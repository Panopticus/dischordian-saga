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

#### 1C.4 — NE-YON (REAL CANON — BLUE-SKINNED HUMANOID WITH MECHANICAL SUB-VARIANTS)

> **CANONICAL CORRECTION (2026-04-22):** This section REPLACES an earlier draft describing Ne-Yons as fully mechanical war-machines with cyan energy cores. That was wrong — derived from outdated bibles. Real canon (user clarification): **Ne-Yons are (usually) blue-skinned humanoids.** Examples confirmed: The Degen (Part 2J) is a Ne-Yon. The old fully-mechanical chrome war-machine is a specific sub-variant (`neyon_warmachine`) — reserved for Ne-Yon combat chassis or heavily-cyberized Ne-Yons, not the species default.

**Turnaround prompt (M & F pass — standard Ne-Yon humanoid):**
> Hyper-realistic cinematic character turnaround sheet, 4 frames (front, 3/4 left, side left, back), neutral grey #808080 background. Subject: a [MALE | FEMALE] Ne-Yon humanoid, mid-twenties, tall (~8% taller than Human baseline, muscular build). BLUE SKIN — cool mid-blue (#5a7a9e base with deeper shadow pooling at the eye sockets, jawline, and neck hollow). Pointed elf-like ears. Eyes: glowing amber-orange (#f57a1c emissive, same warm-internal-glow family as the Degen in Part 2J). Head: hairless or sparse-haired depending on individual — deliver BOTH a clean-bald variant (same as the Degen canon) AND a close-cropped dark-hair variant so the player can choose. Faint tribal-ink tattoos visible on the forearms (simple abstract pattern, not the full Degen swirl — player's ink is less elaborate). Neutral build, T-pose, base undersuit cut in dark neutral-grey (#2a2d32) that contrasts the blue skin. Same 4-frame rotation, same three-point lighting rig as Human/Demagi/Quarchon turnarounds. Film grain. 4K. No rendered text.

**Shader hooks (standard Ne-Yon humanoid):**
- `skinTone`: "#5a7a9e" (base)
- `eyeAmberEmissive`: 0.8 (always subtle, intensifies during speech)
- `eyeGlowThroughLids`: 0.4 (leaks through closed eyelids, same as Degen)
- `tattooPattern`: optional forearm ink (simple pattern at character creation, more elaborate at higher progression)

**Sex dimorphism:** standard humanoid — M variant has squarer jaw and broader shoulders, F variant has softer jaw and narrower shoulders. Same face-mesh template as Human/Demagi/Quarchon with the species-specific skin shader layered on top.

**Sub-variant: `neyon_warmachine` (optional player path, unlocks at progression milestone):**
> Alternative body mesh: fully-mechanized Ne-Yon (the old "chrome war-machine" description). Heavily-cyberized individuals or combat chassis. Towering (~18% taller than base Ne-Yon), gunmetal-charcoal angular armor plates, cyan chest energy-core, rectangular cyan eye-slits replacing amber, ancient Ne-Yon runes etched into plates. NO blue skin visible anywhere — the cyberization is complete. This is the war-machine form The Warlord's host armor mimics in shape (see Part 2T). Deliver as a UNLOCKABLE alternate body mesh, NOT the default Ne-Yon appearance.
> Shader hooks: `coreGlowIntensity` (0–1, default 0.7), `eyeSlitEmissive` (#06b6d4), `runePulseRate` (default 6.0s period), `armorWeathering` (0–1, cosmetic only).

#### 1C.5 — Per-species viseme handling

- **Human, Demagi, Quarchon, Ne-Yon (standard humanoid)** — full 15-viseme morph set on the face mesh, same pipeline as Elara/Human protagonist tier.
- **Ne-Yon (warmachine sub-variant only)** — NO mouth. Track D viseme timeline routes to `coreGlowIntensity` pulse (like The Architect). When a war-machine Ne-Yon speaks, the core panel pulses in sync with phoneme intensity. No viseme morphs needed; just a shader-uniform ramp.

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

### 2D — THE ANTIQUARIAN (CANON CONFIRMED + REFINED)

> **CANONICAL CONFIRMATION (2026-04-22):** User uploaded image #1 confirming the Antiquarian canon. My earlier description was MOSTLY right; minor refinements applied below: hair is silver-AND-DARK mixed (not pure silver-white), eyebrows stay DARK (don't match the silver hair), and pose is left-facing 3/4. The Antiquarian + Programmer (Part 2R) are confirmed as **the SAME PERSON at different points in time** (already specified in 2R's two-phase rig — this confirms it).

Canon anchors (refined): older gentleman, late 50s–60s, weathered scholar. MAGNIFICENT long silver-white CHEST-LENGTH beard continuous with mustache (THE signature silhouette). Hair is shoulder-length wavy MIX of silver-grey AND dark-brown/black streaks (NOT pure silver — the dark color of his youth still shows through at the front and crown), brushed back from the forehead. EYEBROWS remain DARK (deep brown-black, full and slightly bushy) — they did NOT grey with the rest of him. Piercing pale BLUE-GREY eyes, narrowed in evaluation, set in deeply-creased weathered skin. Tan-warm complexion with sun-aged texture. Wearing a black velvet frock coat with HEAVY GOLD BAROQUE EMBROIDERY at the lapels and shoulders (curling filigree, leaf-and-vine motifs). White ruffled-silk shirt visible beneath at the throat (open neck, no cravat). Library backdrop with deep-vaulted bookshelves, warm amber lamp glow, distant stained-glass-window light.

Reference: `apps/client/public/references/npcs/antiquarian/front.png` (from 2026-04-22 upload).

**Critical rigging note:** The beard physically covers the mouth. Viseme reference plates render with the mustache digitally cleared so phoneme shapes read; the runtime rig adds a `beardPart: 0..1` morph target that parts the mustache on open-vowel visemes (AA, O, U) enough for the viseme to show through. Without this, lip-sync reads as "the beard is moving on its own."

#### 2D.1 — Bundle A: Neutral bust (REFINED)

> Three-quarter bust portrait of an older gentleman, late 50s to early 60s, weathered scholar's face with deeply-creased lifelines, sun-aged warm tan complexion (#b89478). Eyes: pale piercing BLUE-GREY (#6b7a88) with a slight upward catchlight, set deep beneath pronounced DARK brow ridges. EYEBROWS are full and DARK BROWN-BLACK (#1a1a1d) — they did NOT grey with age, deliberately contrasting against the silver hair. Direct evaluative gaze, slightly narrowed, head turned ~25° to the viewer's right (his left). A MAGNIFICENT long beard reaching his mid-chest — silver-white (#e4e8eb to #c8ccd2), flowing, well-groomed, full and slightly bushy at the chin and tapering toward the chest, continuous with a full silver-white mustache. The beard is THE signature silhouette. Hair: shoulder-length wavy mix of silver-grey AND streaks of dark brown-black (NOT pure silver — the dark color of his youth still visible at the front, crown, and around the temples), brushed back from the forehead, slightly tousled, ~10cm of length visible. Wearing a black velvet frock coat (#0a0b0d deep matte velvet) with HEAVY GOLD BAROQUE EMBROIDERY (#d4a04a metallic gold) at both lapels and shoulders — intricate curling filigree, leaf-and-vine motifs, the embroidery is RAISED metallic-thread that catches highlights. Beneath the open coat collar: a white ruffled-silk shirt (#f0ede8) with an open neck (NO cravat — earlier draft had a cravat; corrected). Backdrop: defocused tall library — wooden bookshelves receding into deep perspective camera-left, a large round arched stained-glass-style window upper-right (warm amber light bleeding through), warm tungsten lamp glow throughout. Key light: warm amber from camera-right window. Fill: warm reflected ambient. Mouth closed neutral behind the beard — lips visible only as a faint line through the mustache. Film grain. 4K. No rendered text.

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

### 2F — THE ARCHITECT (ENTITY-TIER, STATUESQUE RIG) — CANON VALIDATED

> **CANONICAL VALIDATION (2026-04-22):** User's 2026-04-22 image #3 upload (unlabeled in the message but contextually identifying as the Architect) confirms this canon almost exactly: dark hood, angular black-metallic demon-mask with sculpted flame/fractal ridges radiating from the forehead, piercing golden-amber eyes through narrow eye-slits, silver fractal sigil pendant at the chest mirroring the mask motif, dark void backdrop. Description below remains as-written — no rewrite needed. Treating as image-locked canon.

Canon anchors: entity-tier (not human-tier) — designer of the Panopticon and the player's Story Mode. Deep black hooded cloak absorbing light; full-face black metallic demon mask with fractal wing/flame ridges radiating from the forehead, narrow vertical bridge ending in a pointed beak-like lower jaw; piercing golden-amber glowing eyes through narrow slits — the ONLY warm light on him; silver/chrome fractal sigil pendant at the chest (smaller echo of the mask motif); pure void backdrop — no scene, no environment, HE lights the room.

Reference: `apps/client/public/references/npcs/architect/front.png` (from 2026-04-22 image #3 upload).

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

### 2G — THE AUTHORITY — VALIDATED (2026-04-22)

> **VALIDATION PASS (post-commit):** Confirmed against the codebase. Authority has an active VO manifest (`apps/shared/authorityVoManifest.json` — taunts like `the_authority_taunt_early`, `the_authority_taunt_late`) and is wired as an Act 1 match opponent (`apps/client/src/components/act1/AuthorityPhaseBar.tsx`). The environmental-hall + barely-visible-silhouette canon in this section is consistent with existing usage — she SPEAKS (routed through the environmental-portrait hall's acoustics), but doesn't appear as a humanoid bust. No rewrite needed. Commissioning can proceed against this spec.

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

#### 2G.5 — Fighter-form (CANON ADDITION 2026-05-02)

> **Canon bridge:** The hall (2G.1–2G.4) is the Authority's TRUE form — verdict-as-environment. When directly challenged in combat — i.e. when a player enters Collector's Arena story mode and reaches the Authority's match — the verdict CONDENSES into a humanoid projection. This fighter-form is the only state in which the Authority is corporeal enough to strike or be struck. It dissolves on KO back into the hall silhouette. The two canons coexist: environmental hall everywhere except the fight game; fighter-form only inside the fight engine.

**Visual canon (fighter-form):**

- **Mask:** Full-coverage **silver mirror mask**, no eye-holes, no mouth slit. Surface is liquid-metallic — neither chrome (too sharp) nor brushed (too dull) — read as molten mercury frozen mid-pour. Reflects the opponent's silhouette at all times; in close-up, the player's own fighter face is faintly visible in the mask. Verdict logic: *the verdict is whoever stands before it.*
- **Suit:** **Three-piece silver suit** — jacket, waistcoat, trousers — sharply tailored, single-button jacket, peaked lapels. Fabric reads as **matte silver** (NOT chrome — closer to liquid mercury cooled to a soft sheen, like chalk-white silk with metallic depth). White dress shirt under the waistcoat, no necktie (the throat is bare and continues the mirror-mask treatment, blurring where mask meets collar).
- **Glow:** **Red emissive aura** (#ef4444 core, #b91c1c outer falloff) wrapping the entire figure at ~30% baseline intensity. Volumetric — visible as rim light + ambient red wash on nearby surfaces. Aura intensifies on attacks (peak 1.8×) and on landed hits (1.2× sustained).
- **Hands:** Bare. Same silver mirror-skin treatment as the mask. No nails, no knuckles, no creases — featureless reflective surface where there would be hands.
- **Feet:** Black silver-trimmed dress shoes (the only non-silver element).
- **Stance:** Formal. Even in combat, posture reads as a judge approaching the bench. Idle: hands clasped behind back, weight even. Combat stance: hands forward but held with the deliberation of a verdict, not a brawler.
- **Movement:** No telegraphed wind-ups; strikes resolve with the suddenness of a gavel. Particles: each strike releases a faint puff of cyan-amber-violet courthouse dust (sourced from the three coffin colors of the hall), implying the verdict is dragging fragments of its hall into the arena.
- **KO state:** Mask cracks once (single hairline fracture, no shards). The figure collapses to one knee. The red aura inverts to cyan (#4ba3b5 — the VERDICT-GUILTY coffin color from 2G.3) and then dissolves the figure entirely. The fight engine should overlay a 1.5s fade-to-black and return to the hall silhouette as the post-fight victory pose.
- **Victory state:** Mask reflection briefly resolves into the OPPONENT'S victorious face — a small, deliberately unsettling beat. Aura sustains red. Holds for 2.5s before the figure dissolves to the hall.

**Archetype:** Powerhouse (per gameData.ts roster — see also `apps/client/src/game/spriteSheetConfig.ts` addition). Heavy frame data, slow but unblockable special at full charge ("FINAL VERDICT" — pronounced as red-aura blade-projection from extended forearm).

**Engine wiring:**

- `apps/client/src/game/spriteSheetConfig.ts` — add `authority` id, standard sheet pattern (idle_movement / attacks_specials / reactions_victory / portraits)
- `apps/client/src/game/gameData.ts` (or fighter roster) — Powerhouse archetype, accentColor `#ef4444`, default arena pairing: Shadow Sanctum
- `apps/shared/authorityVoManifest.json` — already exists; reuse for fighter-form taunts (the_authority_taunt_early, the_authority_taunt_late). Add taunt slots if combat-specific lines are needed.

**Sprite-strip prompts:** see `docs/production/OPEN_ASSETS_2026-05-02.md` §2.3 → Authority entry for the full per-state prompt set.

**Note on the Reference doc:** `apps/client/public/references/npcs/authority/REFERENCE.md` should be updated with a new "fighter-form" section pointing to the rendered sprite kit once delivered. Until then, the reference there describes the hall canon only — both canons are valid simultaneously per this addendum.

---

### 2H — CADES — RETRACTED (2026-04-22, codebase-audit finding)

> **⚠️ CANON RETRACTION:** This section described CADES as a "CRT-broadcast-frame NPC with glitched partial-face fragments." That was wrong — derived from seeing CADES UI components in the repo and assuming it was a character. Codebase audit confirms:
> - `apps/client/src/pages/CodexPage.tsx:1163` defines CADES as **C.A.D.E.S. = Comprehensive Analysis & Defense Engagement System**
> - `apps/client/src/pages/CADESFPSPage.tsx` — it's an FPS game-mode (Godot 4.3 iframe)
> - The 4 UI components (`CADESFeed`, `CADESClueBoard`, `CADESConspiracyBoard`, `CADESAmbientLines`) are investigation / surveillance feed UI for the CADES mode, not a character portrait system
> - CADES itself has no VO manifest; it is not an entity that speaks.
>
> **Action:** CADES is not an NPC. The 4 VFX atlases allocated to Part 2H in Part 7.4 (`cades_static_noise.png`, `cades_scanlines.png`, `cades_tracking_bar.png`, `cades_chromatic_bleed.png`) can be RE-PURPOSED as generic CRT-broadcast overlays — useful for the Palimpsest Host's broadcast-studio set (Part 2Q) and for the Warlord reveal's static-interference backdrop. Keep the atlases; drop the Part 2H NPC canon below. The prompts that follow are retained as reference-only for the reallocation, not as canon for a character that doesn't exist.
>
> The Iron Lion character WHO APPEARS inside the CADES FPS mode (per the `IRON_LION_CHANNEL_OPEN` postMessage in `CADESFPSPage.tsx:11`) is a separate NPC and falls outside this brief's 23-NPC roster.

---

**ORIGINAL PLACEHOLDER BELOW — retained for atlas re-purposing reference only. Not canon.**


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

### 2I — THE COLLECTOR + COREY (TWO DISTINCT CHARACTERS)

> **CANONICAL CORRECTION (2026-04-22):** This section now covers TWO related characters, not one:
> - **THE COLLECTOR** (the true entity) — a hooded, dark-robed figure with red-tipped claws, lurking in an observation/specimen chamber. He collects people, memories, experiences.
> - **COREY** (the child disciple) — a seven-year-old boy who WEARS A FACEMASK modeled on the Collector's face. He's a follower, not the entity. The mason jar stays in his canon — it's what disciples carry to offer to the Collector.
>
> My earlier draft conflated them. Real canon below, sourced from the user's 2026-04-22 reference image (Collector = image #4 in the upload batch).

References:
- `apps/client/public/references/npcs/collector/front.png` (Collector entity, image #4 from 2026-04-22 upload)
- `apps/client/public/references/npcs/corey/front.png` (Corey disciple — mask-wearing child)

#### 2I.1-A — THE COLLECTOR: Bundle A neutral bust

> Three-quarter bust portrait of a tall hooded figure in a specimen-observation chamber. The figure wears heavy dark-charcoal-black tattered robes (#151519) with frayed hems and a deep hood pulled fully up over the head. The face beneath the hood is only partially visible: pale greenish-white skin (#b0c4a8, slightly sickly undertone — NOT quite alive), sunken dark eye sockets with small glinting pupils barely visible, a narrow mouth slightly parted. The hood's inner shadow obscures more than it reveals. Both arms extend forward: hands pale-white with long thin fingers, fingertips tapering into RED-GLOWING CLAWS (#c41020 emissive tips, hot inner core, ~3cm claw length per finger, slightly curved inward) — a subtle blood-wet sheen on the claw surfaces. The robes' sleeves are torn at the wrists, ragged hem flowing. Backdrop: a large vertical GLASS OBSERVATION CYLINDER/TANK filled with cool turquoise-green fluid (#4aa098 luminous, slightly hazy) in which the figure IS suspended — he is behind/within the glass, half-submerged in the fluid. Attached to the tank on both sides: dark cables and chains running up into the ceiling shadows. Around the chamber walls: multiple holographic DATA DISPLAYS showing abstract humanoid body-diagram silhouettes with small red annotation markers (render as stylized body-specimen dossier panels, NOT legible text — just body outlines with marker points). Lighting: cool turquoise emissive from within the tank washing the figure from behind, warm red claw-glow on his fingertips, cold cyan accents from the display screens. Atmospheric haze. Film grain. 4K. No rendered text.

#### 2I.1-B — COREY (child disciple): Bundle A neutral bust

> Three-quarter bust portrait of a seven-year-old boy, innocent child's body, fair skin, medium-brown hair parted neatly to the side (over-combed for a child his age). HIS FACE IS COVERED BY A COLLECTOR FACEMASK — a child-sized replica of the Collector's face: pale greenish-white resin mask (#b0c4a8) covering the entire face from hairline to chin, with small dark eye-sockets (no glowing eyes — real child eyes visible through them, catching occasional light at the sockets), narrow closed mouth painted onto the mask. The mask is clearly a WORN ACCESSORY, not his real face — faint elastic strap visible at the back of his ears, mask edges don't quite match his jawline. Above the mask: his real hair visible, his real head shape. Wearing a tidy dark-charcoal button-up shirt (NOT the old sage-green — per Collector-disciple uniform, dark robes-for-children), top button fastened. Both small hands clasped around a smoky glass mason jar (#f0ede8 translucent, fogged from inside) held at his chest — the jar roughly hand-sized. Inside the jar: a faint iridescent red-turquoise shimmer (#4aa098 + #c41020 prismatic, matching the Collector's lab palette — NOT the gold of the old canon). Ambiguous captured light. Backdrop: defocused observation chamber fragments (the Collector's laboratory, not a classroom) — cool turquoise ambient bleed, distant display-screen bokeh. Light: cool turquoise from a single display-screen direction, desaturated ambient elsewhere. Film grain. 4K. No rendered text.

#### 2I.2 — Bundle B: Breathing loops (separate per character)

> **COREY** — 8-frame standard child chest cycle (1.000 to 1.008 peak). Mason jar rises and falls with his chest. Jar shimmer pulses in counter-phase to breath (exhale brightens). FACEMASK is rigid — does not move with breath. Subliminal wrongness comes from the mask's immobility while the body under it clearly breathes.
>
> **THE COLLECTOR** — different rhythm. 10-frame slow cycle (4.0s period — he breathes like something preserved). The suspended figure in the tank shifts 1-2px vertically in the fluid as fluid moves. Red claw-glow pulses subtly (0.9 to 1.1 intensity) on the slow cycle. Hood-drape shifts minimally. Display screens in the background flicker once per cycle (subliminal data-update).

#### 2I.3 — Bundle C: Blink triptych (separate per character)

> **COREY** — Standard child-eye blink, visible through the mask's eye sockets. On CLOSED frame, the jar shimmer brightens 20% (the trapped thing notices when he isn't looking).
>
> **THE COLLECTOR** — Rare slow-blink. The small glint-pupils in the hood's shadow dim for 600ms then re-brighten. Not a human blink — closer to a cat's slow blink of predator-approval. Deliver as 3 frames (normal / dim / return).

#### 2I.4 — Bundle D: Viseme grid (separate per character)

> **COREY** — Standard 15-panel sheet, tight crop through the mask. Mouth is PAINTED on the mask as a closed neutral — it does NOT deform with phonemes. Instead, viseme timeline drives a subtle MASK-RESONANCE effect: the mask itself vibrates in place (2-3px random jitter) during strong open vowels, as if the voice is coming THROUGH the mask but the mask cannot change shape. Unsettling. 15 panels showing the jitter-intensity curve per phoneme.
>
> **THE COLLECTOR** — 15-panel sheet, tight crop on the hood's inner shadow where his mouth would be. Real lip-shape visible through the hood-shadow at low contrast. Mouth open-shapes read at 60% baseline openness — he speaks slowly, deliberately, like an entity rationing words. 4K.

#### 2I.5 — Bundle E: Expressions (per character, 5 each)

**COREY:**
> 1. SPEAKING — mask jitter during phonemes; body still.
> 2. CONCERNED — head tilts, jar pulled tighter; mask unchanged.
> 3. EMOTIONAL1 (delighted-wrong) — jar shimmer intensifies 2× baseline, child's body language shows joy but the mask stays neutral.
> 4. EMOTIONAL2 (protective) — both hands cradle the jar, shoulders curl forward 3°, mask still unmoved.
> 5. REVEALING — he lowers the mask 30% (it slides down his face slightly to reveal the forehead and brow of his REAL face beneath — a normal child's face with uncertain/conflicted expression — mouth and chin still covered). Reserved for the moment Corey shows doubt in his cult.

**THE COLLECTOR:**
> 1. SPEAKING — real lip-shapes visible through hood shadow; claw-glow modulates with phoneme emphasis.
> 2. CONCERNED — the pupils briefly sharpen-brighten, red claw emissive dims to 0.5×.
> 3. EMOTIONAL1 (cataloging) — one clawed hand lifts as if indexing an invisible specimen; head tilts 5° in appraisal.
> 4. EMOTIONAL2 (acquisition-imminent) — both hands extend forward, all 10 red claws blaze to 1.8× emissive intensity for one frame, tank fluid visibly churns. The moment before he takes something.
> 5. REVEALING — the hood pulls BACK (offscreen pull) exposing the full face for the first time: narrow pale-green skin stretched over a NON-HUMAN skull shape (wider cheekbones, smaller chin, larger eye-sockets), eyes now fully visible as small pinprick red-coal glows in shadowed pits. Reserved for the one plot beat where the Collector drops the robe-theater.

#### 2I.6 — Bundle F: VFX overlays (per character)

> **Output:** `apps/client/public/vfx-atlases/collector_{jar_shimmer,red_claws,tank_fluid}.png`.

- **corey_jar_shimmer.png** — 512×512 transparent. Prismatic shimmer cloud in cool-turquoise + red (#4aa098 + #c41020 mix) confined to a 380px circular jar region. Counter-phase to breath.
- **collector_red_claws.png** — 1024×512 transparent. Red emissive glow aligned to the fingertip positions of the Collector's outstretched hands, hot-core (#ffa0a0) fading to deep red (#c41020) to transparent. 10 individual finger-tips, each separately masked.
- **collector_tank_fluid.png** — 2048×2048 seamless tile, turquoise luminous fluid texture with slow caustic pattern. Animated at runtime via texture offset.

#### 2I.7 — Shader uniform blocks

```json
{
  "rigId": "npc_corey_disciple",
  "shaderProgram": "MaskedChildDisciplePortrait",
  "uniforms": {
    "maskJitterAmplitude": 2.5,
    "jarShimmerIntensity": 0.6,
    "jarShimmerTexture": "vfx-atlases/corey_jar_shimmer.png",
    "shimmerBreathCounterPhase": true,
    "maskPosition": "covering_full_face",
    "breathingPhase": "autoLoop:3.2s"
  },
  "stateTriggers": {
    "phonemeJitter": "maskJitterAmplitude pulses with phoneme intensity",
    "collectingEmotion": "jarShimmerIntensity=2.0 for 600ms then settle to 1.1",
    "doubtReveal": "maskPosition='lowered_30pct' for single beat"
  }
}

{
  "rigId": "npc_collector_entity",
  "shaderProgram": "HoodedEntityInTankPortrait",
  "uniforms": {
    "clawEmissive": 1.0,
    "clawTexture": "vfx-atlases/collector_red_claws.png",
    "tankFluidTexture": "vfx-atlases/collector_tank_fluid.png",
    "tankFluidAnimSpeed": 0.04,
    "pupilGlintIntensity": 0.6,
    "hoodCoverage": 1.0,
    "breathingPhase": "autoLoop:4.0s:amp=1.004",
    "visemeScale": 0.6
  },
  "stateTriggers": {
    "cataloging": "one hand extends; head tilts 5°",
    "acquisitionImminent": "clawEmissive=1.8 for 1 frame; tankFluid churns",
    "revealing": "hoodCoverage=0.0; pupilGlintIntensity=1.2; full face exposed"
  }
}
```

#### 2I.8 — Narrative relationship

Corey does NOT realize the Collector is using him as a harvester. Corey thinks he's helping a benevolent "Keeper of Lost Things." In dialogue, he'll deliver lines that expose the Collector's true nature but Corey does not process what he's saying. The rig's REVEALING beats are where the truth briefly cracks the illusion.

---

### 2J — THE DEGEN (REAL CANON — BLUE-SKINNED DEMONIC WARRIOR)

> **CANONICAL CORRECTION (2026-04-22):** This section REPLACES an earlier draft that described The Degen as a "genderfluid carnival-barker in half-violet-sequin / half-cloth-of-gold." That draft was wrong — derived from old bibles. Real canon below, sourced from the user's 2026-04-22 reference upload.

Canon anchors: tall muscular blue-skinned figure, completely bald, pointed elf-like ears, glowing amber-orange eyes (emissive, visible from across a room), red-and-blue swirling tribal tattoos covering both arms and bleeding across the chest and neck, olive-drab military-cut sleeveless vest with high collar and brass buttons, heavy silver chain necklaces layered at the throat with a brass pocket-watch / amulet pendant, studded leather bracers on the forearms with heavy brass buckles, belt with brass centerpiece. Predatory focused scowl — NOT theatrical, NOT a carnival host. A warrior's restraint. Casino-presence is ironic: the pit boss who is ALSO the muscle.

Reference: `apps/client/public/references/npcs/degen/front.png` (from 2026-04-22 upload).

#### 2J.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a tall muscular humanoid with cool BLUE skin (#5a7a9e base with deeper shadow pooling at the eye sockets, jawline and neck — NOT a cartoonish blue; reads as an earned demonic otherworldliness). Completely bald head, pointed elf-like ears. Face gaunt and angular — pronounced cheekbones, deep brow ridges, strong jaw, thin pressed lips. Glowing amber-orange eyes (#f57a1c emissive with a hot white-orange core), pupils contracted to focused points, direct predatory stare from beneath a lowered brow. Visible tattoo work: swirling tribal ink in layered RED (#c74a1a) and DEEP BLUE (#1a3d6e) covering both arms from shoulder to wrist in dense interlocking patterns (flame-like curls, sharp serif hooks, no readable glyphs), with the same ink bleeding faintly up the neck and onto the left pec visible inside the vest's open collar. Wearing an olive-drab/dark-green military-cut sleeveless vest (#4a5a3a canvas, weathered), high-collar turned up, large brass button-studs running down the front, a single brass pin or small mechanism at the right upper chest. Underneath the vest, skin visible — no shirt. Layered at the throat: 2-3 heavy silver/gunmetal chain necklaces (#8a8d92) of varying link sizes, with a round brass pocket-watch-style pendant (#b8752d patina brass, embossed relief, ~4cm diameter) hanging at mid-chest, reading as both jewelry and bounty token. Studded leather bracers on both forearms (#2a1a14 dark leather, small silver studs), heavy brass buckles. Belt with a large brass center-buckle visible at lower frame edge. Backdrop: deep teal-black void (#0a3a3a — heavy desaturated ocean-dark), atmospheric haze, no identifiable environment — he is lit against his own darkness. Key light: cool cyan from camera-left at 30° grazing the shoulder and jaw; warm amber eye-glow lights the cheekbones from within. NO theatrical crowd, NO casino signage, NO neon. Mouth closed in a flat predatory line. Film grain. 4K. No rendered text.

#### 2J.2 — Bundle B: Breathing loop (8 frames)

> Standard chest cycle (1.000 to 1.006 peak — he is CONTAINED, not expansive; muscle breathes differently from fat). The brass pocket-watch pendant at his chest swings ±2px at peak inhalation on a fine pendulum arc — this is his signature idle tell. Chain necklaces shift 1px. Vest collar UNCHANGED. Head UNCHANGED. Arms UNCHANGED (he holds stillness). Tattoos on forearms — a SEPARATE idle channel — the ink INTENSIFIES slightly (+15% emissive saturation) on exhale and settles on inhale. The ink is alive. 8 PNGs, with an auxiliary 8-frame tattoo-glow loop at 5.8s period (intentionally offset from the 3.2s breath cycle so the two rhythms don't sync — creates an unsettling liveness).

#### 2J.3 — Bundle C: Blink triptych

Standard. HOWEVER: On CLOSED frame, the amber eye-glow does NOT fully extinguish — faint warm light still leaks through the closed eyelids (the eyes are backlit from inside his skull). At 40% intensity on closed. On HALF, 70%. On OPEN, 100%. Never fully dark.

#### 2J.4 — Bundle D: Viseme grid

Standard 15-panel. Mouth movements RESTRAINED — he speaks economically, at 80% of baseline openness. When he does open wide (AA, OW), the teeth visible are slightly too many and slightly too sharp — not Shadow-Tongue-level wrong, but a deliberate unease. Reserve the full-teeth frames for emphatic moments only.

#### 2J.5 — Bundle E: Expressions (5)

> 1. SPEAKING — minimal mouth motion, eyes locked forward, tattoo ink pulses subtly brighter during speech.
> 2. CONCERNED — brow lowers further (already lowered at baseline), eyes narrow, predatory calculation rather than sympathy.
> 3. EMOTIONAL1 (house-edge) — a slow thin closed-mouth smile that does not reach the eyes. A bettor just lost more than they should have. Reserved for the casino-assessment beats.
> 4. EMOTIONAL2 (violent-ready) — tattoo ink saturates to 180% intensity across both arms in a single frame, eye-glow doubles to 2.0× intensity, jaw sets. One frame where the muscle-beneath-the-host is visible. DO NOT show a grin — the tell is the eyes and the ink, not the mouth.
> 5. REVEALING — the pocket-watch pendant lifts into frame held between thumb and forefinger, the watch face visible (render as an abstract compass-like face — not legible time, not legible glyphs, but symbolic: a single orange arrow pointing). Direct eye contact. This is the moment the house collects. Not a show — a transaction.
> 4K. No rendered text.

#### 2J.6 — Bundle F: Living-tattoo emissive overlay

> **Output:** `apps/client/public/vfx-atlases/degen_living_tattoo_{ink_red,ink_blue,glow_channel}.png` — each 2048×2048 transparent.

> Three-layer tattoo atlas matching the Degen's forearm/shoulder/chest ink regions:
> - **ink_red:** full-opacity deep red (#c74a1a) tribal pattern, swirling curls, hooks, and flame-branches, organic distribution, matches the canon reference. Static texture.
> - **ink_blue:** full-opacity deep blue (#1a3d6e) pattern overlapping the red in interlocked positions — the blue fills negative space of the red. Static texture.
> - **glow_channel:** a grayscale mask where brighter pixels correspond to where the ink should emit — concentrated at the deepest-saturated inner curls, dim at pattern edges. Animated at runtime via `tattooBreathPhase` uniform to pulse on exhale counter-cycle to chest breath.

#### 2J.7 — Shader uniform block

```json
{
  "rigId": "npc_degen",
  "shaderProgram": "LivingInkDemonicPortrait",
  "uniforms": {
    "skinTone": "#5a7a9e",
    "eyeAmberEmissive": 1.0,
    "eyeGlowThroughLids": 0.4,
    "tattooRedTexture": "vfx-atlases/degen_living_tattoo_ink_red.png",
    "tattooBlueTexture": "vfx-atlases/degen_living_tattoo_ink_blue.png",
    "tattooGlowChannel": "vfx-atlases/degen_living_tattoo_glow_channel.png",
    "tattooBreathPhase": "autoLoop:5.8s:offset=chest",
    "pocketWatchSwing": "autoLoop:3.2s:amp=2px",
    "breathingPhase": "autoLoop:3.2s:amp=1.006",
    "visemeScale": 0.8
  },
  "stateTriggers": {
    "houseEdge": "closed-mouth smile; no eye change",
    "violentReady": "tattooGlowChannel *= 1.8; eyeAmberEmissive=2.0 for 1 frame",
    "revealing": "pocketWatch lifts into frame; eyes lock direct"
  }
}
```

#### 2J.8 — Lore note: Casino adaptation

The Degen still runs the casino (game-mode `/casino`), but his canon makes him a WARRIOR-RUN pit floor, not a barker's stage. The casino environmental art (bibles under `CASINO_EXPANSION_ART_BIBLE.md`) stays valid for the SPACE itself — but any art that depicted the Degen himself as a sequined showman must be flagged for regeneration against this real canon. Audit list for Part 4/Part 5 revision: CIN-013 (Degen discovery video) and any casino-UI art that uses the Degen's face.

---

### 2K — EIDOLA (REAL CANON — DARK-MAGIC PROJECT SORROW SURVIVOR)

> **CANONICAL CORRECTION (2026-04-22):** The earlier placeholder draft described Eidola as a "charcoal-robe academic with silver-streak hair" from the matchup txt. That was wrong. Real canon, per user direction: Eidola is a **survivor of Project Sorrow — the classified counterpart to Celebration** — now teaching ethics at a school run by AI Archons. To SURVIVE in that environment, she must be one of the deadliest and smartest people alive. Her aesthetic is **cyberpunk dark-magic** — the ethics professor who could kill you with her handwriting. Custom lore below.

#### 2K.0 — Lore (custom, canonized here)

**Project Sorrow** was the classified twin program to Celebration. Where Celebration trained children to become compliant broadcast personalities, Sorrow trained them to become the Hierarchy's psychological weapons — operators who could unmake a target's sense of self with a paragraph. Only a handful of Sorrow graduates were produced before the program was officially "archived" (meaning: every instructor and surviving student was supposed to be liquidated to seal the secret). Eidola is one of three confirmed survivors. The other two went dark. She chose to hide in plain sight — as an ethics professor at a Mechronis-adjacent academy run by AI Archons, where the curriculum is perpetually monitored for deviation.

Every lecture she gives is a high-stakes chess game against the Archon overseers. The curriculum must be recognizably ethics instruction — but every student who pays attention has, by graduation, learned how to FIGHT an Archon. She has never been caught because she is better at reading the AI than the AI is at reading her.

**Her true profession is reconnaissance.** She identifies which of her students might one day be used against the Hierarchy, and she seeds them with survival doctrine. She is not a rebel — she is a gardener planting the specific rebels who can win.

**Her cyberpunk-dark-magic aesthetic comes from:** Sorrow's ritual curriculum. The program taught psychological warfare through pre-industrial blood-ink rituals, scaffolded onto cybernetic amplifiers. Every Sorrow graduate carries the marks. In polite company, her marks look like academic affectations — fine silver-filigree dermal implants tracing geometric patterns at her temples and the backs of her hands, the kind an aristocrat might wear. Under pressure, they activate — the filigree pulses with cold violet light and occult runes briefly become legible on her skin.

#### 2K.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a woman, ageless-beautiful (could read mid-thirties to early-fifties — canon is older than she looks due to cybernetic longevity implants). Pale cool-undertoned skin (#d4c8cc) — porcelain, unflinching. Sharp-planed face: high severe cheekbones, strong jawline, thin lips set in a composed line. Eyes: ICE-PALE VIOLET (#b8a6d4 iris, faintly luminous internally with a subtle cold violet glow — NOT overtly emissive like Elara, but the glow is unmistakable on close inspection), unblinking direct gaze. Long straight jet-black hair (#0a0606) with a single asymmetric streak of stark silver-white (#f4f0ec) running from temple down the left side, pulled back into a severe half-ponytail that drapes down the back — the front bangs cut sharp above the brows. Along the temples (visible at the hairline) and across the cheekbones in delicate lines: SILVER-FILIGREE DERMAL IMPLANTS (#c8ccd2 cold metallic with faint violet emissive traces) — geometric-occult patterns reading as "academic jewelry" at first glance, but on close inspection the patterns are sigil-runes. Same filigree visible on the backs of both hands (if in frame) — tracing across the knuckles. Wearing a SEVERE TAILORED BLACK ACADEMIC OUTFIT — NOT traditional robes. A sharp-cut high-collared charcoal-black blazer (#0a0b0d) with subtle deep-violet pinstripe, cut like structured cyberpunk formalwear, shoulders sharp and squared. Beneath the blazer: a high-necked silk blouse in deep blood-red (#5a0c0c). A single long SILVER CHAIN PENDANT at the throat with a small hexagonal implant-node at the end (the pendant is a cybernetic focus, not jewelry). Her ONE concession to old-academic affectation: an antique ink-stylus (silver, narrow, engraved) clipped like a brooch at the lapel — ritual-ink writing implement, the tool of Sorrow's blood-ink curriculum. Backdrop: defocused cyberpunk academy classroom — dark violet-black walls, distant holographic lecture-board with glyph-patterns scrolling (NOT legible text), cold cyan institutional ambient with warm amber accent from a single desk lamp. Palette: cold violet-black dominant, silver filigree accents, deep blood-red blouse, cyan ambient, warm amber key from camera-right desk lamp. Film grain. 4K. No rendered text.

#### 2K.2 — Bundle B: Breathing loop (8 frames)

> Shallow controlled breathing (1.000 to 1.004 peak — she is ALWAYS controlled). The silver filigree implants PULSE VERY SUBTLY across the 8-frame cycle — baseline at rest, a barely-perceptible violet emissive shift (0.3 → 0.4 → 0.3) on a 4.8s offset cycle independent of breath. The implants are always "on standby" — they never fully rest. Hair UNCHANGED. Blazer shoulders UNCHANGED (structured). Stylus-brooch UNCHANGED. 8 PNGs + 1 auxiliary implant-pulse frame reference.

#### 2K.3 — Bundle C: Blink triptych + ACTIVATION VARIANT

> Standard 3 frames (open / half / closed). On CLOSED frame, the violet eye-glow does NOT fully extinguish — a faint inner glow leaks through the closed eyelids (similar to the Degen's backlit-from-within effect). **Bonus 4th frame — ACTIVATION BLINK:** a single closed-then-open blink where the eyelids close fully and then REOPEN to eyes that are visibly brighter-violet-emissive (1.5× baseline) and more luminous. Runtime triggers this specific blink when Eidola is about to unleash Sorrow-doctrine — it's the warning. Audience learns to fear that blink.

#### 2K.4 — Bundle D: Viseme grid + INK-WRITING VARIANT

> Standard 15-panel viseme sheet with natural compressed openness (70% — she speaks tightly, economically, each word weighed). All phonemes preserve the cold-violet eye-glow. PLUS a special **INK-WRITING VARIANT SHEET**: 5 frames showing her speaking with the stylus-brooch LIFTED from the lapel and held at chin level, writing invisibly in the air during her sentence. Ritual gesture — Sorrow's "spoken word made flesh" technique. Runtime uses these frames during her most consequential dialog lines.

#### 2K.5 — Bundle E: Expressions (5)

> 1. SPEAKING — minimal mouth motion, eyes locked and cold, filigree pulse intensity modulates subtly with phoneme emphasis.
> 2. CONCERNED — rare; brow lowers 3° centrally, mouth pulls to one side (a tell she's let slip). Eyes briefly narrow.
> 3. EMOTIONAL1 (teaching-ethics) — her default teaching face: eyes soften 15%, one corner of the mouth lifts into the barest-possible warmth (she DOES actually care about her students). The stylus-brooch at her lapel catches a warm highlight. Carefully human.
> 4. EMOTIONAL2 (prey-identified) — her teaching-warmth drains in a single frame. Face goes unnervingly still, eye-glow intensifies 1.8×, filigree implants briefly illuminate with readable occult runes on the skin. Target acquired. She has decided someone in the room is dangerous to her cover. Reserved.
> 5. REVEALING — she lifts the stylus-brooch from her lapel, holds it vertical between thumb and forefinger in front of her mouth (as if about to inscribe a word directly onto the air in front of the camera), eyes lock direct at 1.5× emissive intensity. Mouth parts for the first honest line of her teaching career. Reserved for the pivotal moment she identifies the player as Sorrow-worthy and drops cover.

#### 2K.6 — Bundle F: Cybernetic filigree emissive overlay

> **Output:** `apps/client/public/vfx-atlases/eidola_{filigree_pulse,activation_runes,stylus_glow}.png`.

> - **filigree_pulse.png** — 2048×2048 transparent. Geometric-occult sigil-patterns rendered as fine 1-2px silver-white linework tracing the temple and knuckle regions. Emissive channel separate: violet glow (#8b5cf6 at 40% opacity fading to transparent at pattern edges) that can ramp 0 to 1 at runtime. At full activation, additional RUNE GLYPHS appear within the filigree patterns (small occult-style angular marks) — these are HIDDEN (pure alpha 0) at baseline and emerge only as a separate channel when `runesActive` uniform is > 0.5.
> - **activation_runes.png** — 1024×1024 transparent. Specifically the rune glyph overlay that appears during EMOTIONAL2 and REVEALING, masking only the skin regions where filigree implants are. Violet emissive.
> - **stylus_glow.png** — 256×512 transparent. The ink-stylus brooch showing a faint violet writing-tip glow that intensifies when lifted to writing position.

#### 2K.7 — Shader uniform block

```json
{
  "rigId": "npc_eidola",
  "shaderProgram": "SorrowGraduatePortrait",
  "uniforms": {
    "filigreePulseIntensity": 0.3,
    "filigreeTexture": "vfx-atlases/eidola_filigree_pulse.png",
    "filigreePulsePeriod": 4.8,
    "runesActive": 0.0,
    "runesTexture": "vfx-atlases/eidola_activation_runes.png",
    "eyeVioletEmissive": 0.5,
    "eyeGlowThroughLids": 0.2,
    "stylusLifted": false,
    "stylusGlowTexture": "vfx-atlases/eidola_stylus_glow.png",
    "breathingPhase": "autoLoop:3.2s:amp=1.004",
    "visemeScale": 0.7
  },
  "stateTriggers": {
    "teachingEthics": "eyes soften; stylus catches highlight; filigree at baseline",
    "preyIdentified": "filigreePulseIntensity=0.9; runesActive=0.8; eyeVioletEmissive=0.9 for held beat",
    "activationBlink": "blink variant fires; eye emissive +50% on reopen",
    "revealing": "stylusLifted=true; eyeVioletEmissive=0.75; runesActive=0.4; mouth parts for sentence"
  }
}
```

#### 2K.8 — Integration with Part 6 parallax rooms

Eidola appears most frequently in her CLASSROOM — a cyberpunk academy lecture hall. This room needs a dedicated variant:
- **Eidola's lecture hall (faction-override room):** Dark-violet-and-cyan academic tiered seating, a holographic lecture-board with scrolling glyph-patterns, two humanoid-silhouette Archon-observer statues flanking the teaching dais (they appear to be decorative but are clearly active surveillance). Warm amber from a single desk lamp on her side (her small personal pool of warmth in an otherwise cold room). Room override triggered when she's actively present. Adds to the 4 Part 6 faction overrides → now 5 total.

---

### 2L — THE GAMEMASTER (REAL CANON — CYBORG-SKULL RIG)

> **CANONICAL CORRECTION (2026-04-22):** This section REPLACES an earlier draft describing the Gamemaster as "a thin pre-split man in conventional spectacles." That draft was wrong — derived from the matchup txt (which is a ONE-TIME flashback beat, not the default render). Real canon (2026-04-22 user upload): he is FULLY MECHANIZED. His head has been replaced with a cyborg skull. The "split" is not his glasses — his EYES are the split (two separate red circular goggle-eyepieces embedded in the skull). No human face remains by default.

Canon anchors: blue-painted metal skull with exposed gear mechanism at the temple, TWO large circular red mechanical goggle-eyepieces (brass-ringed, independently bright — each can pulse separately), hoses and pipes running from the lower jaw down into the clothing, blue military trench coat with brass buttons and a high pop-collar, chain-and-brass pendant assembly at the throat. No mouth that opens. No face skin. Fully inhuman.

Reference: `apps/client/public/references/npcs/gamemaster/front.png` (from 2026-04-22 upload).

**Critical rigging:** No visemes in the traditional sense. No blink. No breathing as chest-rise. All VO lip-sync routes to the TWO goggle-eyepieces as independent emissive channels (similar to Warlord's visor shimmer, but doubled — L and R can be driven asymmetrically). The gear mechanism at the temple turns a fraction of a cog on every consonant. Hoses in the neck pulse on inhale beats. No humanoid liveness markers.

#### 2L.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a fully mechanized figure. Head: a human-skull-shaped metal cranium painted weathered blue (#3a6a9a), with visible dents, scratches, and rivets across the dome. Pointed jaw and exposed metal teeth (not real teeth — machined grinning dentition, #8a8d92 gunmetal, held in a fixed skeletal neutral). NO skin anywhere — the entire head is machined armor plating. Around both eye sockets: large circular brass-and-steel GOGGLE-EYEPIECES (~8cm diameter each), brass-ringed with concentric gear-ring detail, interior lenses glowing deep RED (#c41020 emissive, hot core), surrounded by thin gear-teeth along the outer rim. The left goggle (viewer's left) and right goggle (viewer's right) are independently lit — on the neutral frame, both at baseline 0.7 intensity. Between and above the goggles on the forehead/temple: visible exposed gear-train mechanism — interlocking brass cogs (#b8752d brass, polished), fine chains, a small coiled spring, tiny dials. These mechanisms are STATIC in the neutral frame but will animate in motion bundles. The lower jaw area has thin flexible metal panels with visible articulation seams (implying it CAN move, but in a machined way — not lips). From the underside of the jaw and the back of the neck, several dark-gray flexible hoses (#2a2d32, ribbed industrial tubing, ~2cm diameter) run DOWNWARD, disappearing under the coat collar — a few visible hoses also enter the neck at the base of the skull, secured by small brass clamps. Wearing a deep-BLUE military trench coat (#1a3d6e, heavy wool, weathered), double-breasted with two rows of large brass buttons down the front, a high structured pop-collar turned fully up at the back of the neck, epaulettes at both shoulders with small brass pips. Underneath the coat's collar line: more visible hose-work and chain-and-brass pendant assembly — a cluster of 3-5 small brass gauges/keys on chains hanging at the throat, catching light. Backdrop: deep charcoal-teal void (#1a2a2d — bleak institutional), mild atmospheric haze, no identifiable environment. Lighting: cold cyan fill from camera-left grazing the skull dome; faint warm amber from below (boiler-glow implied offscreen, warming the hose region only). Red goggle emissive provides the primary warmth in frame. Film grain. 4K. No rendered text.

#### 2L.2 — Bundle B: Breathing loop (8 frames)

> No CHEST breathing. Instead, 8-frame mechanical-inhale cycle:
> - Frames 1-2: hoses at the neck CONSTRICT 1-2px as if drawing in
> - Frames 3-4: hold (full inhalation)
> - Frames 5-6: hoses EXHAUST — tiny puff of vapor visible at the joint where one neck-hose connects to the coat collar (faint 4-6px semi-transparent mist, warm grey-white, fading quickly)
> - Frames 7-8: return to baseline, hoses relax
> Additionally, the temple gear-train: one small cog rotates 45° across the 8-frame cycle (continuous). Goggle intensity unchanged across breathing cycle (goggles have their own channel). The skull never moves. 8 PNGs plus the vapor-puff visible on frames 5-6.

#### 2L.3 — Bundle C: Blink triptych — REPURPOSED AS IRIS-CONTRACT TRIPTYCH

Skip traditional blink. Instead, deliver 3 frames: OPEN (both goggle irises at full size), HALF (goggle irises contract to 60% diameter — mechanical iris-shutter contracts), CLOSED (goggle irises contract to 20% diameter — near pinpoint of red). Each goggle has independent "iris" animation — runtime can contract one at a time for asymmetric emphasis. Deliver as 3 PNGs + a 6th asymmetric-contract variant (left wide, right pinned) for rhetorical emphasis frames.

#### 2L.4 — Bundle D: Viseme grid — ROUTED TO GOGGLE-INTENSITY PATTERNS

Skip traditional viseme plates. Deliver 15 reference frames where the two goggles display a specific red-emissive INTENSITY PATTERN per phoneme:
- SIL: both goggles at baseline 0.7
- Open vowels (AA, AO, OW): both goggles BLAZE to 1.6× intensity, a thin red rim-halo visible around each
- Soft consonants (B_M_P, F_V): both goggles DIM to 0.3× briefly (a mechanical mouth-closing analog)
- Fricative consonants (CH_SH, D_S_T): asymmetric — LEFT goggle ramps high while RIGHT stays low, or vice versa per runtime choice
- Liquids (L, R): both goggles pulse at 2Hz micro-flicker during the phoneme duration
Deliver as 15 reference frames plus a shader lookup JSON that maps phoneme → (leftIntensity, rightIntensity, flickerRate). Runtime routes the VO timeline through this lookup. 4K.

#### 2L.5 — Bundle E: Expressions (5)

> 1. SPEAKING — goggles modulate per phoneme lookup; temple gear rotates continuously; minor asymmetric emphasis frames.
> 2. CONCERNED — both goggles DIM to 0.4, temple gear STOPS turning for 600ms. The machine is registering a problem.
> 3. EMOTIONAL1 (procedural-pleased) — the faintest flicker of a brighter inner core in BOTH goggles — 10% intensity spike held for 400ms. The machine's version of a checkmark.
> 4. EMOTIONAL2 (dual-lock) — both goggle irises contract to 20% (pinpoints) simultaneously, temple gears reverse-spin for one frame, the hoses at the neck visibly TENSE. Absolute focus. Reserved for the verdict-pronouncement beat.
> 5. REVEALING — one goggle (runtime chooses L or R) WIDENS to 1.2× diameter while the other stays at baseline — an optical pupil-dilate of targeted attention. Tilt the skull 3° toward the subject of the reveal. Reserved for his "I have understood you completely" beats.

#### 2L.6 — Bundle F: Goggle emissive + gear-temple overlays

> **Output:** `apps/client/public/vfx-atlases/gamemaster_{goggle_L,goggle_R,temple_gears,hose_vapor}.png`.

> Four textures:
> - **goggle_L / goggle_R:** 256×256 each, transparent. Concentric ring structure — outer brass gear-ring (static), inner red lens with gradient from hot-white-orange core (#ffd8a0) to deep red rim (#c41020), animatable at runtime for intensity + iris-contraction scaling. Left and Right separate to allow independent driving.
> - **temple_gears:** 512×256 transparent overlay matching the gear-train position at the temple, rendered as 4 separate gear elements that can be independently rotated at runtime.
> - **hose_vapor:** a small mist-puff sprite, 128×128 transparent, warm-grey semi-transparent gaussian, fades quickly; spawned on exhale frames 5-6.

#### 2L.7 — Shader uniform block

```json
{
  "rigId": "npc_gamemaster",
  "shaderProgram": "CyborgSkullDualGoggleRig",
  "uniforms": {
    "goggleLeftIntensity": 0.7,
    "goggleRightIntensity": 0.7,
    "goggleLeftIrisSize": 1.0,
    "goggleRightIrisSize": 1.0,
    "templeGearRate": 45.0,
    "hoseVaporIntensity": 0.0,
    "breathingPhase": "autoLoop:3.2s:mode=hoseConstrict",
    "visemeChannel": "routeToDualGoggleLookup",
    "blinkChannel": "routeToIrisContract"
  },
  "stateTriggers": {
    "speaking": "both goggles modulate per phoneme lookup; temple gears continuous",
    "dualLock": "both iris=0.2; templeGearRate reverse 1 frame; hoses tense",
    "revealing": "one goggle iris=1.2; skull tilts 3°",
    "proceduralPleased": "both intensity +0.1 for 400ms"
  }
}
```

#### 2L.8 — Lore note: Pre-mechanization flashback

The "thin man in spectacles" described in `matchups/game-master-original.txt` is NOT his default render — it is a ONE-TIME Act 1 flashback showing who he was before mechanization. Treat the old prompt as a RESERVED flashback asset:
- Keep it in the prompt library at `docs/production/act1-asset-build/prompts/matchups/game-master-original.txt`
- Tag it as `gamemaster_phase1_flashback` in Part 9 cinematics manifest
- The cyborg rig in 2L.1 above IS `gamemaster_phase2_mechanized` (the default).
Add a `gamemasterMechanizationProgress: 0..1` uniform if a transition cinematic is wanted (similar to Kael's 3-phase rig). For Phase 1 canvas-texture work re-use the matchup prompt; for Phase 2 use the Bundle A spec above.

---

### 2M — MATRIKALA (REAL CANON — CELEBRATION SURVIVOR, REACTOR MENTOR)

> **CANONICAL CORRECTION (2026-04-22):** The earlier placeholder draft described Matrikala as a vanilla "workshop-mentor professor" from the matchup txt. That was wrong. Real canon (user direction): Matrikala is a **former Celebration survivor**. Custom lore canonized below. She is the second half of a paired lore arc with Eidola (2K): Eidola is Project Sorrow's survivor, Matrikala is Celebration's. Two women who walked out of two halves of the same classified childhood, both now shaping the next generation.

#### 2M.0 — Lore (custom, canonized here)

Matrikala was a **Celebration contestant** — one of the children who "graduated" before the broadcast format turned existential. She survived the broadcast era, which puts her in an extraordinarily small group. Most Celebration graduates either became compliant broadcast personalities for life (the Hierarchy's intended outcome) or were quietly unpersoned when their trauma made them inconvenient. Matrikala did neither. She **went dark** for twenty years, re-emerged with a doctorate in reactor engineering under a different name, and rebuilt herself around the one thing the broadcast could not weaponize: **physical craft**.

Her reactor-engineering classroom is her response to Celebration. Where the broadcast taught children to perform for cameras, she teaches students to listen to a machine's hum. Where Celebration rewarded ambiguity, she rewards precision. Where the broadcast made ethics decorative, she teaches that a miscalibrated reactor kills everyone in the room — moral physics, not moral abstraction. Every student she graduates is immunized against the kind of pressure Celebration used to break her.

**Her scars are literal.** Celebration's finale round for her cohort involved an "engineering challenge" that was actually a psychological trial disguised as a reactor-assembly exercise under a fake countdown clock. Children who completed the assembly correctly passed. Children who panicked and misassembled were exposed to a small actual flash burn. Matrikala completed her assembly — AND, on her way out of the chamber, disassembled and re-sabotaged the trial for the child behind her, saving them. The resulting burns cover the backs of both her forearms in a specific mottled pattern. She has never hidden them.

**Her mentor energy IS the counter-weapon to Celebration.** She listens longer than she needs to. She waits for the student's real answer rather than the camera-ready one. Every interaction she has is an implicit correction of the broadcast's pathology.

#### 2M.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a woman in her early sixties, South-Asian features, weathered warm face, strong jawline, bright attentive dark eyes. Medium-warm skin tone (#a07858) with a subtle red-sun undertone (she has worked outdoors in her reactor-yard decades). Short practical silver-grey hair (#a6a6a6), cut close, parted simply. Face has laugh-lines at the eye corners AND worry-lines between the brows — both earned. Body-language: leaning FORWARD, forearms on a workbench surface in the lower frame. She is already paying attention to you.
>
> Wearing warm oxide-red heavy canvas coveralls (#c66b3d, visible weave, slightly weathered), sleeves rolled to the elbows. On both exposed forearms: VISIBLE BURN SCAR PATTERNS — mottled paler skin patches in a specific organic shape running from wrist to mid-forearm (render as deliberate canonical detail, NOT hidden, NOT ornamental — just what is there). The scars are old, healed-smooth, a permanent canvas of what happened to her. Her hands are strong, knuckled, with fine additional reactor-work scars and callus patterns across the backs and palms. A single polished brass Academy pin (#b8752d) holds the coverall collar closed at the throat. Around her neck, on a simple leather cord: an unusual small PENDANT — a fragment of melted green glass, irregular edge, clearly shaped by heat (a shard of the Celebration broadcast stage floor that fused during her trial, kept as a reminder). Reading glasses on a brass chain around her neck, NOT worn.
>
> On the workbench beside her elbow: a half-disassembled brass reactor coupling (#b8752d polished brass, intricate inner calibration ring exposed), fine needle-point calipers resting across it, a small open leather-bound teaching journal (closed at a page, pages visible edge-worn). Backdrop: defocused reactor workshop — towering brass-and-steel cylindrical reactor housings in the deep background, cool cyan institutional ambient from above, warm amber emissive from an open reactor access-port providing a secondary warm key from lower-left. A small potted green plant on a distant shelf — life in a technical room, a deliberate accent. Palette: cyan ambient #4ba3b5 + amber reactor-glow #f5a040 + brass fixtures #b8752d + oxide-red coveralls + warm skin tones. Film grain. 4K. No rendered text.

#### 2M.2 — Bundle B: Breathing loop (8 frames)

> Standard chest cycle (1.000 to 1.007 peak — she breathes deeply, like a woman who remembers oxygen is a privilege). Brass pin at throat catches shifted highlights across 8 frames. Forearm muscles flex subtly on the leaning-forward pose. The GREEN GLASS PENDANT at her chest sways 1-2px with breath — her signature idle tell (the fragment of the stage floor that almost killed her, swinging on her breath). Reactor coupling in foreground UNCHANGED. Hair UNCHANGED. Scars UNCHANGED.

#### 2M.3 — Bundle C: Blink triptych

> Standard. Her eyes have lived in dust, sparks, and camera-flashes — on CLOSED frame, the crease pattern at the outer corners deepens (half from squinting at work, half from broadcast-era flashbulb muscle memory). Bonus subtle detail: on HALF frame, her eyes briefly FOCUS PAST the camera (a microscopic flinch — old trauma response to sudden attention) before reopening with full direct gaze. Runtime triggers this variant occasionally but not always. 4 PNGs (standard 3 + flinch half).

#### 2M.4 — Bundle D: Viseme grid

> Standard 15-panel. Her mouth readily opens — she is a teacher used to projecting across a workshop (110% baseline openness). Preserve the asymmetric laugh-line wrinkles at the eye corners across all viseme frames.

#### 2M.5 — Bundle E: Expressions (5)

> 1. SPEAKING — head tilts 4° toward the listener, hands gesture toward the coupling (one finger extended pointing-indicating); green pendant sways with the head-tilt.
> 2. CONCERNED — brows knit CENTRALLY (the worry-line between the brows deepens — her old tell), eyes drop to the coupling. She is diagnosing a problem with the hardware, not you. Public version of her worry.
> 3. EMOTIONAL1 (delighted-teaching) — broad warm smile showing teeth, laugh-lines deepen, eyes crinkle, scar-patterns on forearms briefly catch the warm reactor light. When a student finally hears the reactor hum. Her signature expression.
> 4. EMOTIONAL2 (broadcast-flashback) — rare; eyes unfocus briefly, hands go VERY still on the workbench (unnatural stillness — the old freeze response), mouth tight-closed. One frame where Celebration is still inside her. The green pendant stops swaying as if it froze too. Reserved for moments when her dialogue triggers unexpected trauma. She recovers within one frame.
> 5. REVEALING — she rolls her sleeves UP further (already rolled, now pushed higher), fully exposing the burn-scar patterns, and lifts her forearms toward the camera in the gesture of someone showing a wound that has been a teacher. No shame. Mouth opens softly for the sentence: "This is what happens when a child is made to perform in a fire. Do not make your students perform. Listen to them." Reserved for the pivotal beat when she chooses to tell the player who she actually is.

#### 2M.6 — Bundle F: Coupling glow + scar-memory overlays

> **Output:** `apps/client/public/vfx-atlases/matrikala_{coupling_glow,scar_memory_glow,pendant_green}.png`.

> - **coupling_glow.png** — 512×512 transparent. Soft warm amber emissive masked to the brass reactor coupling silhouette, with a small cyan inner-ring sub-glow for the calibration band. Animates during teaching beats.
> - **scar_memory_glow.png** — 1024×256 transparent. Two masked strips matching the burn-scar patterns on her forearms. At baseline, renders invisible (alpha 0). During EMOTIONAL2 broadcast-flashback, the scars briefly emit a SUBTLE warm-red glow (#c41020 at 20% opacity) — not canonical physics, a metaphorical "the memory is still warm underneath" beat. Intensity driven by `scarMemoryActive: 0..1` uniform.
> - **pendant_green.png** — 128×128 transparent. The melted-green-glass fragment with subtle internal emerald emissive (#4a9a6a, barely luminous). Sways with breath phase.

#### 2M.7 — Shader uniform block

```json
{
  "rigId": "npc_matrikala",
  "shaderProgram": "CelebrationSurvivorMentorPortrait",
  "uniforms": {
    "couplingGlowIntensity": 0.4,
    "couplingGlowTexture": "vfx-atlases/matrikala_coupling_glow.png",
    "scarMemoryActive": 0.0,
    "scarMemoryTexture": "vfx-atlases/matrikala_scar_memory_glow.png",
    "pendantSwayAmplitude": 1.5,
    "pendantTexture": "vfx-atlases/matrikala_pendant_green.png",
    "warmHandLight": 0.8,
    "coolFaceLight": 0.6,
    "breathingPhase": "autoLoop:3.2s:amp=1.007"
  },
  "stateTriggers": {
    "teachingDelighted": "couplingGlowIntensity=0.8; reactor-ambient +20% warmth",
    "broadcastFlashback": "scarMemoryActive=0.4 for 800ms; pendant sway stops; hands unnaturally still",
    "revealing": "sleeves pushed higher; scarMemoryActive=0.15 sustained; pendant visible at forward angle"
  }
}
```

#### 2M.8 — Paired lore arc with Eidola

Matrikala (2M) + Eidola (2K) form a deliberate paired arc:
- Both are women who survived classified childhood programs (Celebration + Sorrow).
- Both teach a discipline that is actually their response to what was done to them.
- Both identify students who might matter and quietly prepare them.
- Their dialogues reference each other obliquely ("the woman on the ethics faculty" / "the engineer who teaches the reactor-hum") without ever meeting on-screen in Act 1.
- If/when they share a scene in later Acts, it should be treated as a major reveal beat — the meeting of Celebration's survivor and Sorrow's survivor. Possibly the single most loaded non-protagonist scene in the game.

This paired arc is reinforced by ROOM DESIGN: Matrikala's reactor workshop lighting (warm amber from the reactor + cool cyan ambient) mirrors Eidola's lecture hall (warm amber from her desk lamp + cold violet ambient). Same two-key structure, different palettes — deliberately visually linked for players who see both characters.

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

### 2O — THE NECROMANCER (REAL CANON — CYBERPUNK-PUNK PALE-UNDEAD ELF)

> **CANONICAL CORRECTION (2026-04-22):** This section REPLACES an earlier draft describing the Necromancer as "long-underwater-hair medusa figure floating above the ground in funeral robes." That draft was derived from outdated `characterVisualDNA.ts` and was wrong. Real canon (2026-04-22 user upload, image #3): the Necromancer is a **cyberpunk-punk pale-undead elf** — messy spiked white hair, pointed elf-like ears, RED-LENSED SUNGLASSES hiding the eyes, high-collar black-and-red jacket. The "pale undead" DNA survives; the aesthetic shifts from classical necromancer to punk-street-cyberpunk.

Reference: `apps/client/public/references/npcs/necromancer/front.png` (from 2026-04-22 upload).

**Critical rigging note:** The Necromancer's aliveness is carried by TWO signature tells:
1. The red-lensed sunglasses pulse INTERNAL red emissive at irregular intervals — not constant glow, but occasional bright-flicker bursts when he sees the dead.
2. His breathing is minimal (he is dead-adjacent), but the high jacket collar shifts subtly as the undead-cold air around him disturbs the fabric — not breath, an aura.

#### 2O.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of an ageless-looking male figure, pale-almost-grey skin (#c8c4c0 with cool undertones, not sickly but not alive — a held-between quality), gaunt sharp cheekbones, narrow angular face. Hair: short-to-medium length, MESSY AND SPIKED WILD in an undone-punk style, pure white (#f4f0ec) with occasional strands at the temples streaked very faintly into silver — not styled, just wild-set. Ears: pointed ELF-LIKE extending ~4cm past the normal ear-tip position, flushed with a subtle RED TINT at the cartilage edges (the only warm color on his head — a faint hint the ears take in ambient red-light or signify something undead-ritual). Brows: thin, naturally dark-grey, furrowed slightly downward in a focused/appraising expression.
>
> **EYES HIDDEN BEHIND RED-LENSED SUNGLASSES:** a pair of small narrow wrap-around tactical-style sunglasses with FULL RED INTERIOR LENSES (#c41020 emissive tinted glass — you cannot see his actual eyes behind them, only the red glow of the lenses themselves). Frame is thin black wire (#1a1a1d). The red lens glow is sufficiently bright that a subtle warm-red rim-bounces light back onto his upper cheekbones. Mouth: thin pale lips (#b0a8a8) closed in composed neutral line, slight downturn at the corners — not angry, just unbothered-with-pleasantries.
>
> Wearing a HIGH-COLLAR BLACK JACKET with DEEP BLOOD-RED INNER LINING (outer shell #0a0b0d matte black with worn leathery texture, inner lining visible at the flipped-up collar and a V-section at the chest showing the red #5a0c0c silk-or-leather). Collar turned fully UP, reaching his jaw. Beneath the jacket: a black fitted shirt (#1a1a1d) with a thin silver chain necklace visible above the collar line, a small hexagonal pendant dangling from the chain (pewter-metal, simple — a cybernetic focus element, not ornate).
>
> Backdrop: desaturated dark-grey void (#3a3d42) with faint subtle vertical atmospheric haze — no crypt, no environment, just flat cyberpunk street-portrait background. Lighting: cool edge-fill from back-right (faint cyan suggestion, no actual neon visible), warm-red reflected bounce from his own sunglasses onto his cheeks. No key light — he sits in his own illumination more than the scene's. Film grain. 4K. No rendered text.

#### 2O.2 — Bundle B: Breathing loop (8 frames)

> Minimal chest motion (1.000 to 1.002 peak — he is dead-adjacent, breath is vestigial). The HIGH COLLAR of the jacket shifts subtly across the 8-frame cycle — the leather folds settle 1-2px as if cold undead-aura currents disturb the fabric (NOT synced to the chest breath — offset on a 4.5s independent cycle). The messy hair DRIFTS very subtly (±0.8px, random-jitter patterns, as if individual spikes are alive in their own tiny ways). The red sunglasses — see blink bundle below. 8 PNGs.

#### 2O.3 — Bundle C: Blink triptych + DEAD-SIGHT FLICKER variant

> No traditional eyelid blink (eyes are hidden behind sunglasses). Instead, deliver 4 frames:
> - **baseline:** sunglasses lenses at standard red-glow intensity (0.6)
> - **half-dim:** lenses briefly dim to 0.3 intensity (he is processing data)
> - **full-bright:** lenses briefly spike to 1.4 intensity (he is SEEING something — the dead)
> - **dead-sight flicker (rare variant, every ~8 regular blinks):** for a single frame, the red lens tint disappears entirely and the BLACK LENS SHOWS A GHOSTLY SKULL SILHOUETTE inside the glass (as if the lenses are briefly transparent-to-the-dead-realm — the skull is seen from inside the sunglasses, projecting out). One frame only, then returns to baseline. Unsettling — audience catches it once and then looks for it.

#### 2O.4 — Bundle D: Viseme grid

> Standard 15-panel at 75% baseline openness. He speaks slowly, deliberately, like a man reading names from a long list. Lip color pale (#b0a8a8). Mouth movements are measured — runtime drives viseme transitions at 70% standard speed. Preserve the downturned corners baseline across all vowels (his mouth never quite commits to happy).

#### 2O.5 — Bundle E: Expressions (5)

> 1. SPEAKING — mouth opens minimally, lens-intensity modulates with phoneme emphasis (consonants dim, vowels brighten).
> 2. CONCERNED — one lens DIMS fully to black while the other stays at baseline — asymmetric processing. The dead are SHOWING him something he doesn't want to see.
> 3. EMOTIONAL1 (rites-performed) — lenses intensify to 1.2, subtle halo of faint red bleed from the edges of the glasses onto his temples, head tilts 3° forward (priestly bowing gesture). This is the mortician-in-his-element beat.
> 4. EMOTIONAL2 (communion) — lens-glow drops to 0.2, mouth slightly parts, he appears to be LISTENING to something below the audible range. The dead are talking back. His ears (the pointed elf-ears) subtly flush deeper red. Reserved for the moment he channels another voice.
> 5. REVEALING — he PULLS THE SUNGLASSES DOWN the bridge of his nose with one bare pale hand (fingers long, too-thin), lens angle tilts forward to briefly expose the EYES BENEATH: milk-white, no pupils, faintly luminous inner cores (the old canon DNA survives under the glasses). Direct gaze at camera. Mouth parts for a single spoken name. Reserved for the beat he speaks a name of the dead directly to the player. Sunglasses return to position afterwards. One frame, held, then released.

#### 2O.6 — Bundle F: Sunglasses emissive + dead-sight skull overlay

> **Output:** `apps/client/public/vfx-atlases/necromancer_{sunglass_red,dead_sight_skull,milkwhite_eyes}.png`.

> - **sunglass_red.png** — 512×256 transparent. Two red radial emissive textures matching the lens positions — hot white-red core (#ffa0a0) fading through blood-red (#c41020) to transparent at the lens edges. Driven by `lensIntensity: 0..1.4` uniform. Can be independently driven left/right for asymmetric effects.
> - **dead_sight_skull.png** — 512×256 transparent. Faint ghostly skull silhouette (pale white, ~40% opacity) sized and positioned to fit inside the lens frame. Renders only on the rare dead-sight-flicker blink variant.
> - **milkwhite_eyes.png** — 512×256 transparent. The actual pupil-less milk-white eyes revealed during REVEALING when the sunglasses slide down. Faint luminous inner glow (#f0f0e8 subtle emissive).

#### 2O.7 — Shader uniform block

```json
{
  "rigId": "npc_necromancer",
  "shaderProgram": "CyberpunkUndeadPortrait",
  "uniforms": {
    "lensIntensityLeft": 0.6,
    "lensIntensityRight": 0.6,
    "lensRedTexture": "vfx-atlases/necromancer_sunglass_red.png",
    "deadSightSkullTexture": "vfx-atlases/necromancer_dead_sight_skull.png",
    "deadSightActive": 0.0,
    "sunglassesPosition": 1.0,
    "milkwhiteEyesTexture": "vfx-atlases/necromancer_milkwhite_eyes.png",
    "earRedFlush": 0.3,
    "collarAuraCyclePeriod": 4.5,
    "breathingPhase": "autoLoop:3.2s:amp=1.002",
    "visemeSpeedMultiplier": 0.7
  },
  "stateTriggers": {
    "seeingTheDead": "lensIntensityLeft=1.4; lensIntensityRight=1.4 momentarily",
    "asymmetricConcern": "lensIntensityLeft=0; lensIntensityRight=0.6 (or vice versa)",
    "communion": "lensIntensities=0.2; earRedFlush=0.8; mouth parts listening",
    "deadSightFlicker": "lensIntensities=0; deadSightActive=1 for 1 frame every ~8 blinks",
    "revealing": "sunglassesPosition=0.3 (pushed down); milkwhite eyes exposed for held beat"
  }
}
```

#### 2O.8 — Canon DNA note

The old `characterVisualDNA.ts` entry (ashen skin, milk-white pupil-less eyes, sunken cheeks, white hair) was partially right — the UNDEAD-pale skin, white hair, and pupil-less milk-white eyes are still canonical. They're just **hidden behind sunglasses** in the real canon, revealed only for the REVEALING beat. The "floats above the ground" / "burial-ink sigils on forehead" / "funeral-black tattered robes" beats from the old DNA entry are WRONG and should not appear anywhere in the 3D or 2D pipeline. Replace with the cyberpunk-punk jacket-and-glasses canon above.

---

### 2P — NILMORG (REAL CANON — DEMON IN A SUIT)

> **CANONICAL CORRECTION (2026-04-22):** This section REPLACES an earlier draft describing Nilmorg as a "theatrical DMC kart-racing checkerboard-coat showman with microphone." That was wrong — derived from the CIN-031/032 matchup text, which is race-mode environment framing, NOT Nilmorg's actual appearance. Real canon (2026-04-22 user upload, image #2): **Nilmorg is a demon in a suit.** Tall bald pale-skinned humanoid figure with yellow glowing eyes, corporate-tailored dark suit, fingertips-touching pyramid gesture. Industrial-boiler-room backdrop. Menace without theater.

Reference: `apps/client/public/references/npcs/nilmorg/front.png` (from 2026-04-22 upload).

**Lore note:** Nilmorg still OPERATES the Dead Man's Circuit race (game-mode `/circuit`) as its organizing power — but his real appearance is NOT a carnival showman. He is a demonic HR-executive type who contracts with the winners to "transfer" them into Hierarchy assets. The race is performance theater around him; HE is the signatory at the end. The gracious-smile "winner-crowned" severance beat from the old canon stays intact — but it's delivered by a corporate demon, not a kart-track emcee.

#### 2P.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a tall humanoid figure, completely BALD, PALE BONE-WHITE SKIN (#d4ccc4 with cool undertones) — not sickly, sculptural. Gaunt angular facial structure: pronounced high cheekbones, deep-set temples, long thin jawline, narrow thin closed-lipped mouth in a composed neutral-predatory line. NO eyebrows (or nearly invisible thin brow-hairs the same pale tone as skin — reads as clean-shaven everything). Eyes: LARGE SOLID AMBER-YELLOW glowing orbs (#f5a040 emissive with hot inner-white core #fff0c8, iris fully luminous — no visible pupil; the entire eye reads as a warm yellow lamp), direct piercing stare. Faint dark venous tracing barely visible at the temples (subtle blue-black undertone vein-work beneath the pale skin, reading as "not-quite-human-circulation"). Wearing a PRECISELY TAILORED DARK CHARCOAL-BLACK CORPORATE SUIT (#0a0b0d, flat matte wool, zero sheen, visible subtle warp-weave), double-breasted or sharp single-breasted jacket with high lapels, fully buttoned. Beneath: a dark collared dress shirt with subtle vertical tonal-ribbing (also black-on-black, barely readable as texture). NO tie — the open collar exposes the pale throat with a faint bronze or brass collar-pin at the side (small, executive, non-religious). Hands in frame, both visible at chest level, FINGERTIPS TOUCHING in a precise steepled-pyramid gesture (each fingertip exactly meeting its mirror counterpart, impossibly still, thumbs extended forward at the gesture's apex) — this is his signature pose. Fingers are long, pale, slightly too-thin. Nails natural-neutral. Several small silver-brass "ball-bearing" cyber-rings stacked on the fingers at the gesture points, catching the warm light (~3-4 rings total distributed across the fingers, small, not ornamental — utilitarian). Backdrop: INDUSTRIAL FACTORY / BOILER ROOM at depth — vaulted dark-metal ceiling with visible girders and pipe-work, small warm-amber and warm-orange recessed lamps at regular intervals along the walls (#c76a3a warm work-light) providing edge rim-light, deep shadows at frame edges. The setting reads as a place where deals are finalized, not announced. Lighting: warm amber work-lamps providing upward rim-lighting on his jawline and fingertips (the light comes from BELOW in this room), top fills cool-near-black. Faint orange rim on the suit's shoulders from the lamps. Mouth closed, unreadable expression — still, composed. Film grain. 4K. No rendered text.

#### 2P.2 — Bundle B: Breathing loop (8 frames)

> Barely-there chest motion (1.000 to 1.003 peak — he is SUPERNATURALLY still). The steepled pyramid gesture does NOT move across the 8 frames (the precision is the point — human hands cannot hold this position, his can). Suit UNCHANGED. Only discernible motion: the yellow eye-glow pulses subtly (0.9 to 1.1 intensity) on a 4.0s offset cycle independent of breath. He breathes like something that does not need to.

#### 2P.3 — Bundle C: Blink triptych + PREDATOR NICTITATE VARIANT

> Standard 3 frames (open / half / closed). On CLOSED frame, the yellow eye-glow does NOT extinguish — a strong 60% glow leaks through the closed eyelids (he is brighter-behind-the-eyelid than most characters are with eyes open). PLUS a 4th PREDATOR NICTITATE variant: a horizontal sideways nictitating membrane blink (inner corner sweeping outward across the eye) instead of a vertical eyelid blink. Runtime uses this rarely — every ~8-12 normal blinks. Subliminal wrongness. Similar pattern to Shadow Tongue's anomaly blink.

#### 2P.4 — Bundle D: Viseme grid

Standard 15-panel at 85% baseline openness (he speaks economically, like a man who has said everything before). Thin lips give sharp crisp viseme reads. On OPEN vowels, faint glimpse of back-teeth reveals they are ALL slightly too sharp and slightly too many — a subtle horror-tell, only legible at closest zoom on the widest vowels.

#### 2P.5 — Bundle E: Expressions (5)

> 1. SPEAKING — minimal mouth motion, eyes locked direct, fingertips UNMOVED in steepled position, yellow eye-glow modulates with phoneme emphasis.
> 2. CONCERNED — eyes narrow 15%, brow ridge lowers (where eyebrows would be). He is registering a problem, which does not mean he cares.
> 3. EMOTIONAL1 (cataloging-interest) — head tilts 5° to one side, yellow eye-glow intensifies 1.2×. A moment of genuine interest. Reserved for when he identifies someone he intends to contract.
> 4. EMOTIONAL2 (contract-ready) — the steepled fingertips SEPARATE slightly — the perfectly-still pyramid opens by 3mm. Thumbs retract, fingers spread 15%. A gesture of "ready to sign." Yellow eyes dim to 0.7× (the excitement has been absorbed inward). One of his most unsettling frames. Reserved for post-race severance moments.
> 5. REVEALING — the steepled hands lower to frame edge (out of the composition), head tilts forward, yellow eye-glow blazes to 1.8×, the thin mouth opens into a narrow smile that exposes slightly-too-sharp teeth at full view. The demon fully present. Reserved for a specific beat where a player refuses his contract — the moment he stops pretending to be executive.

#### 2P.6 — Bundle F: Yellow eye-glow + ball-bearing-ring overlays

> **Output:** `apps/client/public/vfx-atlases/nilmorg_{yellow_eye_glow,ring_reflections}.png`.

> - **yellow_eye_glow.png** — 512×256 transparent. A pair of radial yellow emissive textures matching the eye positions, hot white-yellow core (#fff0c8) fading through warm amber (#f5a040) to transparent at edge. No iris/pupil detail — the eyes are FULLY luminous orbs. Driven by `yellowEyeIntensity: 0..2.0` uniform.
> - **ring_reflections.png** — 256×256 transparent. Small specular highlight sprites for the silver-brass ball-bearing rings on his fingers, animated to catch the warm amber work-lamp from below.

#### 2P.7 — Shader uniform block

```json
{
  "rigId": "npc_nilmorg",
  "shaderProgram": "DemonExecutivePortrait",
  "uniforms": {
    "yellowEyeIntensity": 1.0,
    "yellowEyeTexture": "vfx-atlases/nilmorg_yellow_eye_glow.png",
    "yellowEyeGlowThroughLids": 0.6,
    "eyePulsePeriod": 4.0,
    "steepleGestureLocked": true,
    "ringReflectionIntensity": 0.7,
    "ringTexture": "vfx-atlases/nilmorg_ring_reflections.png",
    "breathingPhase": "autoLoop:3.2s:amp=1.003",
    "visemeScale": 0.85
  },
  "stateTriggers": {
    "cataloging": "yellowEyeIntensity=1.2; head tilts 5°",
    "contractReady": "steepleGestureLocked=false; fingertips separate 3mm; yellowEyeIntensity=0.7",
    "predatorNictitate": "horizontal nictitating blink variant fires",
    "revealing": "steeple lowers out of frame; yellowEyeIntensity=1.8; mouth opens to reveal teeth"
  }
}
```

#### 2P.8 — Integration with DMC game-mode

The Dead Man's Circuit (`/circuit`) game-mode cinematics (CIN-031/CIN-032 in `SHIP_READY_ASSET_BIBLE.md`) were written against the OLD carnival-showman Nilmorg. Those cinematics need AUDIT:
- CIN-031 ("kart-line countdown"): the "theatrical GO! shout" beat needs to be re-specced with Nilmorg as a demon-executive CONTRACTING RACERS at the starting line, not a showman rousing a crowd. He still counts down, but with restrained executive precision — no theatrical grin, no microphone flourishing.
- CIN-032 ("severance trophy ceremony"): the gracious-smile beat stays intact — it is still the gracious smile that precedes the severance — but delivered by the demon-executive who steeples his fingers in front of his yellow eyes, not an emcee.

Add to Part 9 cinematics audit list.

---

### 2Q — THE MEME / THE PALIMPSEST (REAL CANON — TRUE FORM AS CORPORATE BROADCAST-ENTITY)

> **CANONICAL CORRECTION (2026-04-22, second pass):** Two prior drafts of this section were wrong. The previous "child-archon with broadcast antennas" draft was also wrong — I over-corrected in the previous pass. REAL canon from user's second clarification: **The Meme and the Palimpsest are the SAME ENTITY, two titles.** The TRUE FORM of this entity (image #1 from user's 2026-04-22 upload batch) is an older corporate figure with a FLOATING HOLOGRAPHIC DISPLAY-FACE and black-and-chrome CYBERNETIC ROBOT HANDS. Minnie the Meme (Part 2N) is a CHILD AVATAR this entity wears when performing — she is a face, not the entity.

#### 2Q.0 — Canonical identity note (CRITICAL)

The **Meme** and the **Palimpsest** are NOT two characters. They are one entity with two functional titles:
- **"The Meme"** — the entity's viral-broadcast function (the chant, the contagion, the spreading meme). Its child avatar is Minnie (Part 2N), the seven-year-old girl with Mickey ears.
- **"The Palimpsest"** — the entity's editing-reality function (the broadcast whose casualty crawl runs backwards; the rewriter of record). No child avatar — the Palimpsest appears in its TRUE FORM because editing requires the entity's full authority.
- **Both are the same cosmic horror.** The Meme spreads. The Palimpsest edits. Minnie is the show's face; the corporate-holo-display figure is who writes and directs the show.

When in-game dialogue references "the Meme," the voice may come from Minnie (child form) or from this true form (corporate form) depending on plot context. When it references "the Palimpsest," always the true form.

#### 2Q.1 — Bundle A: Neutral bust (TRUE FORM)

> Three-quarter bust portrait of an older man — looks mid-sixties — wearing an immaculately tailored DARK-CHARCOAL-BLACK CORPORATE SUIT (#0a0b0d, flat matte wool, sharp single-breasted jacket, high lapels), crisp white dress shirt (#f0ede8), thin black silk tie (#0a0a0a) knotted at the throat with a small dark patterned neck-cloth loosely tied above the tie collar (subtle, not flashy — the accessory of someone who needs to convey "executive"). Corporate executive profile: short silver-white hair (#c8ccd2) combed neatly back from the forehead, lined weathered face visible but AT A REMOVE — see below.
>
> **CRITICAL VISUAL: His face is a FLOATING FLAT HOLOGRAPHIC DISPLAY.** Positioned exactly where a human face would be (filling the area from forehead-line to lower-jaw-line, extending ~25cm wide × 32cm tall), a rectangular RECTANGULAR HOLOGRAPHIC SCREEN floats free in the air, showing a high-resolution live video of his face (deeply lined eyes, weathered skin, neutral composed expression). The screen is OBVIOUSLY A SCREEN on close inspection — thin 1-2px luminous pale-blue edge-outline borders the rectangle (#a0c8e8 subtle emissive), occasional subliminal SCAN LINES very faintly cross the display at slow 8s intervals, and the entire screen FLOATS in front of his actual head, NOT attached. His actual head behind/within the screen would not be rendered — the screen occludes it. The illusion is that his face is a broadcast transmission. Looking past the edges of the screen, the neck and shoulders of his physical body ARE visible (the suit continues, the throat is visible below the screen, the shoulders are real), but the face — the face is signal.
>
> **CRITICAL VISUAL: His HANDS are CYBERNETIC.** Where normal hands would be, both forearms terminate at the wrist into BLACK-AND-CHROME ARTICULATED MECHANICAL HANDS (#1a1d22 matte black knuckle-joints with polished #c0c4cc chrome fingertips and small brass #b8752d reinforcement rings at each finger-joint). The hands are elegantly-designed cybernetic — not crude prosthetics, more like high-end executive cyber-replacement. Fingers are articulated with visible segment joints. One hand (his right, viewer's left) is extended open-palm forward in a gesture of offering or invitation — the palm catching a soft blue-white light from above. The other hand (his left, viewer's right) rests on a dark wooden DESK in the lower-frame foreground, the black mechanical fingers splayed over a scatter of PAPERS (plain white papers with faint abstract glyph-markings — NOT legible text — and a small traditional-ink pen and inkwell at the desk corner, anachronistic against the cybernetics).
>
> Backdrop: dark executive office at night, heavy shadows, deep indigo-black atmosphere. A distant blurred window-rectangle of pale blue light (cool moon-simulation or holographic backlight) at upper right, small warm defocused light sources in the mid-distance suggesting other screens/practicals. The floor-to-ceiling feel is an editor's den, not a broadcast studio. Lighting: cool blue-white key from above-right (simulating the ambient light from his own holographic face), faint warm amber fill from below from the desk-lamp direction, deep black frame edges. Film grain. 4K. No rendered text.

#### 2Q.2 — Bundle B: Breathing loop (8 frames) + REWIND variants

> **Chest breathing** — shallow controlled (1.000 to 1.003 peak, corporate-still). The suit shoulders UNCHANGED across all 8 frames — structured tailoring locks the silhouette. Throat above the tie rises and falls slightly with breath (visible below the floating screen). The floating holographic SCREEN hovers at a constant position relative to his shoulders — as his shoulders rise 1-2px on inhale, the screen rises with them.
> **Screen idle behavior:** across the 8 breathing frames, the screen's interior video shows MICRO-FLICKER artifacts (barely-visible 1-pixel jitter, chromatic-aberration bleed at the screen edges) on an irregular cycle. One frame in eight will show a brief scan-line sweep (frame 4 = scan halfway down the screen).
> **Cybernetic hands** — the extended hand's fingers subtly flex ±1mm on the breath cycle (visible articulation). The desk hand UNCHANGED (resting).
> **BONUS: 4 REWIND frames** (`breathing/rewind_01..04.png`): same subject but chest contracts instead of expanding, screen scan-lines reverse direction, papers on the desk appear to shift position slightly between frames. These splice in when the Palimpsest editing-function activates. 12 total PNGs.

#### 2Q.3 — Bundle C: Blink triptych + SCREEN-GLITCH variant

> Standard 3 frames (open / half / closed) — the FACE ON THE SCREEN blinks normally (this is a real video of his face, and videos can show blinking). BUT: the rectangular screen frame itself does not change. On each blink, the screen border-glow briefly intensifies (+20% luminance for 80ms mid-blink) — a subliminal "signal tick."
> PLUS a 4th SCREEN-GLITCH BLINK variant: the face on the screen freezes in an UNEXPECTED expression for a single frame (a different expression than the one playing before and after), then continues. Runtime fires this rare variant every ~12-20 regular blinks. Unsettling — the broadcast is being edited live. 4 PNGs.

#### 2Q.4 — Bundle D: Viseme grid

> Standard 15-panel sheet — VISEMES RENDER ON THE SCREEN, not on a physical mouth. The screen's video shows the mouth-shape for each phoneme, projecting out to the viewer as pure signal. 15 panels at 100% standard openness (he is a broadcast entity; intelligibility is his function). 4K.

#### 2Q.5 — Bundle E: Expressions (5)

> 1. SPEAKING — the screen-face delivers lines with crisp corporate broadcast cadence; cybernetic hands remain still, the open-palm hand subtly rotates to emphasize certain words (rotation driven per-phoneme by a custom emphasis track).
> 2. CONCERNED — the screen-face's brows pull together in practiced sympathy; the screen-border emits a single faint red pulse (the broadcast is registering a data issue).
> 3. EMOTIONAL1 (editorial-amusement) — the screen-face's lips curl into a thin knowing smile; the CYBERNETIC FINGERS of the desk hand tap once against the papers (a single decisive tap — he has decided something about what you just said).
> 4. EMOTIONAL2 (edit-in-progress) — the screen-face FREEZES on a neutral expression while the ambient background continues to flicker. Both cybernetic hands subtly flex as if typing on an invisible keyboard, rearranging the papers on the desk with a precise shuffle. The desk papers briefly DISPLAY new abstract glyph-marks that weren't there before. The broadcast is being edited in real time. Rare and horrifying.
> 5. REVEALING — the screen EXPANDS 20% in size briefly, the screen-face leans toward the camera as if pushing against the front glass, expression dropping into cold direct appraisal. Both cybernetic hands rise above the desk into frame — both palms facing the camera in a stop-gesture. He has decided the player should SEE WHO IS EDITING THEM. Reserved for the single beat the Palimpsest drops its corporate mask.

#### 2Q.6 — Bundle F: Screen-broadcast + cybernetic-hand overlays

> **Output:** `apps/client/public/vfx-atlases/palimpsest_{screen_border,scan_line,paper_glyphs,cyberhand_rings}.png`.

> - **screen_border.png** — 1024×1280 transparent. The luminous pale-blue rectangular edge-outline with subtle chromatic-aberration bleed, used as overlay around the screen-face region.
> - **scan_line.png** — 1024×64 transparent. A single horizontal scan-line sweep sprite that travels top-to-bottom on the screen at slow intervals.
> - **paper_glyphs.png** — 1024×512 transparent. Abstract glyph-markings for the desk papers, animatable so runtime can morph the glyphs during edit-in-progress beats.
> - **cyberhand_rings.png** — 512×256 transparent. Specular-highlight sprites for the small brass reinforcement rings on the cybernetic fingers, catching light as the hands move.

#### 2Q.7 — Shader uniform block

```json
{
  "rigId": "npc_meme_palimpsest_entity",
  "shaderProgram": "CorporateBroadcastEntityPortrait",
  "uniforms": {
    "screenBorderIntensity": 0.5,
    "screenBorderTexture": "vfx-atlases/palimpsest_screen_border.png",
    "screenVideoSrc": "runtime:dynamic_face_video",
    "scanLinePeriod": 8.0,
    "scanLineTexture": "vfx-atlases/palimpsest_scan_line.png",
    "paperGlyphMorph": 0.0,
    "paperGlyphTexture": "vfx-atlases/palimpsest_paper_glyphs.png",
    "cyberHandRingIntensity": 0.6,
    "editInProgress": 0.0,
    "breathingPhase": "autoLoop:3.2s:amp=1.003",
    "visemeChannel": "routeToScreenVideo"
  },
  "stateTriggers": {
    "editorialAmusement": "desk hand taps once; screen-face smiles",
    "editInProgress": "screen-face FREEZES; cyberhands flex typing; paperGlyphMorph ramps 0→1 over 800ms",
    "revealing": "screen expands 20%; both cyberhands rise to stop-gesture; screen-face drops to cold appraisal",
    "screenGlitchBlink": "face on screen shows unexpected expression for 1 frame every ~12-20 blinks"
  },
  "crossReference": {
    "childAvatar": "npc_meme_minnie (Part 2N) — when the entity performs as the Meme, it wears Minnie's face",
    "canonicalIdentity": "This entity is BOTH 'the Meme' and 'the Palimpsest' — same entity, two functional titles"
  }
}
```

#### 2Q.8 — Minnie cross-reference (update to 2N)

Minnie the Meme (Part 2N) remains as-specified — she is the CHILD AVATAR this entity wears when performing the Meme function. Update the 2N shader block to reference this entity as the TRUE FORM (`parentEntity: npc_meme_palimpsest_entity`). Dialogue routing between 2N and 2Q:
- Minnie-voiced lines → render 2N (child-archon)
- Palimpsest-function lines (Loredex edits, broadcast rewrites) → render 2Q (true form)
- Meme-function lines spoken with adult gravity → render 2Q
- Meme-function lines spoken with child spread-the-chant energy → render 2N
- Runtime decides by reading the line's VO manifest `presentation` field

Corey (2I's child-disciple-of-the-Collector) and Minnie stay as CHILD AVATARS of their respective entities. Trio-arc from the prior draft remains valid — the three children are AVATARS, not independent characters. The true horrors are the adults editing them.

---

### 2R — THE PROGRAMMER (REAL CANON — YOUNG CYBERPUNK PHASE OF THE ANTIQUARIAN)

> **CANONICAL CORRECTION (2026-04-22):** Earlier draft described the Programmer as a "mid-forties man at a Nexon battlefield with ember-rust scarf and satchel." That was wrong — derived from outdated matchup txt. Real canon (user's 2026-04-22 image #2 upload, with explicit confirmation that Antiquarian + Programmer are the same person at different points in time): **The Programmer is the YOUNG cyberpunk phase of the Antiquarian.** Late twenties / early thirties, observing a Shibuya-style cyberpunk city from a high vantage, wearing brass-and-gold STEAMPUNK GOGGLES with red-pink emissive lenses (grid-pattern visible inside), a black FLAT CAP / NEWSBOY CAP, and a black high-collar jacket. Same person who later becomes the bearded scholar in the library (Part 2D).

**Critical rigging note:** Two-phase rig like Kael but simpler (2 states, not 3). Phase 1 = Programmer (this section, young cyberpunk observer). Phase 2 = Antiquarian (Part 2D, older scholar). Runtime blends via `antiquarianEmergenceProgress: 0..1`. Default for present-day = Phase 2. Default for flashback = Phase 1.

**Visual continuity between phases (the same person, aged ~30 years):**
- Same blue-grey eyes (Phase 1 sharper, Phase 2 deeper-set with more crow's-feet)
- Same dark hair (Phase 1 fully dark, Phase 2 silver-and-dark MIXED — the dark of his youth still shows through)
- Same dark eyebrows (Phase 1 and Phase 2 both have dark brows — they never grey)
- Same thin angular face structure
- Phase 1 = clean-shaven; Phase 2 = magnificent silver-white beard

**Goggle parallel note (Engineer/Prince, Part 2V/W):** The Engineer (in his memoir mode) ALSO wears red steampunk goggles. Whether this is coincidence or a deliberate visual signal connecting the two characters (a shared tech tradition, an order, a mentor lineage) is left as a NARRATIVE EASTER EGG for writers to resolve later. Visually, the two characters' goggle systems can read as cousins (both red emissive, both brass-rimmed) without being identical.

Reference: `apps/client/public/references/npcs/programmer/front.png` (from 2026-04-22 image #2 upload).

#### 2R.1 — Bundle A: Neutral bust (Programmer phase)

> Three-quarter bust portrait of a YOUNG man, late 20s to early 30s, thin angular face, fair-medium pale skin (#d4c8b8) with cool undertones, clean-shaven (or extremely light stubble at most). Sharp jaw, defined cheekbones, narrow mouth set in a neutral observant line. Dark BROWN-BLACK hair (#1a1a1d) cut short, neatly cropped at the back and sides, slightly longer at the top — barely visible under a black FLAT CAP / NEWSBOY-STYLE CAP (#0a0b0d, soft fabric weave, slight curve to the brim, sitting tilted forward at a casual angle low over the brow). Dark eyebrows (#1a1a1d), full and slightly arched.
>
> **EYES HIDDEN BEHIND BRASS-AND-GOLD STEAMPUNK GOGGLES** — large round brass-rimmed lenses (#b8752d brass-and-gold metallic frames, ~4cm lens diameter each, with visible mechanical detail at the temple-mounts: small brass screws, articulation joints, a tiny brass-and-leather strap running back behind the head). The interior LENSES glow RED-PINK (#e85a8a emissive, hot inner core) with a visible internal GRID PATTERN — fine cross-hatched grid lines in a slightly brighter pink-red, creating a HUD/scope/data-overlay effect inside each lens. The lenses are sufficiently bright that a subtle pink rim-bounces light back onto his upper cheekbones. Goggles are clearly active TECHNOLOGY (data scopes), NOT decorative — he is reading the city through them.
>
> Wearing a black HIGH-COLLAR JACKET (#0a0b0d, structured with a stiff collar pop'd up at the back of his neck, simple matte-black fabric, contemporary cyberpunk-formal cut, visible button placket down the front). Beneath the jacket: a plain black collared shirt. A small gold pendant on a thin gold chain visible at the V-section of the jacket opening (small simple geometric charm — a hexagonal sigil, abstract). Single small black-or-gold stud earring in the visible right ear.
>
> Pose: standing on a high vantage point (rooftop, balcony, or elevated walkway implied — the camera is at his shoulder level looking past him to the city below). Body angled so his head is turned ~30° to the viewer's right, looking out over the city. He is OBSERVING.
>
> **Backdrop: SHIBUYA-AT-NIGHT CYBERPUNK MEGAPLAZA at depth.** Vast neon-lit city scene seen from above and slightly behind him — towering buildings covered in massive holographic billboards (blue, magenta, pink, green neon signage with bilingual abstract text — NOT legible, just stylized character-forms suggesting Asian-cyberpunk language), street-level crowds visible as tiny bokeh figures in a wide plaza far below, neon ground-level signage, atmospheric haze with neon-color volumetric scatter. The city is the WHOLE backdrop — half the frame. Lighting: cool magenta-pink ambient from the city below + warm yellow-amber from a nearby practical light + the red-pink glow from his own goggles bouncing onto his face. He is lit BY the city. Film grain. 4K. No rendered text.

#### 2R.2 — Bundle B: Breathing loop (8 frames)

> Standard chest cycle (1.000 to 1.005 peak — measured, contained). The flat cap is RIGID, does not move with breath. The high jacket collar shifts ±1px subtly (fabric breathes lightly). The GOGGLE LENSES — see Bundle C below for blink-equivalent behavior. Hair UNCHANGED (covered by cap). Pendant chain at chest swings ±0.5px with breath. 8 PNGs.

#### 2R.3 — Bundle C: Blink triptych — REPURPOSED AS GOGGLE-LENS-SCAN PULSE

> No traditional eyelid blink (eyes hidden behind goggles). Instead, deliver 3 frames showing the goggle-lens grid pattern at three intensities:
> - **baseline:** lens emissive at 0.7 with stable grid pattern visible
> - **dim-scan:** lens emissive briefly drops to 0.4, grid pattern temporarily ENHANCES (more visible cross-hatches) — the goggles are processing fresh data
> - **bright-pulse:** lens emissive briefly spikes to 1.2, grid pattern slightly DISTORTS / wave-flickers — he is registering something significant
> Runtime fires the dim-scan / bright-pulse variants on a random 4-9s cycle (analogous to blink rate). Same NO-real-eyelid pattern as the Programmer's older self has under the open-eyed Antiquarian, but here the goggles do all the work.

#### 2R.4 — Bundle D: Viseme grid

Standard 15-panel at 85% baseline openness — he speaks economically, observed-not-engaged, the cyberpunk-flâneur cadence. Lip color natural pale (#a89a8a). Preserve the cap and goggle line-of-frame across all 15 panels.

#### 2R.5 — Bundle E: Expressions (5)

> 1. SPEAKING — minimal mouth motion, goggle lens grid-pattern modulates with phoneme emphasis, head stays turned to the city.
> 2. CONCERNED — both lens emissive dims to 0.3, grid pattern intensifies (he is concentrating), mouth tightens slightly. The city has shown him something he doesn't like.
> 3. EMOTIONAL1 (observation-confirmed) — one lens briefly TILTS slightly forward at a different angle than the other (the goggles are mechanical-articulated, individual lens-housings can independently move) — a "scope-zoom" gesture. Lens emissive +0.2 for 600ms. He has spotted what he was looking for.
> 4. EMOTIONAL2 (recognition-cost) — both lenses dim fully to 0.1 for one frame (the brightness drains out of the goggles), mouth tight, jaw clenches. He has recognized someone in the crowd below — and the recognition costs him something. Reserved.
> 5. REVEALING — he LIFTS the goggles up onto the brim of his cap with both hands (the goggles are now resting on the front of the cap, lenses dim, real eyes EXPOSED for the first time): pale clear BLUE-GREY eyes (#6b7a88 — the same eye color as the Antiquarian in Phase 2), direct gaze at camera. Mouth opens for a single line. Reserved for the beat where the player learns who he becomes.

#### 2R.6 — Bundle F: Steampunk-goggle emissive overlays

> **Output:** `apps/client/public/vfx-atlases/programmer_{goggle_lens_red,goggle_grid_pattern,goggle_off_brim_pose}.png`.

> - **goggle_lens_red.png** — 512×256 transparent. A pair of radial red-pink emissive textures matching the goggle lens positions (~256×256 per lens, 32px gap between them), hot white-pink core (#ffd0e0) fading through deep pink (#e85a8a) to transparent at the lens edges. Driven by `lensEmissive: 0..1.2` uniform. L/R can be independently driven for asymmetric scope-zoom moments.
> - **goggle_grid_pattern.png** — 512×256 transparent. Fine cross-hatched grid lines for the inside of each lens (slightly brighter pink than the base lens emissive), tileable across the lens region. Driven by `gridPatternIntensity: 0..1` — modulates with phoneme emphasis and processing-pulse beats.
> - **goggle_off_brim_pose.png** — 1024×512 transparent. The goggles in the LIFTED pose resting on the cap brim (rendered separately — used compositionally for the REVEALING frame).

#### 2R.7 — Shader uniform block

```json
{
  "rigId": "npc_programmer_antiquarian",
  "shaderProgram": "PhaseBlendedPortraitWithGoggles",
  "uniforms": {
    "antiquarianEmergenceProgress": 0.0,
    "phase1Bundle": "portraits2d/programmer/",
    "phase2Bundle": "portraits2d/antiquarian/",
    "blendDuration": 2.0,
    "lensEmissiveLeft": 0.7,
    "lensEmissiveRight": 0.7,
    "lensRedTexture": "vfx-atlases/programmer_goggle_lens_red.png",
    "gridPatternIntensity": 1.0,
    "gridPatternTexture": "vfx-atlases/programmer_goggle_grid_pattern.png",
    "gogglesPosition": "down",
    "breathingPhase": "autoLoop:3.2s:amp=1.005"
  },
  "stateTriggers": {
    "flashbackProgrammer": "antiquarianEmergenceProgress=0.0",
    "presentDayAntiquarian": "antiquarianEmergenceProgress=1.0",
    "agingCinematic": "progress ramps 0.0→1.0 over 8s reveal",
    "scopeZoom": "lensEmissiveLeft -= 0.0; lensEmissiveRight = 0.9; one lens tilts forward (mechanical articulation)",
    "recognitionCost": "lensEmissiveLeft = 0.1; lensEmissiveRight = 0.1 for 1 frame (brightness drains)",
    "revealing": "gogglesPosition='lifted_to_brim'; real blue-grey eyes exposed; goggle emissive=0"
  },
  "crossReference": {
    "phase2": "Part 2D Antiquarian — same person aged ~30 years",
    "goggleParallel": "Part 2V/W Engineer also wears red steampunk goggles; relationship between the two characters is a NARRATIVE EASTER EGG to be resolved later"
  }
}
```

#### 2R.8 — Veo 3.1 cinematic pointer

- **CIN-PROG-01:** 12s aging cinematic. Start frame = young Programmer with goggles down on the cyberpunk-Shibuya rooftop (Bundle A). End frame = elderly Antiquarian with white beard at his library lectern (Part 2D Bundle A). Scrubs `antiquarianEmergenceProgress` 0.0 → 1.0 over 12s. Mid-beat at 6s: the goggles LIFT briefly to reveal the young real eyes (matching the Antiquarian's blue-grey), then beard begins growing in, hair greys-but-not-fully (the dark stripes persist), the city behind dissolves into bookshelves. See Part 9 for full beat breakdown.

---

### 2S — THE SEER (REAL CANON — HOODED BLUE-SKINNED ANGEL WITH LIVING STAFF)

> **CANONICAL CORRECTION (2026-04-22):** This section REPLACES an earlier draft describing the Seer as "unbleached linen-cream robes, no wings, plain wooden staff with burnt lower third." That draft was wrong — derived from outdated bibles. Real canon (2026-04-22 user upload): she has massive feathered ANGEL WINGS, cool blue-skinned, long flowing black hair, glowing amber-orange eyes, dark hooded cloak and robes, and carries a LIVING WOODEN MAGICAL STAFF WITH A BLUE CRYSTAL AT THE TOP (NOT a flaming sword — user explicitly corrected this).

Canon anchors: hooded blue-skinned female angel-figure, pale cool-blue skin (#b0c4d4 with porcelain smoothness), long flowing jet-black hair spilling wildly past the shoulders, glowing amber-orange eyes (#f57a1c emissive, same family as Degen's but the Seer's are serene instead of predatory), dark hood pulled up over the crown with hair escaping, flowing dark charcoal-black robes/cloak with subtle black-leather skeletal-decorative belt at the waist (tiny bone-and-metal talisman chains), carrying a tall LIVING WOODEN STAFF with a luminous BLUE CRYSTAL at its top. Two large white-silver feathered wings spread behind her (wingspan wider than her shoulder-line by ~2×), feathers softly glowing at their tips with cool blue edge-light. Serene and slightly sad face — calm despite the wings.

Reference: `apps/client/public/references/npcs/seer/front.png` (from 2026-04-22 upload).

**Critical rigging notes:**
1. The Seer's aliveness tell is "pre-echo" — expressions PRE-RESPOND to player input by 200ms via `precognitionLead` uniform (carried over from the earlier draft — that logic was correct, only the appearance was wrong).
2. The staff is LIVING — wood visibly grows/creeps microscopically at runtime, with the top crystal pulsing on a slow 6s cycle.
3. The wings are a SEPARATE motion channel from breath — they breathe independently at a slower 5.4s period (offset from chest), with feather-ruffle micro-motion on 7 feather-groups.

#### 2S.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a hooded blue-skinned female angel-figure. Skin: cool pale blue (#b0c4d4 base with slightly deeper shadow pooling at the cheekbones, jaw, and neck hollow — unmistakably NOT human, but close enough to be legible as a woman). Ethereally beautiful features — high cheekbones, defined jawline, full dark lips (#5a3545), ethereal serene-slightly-sad expression. Eyes: amber-orange emissive (#f57a1c core with a hotter inner white-orange blaze), narrow focused gaze DIRECT at camera, piercing from the shadow of the hood. Dark eyebrows (#1a1818) arched slightly severe. Long jet-black hair (#0a0808) cascading in wild flowing locks — visible spilling out from the hood over both shoulders, some strands streaming to the subject's left as if caught in a subtle ethereal breeze, individual strands separating with specular highlights. Wearing a deep charcoal-black hood pulled fully UP over the crown of her head (#1a1a1d, soft woven fabric, slightly ragged inner hem visible). Dark charcoal-black robes (#151519) beneath the hood, flowing at the shoulders, the fabric slightly textured. Subtle dark leather skeletal-decorative belt/chains at the waist (render as thin dark leather straps with small pewter-metal skull talismans and bone-shaped beads hanging — gothic-priestess-adjacent, NOT overtly ornamental). Holding in her RIGHT hand (viewer's LEFT), held vertically in the foreground at frame-right edge: a TALL LIVING WOODEN STAFF — the shaft is naturally grown dark wood (#3a2618, living-bark texture with subtle visible veins, small knobs and small green moss-tips at joints), slightly curved near the top, with organic roots spiraling around the grip section. At the TOP of the staff: a luminous BLUE CRYSTAL (#4a8ad6 emissive core with a hotter cyan-white center, ~6cm diameter, irregular natural polygon faceting, pulsing softly, embedded in the wood as if grown into it). No flames, no burnt section. **Behind her, spread symmetrically: two large white-silver feathered ANGEL WINGS** (#f0f4f8 base feather color with cool-blue #a8c8e0 edge-glow along each feather's outer margin), wingspan extending well beyond her shoulders, individual feather-layers clearly readable, softly backlit from a cool blue source behind her — the wings appear partially luminous, as if the feathers themselves emit gentle light. Backdrop: atmospheric cool cyan-white void with faint mist; a soft radial backlight halo behind the wings gives them their glow. No environment, no columns, no academic atrium. Film grain. 4K. No rendered text.

#### 2S.2 — Bundle B: Breathing loop (8 frames) + independent wing cycle

> Slow chest breathing cycle — 4.8s full cycle, amplitude 1.000 to 1.006 (she breathes the way the ocean breathes). Chest rise subtle. Hair drift ±1.5px on slow sine wave independent of breath.
> **Additional 7-frame independent WING cycle at 5.4s period** (deliver as separate `breathing/wings_01..07.png`): wings rise slowly 2-3% and settle, individual feather-groups ruffle at different offsets so the full wing doesn't pump uniformly. Runtime composites wings + chest as two separate layers with offset phase.
> **Additional 6-frame STAFF-LIFE cycle at 6.0s period** (`breathing/staff_01..06.png`): the blue crystal at the staff-top pulses intensity 0.8 → 1.2 → 0.8, and microscopic curling tendrils at the wood's moss-tips drift ±0.5px. Runtime composites as third layer.
> Total: 8 chest + 7 wing + 6 staff = 21 frames distributed across three loops.

#### 2S.3 — Bundle C: Blink triptych

Standard 3 frames (open/half/closed). Amber-orange eye-emissive does NOT extinguish on closed — 30% glow visible through the eyelid, same backlit-skull effect as the Degen. On OPEN, a faint shimmer overlay on the eye-whites (she is seeing beyond the camera's plane).

#### 2S.4 — Bundle D: Viseme grid

Standard 15-panel at 85% baseline openness — she speaks softly, as if each word has already been said. Dark lips read with good contrast against the blue skin. Visemes preserve eye-glow across all 15 panels.

#### 2S.5 — Bundle E: Expressions (5)

> 1. SPEAKING — mouth barely opens, eyes continue pre-echo off-focus gaze (gaze offset 8px from the camera plane — looking where the viewer is ABOUT to be).
> 2. CONCERNED — she looks at you DIRECTLY for the first time in the rig (rare — her default is pre-echo). Brows knit in present-moment worry. Wings LOWER subtly — the feathers on the outer primaries droop 2° — concern is physical.
> 3. EMOTIONAL1 (resignation) — head tilts 3°, hair cascades forward across one shoulder, eyes soft-sad direct. She has seen this ending and is at peace.
> 4. EMOTIONAL2 (futures-glimpse) — the blue crystal at the staff-top BLAZES to 2.0× intensity for one frame; in the same frame the wings tense and rise slightly; eyes narrow in concentration. The crystal is a pre-cognition amplifier. Reserved for moments when she glimpses multiple futures at once.
> 5. REVEALING — she raises the staff vertical, crystal alights 2.5× intensity, gaze pulls fully to camera (precognitionLead → 0), wings spread maximum. She has decided to tell you what she has seen. Both hands now on the staff.
> 4K. No rendered text.

#### 2S.6 — Bundle F: Staff-crystal + wing-edge emissive overlays

> **Output:** `apps/client/public/vfx-atlases/seer_{staff_crystal,wing_edge_glow,wing_feather_groups}.png`.

> - **staff_crystal:** 512×512 transparent. A luminous blue-cyan emissive radial texture sized and shaped to match the staff-top crystal silhouette (irregular natural faceted polygon ~380px wide). Hot white-cyan core (#eaf4ff) fading through cyan (#4a8ad6) to deep blue (#1a3d6e) at the crystal's outer edge, with visible internal fracture-lines glowing more intensely along crystal axes. Used as animated intensity-pulse overlay driven by `staffCrystalIntensity: 0..2.5`.
> - **wing_edge_glow:** 2048×1024 transparent. Pair of soft cool-blue rim-glow textures matching the outer feather edges of both wings, 40% base opacity fading to transparent at the inner edge. Used as additive edge-light overlay on the wings — gives them the "backlit feathered angel" read.
> - **wing_feather_groups:** a reference sheet showing the 7 distinct feather groupings (primaries, secondaries, coverts, etc.) color-coded so runtime can drive each group with independent ruffle animation.

#### 2S.7 — Shader uniform block

```json
{
  "rigId": "npc_seer",
  "shaderProgram": "WingedAngelPrecognitionPortrait",
  "uniforms": {
    "precognitionLead": 200,
    "gazeOffsetFromCamera": 8,
    "staffCrystalIntensity": 1.0,
    "staffCrystalTexture": "vfx-atlases/seer_staff_crystal.png",
    "staffCrystalPulsePeriod": 6.0,
    "wingEdgeGlow": 0.8,
    "wingEdgeGlowTexture": "vfx-atlases/seer_wing_edge_glow.png",
    "wingBreathPeriod": 5.4,
    "eyeAmberEmissive": 1.0,
    "eyeGlowThroughLids": 0.3,
    "breathingPeriod": 4.8,
    "breathingPhase": "autoLoop:4.8s:amp=1.006"
  },
  "stateTriggers": {
    "directContact": "gazeOffsetFromCamera=0",
    "futuresGlimpse": "staffCrystalIntensity=2.0 for 1 frame; wings tense; eyes narrow",
    "revealing": "staffCrystalIntensity=2.5; precognitionLead=0; wings max spread"
  }
}
```

---

### 2T — THE WARLORD (CANON CONFIRMED — YELLOW ARMOR, FACE UNDER HELM = BLONDE PUNK)

> **CANONICAL CORRECTION + CONFIRMATION (2026-04-22, two-pass):** Earlier draft described "brass-and-composite dusky-chrome" armor — that was wrong. Real canon (user direction): **The Warlord's armor is YELLOW**, hazard-saffron palette that rhymes thematically with Agent Zero's saffron tactical hood (Part 2A) — same color family, deliberate visual echo across both characters. Second-pass user clarification: **The Warlord IS the same character throughout** — her face is hidden under the armored helm for ALL of Act 1 (and most of the game). Image #4 (2026-04-22 upload) shows what she looks like UNDER the armor — blonde, tattooed, beautiful punk-woman — but this image is **BANKED FOR THE SWARM-REVEAL CINEMATIC**, not for the standard character-sheet render. By default she is fully armored and faceless.

Reference: `apps/client/public/references/npcs/warlord/{front_armored.png, host_face_under_helm.png}`. The first is the default character-sheet render (helm down). The second is the host-face reference for the eventual reveal beat.

**Critical rigging note:** The Warlord has NO face visible (default render), NO viseme, NO blink. All lip-sync data routes to the visor's shimmer intensity (same pattern as The Architect's maskVibration). Breathing is minimal (the armor is rigid; the body inside is half-swarm). The shimmer is her sole tell. The helm-removed-face render is RESERVED for one specific cinematic beat (the swarm reveal) and never appears in the standard sheet.

**Lore note (yellow callback):** The yellow armor matches Agent Zero's saffron tactical uniform (Part 2A) — same color family. Whether this is coincidence, an in-fiction faction-color, the swarm mimicking other yellow-coded operators, or a deliberate Hierarchy taunt is left ambiguous in Act 1. Players who notice the color resonance are doing the work the writers want them to do.

#### 2T.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a fully armored figure, standing still at mid-distance. Armor palette: **primary YELLOW** — a weathered industrial hazard-saffron (#d4a04a to #c4862e gradient across the plates, NOT bright school-bus yellow; think "ceremonial hazard-yellow with combat wear"), with darker gunmetal-black (#2a2d32) at the articulated joint seams, collar line, gauntlet wrist-cuffs, and underside plates. Secondary accent: polished brass (#b8752d) at the joint-rivets and the visor rim. The yellow dominates upper-body plates and pauldrons; darker gunmetal fills the shadow zones between the yellow sections — the armor reads YELLOW-FIRST at silhouette distance. Subtle weathering: chips, dents, carbon-scoring streaks across the yellow plates (she has fought in this armor).
>
> Articulated segmented cuirass — **designed to DISGUISE but not fully erase the female silhouette:** the chest plate has moderate upper-torso volume without sculpting to breasts; pauldrons are OVERSIZED squared-off (exaggerate shoulder width by ~20%, making the upper silhouette read broader than her actual shoulders); the waist cuirass is STRAIGHT-CUT rather than tapered (no waist cinch — the armor visually widens the waistline to neutralize hip-shoulder taper); the lower torso plates flare slightly at the hip but not in a feminine-tapered way, more in a tactical-utility way. Gauntlets on both arms are heavy and squared, adding apparent forearm bulk. On close inspection: her actual female proportions are readable in the NECK and JAWLINE silhouette curve (slightly narrower than a typical male combat chassis), and in the visible BACK OF THE HAND where a slimmer wrist emerges from the gauntlet cuff. First-pass read: "this is a soldier, probably male." Second-pass read: "wait, she's a woman." Intentional ambiguity.
>
> NO Empire insignia, NO faction marks — deliberately unornamented field armor, the armor of a professional arriving to complete a transaction. The helm is full-face: a sculpted brass-rimmed visor (#b8752d brass rim, black interior #0a0a0a matte), continuous horizontal scanning slit across eye level (~8cm wide, 1.5cm tall), face completely hidden. Along the visor's lower inner edge (inside the scanning slit): a faint iridescent shimmer barely visible — almost a heat-haze, the sole visible indicator of the Vex-swarm infesting the body inside. Subtle rainbow-pale chromatic shimmer, NOT flashy — a viewer who doesn't know to look reads it as spotlight refraction on the visor metal.
>
> One gauntleted hand visible at lower frame edge resting on the hilt of a broad short-bladed weapon at the hip (not drawn). Her stance: still, not aggressive — feet squared, shoulders level, weight evenly distributed. Backdrop: defocused Nexon breach battlefield — smoke columns, torn banner at screen-right edge, distant ember-orange city fires, faint cold cyan from emergency flares. Lighting: amber spotlight on pauldron and upper visor from camera-right (the yellow armor reads BRIGHT under this warm key); ember-orange rim from back (city glow), faint cold cyan rim from back-left (flares). Visor scanning slit reflects the ember glow. Film grain. 4K. No rendered text.

#### 2T.2 — Bundle B: Breathing loop (8 frames)

> Minimal chest motion (1.000 to 1.002 peak — the armor is rigid, and the body inside is half-swarm). Shimmer inside the visor slit SLIGHTLY modulates across the 8 frames — intensity cycles 0.25 → 0.35 → 0.25 (subliminal). This is the swarm "breathing." Armor plates UNCHANGED. Weapon hand UNCHANGED. The yellow stays static — only the visor-shimmer animates.

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
    "armorPrimaryColor": "#d4a04a",
    "armorShadowColor": "#2a2d32",
    "armorAccentBrass": "#b8752d",
    "armorWeathering": 0.6,
    "silhouetteDisguiseLevel": 0.75,
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
  },
  "loreNotes": "Yellow armor mirrors Agent Zero's saffron palette (Part 2A) — same color family. The reading is left ambiguous in Act 1: faction signal, swarm mimicry, or deliberate taunt. Writers will resolve later."
}
```

#### 2T.9 — RESERVED: Host-face-under-helm reference (for swarm-reveal cinematic ONLY)

> **CRITICAL: This asset is BANKED for a specific late-game cinematic beat. It MUST NOT appear in the standard character-sheet render, in the Bundle E expressions, or in any Act 1 dialog frame. The Warlord's face is hidden through ALL of Act 1.**

When the swarm-reveal cinematic plays (TBD beat — likely Act 2 or Act 3), her helm comes off. The face beneath is locked from the user's 2026-04-22 image #4 upload.

**Host-face reference prompt (for that single cinematic beat):**

> Three-quarter portrait of a beautiful young woman, mid-twenties, pale porcelain skin (#e8e0d8) with cool undertones, long platinum-blonde hair (#f0e8d8) flowing loose past her shoulders — wild, slightly unkempt, with strands falling across her face. Striking bright GREEN eyes (#7da868 piercing, narrow focused gaze, the only warm color on her face), dark eyeliner smudged at the lower lid. BLOOD-RED lipstick (#a8141c) on full lips, slightly parted. **Signature face-tattoos on the LEFT side of her face only:** intricate occult-tribal black ink work covering the temple, cheekbone, and corner of the eye — sharp angular line-work, scattered small dots, two small black star-points, and ONE BLOOD-RED ASTERISK MARK (#c41020) at the cheekbone (the swarm-mark — the only spot of red ink, deliberately matching her lipstick color and signaling the corruption beneath). Small black hexagonal earring at the visible ear. She is wearing the YELLOW HOODED CANVAS JACKET that matches her armor palette (#d4a04a, hood pulled UP over the back of her head with strands of blonde hair escaping at the front), open at the chest exposing BLACK CYBERNETIC ARMOR PLATING beneath at the shoulders and collarbone (segmented black plates, visible articulation joints, low-poly tactical-cyberpunk silhouette — these plates are what the helm-down armor's chest-piece is built ONTO). Backdrop: defocused desaturated misty post-apocalyptic urban ruin (cool grey-green ambient, atmospheric haze, no environment specifics). Lighting: cool overcast key from above-right, warm-yellow rim from her hood-fabric reflecting a faint warm glow back onto her jaw. Expression: guarded, sharp-eyed, NOT defeated — the swarm has not won here. Film grain. 4K. No rendered text.

**Cinematic context (when this face is shown):**

The swarm-reveal cinematic is a single ~8-second beat where the Warlord's helm RETRACTS or is REMOVED, exposing this face for the first time. In the same beat:
- Her green eyes briefly show a faint iridescent VEX-SHIMMER bleed at the pupil edge (the swarm visible inside her, NOT controlling but PRESENT)
- The blood-red asterisk tattoo on her cheekbone subtly PULSES once with cold-iridescent under-light (the swarm's brand)
- Her lips part for the first audible spoken line in her own voice (NOT the swarm-mediated visor-routed voice she's used through Act 1)
- Held beat — the player meets the woman who has been the Warlord this whole time

After the reveal, she may or may not put the helm back on (writer's choice). For all subsequent appearances, default render returns to fully-armored helm-down — but the player now KNOWS what's beneath.

**Asset deliverable:** ONE host-face PNG at 1024×1536 for the reveal-cinematic still composite. Plus a 6-second Veo 3.1 helm-retraction clip with start frame (helm down) and end frame (face fully exposed at the pose described above). Add to Part 9 cinematics manifest as `CIN-WARLORD-REVEAL-01`.

---

### 2U — THE WATCHER (CORPORATE FORM)

Canon anchors (2026-04-22 user direction): take the reference image of the pale-skinned man in white monk robes with a black-haired top-knot ponytail, WHITE COVID MASK covering the lower face, and a THIRD EYE symbol marked directly on the forehead — then adapt him into a CORPORATE VERSION. Three-piece business suit replaces monk robes. Still wearing the white Covid mask. Still the third-eye mark.

Reference source: `apps/client/public/references/npcs/watcher/front_monastic.png` (the upload) → CORPORATE adaptation as the canon default at `apps/client/public/references/npcs/watcher/front.png`.

**Critical rigging notes:**
1. The WHITE SURGICAL/COVID MASK physically covers the lower face — visemes read entirely through mask tension. The mask is fabric, not rigid, so it DEFORMS subtly on open vowels (AA, OW pushing the fabric 2-3px forward at the chin plane).
2. The THIRD EYE on the forehead is the signature aliveness tell. It is a small (~2cm) eye-glyph tattoo/scar mark at mid-forehead — but it BLINKS independently from the two normal eyes on an irregular 6-14s cycle, NOT synced to the normal blink. When the third eye blinks, the normal eyes stay open. When the normal eyes blink, the third eye stays open. Subliminal wrongness.
3. The Watcher NEVER LOOKS DIRECTLY at the camera with his normal eyes. Gaze is always offset 4-6° to the side. The THIRD EYE is what meets the camera.

#### 2U.1 — Bundle A: Neutral bust

> Three-quarter bust portrait of a man, mid-thirties, ethereally beautiful East-Asian features, pale porcelain skin with a cool neutral undertone (#e8e4dc). Long jet-black hair (#0a0606) pulled up into a tight high top-knot / samurai bun at the crown of the head, the bun secured cleanly with a few stray hair strands falling loose past his jawline and down his shoulders. Dark slender eyebrows arched subtly. Eyes: clear cool-grey (#6a7278), direct but offset — the gaze pulls 5° to the viewer's left (i.e., the subject's right), NEVER meeting the camera directly. Long dark eyelashes. Bridge of the nose visible above the mask. Forehead CENTER, between the brows and slightly above, bears a small (~2cm) THIRD-EYE glyph marking: a simple ink-drawn almond-shaped eye with a dark-grey iris and a single small circular pupil, drawn cleanly in dark ink (#1a1a1d) on the pale skin — reads as tattoo or ritual scar. The third eye is OPEN, iris gently luminous with a soft cyan inner glow (#7ac4d4 subtle emissive), PUPIL LOCKED DIRECTLY ON THE CAMERA (the third eye IS the eye contact the normal eyes refuse). Lower face COVERED by a clean WHITE SURGICAL/COVID MASK (#f8f8f4, crisp fabric, clearly a modern medical-style mask), fitted with small thin elastic ear-loops visible at the cheeks (#e6e4e0, tucked behind the ears, faintly visible), mask tied clean across the bridge of the nose with a subtle nose-wire indent visible. Mask fabric drapes clean over chin and extends to just below the jawline — no beard visible through or around it. Wearing a CORPORATE THREE-PIECE BUSINESS SUIT — specifically: a deep charcoal-grey (#2a2d32) three-piece suit, crisp flat lapels, with a matching waistcoat underneath visible above the jacket's front closure; crisp white dress shirt (#f0ede8) buttoned to the collar with a thin dark-charcoal tie (#1a1d22) knotted tight; a small silver lapel pin (abstract geometric — a tiny eye-within-triangle motif in brushed silver, very subtle). Shoulders of the suit structured and sharp. Hair falls cleanly down the back/side despite the suit's formal context. Backdrop: defocused minimalist neutral-grey corporate lobby or gallery wall (#b4b8bc), soft diffuse even lighting from multiple directions (soft box simulation — he is lit for a corporate headshot), faint vertical strip of warmer light on one side suggesting a modern interior window. Lighting: clean, corporate, no drama. Film grain subtle. 4K. No rendered text.

#### 2U.2 — Bundle B: Breathing loop (8 frames)

> Standard chest cycle (1.000 to 1.004 peak — contained, controlled). Suit shoulders UNCHANGED (well-tailored). The WHITE MASK flexes subtly with breath: on inhale the mask expands 1-2px outward at the cheeks and chin plane; on exhale the mask pulls slightly back and a barely-perceptible 3px-wide zone of condensation-haze appears briefly at the mask's mouth-plane center (warm breath through fabric — use a very faint warm-white translucent overlay) then fades. 8 PNGs.

#### 2U.3 — Bundle C: Blink triptych + THIRD-EYE BLINK variants

> Standard 3 frames for normal eyes (open / half / closed). PLUS 3 additional frames for THIRD-EYE independent blink: third_eye_open / third_eye_half / third_eye_closed. During runtime, the normal-eye blink channel and the third-eye blink channel fire INDEPENDENTLY on offset cycles. Normal eyes blink every 4-9s (standard); third eye blinks every 6-14s (less frequent, irregular). They NEVER synchronize. When the third eye blinks, the cyan glow extinguishes for 140ms and the eye visually closes — the lower eyelid line of the tattoo becomes temporarily the only visible line. 6 PNGs total.

#### 2U.4 — Bundle D: Viseme grid — ROUTED TO MASK DEFORMATION

> Skip traditional mouth-plate visemes. Instead, deliver 15 reference frames showing the white mask DEFORMING per phoneme, with the mask fabric being the only mouth-shape indicator. Viseme mechanics:
> - SIL: mask flat neutral
> - Open vowels (AA, AO, OW): mask pushes forward 3-5px at the chin plane, creating a visible outward-protruding curve in the fabric
> - Closed consonants (B_M_P): mask unchanged (lips pressed BEHIND mask)
> - Fricatives (F_V, CH_SH): mask pulls INWARD slightly at the upper-lip position, creating a small inward dimple
> - Tongue visemes (D_S_T, L): minimal mask deformation; rely on surrounding expression
> The 15 panels reference the mask-deformation pose; runtime drives via a `maskFabricDeformation: 0..1` uniform that triggers subtle mesh-push on the mask geometry at the chin plane. Eye region UNCHANGED across all 15. 4K.

#### 2U.5 — Bundle E: Expressions (5)

> 1. SPEAKING — normal eyes continue 5° offset gaze; third eye LOCKS on camera; mask deforms per viseme.
> 2. CONCERNED — third eye's cyan glow DIMS to 0.3×; normal eyes pull further offset (7-8°); mask unchanged.
> 3. EMOTIONAL1 (watching-intently) — third eye's cyan glow BRIGHTENS to 1.4×; normal eyes close HALF (he closes his normal eyes to see with the third); mask unchanged.
> 4. EMOTIONAL2 (watcher-seen-seeing-you) — rare; the NORMAL EYES pull to camera for ONE FRAME, direct and cold; third eye closes tight on same frame. Inversion: the normal eyes have been watching all along. Reserved for specific reveal beats.
> 5. REVEALING — the mask is lowered 40% (pulled down by an offscreen hand to expose the mouth for a single line); lower face visible: thin pale lips forming a single sentence; third eye blazes to 1.8× intensity; normal eyes close fully as if praying. Reserved for the single line where the Watcher must speak with his whole face. After the line, the mask returns.
> 4K. No rendered text.

#### 2U.6 — Bundle F: Third-eye emissive + mask-breath condensation overlays

> **Output:** `apps/client/public/vfx-atlases/watcher_{third_eye_glow,mask_condensation}.png`.

> - **third_eye_glow:** 256×256 transparent. Soft cyan emissive texture masked to the third-eye iris shape — hot white-cyan core (#d8f0f4) fading to cyan (#7ac4d4) to transparent. Intensity driven by `thirdEyeIntensity: 0..1.8`.
> - **mask_condensation:** 512×256 transparent. Faint warm-white translucent gaussian patch for the breath-through-mask effect. Spawns briefly on exhale frames (frames 5-6 of breathing loop). Low opacity, quick fade.

#### 2U.7 — Shader uniform block

```json
{
  "rigId": "npc_watcher",
  "shaderProgram": "MaskedTripleEyePortrait",
  "uniforms": {
    "normalEyeGazeOffset": 5,
    "thirdEyeGazeLocked": true,
    "thirdEyeIntensity": 0.8,
    "thirdEyeTexture": "vfx-atlases/watcher_third_eye_glow.png",
    "thirdEyeBlinkCycle": "random:6s-14s",
    "maskFabricDeformation": 0.0,
    "maskCondensationIntensity": 0.0,
    "visemeChannel": "routeToMaskDeformation",
    "breathingPhase": "autoLoop:3.2s:amp=1.004"
  },
  "stateTriggers": {
    "watchingIntently": "thirdEyeIntensity=1.4; normal eyes half-closed",
    "watcherInverted": "normalEyeGazeOffset=0 for 1 frame; thirdEyeIntensity=0 same frame",
    "revealing": "mask lowered 40%; thirdEyeIntensity=1.8; normal eyes fully closed"
  }
}
```

---

### 2V/2W — THE ENGINEER / THE PRINCE (SINGLE CHARACTER, TWO-PHASE RIG)

> **CANONICAL NOTE (2026-04-22):** User confirmed these are ONE CHARACTER, NOT TWO. "The Prince IS the Engineer. He was the Prince of Celebration before assuming the title of Engineer." Implement as a two-phase rig blended via `princeToEngineerProgress: 0..1` uniform (same structural pattern as Kael's 3-phase rig and the Programmer → Antiquarian blend).

- **Phase 1 (progress=0.0) — THE PRINCE OF CELEBRATION.** The character's earlier identity. Ceremonial royal-of-Celebration attire. Canon not yet uploaded — reference `docs/art-originals/celebration/mascoteers/mascoteer_prince_original.png` exists in the repo as a candidate source, subject to user confirmation.
- **Phase 2 (progress=1.0) — THE ENGINEER (Memoir form).** Default render for present-day. Canon locked from the 2026-04-22 upload: Black man, short dreadlocks, dark beard, RED STEAMPUNK GOGGLES over the eyes (red lens emissive — eyes concealed behind them when down, goggles lift to forehead for "listening" mode), RED MILITARY-CUT WOOL COAT with brass buttons, white shirt beneath, utility belt stacked with brass gauges and chronometers, heroic upward tilt pose. Starfield + burning cityscape backdrop canon.

Reference: `apps/client/public/references/npcs/engineer_prince/phase1_prince.png` (Prince — TBD) + `apps/client/public/references/npcs/engineer_prince/phase2_engineer.png` (Engineer — from 2026-04-22 upload).

**Critical rigging notes:**
1. Single mesh/face/body across both phases — costume, prop, and color-shader driven. Same man, different title.
2. Engineer-phase goggles are a two-state prop: GOGGLES DOWN (red lens covers eyes, `memoirActive=1`) or GOGGLES UP (pushed onto forehead, eyes visible, `memoirActive=0`). The player learns that goggles-down = he is narrating the past; goggles-up = he is present with you.
3. Brass gauges on the belt tick independently on a 1.7s clock cycle — his "heartbeat" tell regardless of phase.

#### 2V/W.1 — Bundle A (Phase 2 ENGINEER — default)

> Three-quarter bust portrait of a Black man in his late thirties, healthy dark brown skin (#4a2818), short well-kept dreadlocks (#1a1008) falling neatly past his jaw. Dark short-trimmed beard, neat mustache. Proud heroic upward chin-tilt (the camera is slightly BELOW his sightline — low-angle hero composition). RED STEAMPUNK GOGGLES covering his eyes: two large circular brass-rimmed lenses (#b8752d brass frames, ~5cm lens diameter each), interior glowing a deep blood-RED (#c41020 emissive, hot inner core — the eyes are completely concealed behind them by default), thick dark leather strap running around the back of the head visible at the temples. Wearing a RICH RED WOOL MILITARY-CUT COAT (#a81e1e rich wool, slightly weathered but cared-for) — double-breasted with two vertical rows of large brass buttons (#c4a040), high pop-collar turned up, fitted through the shoulders with structured epaulettes, a small brass medal/pin on the left chest (geometric abstract, no legible symbol). Beneath the coat: a crisp off-white shirt (#e8e0d0, slightly rumpled) with a dark muted-indigo neck-cloth loosely tied at the throat. Around the waist (visible at lower frame edge if the bust framing extends): a heavy UTILITY BELT in dark brown leather with multiple brass gauges, pocket watches, chronometers and small dials mounted to it (small brass instruments, cluttered with purpose). Backdrop: deep starfield (dark cosmic blue-black #060a1a with scattered small warm stars and distant nebula gas-clouds in violet-magenta), with a BURNING CITYSCAPE silhouetted in the lower third-right — distant spires, ember-orange fire-glow tinting the bottom third of the frame, smoke billowing upward. The two light sources implied: cool starlight from above-right, warm city-fire glow from below-left. Key light: warm amber-red from below-left (city fires) washing his lower jaw and red coat. Rim light: cool cyan-white from above (starlight) on the top of his dreadlocks and shoulder-line. Heroic determined expression, mouth closed neutral-firm. Film grain. 4K. No rendered text.

#### 2V/W.2 — Bundle A-alt (Phase 2 ENGINEER — goggles up variant)

> Same subject, same lighting, same backdrop, same costume — EXCEPT the red steampunk goggles are pushed UP onto the forehead (lenses now hovering above his eyebrows, straps still around his head). EYES NOW VISIBLE: dark warm brown (#3a1a0c), direct attentive gaze, slight crinkle at the outer corners (laugh-lines earned). Mouth still closed neutral. This alt-frame gets used when he is LISTENING in the present, rather than narrating. 1 PNG additional.

#### 2V/W.3 — Bundle A (Phase 1 PRINCE — CANDIDATE-LOCKED)

> **PROVISIONAL CANON LOCK (2026-04-23):** Adopted `docs/art-originals/celebration/mascoteers/mascoteer_prince_original.png` as the canonical Phase 1 reference, per user direction to close §10.4 open questions. Reference image is in-repo and tested; treat as canon for commission unless user uploads an explicit override to `apps/client/public/references/npcs/engineer_prince/phase1_prince/front.png` (the placeholder REFERENCE.md in that directory documents the override path).
>
> Bundle A neutral-bust prompt:
> Three-quarter bust portrait of the SAME man as Phase 2 Engineer (Black, well-kept dreadlocks, trimmed beard) but ~5-10 years younger. Read the canonical reference at `docs/art-originals/celebration/mascoteers/mascoteer_prince_original.png` for face structure and ceremonial attire details. Wearing CELEBRATION royal ceremonial attire: pastel warm-cream and honey-gold (#e6d8a8, #d9a66a) structured ceremonial vest or robe with small warm accents — no steampunk elements, no goggles, no red military coat. Clean ornament work at collar and cuffs. Youthful regal bearing, innocent of what's coming (Phase 2 = the same man after Celebration falls). Backdrop: warm honey-gold Celebration parade light, defocused crowd bokeh with colorful pennants. Same face-mesh as Phase 2 — eye color, dark eyebrows, jaw structure all carry through. Film grain. 4K. No rendered text.

#### 2V/W.4 — Bundle B: Breathing loop (8 frames, Phase 2 default)

> Standard chest cycle (1.000 to 1.006 peak). Red coat structured — shoulders UNCHANGED. Dreadlocks drift ±0.6px. Brass utility-belt instruments: each gauge animates on its OWN 1.7s clock cycle — the second-hand of the largest visible chronometer advances 1px per frame. Small brass dials rotate micro-increments. This is his "heartbeat" tell. Red goggle lenses pulse SUBTLY — 0.9 to 1.1 intensity range on a 2.4s cycle, independent of breath (the memoir is actively recording). 8 PNGs.

#### 2V/W.5 — Bundle C: Blink triptych (Phase 2 default)

> Goggles DOWN: no visible eyelid blink (eyes concealed). Instead, the red goggle emissive INTENSIFIES briefly every ~5-9s (a "memoir write" pulse to 1.4× intensity for 140ms then return to baseline). Deliver as 3 frames showing the three intensity stops (baseline / pulse / recovery). Goggles UP (alt variant): standard 3-frame eyelid blink on the visible eyes. 6 PNGs total.

#### 2V/W.6 — Bundle D: Viseme grid (15 panels)

> Standard 15-panel mouth crop. Beard is short enough to not require a beard-part strategy. Lip tone medium neutral. 4K.

#### 2V/W.7 — Bundle E: Expressions (5, Phase 2)

> 1. SPEAKING — goggles DOWN (narrating memoir mode); mouth delivers lines; goggle intensity pulses at each phoneme emphasis.
> 2. CONCERNED — brows barely visible below the goggle line; a single visible furrow; goggles dim to 0.5×.
> 3. EMOTIONAL1 (heroic-resolve) — chin lifts further, chest forward, goggle intensity steady at 1.2×. His default.
> 4. EMOTIONAL2 (grief-beneath-armor) — goggles LIFT partway (to mid-forehead — halfway between up and down); one visible eye catches moisture in the inner corner; mouth tight.
> 5. REVEALING — goggles FULLY UP onto forehead; eyes direct at camera for the first time; his gaze is tired but clear. Mouth parts pre-line. The Engineer has chosen to speak without the memoir's distance.

#### 2V/W.8 — Bundle F: Goggle emissive + belt-instrument overlays

> **Output:** `apps/client/public/vfx-atlases/engineer_{goggle_lens,belt_instruments}.png`.
> - **goggle_lens:** 512×256 transparent. Two circular red emissive radial textures matching the goggle lens positions, hot red (#ff4030) core to deep red (#8a1010) edge. Driven by `memoirActive: 0..1.4`.
> - **belt_instruments:** 1024×256 transparent. Reference sheet showing each of the ~6 brass belt-mounted instruments (gauges, pocket watches, chronometers) as individually masked/ticking elements. Runtime drives each on its own independent clock cycle.

#### 2V/W.9 — Shader uniform block

```json
{
  "rigId": "npc_engineer_prince",
  "shaderProgram": "PhaseBlendedHeroPortrait",
  "uniforms": {
    "princeToEngineerProgress": 1.0,
    "phase1Bundle": "portraits2d/prince/",
    "phase2Bundle": "portraits2d/engineer/",
    "memoirActive": 1.0,
    "gogglesPosition": "down",
    "beltInstrumentsClock": "autoTick:1.7s",
    "gogglePulsePeriod": 2.4,
    "breathingPhase": "autoLoop:3.2s:amp=1.006"
  },
  "stateTriggers": {
    "flashbackPrince": "princeToEngineerProgress=0.0",
    "presentDayEngineerMemoirMode": "princeToEngineerProgress=1.0; gogglesPosition=down; memoirActive=1.0",
    "presentDayEngineerListening": "princeToEngineerProgress=1.0; gogglesPosition=up; memoirActive=0.0",
    "revealing": "gogglesPosition=up; memoirActive=0; eye contact direct"
  }
}
```

#### 2V/W.10 — Veo 3.1 cinematic pointer

- **CIN-PRINCE-01:** 12s transformation from Prince → Engineer (mirrors Kael's transformation cinematic but simpler — 2 phases not 3). Start frame = young Prince in Celebration pageantry. End frame = Engineer at the burning-cityscape starfield with goggles down. Scrubs `princeToEngineerProgress` 0.0 → 1.0 over 12s with a mid-beat at 6s showing the transition (Celebration falls; he takes up the Engineer's mantle). See Part 9 for full spec.

---

## PART 3 — INVENTOR'S SUITS 3D RE-COMMISSION

### 3.0 — Pipeline overview

The Inventor's Suits system ships today as 1,080 2D PNG slots (18 sets × 6 rarities × 10 slots, per `apps/shared/suitArtPrompts.ts:SUIT_SET_ROSTER`). For the living character sheet, each piece needs a rigged GLB with PBR textures that attaches to the player base-mesh sockets (Part 1C.6). Two-track pipeline:

1. **Image-to-3D conversion** — take the existing 2D PNG (or re-commissioned version) through Meshy v5 / Tripo3D with the prompts below.
2. **Substance 3D re-bake** — bake PBR texture set on the converted mesh (albedo/normal/roughness/metallic/emissive), re-using the original 2D color as albedo source where quality allows.

### 3.1 — 18 suit sets (canonical roster from `SUIT_SET_ROSTER`)

| # | Set ID | Name | Narrative archetype | Primary material | Signature VFX |
|---|---|---|---|---|---|
| 1 | `regalia-of-the-seeing-stylus` | Regalia of the Seeing Stylus | Oracle / scribe | Rich silk and ink-dark velvet | Floating stylus sigil trails |
| 2 | `pressure-loom-harness` | Pressure-Loom Harness | Industrial engineer | Oiled canvas + brass gauges | Steam puffs at exhaust valves |
| 3 | `black-crepe-weave` | Black-Crepe Weave | Mourner / shadow operative | Matte black crepe fabric | Subtle fabric-drift smoke trails |
| 4 | `bulwark-of-the-eighth-column` | Bulwark of the Eighth Column | Heavy defender | Brass-bound ceramic plate | Structural glyph emissive on impact zones |
| 5 | `low-profile-tailoring` | Low-Profile Tailoring | Infiltrator / spy | Dark fitted wool + leather | Near-invisible at rest; shimmer on motion |
| 6 | `arcane-rune-regalia` | Arcane-Rune Regalia | Mystic | Runed midnight-blue cloth | Pulsing rune emissive along seams |
| 7 | `clockwork-exoframe` | Clockwork Exoframe | Engineer / tinker | Exposed brass gears + leather | Visible turning cogs on joints |
| 8 | `hybrid-vein-panoply` | Hybrid-Vein Panoply | Bio-tech hybrid | Bioluminescent vein-traced armor | Subdermal pulse flows |
| 9 | `geomancers-stratum` | Geomancer's Stratum | Earth-element mystic | Stratified stone-layer plate | Dust sheds from joints on motion |
| 10 | `ember-bellows-array` | Ember-Bellows Array | Fire-element engineer | Soot-blackened metal + heat vents | Ember embers flare at vents |
| 11 | `tide-engine-carapace` | Tide-Engine Carapace | Water-element heavy | Tarnished verdigris brass | Subtle water-sheen ripple on plates |
| 12 | `aetheric-dirigible-rig` | Aetheric Dirigible Rig | Air-element scout | Oilcloth + balloon-silk + brass | Faint lift-vapor trail |
| 13 | `void-sextant-ensemble` | Void-Sextant Ensemble | Cosmic navigator | Deep-void velvet + silver-inlay | Starfield emissive on chest panel |
| 14 | `chronometer-livery` | Chronometer Livery | Time-bound courier | Brass-buttoned long-coat | Clock-hand emissive on wrist |
| 15 | `dicewrights-motley` | Dicewright's Motley | Casino operative | Jester-harlequin gold/violet | Rolling-die glyph trails |
| 16 | `null-weaver-mantle` | Null-Weaver Mantle | Anomaly tier | Shadow-fabric (anti-light) | Inverse-light edge; reality-tear shimmer |
| 17 | `the-mourners-coat` | The Mourner's Coat | Necromantic | Graveyard-black wool + white trim | Petal-drift shed on motion |
| 18 | `the-first-chassis` | The First Chassis | Ne-Yon progenitor | Ancient weathered chrome | Cyan core glow; rune-etched plates |

### 3.2 — Per-set 3D conversion prompt template (runs once per set × rarity × slot = 1080 passes)

**Image-to-3D conversion prompt (paste with each 2D slot PNG into Meshy v5):**

> Convert this 2D garment/prop concept art into a rigged 3D mesh suitable for attaching to a Mixamo-compatible humanoid skeleton at the `{SLOT}` socket. Preserve the silhouette exactly as drawn. Preserve the material palette exactly. Generate with PBR separation: base color / metallic / roughness / normal / emissive channels distinct. Output: .glb format, ≤12,000 triangles for standard slots (head / chest / shoulders / arms / legs / feet), ≤25,000 triangles for signature slots (weapon-primary / back). UV layout should match the cross-species UV template at `apps/client/public/rigs/player/UV_TEMPLATE.png`. Preserve emissive details (glow regions, rune work, vent glow) as a separate emissive channel — do NOT bake them into base color. Preserve specularity separation: metallic parts read as metallic; fabric parts read as dielectric. No environmental context — subject-only on transparent background equivalent.

**Substance 3D re-bake directives (per converted GLB):**

> Re-bake PBR maps at 2048² per slot (4096² for chest + weapon-primary). Source the base color from the original 2D concept art using Substance Sampler's photo-to-PBR pipeline. Extract height map for additional displacement detail on heavy fabrics and plate armor. Generate AO map from the mesh's own geometry. For emissive regions (glow seams, rune trails, core panels), hand-author a separate emissive channel keyed to the set's signature VFX description (Table 3.1). Export .ktx2 for WebGPU efficiency.

### 3.3 — Rarity shader presets (6 tiers applied on top of base gear)

Each of the 18 sets ships at 6 rarity tiers. Rarity is primarily a SHADER TREATMENT on the same base GLB — not a new geometry commission. Runtime picks the shader preset from the rarity flag on the piece.

| Rarity | Color treatment | Emissive behavior | Particle VFX | Material quality | Runtime shader preset |
|---|---|---|---|---|---|
| **common** | Faithful to base 2D concept, slight desaturation (−10%) | None | None | Matte PBR, moderate roughness (0.7) | `rarity_common.preset` |
| **uncommon** | Base color unchanged | Faint green edge-glow at seams (~6px, 20% intensity, #7dd87a) | None | Standard PBR (roughness 0.55) | `rarity_uncommon.preset` |
| **rare** | Base color unchanged | Blue edge-glow at seams (40% intensity, #4a8ad6) | Rare light-mote drift (~5 motes/s) | Crisp PBR (roughness 0.45) | `rarity_rare.preset` |
| **epic** | Base color saturation +15%, slight purple tint | Violet seam-glow (70%, #a555d6), internal soft light from within | Purple sparkle emission on motion | High-quality PBR (roughness 0.3) | `rarity_epic.preset` |
| **legendary** | Base color full saturation + warm amber rim | Gold-orange seam-glow (100%, #f5a040) + ambient sparkle | Continuous gold dust trail on motion | Premium PBR + clear-coat | `rarity_legendary.preset` |
| **mythic** | Base color plus iridescent shifting secondary | Full chromatic shifting emissive — rainbow cycle along seams on a 4s loop | Reality-fracture micro-particles (rare) | Hero-quality PBR + iridescent-film shader | `rarity_mythic.preset` |

### 3.4 — Rarity shader texture atlases (shared across all sets)

> **Output:** `apps/client/public/vfx-atlases/rarity/{common,uncommon,rare,epic,legendary,mythic}.png` — each 2048×2048.

Six atlases, each combining the seam-glow color, particle sprite, and ambient-sparkle textures for that tier:

**common:** Empty/minimal — a flat low-opacity dust overlay for wear-and-tear, used as subtractive roughness modulation.

**uncommon:** A 128×512 seam-glow strip (green #7dd87a, soft gaussian) tileable along any mesh edge, plus a small 64px leaf-mote sprite sheet.

**rare:** 128×512 blue seam-glow strip (#4a8ad6), a 64px drifting-mote sprite with streak-trail, and a subtle radial "inner-light" soft texture for garment interiors.

**epic:** 256×512 violet seam-glow strip (#a555d6) with high emissive intensity, 64px sparkle-burst sprite sheet, and a radial interior-light texture that glows brighter in the center of large fabric sections.

**legendary:** 256×512 gold-orange seam-glow strip (#f5a040) with warm bloom falloff, 128px gold-dust-trail sprite sheet with continuous emission pattern, plus a CLEAR-COAT normal detail texture for the premium surface finish.

**mythic:** 512×512 iridescent seam strip cycling through the full visible spectrum (magenta → cyan → yellow → magenta, seamless loop over 4s), 128px reality-fracture sprite (a tiny crack in spacetime — hard-to-describe; think "a very small tear at the edge of possibility"), plus an iridescent-film oil-slick normal texture that reads different colors at different viewing angles.

### 3.5 — Per-set 3D prompt overrides (exceptions requiring special handling)

Most of the 1,080 pieces convert cleanly with the 3.2 generic prompt. Five sets require special attention:

**`null-weaver-mantle` (anomaly tier):** The base 2D art shows "anti-light" fabric — shadows that shouldn't cast. In 3D this requires a CUSTOM SHADER, not standard PBR. Override: after conversion, pass the GLB through a second shader-setup step with material preset `anti_light_anomaly.preset` — which INVERTS lighting contribution (lit surfaces go dark, shadow surfaces go bright). Add `inverseLightingMask: 0..1` uniform. The effect should be SUBTLE — max 30% inversion at rarity common, scaling to 80% at mythic.

**`hybrid-vein-panoply`:** The bio-luminescent veins need to PULSE on a 4.2s cycle (subdermal-flow simulation). After bake, add an emissive animation: the vein pattern brightens 1.0 → 1.4 → 1.0 over 4.2s, continuous. Use `veinPulsePhase` uniform.

**`clockwork-exoframe`:** Exposed brass gears at the shoulders, elbows, and knees must ROTATE at runtime. After conversion, isolate the gear geometry as SEPARATE mesh children of the parent GLB so runtime can animate rotation transforms per-gear. 6 gears total (2 shoulder, 2 elbow, 2 knee) at different rotation rates.

**`the-first-chassis`:** Ancient Ne-Yon progenitor. This set MUST feel older than any other set in the game. Override albedo baking: add intentional weathering (rust patches, micro-scratches, corrosion greening at joints) that goes BEYOND what's in the 2D art. Bake a secondary normal map with pitting and age-wear. Core-glow panel at the chest is non-negotiable — preserve at full intensity.

**`void-sextant-ensemble`:** The chest panel shows an actual starfield as emissive. Do not bake this as static emissive. Instead, preserve the chest panel as a separate mesh region with a STARFIELD PROCEDURAL SHADER (`starfield_emissive.preset`) so the stars subtly drift and twinkle at runtime.

### 3.6 — Asset ID grammar + per-piece output

Total output per piece: one GLB + one 2048² PBR texture bundle (or 4096² for chest/weapon). Asset IDs follow Part 0.2:

```
gear_{setId}_{rarity}_{slot}

Examples:
gear_regalia-of-the-seeing-stylus_common_head
gear_regalia-of-the-seeing-stylus_mythic_weapon-primary
gear_the-first-chassis_legendary_chest
```

1,080 GLBs total (18 × 6 × 10). Can be batched 50 at a time through Meshy v5 API with the 3.2 prompt template, per-set prompt overrides applied as needed. Estimated ~22 batches over 2-3 days.

### 3.7 — Starter gear (outside the 1080 — 4 species × 5 classes × 5 elements × 4 foundations)

Starter loadouts (per `apps/shared/starterLoadout.ts`) produce 4 × 5 × 5 × 4 = **400 combinations**, but only 2 slots (baseMask + baseSuit) drive unique GLB generation. That's **800 starter GLBs** minimum (400 combos × 2 slots), implemented with a parametric base-mesh variant approach:

- Base mask GLB library: per species (4) × per class (5) = **20 base mask meshes**, with element and foundation driving shader presets (not geometry)
- Base suit GLB library: per species (4) × per class (5) = **20 base suit meshes**, with element/foundation driving shader color tints

Total starter-gear GLBs: **40 meshes + parametric shader variant system** — not 800. Massive cost saving over fully enumerated generation.

**Starter mask prompt template:**
> Rigged 3D helm mesh representing the {class} archetype for species {species}. Silhouette matches the starter-mask reference in `apps/shared/starterLoadout.ts`. Base neutral shader ready for runtime re-tinting by element (5 options) and foundation (4 options). ≤10,000 triangles. Attach socket: head. Output .glb.

**Starter suit prompt template:**
> Rigged 3D body-suit mesh representing the {class} archetype for species {species}. Silhouette matches the starter-suit reference. Base neutral shader ready for runtime re-tinting by element (5 options) and foundation (4 options). Respect Ne-Yon species body proportions (+18% stature, broader shoulders) where applicable. ≤18,000 triangles. Attach sockets: chest + arms + legs. Output .glb.

---

## PART 4 — LIONS CLUB CEREMONIAL + SEASONAL GEAR

### 4.0 — Overview

Source systems: `apps/shared/lionsClub.ts` (rental-suit faction), `apps/shared/christmasInJuly.ts` (seasonal event), LCIF donor trophies. Estimated ~170 pieces across the following tracks:

- **Ceremonial set** — 10 pieces, the "signature" Lions Club regalia. Rental-gated via membership; materializes on equip, dissolves on rental expiry.
- **Seasonal event sets** — ~160 pieces across 6 seasons (spring, summer, autumn, winter, Christmas-in-July, Shadow Convergence). Time-window gated via `eventWindow` middleware.
- **LCIF donor trophies** — 3 pieces (Bronze / Silver / Gold), permanent account unlocks, relic-tier shader above mythic.

### 4.1 — Ceremonial set (10 pieces, rental-gated)

Slots match the Inventor's Suits slot roster: head, chest, shoulders, arms, gloves, belt, legs, feet, weapon-primary, back.

**Narrative identity:** White ICL (Iron Clad Lions) parade regalia — the same material family as Kael's Phase 1 armor (Part 2C.1). Lions Club members equip this only during active membership; non-members see the slots as locked gold-laurel silhouette placeholders.

**Base 3D commission prompt:**
> Rigged 3D ceremonial armor piece — {SLOT} — for the Iron Clad Lions' Ceremonial regalia set. Material: white ceramic plate armor (#f0ede8) with polished brass ornamentation (#c4a040) at the joints and edges, faintly engraved ICL sigil work (small, not overt). Silhouette low-poly hero sci-fi (matching Kael Phase 1's armor geometry language). Preserve a chest-plate mounting position for a detachable ICL insignia (separate small mesh child). Output .glb at slot-appropriate triangle budgets (see Part 3.2). Sockets match player mesh.

**Rental-state shaders (on top of the base GLB):**

- **Pre-equip (locked, non-member):** Renders as a gold-laurel silhouette at 40% opacity with "MEMBERSHIP REQUIRED" tooltip on hover. Geometry simplified to silhouette-only mesh. Uniform: `rentalState = "locked"`.
- **Materialization (just equipped):** 0.8s animation where the armor resolves from gold particle swarm into solid form. Similar to The Human's particle-assembly reveal but simpler and faster. Uniform: `rentalState = "materializing"; materializationProgress = 0..1`.
- **Active (membership valid):** Full PBR render, faint warm gold rim-light around the edges (faction ambient). Uniform: `rentalState = "active"`.
- **Grace period (membership expires within 72 hours):** Faint edge desaturation (−15%) with a subtle warning-pulse: the gold rim briefly dims every 6s. Uniform: `rentalState = "grace"; graceTimeRemaining = 0..72h`.
- **Dissolution (just expired):** Reverse of materialization — 1.2s animation where the armor dissolves into gold particle swarm and vanishes. Uniform: `rentalState = "dissolving"; dissolveProgress = 0..1`. After this plays, slot returns to locked state.

> **Output:** `apps/client/public/gear3d/lions-club/ceremonial/{slot}.glb` + `rental_materialization.preset` shader file.

### 4.2 — Seasonal rental sets (six seasons × ~10 slots × 2-3 theme variants)

Each season introduces ONE Ceremonial-derived variant set with the same 10 slots re-skinned to the season's palette and ambient VFX. User-facing "Seasonal tab" in the equip panel gates these behind `eventWindow` — outside the window, displayed with "Returns in {N} days" tooltip.

**Per-season ambient VFX class (defines the season's signature seasonal "feel" when worn):**

| Season | Palette | Ambient VFX class | Triggers |
|---|---|---|---|
| **spring** | Pale sage #b4c7a8, soft cream #e6dcc2, gentle magenta pollen accents | `PollenDrift` — scattered soft magenta pollen particles drift diagonally across the character, more dense near feet/ankles | Active while worn indoors or outdoors during spring window |
| **summer** | Warm coral #e08266, bright saturated cyan #4ba3b5, gold trim | `HeatShimmer` — faint heat-haze distortion around the character's silhouette at 10% intensity | Active while worn |
| **autumn** | Burnt-orange #c74a1a, oxblood #8a1818, deep amber #d4a04a | `FallingLeaves` — ~3 leaf-shaped particles per second drift downward past the character, warm autumn colors | Active while worn |
| **winter** | Pale silver-blue #b0c4d4, deep navy #1a2d5a, snow-white trim | `BreathFrost` — warm-white visible exhale frost appears on every exhale breath, syncs with Track D viseme exhale phonemes | Syncs to VO timeline when speaking |
| **christmasInJuly** | Candy-cane red-and-white stripes, gold, deep forest green | `PeppermintSparkle` — tiny red-and-white candy-cane sparkles emit from the cuffs and collar on motion | Active while worn |
| **shadowConvergence** | Deep violet #3d1a5a, corruption-black, faint magenta seam accents | `VoidTendrils` — thin violet tendrils trace along the character's silhouette, appearing to wrap around them from outside the frame | Active while worn — the most visually aggressive of the seasons |

**Per-season 3D commission prompt template (runs once per slot × season = 60 pieces):**

> Rigged 3D seasonal-variant armor piece — {SLOT} — for the Iron Clad Lions' {SEASON} event collection. Start from the Ceremonial base geometry (4.1). Re-skin to the {SEASON} palette (per Table 4.2). Add season-appropriate silhouette modifications only where narratively justified (e.g., winter adds fur-lining at collar and cuffs; autumn adds wind-blown scarf accent at shoulder). Preserve the attachment sockets exactly. PBR textures should carry season ambient — winter fabric slightly frosted, summer slightly sun-faded, spring with subtle floral embroidery on trim. Output .glb + 2048² PBR bundle.

**Ambient VFX atlases:** One shader preset per season, shared across all 10 slots of that season.

> **Output:** `apps/client/public/vfx-atlases/seasonal/{spring,summer,autumn,winter,christmasJuly,shadowConvergence}_ambient.png` — each 2048×2048.

For each season-ambient atlas, author a tiling texture plus sprite sheet matching the ambient VFX class:

- `spring_ambient.png` — 4×4 grid of pollen mote variants (soft magenta gaussian blurs, 8-24px each)
- `summer_ambient.png` — heat-haze distortion normal map (subtle shimmer offsets)
- `autumn_ambient.png` — 4×4 grid of leaf sprites (varying fall colors, rotated angles)
- `winter_ambient.png` — exhale frost puff sprite sheet (soft warm-white gaussians that fade quickly)
- `christmasJuly_ambient.png` — 4×4 grid of candy-cane sparkle variants (red-white striped 8px sprites)
- `shadowConvergence_ambient.png` — thin violet tendril sprite sheet (animated tendril segments, 32×128px each)

### 4.3 — Event-specific sets (inside seasonal windows)

Beyond the generic seasonal rentals, specific events introduce ONE-OFF pieces. Examples (from `apps/client/src/data/events/`):

- **Shadow Convergence Mantle** — a single chest-slot override available only during the Shadow Convergence event window. 3D commission prompt: "A corrupted Ceremonial chest-plate, the pristine white ceramic now fractured with violet-black veins of void-corruption, violet emissive leaking from the fracture lines — as if the armor has been touched by Shadow Tongue. Preserve the ceremonial silhouette but add the fracture geometry as real displacement." Paired with a Veo 3.1 intro cinematic showing a ceremonial suit being corrupted.
- **Christmas-in-July wheel prizes** — cosmetic accessories spawned from event wheel: santa-hat helm variant, candy-cane weapon skin, reindeer-antler head accessory. Each is a small add-on GLB that attaches to the head socket without replacing the currently-equipped helm. ~8-12 pieces per year.

### 4.4 — LCIF donor trophies (3 pieces, permanent account unlocks, RELIC tier)

These are the top-tier prestige pieces. Gated by real-world LCIF (Lions Clubs International Foundation) donation receipts, unlocked permanently across the account. Displayed in a dedicated Dreamer sidebar vignette, not in the standard equip panel (they're trophies, not gear).

Three tiers: Bronze / Silver / Gold. Each is a single trophy GLB — not a wearable armor piece — displayed on a pedestal in the character-sheet sidebar.

**RELIC shader tier (ABOVE mythic):**

Adds one tier beyond the 6 standard rarities in Part 3.3. Relic treatment:
- **Color:** base material + full iridescent-film interference (similar to mythic) + additional engraving-scroll shader. Fine engraved patterns SCROLL slowly across the metal surface (0.002 texture units/second) revealing commemorative text and LCIF sigils (abstract — not legible text).
- **Emissive:** Multi-layered — primary gold-orange seam glow + secondary soft blue-white inner holographic overlay + tertiary chromatic iridescence on the outermost surface.
- **Particle VFX:** Slow falling gold-dust particles around the trophy at all times, plus a rare "commemoration burst" every ~30s that emits a spiral of gold sparkles.

> **Output:** `apps/client/public/vfx-atlases/rarity/relic.png` — 2048×2048 combining the three emissive layers as separate channels packed into R/G/B.

**Per-tier 3D commission prompts:**

- **BRONZE donor trophy:** "A small bronze Lions Clubs International sculptural trophy, ~15cm tall: a stylized lion head emerging from a rectangular plinth base, polished bronze (#cd7f32) with subtle patina at the recesses. Engraved commemorative inscription on the plinth (render as abstract scroll pattern, no legible text). Simple upright pose, cinematic lighting preserved in the PBR maps. Output .glb + 2048² PBR bundle."

- **SILVER donor trophy:** "Same sculptural silhouette as Bronze but polished silver (#c0c0c0) with subtle tarnish lines, slightly larger (~18cm), more intricate plinth engraving work visible. Output .glb + 2048² PBR."

- **GOLD donor trophy:** "Same silhouette but polished gold (#ffd700) with high-clarity reflections, ~22cm tall, hand-engraved floral scroll work wrapping the plinth, a single tiny inset gem at the lion's forehead (blue sapphire, small emissive). This is the apex prestige tier — commission at the highest material quality. Output .glb + 4096² PBR bundle."

### 4.5 — Rental system integration (server-side, no new art required)

Rental logic already exists in `apps/shared/lionsClub.ts:canEquipRentalPiece` (returns pass/fail + grace-period data). No server-side changes. The 3D gear pipeline only needs to respect the `rentalState` uniform described in 4.1 — pre-equip (locked silhouette), materialization animation, active, grace warning pulse, dissolution animation. All state transitions are purely visual on top of the same GLB.

**State machine JSON (developer hand-off):**

```json
{
  "rentalStateMachine": {
    "states": ["locked", "materializing", "active", "grace", "dissolving"],
    "transitions": {
      "locked → materializing": "onEquip + membership valid",
      "materializing → active": "materializationProgress = 1.0",
      "active → grace": "membership expires within 72h",
      "grace → active": "membership renewed",
      "grace → dissolving": "membership expired",
      "active → dissolving": "un-equipped",
      "dissolving → locked": "dissolveProgress = 1.0"
    },
    "shaders": {
      "locked": "gold_laurel_silhouette.preset",
      "materializing": "rental_materialization.preset + base_gear_material",
      "active": "base_gear_material + lions_rim_glow.preset",
      "grace": "base_gear_material + lions_rim_glow_warning.preset",
      "dissolving": "rental_dissolution.preset + base_gear_material"
    }
  }
}
```

---

## PART 5 — CASINO COSMETIC IDLE LOOPS (KLING)

### 5.0 — Overview

Casino cosmetics are small VFX loops that play in the background of casino UI elements (table backdrops, chip animations, card-face reveals). Unlike character-sheet idle loops (Part 1A.5, 1B.5), these DO NOT contain a character — they are environmental ambient motion. Kling 2.0 is preferred for these because it excels at abstract continuous loops (fluid simulation, particles, light play).

**Critical note after Degen canon correction:** The casino ENVIRONMENT (pit, VIP lounge, slot gallery) stays valid per `docs/production/CASINO_EXPANSION_ART_BIBLE.md`. What changes is any art that DEPICTED THE DEGEN personally — those pieces must be regenerated against Part 2J's blue-skinned warrior canon. This Part 5 is environmental-only and does NOT need to be regenerated for the Degen correction.

### 5.1 — Required loops

> **Output path:** `apps/client/public/videos/casino/{loopId}_idle_loop.mp4` — all at 1:1 or 16:9 as specified, 8-12 seconds, seamless loop.

**Loop 1: CHIP_SPIN** (1:1, 6s seamless)
- Content: a single stack of 5 casino chips (deep violet-black velvet chips with gold edge-stripe) spinning SLOWLY on a dark polished surface. Individual chips rotate at slightly different rates creating a hypnotic parallax. Gentle warm amber glow from below. No crowd, no environment, no character. Film grain. Pure loop ambient.
- **Kling prompt:** "Hyper-realistic close-up of a stack of 5 casino chips — deep violet-black velvet chips with gold edge-stripes — slowly rotating on a dark obsidian polished table. Each chip rotates at a slightly different speed creating a soft parallax. Warm amber glow from below lights the chip edges. Dark bokeh background. Cinematic 4K. Seamless 6-second loop. No text, no chips falling or appearing. Pure meditative rotation."

**Loop 2: CARD_FACE_REVEAL_SHIMMER** (1:1, 4s seamless)
- Content: a single face-down card with a dark violet back gently rocking as if the universe is about to flip it. Card edges catch tiny glints of light. No actual flip occurs in the loop — loop ends with the card still face-down but slightly closer to flipping than at loop start. Subliminal promise.
- **Kling prompt:** "Hyper-realistic single casino card, face-down with a deep violet patterned back, lying on dark obsidian surface. The card gently rocks 2° back and forth, catching gold light along its edges on each rock. 4-second seamless loop. No flip completes. Subtle anamorphic flare. Cinematic 4K. Meditative anticipation."

**Loop 3: TABLE_FELT_WASH** (16:9, 10s seamless)
- Content: a close-up of deep violet table felt texture with slow ambient light washing across it diagonally. Used as background on casino UI panels. Pure texture motion, no character, no objects.
- **Kling prompt:** "Deep violet felt table surface in extreme close-up with slow diagonal light wash drifting across. Gentle amber-to-violet gradient washing from corner to corner over 10 seconds, seamless loop. Very soft, ambient, meditative background texture. No objects, no hands, no UI. Cinematic 4K."

**Loop 4: BREATHING_COMPANION** (1:1, 8s seamless)
- Content: a companion creature/pet in a casino-pit setting, standing idle next to an empty chair. Breathing softly, occasionally blinking. Used as ambient idle on companion-pet UI in casino areas.
- **Kling prompt:** "Hyper-realistic digital casino companion creature — a small domesticated creature with a velvet-textured body and glowing amber eyes — standing idle next to an empty dark-wood high-backed chair. Breathing gently, occasionally blinking. Warm casino ambient light in the background (defocused). 8-second seamless loop. Cinematic 4K."

**Loop 5: ROULETTE_WHEEL_SLOW** (16:9, 12s seamless)
- Content: a roulette wheel spinning in slow motion, ball racing around but never landing. Visible continuous motion. Used as feature header on the main casino landing page.
- **Kling prompt:** "Hyper-realistic top-down view of a luxurious casino roulette wheel spinning slowly — dark obsidian and gold construction — with a single small ivory ball racing in the opposite direction around the outer rim. The ball never lands. Wheel spins continuously. Warm amber light on gold accents. Volumetric casino haze in the background. 12-second seamless loop. Cinematic 4K. Absolute meditative hypnosis."

### 5.2 — Additional supplementary loops (P1)

**Loop 6: VIP_LOUNGE_AMBIENT** (16:9, 15s seamless) — intimate VIP lounge backdrop with softly undulating dark-matter walls (per `CASINO_EXPANSION_ART_BIBLE.md` CF-005). Used as background for VIP-level UI.

**Loop 7: SLOT_MACHINE_REEL_IDLE** (1:1, 4s) — close-up of a slot machine reel at rest, symbols barely visible through the glass, light reflections moving slowly. Used as ambient in slot-machine UI.

**Loop 8: CHIP_CASCADE_NEAR_MISS** (16:9, 3s one-shot, not loop) — a cascade of chips almost tipping over the edge of a stack, then settling. Plays as a "near-win" feedback animation when a bet is within 1 unit of a payout. One-shot play, not looped.

### 5.3 — Casino Degen idle cinematic (regenerated from Part 2J canon)

The existing CIN-013 discovery video (`apps/client/public/videos/entities/entity_99_degen.mp4`) was specced against the WRONG Degen canon. Replace with a new Kling-generated version using the real blue-demon canon:

**DEGEN_IDLE_PIT** (1:1, 10s seamless) — Part 2J character specifically:
- **Kling prompt:** "Hyper-realistic cinematic close-up of the Degen — a tall muscular blue-skinned demonic figure with bald head, pointed ears, glowing amber-orange eyes, red-and-blue swirling tribal tattoos on his arms, wearing a dark olive-drab military-cut sleeveless vest with brass buttons and a heavy silver chain necklace with a brass pocket-watch pendant. He stands behind a casino roulette pit, arms crossed, watching. The pocket-watch pendant at his chest swings gently as he breathes. The red-and-blue tattoo ink subtly pulses in counter-phase to his breathing. His amber eyes never blink. Deep teal-black casino ambient behind him with faint violet neon haze. 10-second seamless loop. Predatory stillness. Cinematic 4K. No text."

### 5.4 — Shared casino VFX atlas

> **Output:** `apps/client/public/vfx-atlases/casino/{chip_edge_glint,felt_wash_gradient,roulette_motion_blur,slot_reel_symbols}.png`.

Four shared textures supporting the above loops:

- `chip_edge_glint`: 128×32 sprite of a bright gold edge-glint reflection, used as additive overlay on chip edges during rotation.
- `felt_wash_gradient`: 2048×1024 tileable diagonal gradient (violet-to-amber), animated via texture offset at runtime.
- `roulette_motion_blur`: 512×512 radial motion-blur overlay used at the edge of the roulette wheel.
- `slot_reel_symbols`: 1024×256 strip of abstract slot symbols (moon, star, eye, chip, chalice, lion-head — no legible text, each 128×128).

---

## PART 6 — CHARACTER-SHEET PARALLAX "ROOMS"

### 6.0 — Overview

Each character sheet is displayed against a parallaxed environmental backdrop — a "room" appropriate to the player's species × class × faction combination. This is the context that frames the character's 3D bust on the sheet. Without it the rig floats in grey void; with it, the character is PLACED in their world.

Three-layer parallax per room: **background (far)** / **mid** / **foreground (near)**. Each layer moves at a different rate in response to mouse hover — creates depth without requiring full 3D scene rendering. Output format: static PNG layers at 2560×1440, scrolled with CSS transform at runtime.

### 6.1 — Room generation matrix

Rooms are keyed by **(species, class, faction)** but don't need every permutation as unique art. The actual generation matrix:

- **4 species × 5 classes = 20 base rooms** (environment appropriate to what species+class the player picked).
- **+ 4 faction override rooms** (Lions Club, Casino, Palimpsest Studio, Authority Hall) — swap the standard room when the player is actively operating in that faction context.

**Total rooms: 24** — manageable commission, covers the space meaningfully.

### 6.2 — 20 base rooms (species × class)

#### Human

1. **Human × Engineer** — An Ark workshop bay. Exposed pipework overhead, brass gauges on the wall, a cluttered workbench with hand tools. Warm tungsten lamp-light from the foreground. Cool institutional ambient from the background.
2. **Human × Oracle** — A quiet observation chamber aboard the Ark. Large viewport looking onto a nebula. Scattered paper journals on a reading desk. Soft cool starlight from the viewport + warm lamp on the desk.
3. **Human × Assassin** — A dimly-lit safe-house interior. Dark wood furniture, blackout curtains half-drawn, a single sharp weapon displayed on a wall mount. Cool moonlight through the curtains.
4. **Human × Soldier** — A briefing room. Regulation furniture, map projections on one wall, a neat personal locker in the foreground. Hard clinical fluorescent light.
5. **Human × Spy** — A multi-monitor surveillance booth. Banks of screens showing static and partial data, a single empty coffee cup in the foreground, a personal tracker device on the desk. Blue screen-glow dominant.

#### Demagi

6. **Demagi × Engineer** — A forge-chamber. Open flame-hearths in the background, anvil and smithing tools in the mid, a decorated ceremonial apron hanging near the foreground. Warm ember-orange dominant.
7. **Demagi × Oracle** — An ember-temple. Low-burning offering bowls around a central dais, ritual markings on the walls. Warm firelight from all sides.
8. **Demagi × Assassin** — A charcoal-walled shadow-temple. Black stone pillars, a single hooded silhouette-statue in the deep background, razor-thin incense smoke trails. Low amber light.
9. **Demagi × Soldier** — A warrior's hall. Weapons racked ceremonially, a banner with flame-motif on one wall, armored mannequins in alcoves. Warm torch-light.
10. **Demagi × Spy** — An ember-shrouded rooftop overlook at night. City lights far below in warm amber, rain-haze around the perimeter, a single warm lamp on a small side-table in the foreground. Warm-cool contrast.

#### Quarchon

11. **Quarchon × Engineer** — A translucent crystalline laboratory. Prismatic refraction surfaces catch light from multiple directions, delicate instruments suspended mid-air by dimensional tethers. Pale cyan-white dominant.
12. **Quarchon × Oracle** — A phase-shift chamber. Reality bends subtly at the room's edges, walls appear to exist at multiple angles simultaneously. Pale violet ambient.
13. **Quarchon × Assassin** — A fracture-room. The walls are broken into dimensional facets that don't quite line up, creating the sense of "no one place to hide but also no one place to be found." Desaturated grays.
14. **Quarchon × Soldier** — A defense-protocol chamber. Tall crystalline columns acting as barriers/shields, a central strategic display table with 3D volumetric terrain hologram. Cool prismatic light.
15. **Quarchon × Spy** — An observation chamber with walls that SHOW what the character is currently watching (render as abstract data-visualization patterns, not legible). Character is always surrounded by what they surveil.

#### Ne-Yon

16. **Ne-Yon × Engineer** — A massive ancient machine-hall with towering mechanical pillars holding up a vaulted ceiling. Cyan energy-cores embedded in the walls. Scale is larger than other species rooms — Ne-Yons are tall.
17. **Ne-Yon × Oracle** — A ceremonial core-chamber. Central cyan energy well, ancient Ne-Yon runes etched into the walls, a ritual dais for core-reading. Cold cyan dominant.
18. **Ne-Yon × Assassin** — A silent war-bunker. Machine-oil dark walls, a single active cyan status-light panel in the middle distance. Low light, heavy atmosphere.
19. **Ne-Yon × Soldier** — A command war-machine hangar. Partial Ne-Yon war-machines in the background alcoves, a central standing area. Cyan core-light dominant.
20. **Ne-Yon × Spy** — A signals-intercept chamber. Walls full of flickering data-panels showing Ne-Yon rune streams, a central listening-throne. Deep cyan ambient.

### 6.3 — 4 faction-override rooms

21. **Lions Club override** — White-marble columned hall, brass laurel motif, warm ceremonial amber light, subtle gold-laurel trim throughout. Overrides base room when player is operating in a Lions-Club-gated context.
22. **Casino override** — Dark velvet lounge, violet-gold neon perimeter, distant bokeh of patrons. Overrides when player is in a casino-gated context.
23. **Palimpsest Studio override** — Broadcast-studio set (matches the Palimpsest Host backdrop in Part 2Q), a crawl strip visible in the mid layer scrolling abstract glyphs. Overrides when Palimpsest episodes are actively running.
24. **Authority Hall override** — The deep-perspective black-marble hall from Part 2G, six crystal coffins visible along the left wall, cold ambient. Overrides when the player is in an Authority-judgment context.

### 6.4 — Per-room 3-layer parallax commission

**Output path (per room):** `apps/client/public/rooms/{species}_{class}/{background,mid,foreground}.png` — each 2560×1440 PNG, foreground with transparent cutouts.

**Background-layer prompt (runs once per room):**
> Hyper-realistic environmental backdrop, 2560×1440, 16:9. [Room description from 6.2]. Render the FAR layer only — deep perspective elements, distant architecture, skybox / nebula / far lighting. Subject-less — this layer frames where the character bust will sit but does not contain the character. Moderate depth-of-field BLUR appropriate to a background plate. PBR photorealistic, volumetric atmospheric haze, film grain. 4K. No rendered text.

**Mid-layer prompt (runs once per room):**
> Same environment as the background layer for room [ROOM NAME]. Render the MID-DISTANCE elements — mid-depth props, mid-perspective architecture, surrounding atmosphere pieces. This layer sits ABOVE the background plate and BELOW the foreground. Moderate sharpness with subtle depth-of-field. Keep a central ~40% horizontal band OPEN/clear where the character will be placed — this band should contain only ambient atmosphere, no blocking objects. 4K. PNG with transparent regions where content shouldn't block. No rendered text.

**Foreground-layer prompt (runs once per room):**
> Same environment, FOREGROUND elements only. Render the NEAREST plane — framing edges, near props, close-focus items that surround but do not cover the character's bust region. This layer sits ABOVE the character (character in 3D renders in the middle). Sharp focus. Small particle-atmosphere elements appropriate to the room (dust motes for Human Engineer, ember particles for Demagi, prismatic refraction for Quarchon, cyan energy sparks for Ne-Yon). Large central cutout where the character's bust geometry will appear — render with full transparent alpha in that region. 4K. PNG with generous transparent cutout. No rendered text.

### 6.5 — Parallax motion spec (runtime, no new art)

When the character sheet is displayed, the three layers parallax on mouse move:

- Background: −0.5% per degree of mouse offset (subtle)
- Mid: 0% (anchored — this is the "stage")
- Foreground: +1.0% per degree of mouse offset (pronounced)

Creates the sense that the character is standing IN the room, not pasted onto it.

### 6.6 — Ambient audio per room (optional, P2)

Each room can have an associated ambient audio loop — low-volume environmental bed. Examples:
- Human × Engineer: workshop hum + distant hammer strikes
- Demagi × Oracle: crackling flame + distant chanting
- Quarchon × Assassin: subtle phase-shift shimmer + silence
- Ne-Yon × Soldier: deep mechanical pulse + core-hum

One 60-second ambient loop per room, generated via Suno v4 ambient preset. Deferred to P2 — not blocking the P0/P1 visual pipeline.

---

## PART 7 — VFX SHADER-TEXTURE ATLASES (CONSOLIDATED)

### 7.0 — Purpose

This part consolidates every texture atlas referenced throughout Parts 1–6 into a single commission list. Many atlases appear as "Bundle F" entries scattered across NPC sections; this list is the authoritative source for batched generation. Total atlas count: **~60 textures**.

### 7.1 — Hologram atlases (Part 1A)

All at 2048×2048 unless noted.

| Atlas | Description | Primary use |
|---|---|---|
| `hologram/elara_scanlines.png` | Horizontal cyan scanline tile | Elara shader overlay |
| `hologram/elara_rain-motes.png` | Cyan particle mote scatter, 180/tile | Elara shader overlay |
| `hologram/elara_chromatic_aberration_mask.png` | Grayscale radial mask | Chromatic-aberration strength |
| `hologram/elara_silhouette_edge.png` | Cyan rim glow with single inner scanline | Elara mesh edge |

### 7.2 — Particle atlases (Part 1B + Part 2 protagonist tier)

| Atlas | Size | Description | Used by |
|---|---|---|---|
| `particles/human_assembly-atom.png` | 512×512 | Red ember with directional streak | Human reveal VFX |
| `particles/human_red-eye-ignition.png` | 1024×1024 | Radial red emissive burst | Human climax frame |
| `particles/human_rim-shadow.png` | 2048×2048 | Warm-red-tinted shadow mask | Human scene rim |
| `particles/human_silhouette-stencil.png` | 2048×2048 | Hard-edged silhouette cutout | Human particle target |
| `particles/rock-break-shard.png` | 512×512 | Stone shard sprite sheet | Kael Phase 3 emergence |

### 7.3 — Rarity atlases (Part 3.4 + Part 4.4)

| Atlas | Size | Description |
|---|---|---|
| `rarity/common.png` | 2048×2048 | Flat dust overlay, subtractive roughness |
| `rarity/uncommon.png` | 2048×2048 | Green seam-glow strip + leaf-mote sprite sheet |
| `rarity/rare.png` | 2048×2048 | Blue seam-glow strip + drifting-mote sprite + inner-light radial |
| `rarity/epic.png` | 2048×2048 | Violet seam-glow strip + sparkle-burst sprite + interior glow |
| `rarity/legendary.png` | 2048×2048 | Gold-orange seam + gold-dust-trail + clear-coat normal detail |
| `rarity/mythic.png` | 2048×2048 | Iridescent spectrum strip + reality-fracture sprite + oil-slick normal |
| `rarity/relic.png` | 2048×2048 | Multi-layer (gold + blue + iridescent) packed into R/G/B channels |

### 7.4 — NPC-specific VFX atlases (Part 2)

Grouped by NPC. Each atlas ships at the size noted.

**Locke (2B):** `locke_eyepatch_scan.png` (512×512) — red scan-line pattern, circular 400px zone with vertical scan-band.

**Kael/Source (2C):** `source_void_fractures.png` (2048×2048) — crack network with cold-blue inner emissive.

**Shadow Tongue (2E):** `shadow_tongue_fingertip_text.png` (1024×1024) — scattered violet glyph characters with directional streaks.

**Architect (2F):** `architect_mask_cracks.png` (2048×2048) — mask seam cracks with violet-to-amber inner emissive.

**CADES (2H):** `cades_static_noise.png`, `cades_scanlines.png`, `cades_tracking_bar.png`, `cades_chromatic_bleed.png` (each 2048×2048) — CRT broadcast overlays.

**Collector (2I):** `collector_jar_shimmer.png` (512×512) — golden iridescent cloud in 380px circular jar region.

**Degen (2J — REAL CANON):** `degen_living_tattoo_ink_red.png`, `degen_living_tattoo_ink_blue.png`, `degen_living_tattoo_glow_channel.png` (each 2048×2048) — tattoo layers + emissive mask.

**Gamemaster (2L):** `gamemaster_goggle_L.png`, `gamemaster_goggle_R.png` (each 256×256), `gamemaster_temple_gears.png` (512×256), `gamemaster_hose_vapor.png` (128×128).

**Matrikala (2M — placeholder):** `matrikala_coupling_glow.png` (512×512) — brass coupling with inner cyan glow.

**Meme (2N):** `meme_chant_wave.png` (1024×1024) — radial concentric ring-waves, warm gold tinted.

**Necromancer (2O):** `necromancer_eye_faces.png` (512×512) — ghostly faces overlay on milk-white base.

**Palimpsest Host (2Q — placeholder):** `palimpsest_crawl.png` (2048×128) — horizontal abstract glyph-shape crawl strip.

**Seer (2S — REAL CANON):** `seer_staff_crystal.png` (512×512), `seer_wing_edge_glow.png` (2048×1024), `seer_wing_feather_groups.png` (2048×1024) — staff crystal + wing overlays.

**Warlord (2T):** `warlord_visor_shimmer.png` (1024×256) — narrow iridescent horizontal band.

**Watcher (2U):** `watcher_third_eye_glow.png` (256×256), `watcher_mask_condensation.png` (512×256) — third-eye emissive + breath-through-mask patch.

**Engineer/Prince (2V/W):** `engineer_goggle_lens.png` (512×256), `engineer_belt_instruments.png` (1024×256) — goggle emissive + belt gauge reference.

### 7.5 — Seasonal ambient atlases (Part 4.2)

All at 2048×2048:

- `seasonal/spring_ambient.png` — pollen mote variants (4×4 grid)
- `seasonal/summer_ambient.png` — heat-haze distortion normal map
- `seasonal/autumn_ambient.png` — leaf sprite grid (4×4)
- `seasonal/winter_ambient.png` — exhale frost puff sheet
- `seasonal/christmasJuly_ambient.png` — candy-cane sparkle grid (4×4)
- `seasonal/shadowConvergence_ambient.png` — violet tendril sprite sheet

### 7.6 — Casino atlases (Part 5.4)

Shared across all casino loops:

- `casino/chip_edge_glint.png` (128×32) — gold edge-glint sprite
- `casino/felt_wash_gradient.png` (2048×1024) — diagonal violet-to-amber tileable gradient
- `casino/roulette_motion_blur.png` (512×512) — radial motion-blur overlay
- `casino/slot_reel_symbols.png` (1024×256) — 8 abstract slot symbols in a strip

### 7.7 — Faction rim-light shader data (Part 6 integration)

Faction-specific lighting rigs applied to the scene when player is in that faction's context. Delivered as shader preset files (not textures), but listed here for completeness:

- `faction/ICL_rim.preset` — warm white ceremonial rim with subtle gold-laurel emissive mask
- `faction/authority_rim.preset` — cold cyan-to-violet gradient rim from back
- `faction/source_rim.preset` — cold pale-blue fracture-emissive rim pattern
- `faction/hierarchy_rim.preset` — violet corruption-edge rim with subtle glitch artifacts

### 7.8 — Total atlas count estimate

- Hologram: 4
- Particles: 5
- Rarity: 7 (including RELIC)
- NPC-specific: ~32 atlases across 20 NPCs (ranging from single textures to 4-texture bundles)
- Seasonal: 6
- Casino: 4
- Faction rim: 4 presets (not textures)

**Total textures to commission: ~58 atlases.** Estimated 2-3 days of batched generation through Substance 3D Sampler + procedural authoring for geometric atlases.

---

## PART 8 — UI ATMOSPHERE

### 8.0 — Overview

Interface-level art that frames the character sheet itself: rarity-tier glyph badges, equip-slot frames, buff/debuff icons, status-effect overlays. Smaller but numerous — ~80 UI sprites.

### 8.1 — Rarity-tier glyph badges (7 tiers, 3 sizes each = 21 sprites)

Displayed on gear tooltips, inventory grid cells, equip-slot corners. Consistent visual language across the 7 tiers (common / uncommon / rare / epic / legendary / mythic / relic) — differentiated by color and complexity.

> **Output:** `apps/client/public/ui/rarity-glyphs/{tier}_{size}.png` — three sizes (32px / 64px / 128px).

**Generation prompt template:**
> Small UI sprite of a geometric sigil/glyph badge representing "[TIER] rarity" in a sci-fi game. Sizes: 32×32, 64×64, and 128×128. Transparent background. Design: clean geometric linework in the tier's signature color ([TIER COLOR]). Single symmetric glyph centered in frame. Complexity scales with tier:
> - COMMON (neutral grey #808080): single hexagon outline
> - UNCOMMON (green #7dd87a): hexagon with inner 3-segment leaf mark
> - RARE (blue #4a8ad6): hexagon with inset 6-pointed star
> - EPIC (violet #a555d6): ornate hexagon with double-ring and inner diamond
> - LEGENDARY (gold-orange #f5a040): crown-circled hexagon with 8-point starburst
> - MYTHIC (iridescent rainbow gradient): radial mandala with concentric fractal edges
> - RELIC (LCIF donor tier, chromatic): laurel-wreath-circled hexagon with inset lion-head sigil in center, multi-color iridescent fill
> Each glyph should read clearly at 32×32 while holding detail at 128×128. Sharp clean vector-feel but rendered as PNG. No text. No rendered letters. No shadows or complex gradients — flat-design with subtle gradient fill only.

### 8.2 — Equip-slot frames (16 slot types × 3 states = 48 sprites)

Each equipment slot in the character sheet has a visual frame: empty / filled / locked. Per Part 1C.6 there are 15 attachment sockets + 1 for the rarity indicator.

Slots: `head`, `chest`, `shoulders`, `arms`, `gloves`, `belt`, `legs`, `feet`, `weapon_primary`, `weapon_secondary`, `back`, `neck`, `L_shoulder`, `R_shoulder`, `L_forearm`, `R_forearm`.

States per slot:
- **EMPTY** — faint silhouette of what the slot expects (e.g., head slot shows a dim helm-silhouette), 40% opacity.
- **FILLED** — rendered gear PNG in the slot frame, rarity-tier color-tinted border.
- **LOCKED** — ghosted slot with a small lock-glyph overlay.

> **Output:** `apps/client/public/ui/slot-frames/{slot}_{state}.png` — 256×256 each.

Standard UI frame generation prompt:
> A 256×256 UI equipment-slot frame sprite for a sci-fi RPG character sheet. Transparent background. Clean geometric outer border (~8px thickness) in dark-metallic gunmetal tone. Inner area has a faint silhouette of a [SLOT TYPE] item (40% opacity, matching the slot's expected equipment — head = helmet, chest = torso armor, etc.). Subtle rarity-border color can be color-shifted at runtime (author in neutral grey; apply rarity tint via CSS/shader). Sharp clean edges, no drop shadows, no text. Readable at small scales.

### 8.3 — Buff / debuff / status icons (~40 sprites)

Characters accumulate temporary status effects (stat boosts, temporary penalties, situational buffs). Each needs a small 32×32 or 48×48 icon visible on the character-sheet status strip.

Categories:
- **Stat buffs (6)** — STR+, DEX+, INT+, CHA+, WIS+, CON+ (each 48×48)
- **Stat debuffs (6)** — same stats with inverted downward-arrow variants
- **Element affinities (5)** — fire, water, air, earth, void (48×48 each, rich emissive color)
- **Status effects (8)** — bleeding, poisoned, blessed, frozen, burning, stunned, shielded, hidden
- **Rental-state indicators (4)** — membership-active, membership-grace, membership-expired, membership-locked (Part 4)
- **Narrative flags (5)** — Source-aligned, Authority-aligned, Lions-aligned, Casino-aligned, Palimpsest-viewer
- **Rarity promotion indicators (3)** — tier-up-pending, tier-up-available, tier-up-completed (small badge overlays)
- **Cinematic-unlock indicators (3)** — reveal-available, reveal-viewed, reveal-locked

> **Output:** `apps/client/public/ui/status-icons/{category}_{effect}.png` — 48×48 each.

**Generation prompt template:**
> Small UI sprite 48×48 representing a "[EFFECT NAME]" status effect in a sci-fi RPG. Transparent background. Clean geometric glyph centered in frame. Single dominant color [EFFECT COLOR]. Recognizable silhouette at small scale — players should identify the effect category without reading text. No rendered letters. Simple shape vocabulary: upward arrows for buffs, downward for debuffs, rings for protective, jagged lines for damage-over-time, etc.

### 8.4 — Character-sheet frame chrome (persistent UI)

The character sheet's static UI frame — borders, corner decorations, title-bar glyph, section dividers. Each is a small PNG used as CSS background-image in the UI layout.

> **Output:** `apps/client/public/ui/sheet-chrome/`

- `frame_corner_top_left.png` (128×128) — ornate corner-piece, brass-and-violet tone
- `frame_corner_top_right.png` (128×128) — mirrored
- `frame_corner_bottom_left.png` (128×128) — simplified (no rarity indicator on bottom corners)
- `frame_corner_bottom_right.png` (128×128) — mirrored
- `frame_edge_top.png` (512×64) — top-edge ornamental strip tileable
- `frame_edge_side.png` (64×512) — side ornamental strip tileable
- `title_bar_glyph.png` (256×32) — thin horizontal ornamental strip above the character name
- `section_divider.png` (512×16) — simple thin divider between UI sections

### 8.5 — Special-state overlays (full-frame effects)

When certain narrative/state events occur, a full-character-sheet overlay plays briefly. Most are driven by NPC-visit context.

- `overlays/shadow_tongue_detected.png` (1920×1080 transparent) — faint violet glitch-distortion overlay (like Shadow Tongue has passed through the UI). Plays briefly on initial load if Shadow Tongue has recently edited the player's Loredex.
- `overlays/authority_verdict_pending.png` (1920×1080 transparent) — faint cold-cyan gradient from top-left, hinting at a pending judgment beat.
- `overlays/source_emergence.png` (1920×1080 transparent) — fracture-crack web pattern with cold-blue inner glow, fade-in on first encounter with the Source.
- `overlays/lions_membership_active.png` (1920×1080 transparent) — subtle warm-gold rim with faint laurel motif in corners.
- `overlays/casino_guest.png` (1920×1080 transparent) — faint violet-gold neon haze from bottom edge.

### 8.6 — Total UI atmosphere count

- Rarity glyphs: 21 sprites
- Equip-slot frames: 48 sprites
- Status icons: ~40 sprites
- Chrome elements: 8 sprites
- Special overlays: 5 sprites

**Total UI atmosphere: ~122 sprites.** Simple geometric work, ideal for batched generation via Midjourney v7 or SDXL with consistent prompt templates. Estimated 1-2 days.

---

## PART 9 — VEO 3.1 CINEMATICS MANIFEST

### 9.0 — Overview

Consolidates every Veo 3.1 / Seedance 2.0 motion clip referenced throughout Parts 1–8. Each entry gives: **START FRAME** (Nano Banana 2 still), **END FRAME** (Nano Banana 2 still), and **MOTION PROMPT** (Veo 3.1 or Seedance 2.0 directive). Render workflow per SHIP_READY_ASSET_BIBLE.md §2 protocol: render start and end keyframes first in Nano Banana 2 at matching resolution, upload both as keyframes to Veo 3.1, paste motion prompt, render.

**Total cinematics: 11 primary + 3 audit-flagged regenerations.**

| ID | Title | Duration | Use | Priority |
|---|---|---|---|---|
| CIN-ELARA-IDLE | Elara holographic idle loop | 8s loop | Character-sheet default | P0 |
| CIN-HUMAN-REVEAL | The Human's first-encounter particle assembly | 15s one-shot | First meeting | P0 |
| CIN-KAEL-01 | Kael 3-phase transformation | 14s one-shot | Narrative climax | P0 |
| CIN-KAEL-02 | Source rock-break emergence | 6s one-shot | First Source encounter | P0 |
| CIN-ARCH-01 | Architect mask-ignition reveal | 6s one-shot | True Final Message reveal | P0 |
| CIN-PROG-01 | Programmer → Antiquarian aging | 12s one-shot | Late-game reveal | P1 |
| CIN-PRINCE-01 | Prince → Engineer transformation | 12s one-shot | Memoir origin beat | P1 |
| CIN-WARLORD-REVEAL-01 | Warlord helm retraction + swarm reveal | 8s one-shot | Act 2/3 reveal | P1 |
| CIN-SHADOW-TEETH | Shadow Tongue second-teeth reveal | 4s trigger | Revelatory dialog beat | P1 |
| CIN-DEGEN-IDLE | Degen casino pit idle (NEW CANON) | 10s loop | Casino game-mode | P1 |
| CIN-LIONS-MATERIALIZE | Lions Club armor materialization | 0.8s one-shot | Gear-equip animation | P1 |

**Audit-flagged regenerations (existing cinematics wrong per new canon):**
- CIN-013 (Degen discovery) — old sequined showman canon is WRONG; use CIN-DEGEN-IDLE instead
- CIN-031 (DMC starting line) — old carnival-showman Nilmorg is WRONG; re-spec with demon-executive precision
- CIN-032 (DMC severance ceremony) — same Nilmorg audit

---

### CIN-ELARA-IDLE — Elara holographic idle loop (8s seamless, P0)

**Output:** `apps/client/public/videos/character-sheet/protagonist_elara_idle_loop.mp4` · **Aspect:** 1:1 square · **Resolution:** 2048×2048

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. Elara, three-quarter bust framing, standing in a dimly lit ship corridor (blurred to heavy bokeh — cyan console lights at mid-distance, amber emergency strip far back). She is mid-breath, chest at neutral expansion. Rain-like cyan particles drift slowly downward through the air around her at low density — not environmental rain, an aesthetic artifact of her projection field. A few particles pass through her shoulder translucently. Her hair is damp, a single water droplet caught on the strand by her left temple. Eyes direct to camera, calm, luminous blue. Faint horizontal scanline at ~y=0.42 crosses her face (she is projected light). Pale cyan rim on her entire silhouette, slightly brighter on the left shoulder where a rim light sits. Mouth closed, neutral. Volumetric cyan haze in the foreground depth. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2) — identical to START for seamless loop:**
> *(Same prompt as START FRAME — loop is designed to cycle. Breathing, blink, and particle motion happen in the motion prompt only.)*

**VEO 3.1 MOTION PROMPT:**
> 8-second seamless loop. Camera locked, no dolly. Subject Elara, three-quarter bust, breathing gently (chest rise at 0.0s, peak at 1.6s, release by 3.2s; second full cycle 3.2–6.4s; partial cycle 6.4–8.0s that matches start frame at loop point). Blink once at 2.1s (140ms total close-hold-open). Cyan particles drift downward continuously at ~12px/s, density steady. At 4.5s, a single scanline travels from forehead to chin over 600ms — subtle, not dramatic (she is ALWAYS scanlined; this one just stronger). At 6.0s, her eyes saccade 2° to the left and back over 400ms — she looks at something mid-distance, then returns. No mouth motion. No cinematic camera moves. Goal: she should feel like she's *there*, waiting, not performing. 24fps. Film grain preserved. Loop-point match at frame 192.

---

### CIN-HUMAN-REVEAL — The Human's first-encounter particle assembly (15s one-shot, P0)

**Output:** `apps/client/public/videos/character-sheet/protagonist_human_reveal.mp4` · **Aspect:** 1:1 square · **Resolution:** 2048×2048 · **Duration:** 15s one-shot (NOT a loop — plays once on first contact, then the idle 3D rig takes over)

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. A near-empty dark frame. Deep charcoal-black background with a faint warm-red ambient haze filling the lower half of the frame. A sparse scatter of ~80 glowing red ember particles drift lazily through the composition, each a tiny warm red point with a faint directional streak. No figure visible yet — only the suggestion of atmosphere. A single more-concentrated cluster of ~15 particles hovers at roughly the center-lower-third, beginning to congregate. The background has extremely subtle CRT-scanline overlay at 15% opacity. Volumetric red haze in deep foreground. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. Same frame composition as the start frame (same camera, same background haze). But now fully present: THE HUMAN, three-quarter bust framing, matching the front turnaround pose exactly — weathered face, dark brown beard, black fedora at asymmetric tilt (right side brim lower), rugged black high-collar coat. Both eyes now exposed and blazing at full red-emissive intensity — iris #b81a1a with hot white cores (#ffe0e0 catchlights), warm red light bouncing onto his cheekbones. His head is lifted, chin up slightly, eyes locked directly on camera. Mouth slightly parted — on the verge of speaking the first line. The lingering ~60 red ember particles that didn't resolve into his body still drift around his silhouette. Warm red rim light traces his outline fully. Background CRT-scanline overlay now at 25% opacity on him. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 15-second one-shot reveal cinematic. Camera locked static, no dolly, no pan. Subject: The Human assembling from particles into solid form. Narrative beats with frame timings:
> - **0.0–2.0s (stillness):** Ambient red ember particles drift lazily. Background has a subtle CRT-scanline sweep (one full vertical sweep in 2s). No figure yet — only atmosphere. Mood: patient anticipation.
> - **2.0–4.0s (gathering):** Scattered particles accelerate inward, converging toward the center-frame silhouette-target. Particle count grows from 80 to 500 as new particles fade in from frame edges. They form a vague cloud at the shape of the figure-to-be. Subtle red atmospheric swell.
> - **4.0–8.0s (resolution):** Particle count climbs to 2000, swarming along the silhouette-stencil target. Outline of The Human's body becomes readable — shoulder, hat crown, coat line. Particles at the edges transition from dot-particles into streaked micro-strokes, then into solid pixel-clusters. From 4s to 8s we scrub `revealProgress` from 0.0 to 0.85 — his body resolves from particulate to solid photoreal, but his EYES REMAIN DARK. Face visible (beard, mouth, hat brim) but the eye sockets are still two empty shadow-pits. **At 8.0s: body present, not yet "alive" — eyes are closed/absent.**
> - **8.0–11.0s (held beat):** Body holds fully resolved. Chest rises once — his first breath, timed carefully. Red ambient particles thin to ~100. CRT-scanline sweep slows. Mood: silent. We are waiting for him. His body exists; his being does not yet.
> - **11.0–12.8s (eye kindling):** Sub-surface warm red glow begins to build inside both eye sockets, from zero to mid-intensity over 1.8s. Barely perceptible at 11.0s, growing to visible (12.0s), bright (12.5s), full-intensity (12.8s). A quiet emissive swell.
> - **12.8–13.0s (IGNITION):** One frame — at 12.9s the eyes snap to full red-emissive ignition. Hot white cores, aggressive red rays. A subtle audio-synced visual pulse — faint volumetric bloom ring emanates outward from the eyes across 8 frames. Cheekbones catch the red light for the first time. **This is the moment The Human is alive.**
> - **13.0–14.0s (first breath of life):** Chin lifts 3°, eyes (now lit) saccade once across the camera — a recognition beat. He sees the player. Chest rises for a second breath, deeper. Hat brim shadow now shows the red light leaking onto his skin underneath.
> - **14.0–15.0s (settle):** Body settles into the END FRAME pose. A residual ember particle drifts past his shoulder. Scanline sweep completes one final pass. Mouth parts slightly — he is about to say the first line. Hold on end frame for the final 8 frames (0.33s) to lock loop-out.
> Cinematography: fixed camera, no motion. Motion is entirely in the subject, the particles, and the light. 24fps. Film grain preserved throughout. Warm red palette dominant.

**Audio hand-off note:** Synced to the player's first VO line. Ignition moment (12.9s) lines up with a Suno-generated 1.2s low-string stinger. First-line VO begins at 14.5s — he finishes the cinematic exhaling, then speaks over the final settle. See `docs/production/vo-batches/act1-opponent-dialog__human.csv` for the first-line text.

---

### CIN-KAEL-01 — Kael three-phase transformation (14s one-shot, P0)

**Output:** `apps/client/public/videos/character-sheet/kael_three_phase_transform.mp4` · **Aspect:** 16:9 · **Resolution:** 1920×1080

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. Interior of an Iron Clad Lions recruitment hall — white marble pillars, warm amber wall-sconces, faint cyan institutional ambient. In the center of frame, Kael as THE RECRUITER (Phase 1): muscular man in his late twenties, warm medium-brown skin, long well-maintained brown dreadlocks pulled back cleanly, trim goatee, subtle amber eye-glow. Wearing white ICL plate armor with "ICL" stenciled in clean black lettering at the right pec and shoulder pauldron. Red-orange tribal ink visible on both exposed forearms (clean ceremonial flame motif). Stance: heroic confident chest-forward, one arm extended slightly in a recruiter's "join us" gesture. Warm amber key lighting from camera-left, cool cyan fill from right. Film grain. 4K. No rendered text other than the ICL stencils.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. Interior of a broken stone cavern — dust motes frozen in a cold shaft of pale blue light falling from above through a fractured ceiling crevice. Center of frame, Kael as THE SOURCE (Phase 3): same man as start frame but ASHEN-PALE, skin a cool desaturated grey covered in black crack-like fractures that leak cold pale-blue emissive light from within. Dreadlocks now wild and partially petrified — individual locks fossilized into stone-moss textures at the tips. Heavy full beard, gray-weathered at the edges. Tattoos subsumed and indistinguishable from the fractures. Chrome cybernetic gauntlets on both forearms (reforged from brass). Bronze sun-sigil belt medallion at the waist. FULL amber-gold eye glow. Head bowed slightly, shoulders squared into power. Cold ambient, warm subject-center. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 14-second one-shot transformation cinematic. Camera slowly pushes in on Kael across the entire duration (very gentle dolly, 1.2% zoom total). Scrubs `kaelTransformProgress` 0.0 → 0.5 at 5s → 1.0 at 12s with held reveal beat through 14s. Narrative beats:
> - **0.0–3.0s (Phase 1 idle):** Recruiter Kael stands composed, breathes once, eye-glow baseline 0.2, amber ICL-hall light. A single slow blink at 1.8s.
> - **3.0–5.0s (Phase 1 → Phase 2 transition):** White ICL plate armor DISSOLVES from his body in small fragments drifting upward and fading, revealing bare skin beneath. Red-orange tribal forearm ink shifts to BLACK-NAVY — corruption moment. Dreadlocks lengthen and wildness creeps in. Skin tone desaturates toward prisoner-pallor. Bronze prisoner-bracers MATERIALIZE onto both forearms from an invisible source. The hall lighting drops cooler, ceremonial amber bleeds out, replaced by harsh cyan prison-stone ambient. Eye-glow dims from 0.2 to 0.3 (defiant rather than confident). At 5.0s: Enslaved Kael fully present, shirtless, tattoos black-navy across chest and stomach, wild unkempt longer dreads, brass medallion at collarbone.
> - **5.0–7.0s (Phase 2 held beat):** Enslaved Kael holds for 2 seconds. Chest rises once (a guarded, shallow breath). Eyes defiant-fixed at camera. Mood: the weight of captivity. Lighting: harsh cyan from above, no warm fill.
> - **7.0–12.0s (Phase 2 → Phase 3 transition — the longest and most dramatic beat):** The transformation accelerates. Black tribal ink on chest/stomach VISIBLY CRACKS — thin black fracture lines spread outward from the ink, extending onto the shoulders, neck, and jawline, CONTINUING across the forehead. Inside the fractures, cold pale-blue emissive light begins to bleed outward (scrub `fractureEmission` 0.0 → 0.7 over these 5 seconds). Skin tone shifts from pale prisoner-grey to ASHEN — desaturated cool grey. Dreadlocks at the tips begin to PETRIFY — stone-moss textures creep inward from the ends. Brass prisoner-bracers on his forearms REFORGE IN REAL-TIME — brass flows like liquid metal, re-alloying into CHROME cybernetic gauntlets (the embossing patterns remain similar but the material shifts). Bronze sun-sigil belt medallion rises from below the frame and locks into place at his waist. Amber eye-glow ramps from 0.3 to 1.0 at full intensity. The prison-stone backdrop DISSOLVES into a broken stone cavern — ceiling cracks open above him, cold pale-blue light pours down from the fractured crevice.
> - **12.0–14.0s (Phase 3 held reveal):** The Source is fully present. Held beat, 2 seconds of stillness. He breathes once — deep, slow, the breath of something ancient. Fracture emissive pulses subtly with breath (inhale dims, exhale brightens). Petrified dreadlocks at the nape move briefly like Medusa-roots for 400ms then settle. Head remains slightly bowed. Audience meets the fully-realized Source.
> Cinematography: slow ~1° push-in across entire 14s. 24fps. Film grain preserved. Palette shifts from warm-amber (Phase 1) → harsh-cyan (Phase 2) → cold-blue-with-warm-subject-glow (Phase 3).

**Audio hand-off note:** Three-movement score — warm strings (0.0–5.0s), percussive cold bass drones (5.0–12.0s), unresolved sustained chord (12.0–14.0s). See Suno generation spec for Kael's theme.

---

### CIN-KAEL-02 — Source rock-break emergence (6s one-shot, P0)

**Output:** `apps/client/public/videos/character-sheet/kael_source_emergence.mp4` · **Aspect:** 16:9 · **Resolution:** 1920×1080

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. A solid wall of dark stone — cracked, weathered, ancient — filling the frame. Deep within the stone, near the center, a HAIRLINE FRACTURE runs vertically about 40cm tall, pulsing faintly with cold pale-blue light from within the crack. The crack is narrow enough that the viewer cannot see what is inside. Atmospheric dust motes frozen in a cold high-angle light source. Cavern ambient, desaturated cool palette. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. The same cavern, but the stone wall has BROKEN OPEN — a ragged torso-sized opening where the hairline fracture was, stone shards falling mid-air as if caught in a freeze-frame of the break. Standing framed by the broken rock: Kael as THE SOURCE (matching Phase 3 canon exactly — ashen skin with black fractures leaking cold pale-blue emissive, partially petrified dreadlocks, full amber-gold eye glow, chrome gauntlets, bronze sun-sigil belt). His head is slowly lifting from a bowed default position. Around his body, cold pale-blue fracture-light spills outward from the new opening, throwing long blue-cast shadows across the surrounding stone. Dust and broken stone particles hang in the air mid-fall. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 6-second one-shot rock-break emergence cinematic. Camera static, locked on the stone wall.
> - **0.0–1.5s (anticipation):** The hairline fracture in the stone pulses faintly, slowly brightening. Cold pale-blue light inside the crack intensifies. A single low rumble (audio-synced beat) as the stone begins to strain.
> - **1.5–3.0s (break):** The stone VIOLENTLY CRACKS OPEN — ragged torso-sized opening expands outward from the fracture with stone shards flying outward and falling. Inside the opening, the Source is visible standing — initially silhouetted against the cold blue interior light.
> - **3.0–4.5s (emergence):** The cold blue light from behind him spills outward, illuminating the broken stone edges. His body details resolve — ashen skin, fractures, dreadlocks, chrome gauntlets — as the light catches him. His head remains bowed.
> - **4.5–6.0s (reveal held):** His head SLOWLY LIFTS from the bowed position to look directly at the camera, full amber-gold eye glow engaging for the first time in the cinematic. Dust and stone particles still hanging in the air begin their slow downward fall. He has arrived.
> Cinematography: locked static camera. Focal push only on final 1.5s — gentle rack focus from foreground stone-shards to his face. 24fps. Film grain heavy. Palette: cold blue + warm amber subject-glow.

**Audio hand-off note:** Low rumble building (0.0–1.5s), sharp crack beat (1.5s), resonant bass sustain during emergence (1.5–4.5s), single sustained held note as his eyes engage camera (4.5–6.0s).

---

### CIN-ARCH-01 — Architect mask-ignition reveal (6s one-shot, P0)

**Output:** `apps/client/public/videos/character-sheet/architect_mask_ignition.mp4` · **Aspect:** 1:1 square · **Resolution:** 2048×2048

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. The Architect in default bust framing: tall hooded figure in deep black cloak, full-face black metallic demon mask with fractal wing/flame ridges at the forehead, piercing golden-amber eyes at baseline 0.8 intensity visible through narrow eye-slits, silver fractal sigil pendant at the chest pulsing softly. Pure void backdrop. Subject-lighting only — the amber eye-glow bounces on the mask cheekbones, the silver pendant casts a cool faint glow up onto the underside of the hood. Still, composed, authoritative. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. Same Architect, same framing, same hood and cloak — but the MASK HAS FRACTURED. A hairline fracture now runs from the left cheekbone of the mask down to the lower jaw, with VIOLET-AMBER LIGHT LEAKING THROUGH the crack. A single thin tear of the same violet-amber light runs down from the crack (as if weeping inside-out light). Eye-amber at maximum 2.0 intensity — overdriven HDR bloom, near white-hot cores. Silver sigil pendant at the chest now pulsing rapidly at 1.0 intensity, with brief multi-layered inner glow hints (violet and amber secondary channels). Pure void backdrop unchanged. Held beat — he is exposed in a way he has never been before, but he is still here. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 6-second one-shot mask-ignition reveal. Camera locked static, 1:1 square.
> - **0.0–1.5s (statue baseline):** Architect stands composed at baseline. No breathing (statue rig). Eye-amber steady at 0.8. Sigil pendant pulses slowly at 4s period. Hood drape drifts subtly.
> - **1.5–3.0s (internal pressure):** Maskvibration crack-glow begins — faint violet-amber hairlines activate inside the mask along the forehead ridges and cheekbone seams, brightening from 0 to 0.4. Eye-amber ramps from 0.8 to 1.2. Sigil pendant pulse accelerates to 2s period. Nothing else moves — only the emissive fields.
> - **3.0–4.5s (fracture):** A single hairline crack BECOMES VISIBLE as a physical rupture on the mask surface — starting at the left cheekbone ridge and traveling downward toward the jawline over 1.5s. Violet-amber light bleeds out of the crack in real-time, brightening as the crack extends. Eye-amber continues ramping, now 1.5. Sigil pendant pulse at 1s period.
> - **4.5–5.5s (tear emerges):** A single thin tear-drop of violet-amber light forms at the crack's midpoint and begins running DOWNWARD along the mask surface, leaving a faint residual trail. This is the weeping beat. Eye-amber hits maximum 2.0 on the tear-emergence frame. Sigil pulse rapid 0.5s period.
> - **5.5–6.0s (held):** Everything freezes at the END FRAME pose. The tear has run ~3cm down the mask face, still glowing. The mask is permanently fractured now. Architect has not moved. He is still composed. But something has cracked through.
> Cinematography: locked static camera, no motion. All motion is in the emissive fields and the single crack-fracture-tear. 24fps. Film grain preserved.

**Audio hand-off note:** Bell-tone ring building slowly (0.0–3.0s), sharp crystal-crack beat at 3.0s, resonant sustain of a single note through 6.0s — the bell rung from inside has cracked the bell.

---

### CIN-PROG-01 — Programmer → Antiquarian aging (12s one-shot, P1)

**Output:** `apps/client/public/videos/character-sheet/programmer_antiquarian_aging.mp4` · **Aspect:** 16:9 · **Resolution:** 1920×1080

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. YOUNG Programmer (per Part 2R canon): late 20s / early 30s, thin angular pale-skin face, clean-shaven, dark short hair under a black FLAT CAP tilted forward at a casual angle low over the brow. Wearing BRASS-AND-GOLD STEAMPUNK GOGGLES with RED-PINK emissive lenses (grid pattern visible inside). Black high-collar jacket, small gold pendant on chain. Pose: standing on a high rooftop vantage, head turned 30° to viewer's right, looking out over a SHIBUYA-STYLE CYBERPUNK MEGAPLAZA at night — vast neon-lit buildings with massive holographic billboards (blue, magenta, pink, green signage), crowds visible as tiny bokeh below. Lit by magenta-pink city ambient from below + red-pink glow from his own goggles. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. ELDERLY Antiquarian (per Part 2D refined canon): late 50s to early 60s, weathered-scholar face with deep lifelines, sun-aged warm tan complexion, MAGNIFICENT long silver-white chest-length beard continuous with mustache, silver-AND-DARK mixed shoulder-length hair brushed back (dark streaks at front/crown — same dark as the Programmer's youth), DARK brown-black eyebrows (never greyed), pale blue-grey eyes. Wearing a black velvet frock coat with heavy raised gold baroque embroidery at lapels and shoulders. Backdrop: defocused tall library with wooden bookshelves receding, a large arched stained-glass window upper-right bleeding warm amber light, warm tungsten lamp glow. Head turned 25° to viewer's right. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 12-second one-shot aging cinematic. Camera gently dollies in ~5% over the full duration. Scrubs `antiquarianEmergenceProgress` 0.0 → 1.0 over 12s. Narrative beats:
> - **0.0–2.0s (young Programmer idle):** Young him stands on the cyberpunk rooftop. Goggle grid-pattern pulses once (data registering). City neon reflects on his jaw. Cityscape bokeh slowly drifts.
> - **2.0–3.5s (goggle lift):** With one hand, the young Programmer LIFTS THE GOGGLES up onto the brim of his cap — the lenses dim from 0.7 to 0 as they rise, and his REAL EYES are exposed for the first time in the cinematic: pale blue-grey (#6b7a88) — matching the Antiquarian's eyes exactly. Held beat at 3.0s: clear young blue-grey eyes direct at camera.
> - **3.5–6.0s (environment dissolve):** The Shibuya cityscape behind him begins to DISSOLVE — buildings fade into vertical geometry, neon signs soften into warm amber glows, crowd bokeh scatters. In their place, tall WOODEN BOOKSHELVES fade in (same compositional position, different subject). City street dust motes transition to library dust motes. Magenta-pink ambient shifts to warm tungsten amber.
> - **6.0–10.0s (aging):** His face ages in real-time. Skin tans and weathers — lifelines deepen, the youthful smoothness yields to a scholar's weather. Dark hair LENGTHENS to shoulder length and mostly greys (dark streaks persist at front and crown — deliberately NOT pure silver). Dark eyebrows remain UNCHANGED (never greying). Clean-shaven jaw sprouts the magnificent silver-white beard, growing from short stubble to full chest-length gradually. The flat cap lifts off his head and dissolves upward out of frame. The goggles resting on the cap-brim follow the cap and disappear.
> - **10.0–11.5s (costume transition):** The black high-collar jacket reshapes into the black velvet frock coat — fabric grows thicker and richer, gold baroque embroidery materializes along the lapels and shoulders with curling filigree work. The small gold pendant at his chest remains (same pendant — it crossed both phases). The white collar shirt beneath simplifies from the cyberpunk-formal to the open-neck ruffled-silk of the elderly scholar.
> - **11.5–12.0s (held reveal):** Fully aged Antiquarian in his library. Beard full. Hair silver-and-dark. Eyes still blue-grey and direct at camera. The same man, thirty years later. He has made it through.
> Cinematography: slow ~5% dolly-in across full 12s. 24fps. Film grain. Palette shifts from cyberpunk-magenta-pink (Phase 1) to library-warm-amber (Phase 2) linearly across 3.5-10.0s.

**Audio hand-off note:** Synth-bass cyberpunk loop (0.0–3.0s), transitional ambient hum (3.0–6.0s), warm cello line emerging (6.0–12.0s). The cello is the Antiquarian's recurring motif.

---

### CIN-PRINCE-01 — Prince → Engineer transformation (12s one-shot, P1)

**Output:** `apps/client/public/videos/character-sheet/prince_engineer_transform.mp4` · **Aspect:** 16:9 · **Resolution:** 1920×1080

**START FRAME (Nano Banana 2):**
> ⚠️ **Canon not yet locked for Phase 1 (the Prince).** Working placeholder: hyper-realistic cinematic still, 16:9 1920×1080. Young man (same face as Phase 2 Engineer but ~5-10 years younger — Black, short dreadlocks, trimmed beard), wearing CELEBRATION royal ceremonial attire in pastel warm-cream and honey-gold — structured ceremonial vest or short robe with small warm accents, clean ornament work at collar and cuffs. Youthful regal bearing, innocent of what's coming. Backdrop: Celebration parade light — warm honey-gold ambient, defocused crowd bokeh with colorful pennants. Film grain. 4K. No rendered text. **REGENERATE this frame once user uploads definitive Prince canon.**

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. The ENGINEER (Phase 2, per Part 2V/W canon): Black man in his late thirties, healthy dark brown skin, short well-kept dreadlocks past his jaw, dark short-trimmed beard. Proud heroic upward chin-tilt (low-angle hero composition). RED STEAMPUNK GOGGLES covering his eyes (brass-rimmed lenses glowing deep red). Wearing the rich red wool military-cut coat with double rows of brass buttons, high pop-collar turned up, structured epaulettes. Utility belt at waist stacked with brass gauges and chronometers. Backdrop: deep starfield + burning cityscape silhouetted in lower-third-right (distant spires, ember-orange fire-glow, smoke rising). Warm amber key from below-left (city fires), cool starlight rim from above. Heroic determined expression, mouth closed firm. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 12-second one-shot transformation from royal Prince to memoir-bearing Engineer. Camera gently pulls back ~8% over the full duration (opposite direction from CIN-PROG-01's push-in — as he gains weight and wisdom, we give him more frame). Narrative beats:
> - **0.0–2.5s (Celebration Prince idle):** Young Prince stands in the warm ceremonial hall. Pennants drift softly in the background bokeh. He smiles faintly — a young man who has not yet seen what's coming. Soft honey-gold light.
> - **2.5–5.0s (Celebration fall):** The environment begins to DEGRADE. Honey-gold ambient cools toward the bottom of the frame (something catches fire offscreen). Pastel Celebration trim on his ceremonial vest darkens as the warm light recedes. His smile drops. Eyes go wide (the first thousand-yard-stare beat). Pennants in the background blow in a sudden wind, tearing. One of them catches fire mid-flight (off-focus, implied through warm glow spike).
> - **5.0–7.5s (clothing transition):** The pastel ceremonial robe VISIBLY TRANSFORMS on his body — the cream-and-gold fabric desaturates and darkens toward deep wool red, the simple ornament work at the collar yields to a high military pop-collar, brass buttons materialize in a double row down the front, shoulder epaulettes build from small ceremonial piping into structured military weight. The short ornamental vest at his waist reshapes into the heavy utility belt with brass gauges appearing one at a time (first gauge materializes at 5.8s, tick-tick-tick the rest lock in through 7.5s).
> - **7.5–9.5s (physical aging + goggles):** His face subtly matures — beard thickens, dreadlocks lengthen, eye-lines soften into the weary-earned look of the older Engineer. The red steampunk goggles fade onto his face from an invisible source, sliding down onto the bridge of his nose and settling into position — lenses light up from 0 to baseline emissive over 1.5 seconds. He is now the Engineer.
> - **9.5–12.0s (reveal held):** Full Engineer present in full costume. The backdrop has shifted entirely — the Celebration hall is GONE, replaced by the cold starfield + burning cityscape below. Warm fire-key from below-left catches his red coat. He breathes once — deep, measured. Belt gauges tick once in unison. Held reveal.
> Cinematography: slow ~8% dolly-back across full 12s. 24fps. Film grain. Palette shifts from honey-gold Celebration warmth (Phase 1) → cool starfield with ember-fire-glow (Phase 2).

**Audio hand-off note:** Warm ceremonial choir (0.0-3.0s), dissonant fire-crackle + string-swell building (3.0-7.5s), mechanical gear-tick rhythm emerging (7.5-9.5s), sustained note (9.5-12s). Belt-gauge synchronized tick at 9.8s is the Engineer's "heartbeat" signature baked into the score.

---

### CIN-WARLORD-REVEAL-01 — Helm retraction + swarm reveal (8s one-shot, P1)

**Output:** `apps/client/public/videos/character-sheet/warlord_helm_retract_swarm_reveal.mp4` · **Aspect:** 16:9 · **Resolution:** 1920×1080

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. The Warlord in default fully-armored pose (per Part 2T canon): helm down, yellow hazard-saffron armor (#d4a04a) with gunmetal-black joint seams and polished brass rivets, full-face brass-rimmed visor with continuous horizontal scanning slit across eye level. Barely-visible iridescent shimmer inside the visor slit lower-edge. Stance: still, professional. One gauntleted hand resting on weapon hilt at hip. Backdrop: defocused Nexon breach battlefield — smoke columns, distant ember-orange city fires, faint cold cyan from emergency flares. Amber spotlight from camera-right on pauldron and upper visor. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9 1920×1080. The Warlord, helm RETRACTED and gone. Exposed face visible for the first time (per Part 2T.9 canon): late-twenties woman, pale porcelain skin, long platinum-blonde hair flowing loose past shoulders (wild, slightly unkempt, strands across face), striking bright GREEN eyes, dark smudged eyeliner, blood-red lips slightly parted. Face-tattoos LEFT side only: intricate occult-tribal black ink on temple/cheekbone/eye-corner with sharp angular lines, scattered dots, two small black stars, ONE BLOOD-RED ASTERISK MARK at the cheekbone (the swarm-mark). Small black hexagonal earring at visible ear. Wearing the YELLOW HOODED CANVAS JACKET (now open at the chest where the armor chest-piece retracted), hood draped at the back of her head, blonde strands escaping. Black cybernetic armor plating still visible at shoulders and collarbone. **Around her green pupils, a faint iridescent Vex-shimmer is just barely visible** — the swarm is inside her, watching. The red asterisk tattoo on her cheekbone glows subtly with cold-iridescent under-light (the swarm's brand pulsing). Expression: guarded, sharp-eyed, NOT defeated. Same Nexon battlefield backdrop as start, overcast cold key. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 8-second one-shot helm-retraction cinematic. Camera starts at standard Warlord framing and slowly dollies in ~10% over the full duration (this is an intimate reveal, not a pull-back).
> - **0.0–1.5s (armored baseline):** Warlord stands still in full armor. Visor shimmer at baseline 0.25. Weapon hand on hip. Nothing moves except the subtle visor shimmer.
> - **1.5–3.5s (helm retraction):** The full-face visor begins to PHYSICALLY RETRACT — individual plate segments slide upward and back into the helm's crown, and the helm's front-face retracts upward over her head, folding back along the skull into a half-crown configuration at the back of her head. The retraction is mechanical and deliberate (~2s total), accompanied by faint servo-whirs and a subtle exhaust of cooled air. As the helm retracts, her face is revealed from chin up — blonde hair first spills out at the jaw-line, then the lower face, then the eyes, finally the forehead. At 3.5s: helm fully retracted, hood of the yellow canvas jacket naturally falling into place at the back of her head.
> - **3.5–5.0s (face resolution):** First clear view of her exposed face. Hair settles around her shoulders with weight and texture. Eyes close briefly (first real blink — the swarm has not let her blink in a long time), then open direct at camera. Blood-red lipstick catches the overcast key. Face-tattoos fully visible in the light.
> - **5.0–6.5s (swarm signs emerge):** The subtle indicators of swarm-presence activate: around her green pupils, a faint iridescent Vex-shimmer layer becomes visible — the swarm is INSIDE her eyes but not controlling (yet/anymore). The BLOOD-RED ASTERISK tattoo on her cheekbone begins to glow with a cold-iridescent under-light that was not there moments ago — it PULSES ONCE with soft chromatic shimmer (pink → cyan → gold → violet traveling along the tattoo's lines over ~1 second), then settles to a faint residual glow.
> - **6.5–8.0s (speech held):** Her lips part. She is about to deliver her first VO line in her OWN voice (not the visor-routed swarm-mediated voice the player has heard through Act 1). Held beat — the audience meets the woman behind the armor. Exhale visible. Hair drifts once in a cold wind. Screen holds.
> Cinematography: gentle ~10% dolly-in across 8s — the camera leans toward her. 24fps. Film grain. Palette: overcast cold grey-green + warm yellow-jacket rim + iridescent swarm-mark pulse.

**Audio hand-off note:** Mechanical servo-whir during retraction (1.5-3.5s), soft intake of breath audio beat at 3.5s (her first real breath), subtle chromatic-shimmer audio pulse synced to the asterisk glow at 5.5s, silent beat until 7.8s when audio begins her first-line VO prelude. This cinematic is deliberately silent-to-near-silent through most of its runtime — the sound of the swarm was the noise we've been hearing this whole time, and this is the first moment it isn't speaking for her.

---

### CIN-SHADOW-TEETH — Shadow Tongue second-row-teeth reveal (4s trigger, P1)

**Output:** `apps/client/public/videos/character-sheet/shadow_tongue_second_teeth.mp4` · **Aspect:** 1:1 square · **Resolution:** 2048×2048 · **Use:** plays on specific dialog lines flagged with `revealSecondTeeth: true` in the VO manifest (reserved for revelatory lines like "I am the universe's editor")

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. Shadow Tongue in corporate bust framing (per Part 2E canon): tall androgynous executive-presenting figure, near-black violet-undertone skin, slicked-back black smoke-hair, violet slit-pupil eyes slightly too large, charcoal-to-violet pinstripe three-piece suit, deep violet silk tie with CRT-scanline pattern, "EDITOR" lanyard at lapel. Corporate night-office backdrop — floor-to-ceiling glass reflecting neon city grid, the Loredex volume visible on a dark desk in the deep background. Mouth CLOSED in the almost-correct neutral, slightly-too-wide-by-4% baseline. Fingertip violet text-glyph mist trailing at chest level. Film grain. 4K. No rendered text except the EDITOR lanyard.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. Same Shadow Tongue, same framing — but MOUTH FULLY OPEN in hyperextended configuration beyond human jaw range. Jaw dropped further than anatomically possible for a humanoid, mouth corners retracted wider than cheek geometry should allow. Inside the mouth cavity: TWO ROWS OF TEETH visible — the normal outer row, and a SECOND INNER ROW set deeper in the jaw (small, sharp, inward-curving, humanoid-adjacent but clearly wrong). Violet slit-pupil eyes have doubled in bloom intensity. Face asymmetry ramped up — cheekbones visibly offset by 8%, almost imperceptible but wrong. Fingertip violet text cascades at full intensity. Lanyard briefly reads "HIERARCHY SVP" instead of "EDITOR" (text shimmer caught at this frame). Film grain. 4K. Single rendered-text detail: "HIERARCHY SVP" on the lanyard (reserved text, only on this frame).

**VEO 3.1 MOTION PROMPT:**
> 4-second one-shot trigger cinematic. Camera locked static. This is a TIGHT BURST — the horror moment itself is ~1 second bracketed by setup and settle.
> - **0.0–1.5s (composed baseline):** Shadow Tongue holds the closed-mouth neutral pose. Fingertip text streams at baseline. He is listening. Subliminal face-asymmetry cycle continues at baseline. Viewer watches, waiting for the line.
> - **1.5–2.5s (jaw hyperextension):** The jaw OPENS — mouth opens progressively wider across 1.0 seconds, jaw dropping past anatomical human limit, cheeks pulling back wider than should be possible. Simultaneously: violet eye-glow ramps from 0.3 to 0.6 intensity. Face asymmetry spikes from baseline 0.4 to 0.8. The lanyard text begins to shimmer from "EDITOR" toward "HIERARCHY SVP."
> - **2.5–3.0s (second-row reveal):** Held at maximum hyperextension. INSIDE THE MOUTH, the second inner row of teeth becomes visible — they don't appear via VFX, they are simply THERE inside a mouth that should not open this wide. Eye-bloom hits 0.6 maximum. Lanyard fully reads "HIERARCHY SVP" on one frame at 2.7s.
> - **3.0–4.0s (settle):** Jaw returns to closed-neutral position over 1 second. Eye-bloom drops back to baseline 0.3. Face asymmetry drops back to baseline 0.4. Lanyard text shimmers back to "EDITOR." Fingertip text settles. Viewer is left uncertain whether they actually saw what they just saw. Final frame at 4.0s matches START FRAME composition almost exactly — the performance has been reset.
> Cinematography: locked static camera, no motion. All motion is subject-internal. 24fps. Film grain preserved.

**Audio hand-off note:** Sustained held note throughout (no musical movement — the music PAUSES on this beat while the VO line plays). The VO line itself (from the manifest) is timed to land on the hyperextension peak at 2.5s. A single sharp subsonic sub-bass hit at 1.5s (jaw-open beat), then silence under the voice.

---

### CIN-DEGEN-IDLE — Degen casino pit idle (10s seamless loop, P1)

**Output:** `apps/client/public/videos/casino/degen_idle_pit.mp4` · **Aspect:** 1:1 square · **Resolution:** 2048×2048 · **Use:** replaces the old CIN-013 sequined-showman Degen (audit-flagged). Plays on casino game-mode discovery screens and as ambient on the pit-boss UI panel.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 2048×2048. The Degen in close three-quarter bust (per Part 2J real canon): tall muscular blue-skinned demonic Ne-Yon figure, completely bald, pointed elf-like ears, glowing amber-orange eyes (#f57a1c emissive), red-and-blue swirling tribal tattoos across arms and neck. Wearing the olive-drab military-cut sleeveless vest with brass buttons, heavy silver chain necklaces at the throat with a brass pocket-watch pendant at mid-chest. Studded leather bracers on forearms. Pose: standing behind a dark-velvet casino roulette pit, arms crossed over his chest, watching. The pit edge is visible at the bottom of the frame with a single stack of violet-gold casino chips sitting on the rim. Backdrop: deep teal-black casino ambient with faint violet neon haze, defocused distant table silhouettes in mid-depth. Lighting: cool cyan rim from behind, warm amber from below (pit-lamp direction), the warm amber eye-glow lighting his cheekbones from within. Predatory stillness. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2) — identical to START for seamless loop:**
> *(Same prompt as START FRAME — loop is designed to cycle. Breath, eye-glow, pendant-swing, and tattoo-pulse animations happen in the motion prompt only.)*

**VEO 3.1 MOTION PROMPT:**
> 10-second seamless loop. Camera locked, no motion. Subject Degen in close three-quarter bust, predatory still.
> - **Continuous (0-10s):** Chest breathes at contained 3.2s cycle (1.000 to 1.006 peak — he is CONTAINED, not expansive). Pocket-watch pendant at his chest swings ±2px on a gentle pendulum arc synced to breath exhale — his signature idle tell.
> - **Tattoo-pulse channel (5.8s offset cycle, independent of breath):** The red-and-blue swirling tribal ink on his arms and neck INTENSIFIES slightly (+15% emissive saturation) on exhale phase of its own 5.8s cycle, and settles on inhale phase. The two rhythms (breath 3.2s + ink 5.8s) deliberately DO NOT sync — creates an unsettling liveness where his body and his ink are breathing on different clocks.
> - **2.8s:** Single slow blink — eyes close for 180ms (slower than standard). Amber eye-glow does NOT fully extinguish on closed eyelids (40% glow leaks through — he is backlit from inside his skull).
> - **4.5s:** Head turns ~3° to the left, eyes briefly track something offscreen-left, head returns to baseline over 1.2s. No other movement. The implication: he just watched someone place a bet. He is the pit.
> - **7.2s:** Second blink, same slow-180ms character.
> - **9.0s:** One finger of one crossed arm taps the opposite bicep ONCE (a single decisive tap, the "house-edge" micro-tell from his Part 2J rig). Then stillness.
> - **9.8-10.0s:** Frame position matches START for seamless loop.
> Cinematography: locked static camera. 24fps. Film grain preserved. Loop-point match at frame 240.

**Audio hand-off note:** Low subsonic ambient hum through entire loop (casino ambient — barely audible). Brass-pocket-watch tick-tock synced to breath exhales (very faint, barely perceptible). At 9.0s (the finger tap): single soft percussive tock audio beat.

---

### CIN-LIONS-MATERIALIZE — Lions Club Ceremonial armor materialization (0.8s one-shot, P1)

**Output:** `apps/client/public/videos/gear/lions_materialize_template.mp4` · **Aspect:** 1:1 square · **Resolution:** 1024×1024 · **Use:** plays each time a player with valid Lions Club membership equips a Ceremonial slot. Generic template — runtime composites the specific piece over the player's character-sheet mesh at the correct attach socket.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 1024×1024. A single equipment slot on a character sheet — dark neutral background. In the slot, a faint GOLD-LAUREL SILHOUETTE of the Ceremonial piece's shape (e.g., chest-plate silhouette for the chest slot), rendered at 40% opacity in warm gold (#d9a66a) on transparent backing. No solid armor yet — only the pre-equip placeholder. Film grain. 4K. No rendered text.

**END FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 1:1 square, 1024×1024. The same slot, now showing the fully-rendered Ceremonial piece in solid PBR: white ICL ceramic plate armor (#f0ede8) with polished brass ornamentation (#c4a040) at the joints and edges, faint engraved ICL sigil work visible, full-opacity and sharp. A faint warm-gold rim light traces the edges of the piece (the Lions Club faction rim). Same dark neutral background. Film grain. 4K. No rendered text.

**VEO 3.1 MOTION PROMPT:**
> 0.8-second one-shot gear-materialization animation. Camera locked.
> - **0.0–0.1s (gathering):** Warm gold particles (~300 of them) begin to spawn from the edges of the frame, drifting inward toward the gold-laurel silhouette target in the slot center. Baseline gold-laurel silhouette visible.
> - **0.1–0.5s (coalescing):** Particles concentrate and begin forming the shape of the Ceremonial piece. Partial solid pixel-clusters appear along the silhouette edges. From 0.1-0.5s scrub `materializationProgress` from 0.0 → 0.8 — piece resolves from particulate toward solid PBR render but edges still shimmer.
> - **0.5–0.7s (solidification):** Particle count drops from peak back to zero. The Ceremonial piece locks into full-solid PBR material. Warm-gold rim light ramps up on the edges from 0 to full Lions-faction rim intensity.
> - **0.7–0.8s (settle + hold):** Held at end frame — piece is now fully equipped and active. Rim glow steady.
> Cinematography: locked static camera, no motion. All motion is subject-internal. 60fps capture recommended to preserve particle detail. Film grain light.

**Audio hand-off note:** Soft harp-pluck ascending from 0.0-0.3s, swelling into a warm brass chord that sustains at 0.5s through end. Synchronized to the solidification moment. UI may play an additional short "equip confirm" SFX layered on top.

**Runtime note:** This video is a GENERIC TEMPLATE. The actual in-slot display uses shader-level materialization (per Part 4.1 rental-state machine) rather than playing this video literally — the video exists as a reference for tuning the shader timing and as a fallback for UI surfaces that can't render the shader. Runtime priority: shader-based materialization if supported, video fallback otherwise.

---

### 9.12 — Audit-flagged regenerations

Three existing cinematics in the SHIP_READY_ASSET_BIBLE.md were specced against wrong canon and need replacement. They are not P0 blockers (game functions without them) but MUST be replaced before any public demo using those game-modes.

#### CIN-013 Degen discovery — **DEPRECATE**

- **Old output:** `apps/client/public/videos/entities/entity_99_degen.mp4`
- **Status:** old canon (sequined carnival-barker showman) was WRONG per 2026-04-22 user correction. See Part 2J real canon.
- **Action:** replace reference everywhere in `apps/client/src/components/DiscoveryVideoOverlay.tsx` and routing code to point at CIN-DEGEN-IDLE (above). Or if a longer discovery-intro variant is needed, commission a NEW 12s one-shot version of CIN-DEGEN-IDLE with start-frame wide-establish of the casino pit pulling in to the bust composition — use same Degen canon as Part 2J.

#### CIN-031 DMC kart-line countdown — **REGENERATE**

- **Old output:** `apps/client/public/videos/game-modes/dead-mans-circuit/kart_line_countdown.mp4`
- **Old canon (wrong):** theatrical Nilmorg in checkerboard coat at a raised podium, microphone overhead, crowd silhouettes in darkness, countdown glyphs above.
- **New canon (correct):** Nilmorg as the demon-executive from Part 2P — bald pale-skinned humanoid with yellow solid-eye-orbs in a dark charcoal corporate suit. Same starting-line kart setup, but Nilmorg is now doing contracting-signatory work instead of crowd-rousing.
- **New start frame:** line of karts at a hazard-lit starting grid (unchanged from old), but the podium figure is Nilmorg in his demon-exec pose. He stands precisely still, both hands visible at chest level in his signature STEEPLED-PYRAMID FINGERTIPS gesture, yellow eye-orbs at baseline 1.0 intensity. No microphone. No theatrical grin. A stack of small ABSTRACT CONTRACT PAPERS rests on a podium-surface in front of him (small glyph-markings, not legible text). Industrial-boiler-room backdrop rim-lights from below.
- **New end frame:** drivers materialize into karts, holographic countdown-glyph suspended overhead at "3/2/1" (same stylized abstract glyphs as original), hazard lights flare in unison at red. **Nilmorg has NOT MOVED.** Steepled fingers still precisely locked. Yellow eyes track straight ahead, unblinking. One of his cybernetic-ring fingers visibly TAPS ONCE against the contract papers on the podium as the countdown resolves. Cold executive precision where theatrics should be.
- **New motion prompt:** same camera path as old (crane-down past podium to kart line), same countdown beats at 3s / 5s / 7s, but Nilmorg replaces the showman. At 9s: the finger tap on the contract papers instead of a theatrical "GO" shout. The racers are NOT being cheered on — they are being signed into the contract the race itself represents.
- **Audio:** low subsonic hum + single sharp contract-tap percussive beat at 9s. No crowd noise (boiler room is empty of spectators).

#### CIN-032 DMC severance trophy ceremony — **REGENERATE**

- **Old output:** `apps/client/public/videos/game-modes/dead-mans-circuit/severance_trophy.mp4`
- **Old canon (wrong):** theatrical Nilmorg handing a trophy with gracious smile; winner visibly severed as data-corona around them dissolves.
- **New canon (correct):** Nilmorg demon-exec from Part 2P. Same severance-mechanic beat (winner being converted to Hierarchy asset), but Nilmorg delivers it in executive cold-precision rather than MC warmth.
- **New start frame:** podium scene. Nilmorg stands to one side of the podium, steepled fingertips UNLOCKED from their default rest position (the pyramid gesture has OPENED by 3mm — his EMOTIONAL2 "contract-ready" pose from 2P.5). Winner stands on the podium, still in their racing suit, expression proud-about-to-drop. Yellow eye-orbs at 1.2 intensity — he is SEEING his acquisition.
- **New end frame:** same data-corona-dissolve and Hierarchy-emblem-gain mechanic as old (winner being severed in real-time). Nilmorg has not moved except for: one cybernetic-ring finger now EXTENDED TOWARD the winner, thumb forming a precise L with the index (the "signed" gesture — contract finalized). Yellow eyes at 1.4. The racing-suit-to-Hierarchy-emblem transition happens on the winner as it did in the old cinematic — that mechanic is unchanged. What changed: the severance is delivered by the signatory, not the showman.
- **New motion prompt:** same camera orbit as old (slow orbit around the podium). Beat at 3s: winner takes trophy. Beat at 5s: recognition-horror dawns. Beat at 7s: racing suit gains Hierarchy emblems. Beat at 9s: severance certificate completes overhead. Beat at 9.5s: **Nilmorg's index finger extends forward** (the contract-sign gesture) — this is the new beat replacing old gracious-smile moment. 24fps.
- **Audio:** low subsonic rising sustain, clean cold-bell beat at 9.5s on the finger-extend. No crowd applause. "The prize IS the severance" tone intact.

---

### 9.13 — Part 9 asset count summary

- **11 primary cinematics** — 4 loops (Elara 8s / Degen 10s / Lions template 0.8s / casino cosmetics from Part 5) + 7 one-shots (Human reveal 15s / Kael transform 14s / Kael emergence 6s / Architect ignition 6s / Programmer aging 12s / Prince→Engineer 12s / Warlord helm-retract 8s / Shadow teeth 4s)
- **3 audit regenerations** (CIN-013, CIN-031, CIN-032) — regen against corrected canon
- **Total runtime:** ~90 seconds of generated motion across the primary set; ~32 seconds of audit regens; ~55 seconds of casino cosmetics (Part 5) all in

Each primary cinematic requires: 1 Nano Banana 2 start frame + 1 Nano Banana 2 end frame + 1 Veo 3.1 motion render (or Seedance 2.0 fallback). Plus optional Suno v4 music stingers for the reveal beats flagged above.

**Estimated commission time:** 2-3 days for the 11 primary cinematics (batched start/end frame passes + Veo render passes), +1 day for the 3 regens, +1 day for iteration/approval. Total ~5 working days for the full Part 9 cinematics set.

---

## PART 10 — PRODUCTION ROADMAP + TOTAL ASSET ACCOUNTING

> **THIS FILE IS THE SINGLE PRODUCTION BIBLE** for the Living Character Sheet initiative. Parts 1-9 above are the authoritative spec. Part 10 below is the ordered commission roadmap + total asset count so producers can plan the budget and sequencing.

### 10.0 — Total asset count (grand sum)

| Category | Count | Source |
|---|---|---|
| Protagonist 3D rigs (Elara + Human busts + viseme/expression bundles) | ~80 assets | Parts 1A + 1B |
| Player 3D base meshes (4 species × 2 sexes + Ne-Yon warmachine sub-variant) | 9 meshes + shader presets | Part 1C |
| NPC 2D lip-sync bundles (22 characters × 32 images baseline + variants; CADES retracted — see 10.4) | ~718 images | Part 2 |
| Inventor's Suits 3D re-commission (18 sets × 6 rarities × 10 slots) | 1,080 GLBs | Part 3 |
| Starter gear 3D base meshes (species × class base meshes) | 40 GLBs + shader variants | Part 3.7 |
| Lions Club Ceremonial + Seasonal gear (10 ceremonial + ~160 seasonal + 3 donor trophies) | ~173 GLBs | Part 4 |
| Casino cosmetic idle loops | 8 loops | Part 5 |
| Character-sheet parallax rooms (20 base + 4 faction + 1 Eidola lecture hall) | 75 PNGs (25 rooms × 3 layers) | Part 6 |
| VFX shader-texture atlases | ~58 atlases | Part 7 |
| UI atmosphere sprites (rarity glyphs + slot frames + status icons + chrome + overlays) | ~122 sprites | Part 8 |
| Veo 3.1 cinematics (11 primary + 3 audit regens) | 14 videos | Part 9 |
| **GRAND TOTAL** | **~2,380 individual assets** (CADES retraction dropped 32 bundles) | |

### 10.1 — Commission phase ordering (P0 first, then P1, then P2)

**Phase 1 — P0 ship-blocking (~4 weeks)**
1. Week 1: Part 1A + 1B protagonist rigs (Elara 3D + Human 3D + viseme sheets + reveal cinematic)
2. Week 2: Part 1C player base meshes (8 meshes + Ne-Yon warmachine sub-variant)
3. Week 3: Part 2 high-priority NPCs (2A Agent Zero + 2B Locke + 2C Kael + 2D Antiquarian + 2E Shadow Tongue + 2F Architect)
4. Week 4: Part 9 P0 cinematics (CIN-ELARA-IDLE + CIN-HUMAN-REVEAL + CIN-KAEL-01 + CIN-KAEL-02 + CIN-ARCH-01)

**Phase 2 — P1 narrative-rich (~3 weeks)**
5. Week 5: Part 2 remaining NPCs (2G through 2W, ~17 characters in 2D lip-sync pipeline)
6. Week 6: Part 3 Inventor's Suits 3D re-commission (1,080 GLBs batched 50/day through Meshy v5 API)
7. Week 7: Part 4 Lions Club + seasonal gear (~173 GLBs) + Part 9 P1 cinematics (PROG-01, PRINCE-01, DEGEN-IDLE, LIONS-MATERIALIZE, SHADOW-TEETH)

**Phase 3 — P2 environmental + polish + Warlord reveal (~2 weeks)**
8. Week 8: Parts 5-6 casino cosmetics + parallax rooms (~83 assets) + Part 2T.9 host-face-under-helm reference still
9. Week 9: Parts 7-8 VFX atlases + UI sprites (~180 assets) + CIN-WARLORD-REVEAL-01 (8s helm-retraction, deferred from week 7 per §10.4 resolution to preserve the Act-1 faceless-mystery asset) + final regen pass (Part 9.12 audit regens) + iteration pass

**Total estimated timeline: ~9 working weeks to complete the full Living Character Sheet asset pipeline.**

### 10.2 — Ordered pre-commission checklist

Before any asset generation begins, the following reference files MUST be authored and saved to `apps/client/public/references/`:

- [ ] `protagonists/elara/front.png` + `protagonists/elara/REFERENCE.md`
- [ ] `protagonists/human/front.png` + `protagonists/human/REFERENCE.md`
- [ ] `npcs/{agent_zero,locke,source/phase-1,source/phase-2,source/phase-3,antiquarian,shadow_tongue,architect,authority,cades,collector,corey,degen,eidola,engineer_prince/phase-2,gamemaster,matrikala,meme_palimpsest_entity,minnie,necromancer,nilmorg,programmer,seer,warlord_armored,warlord_host_face,watcher}/front.png` + matching `REFERENCE.md` files
- [ ] `3d-turnarounds/{species × sex}/front|3q_left|side_left|back.png` (×8 meshes × 4 views = 32 images)
- [ ] `UV_TEMPLATE.png` for cross-species gear-fit reference
- [ ] **⚠️ Still awaiting user upload:** Prince phase 1 (engineer_prince/phase-1.png) — placeholder currently in use; final canon upload will trigger regen of CIN-PRINCE-01 start frame

Each REFERENCE.md must cite the Part 2 subsection that defines the character's canon + link to the canonical reference image + list any explicit DO-NOT-DEPICT constraints (e.g. Shadow Tongue's NEVER-BREATHE, Architect's NO-HAIR, Warlord's HELM-NEVER-REMOVED-OUTSIDE-CINEMATIC, etc.)

### 10.3 — Change log / canon corrections applied

This file has gone through multiple canonical correction passes as the user has confirmed real canon vs. outdated bible descriptions. Major corrections logged:

1. **Ne-Yon species** (2026-04-22) — blue-skinned humanoids (not mechanical war-machines by default). Chrome war-machine demoted to sub-variant.
2. **The Degen** (2026-04-22) — blue-skinned demonic warrior Ne-Yon (not genderfluid sequined carnival barker). Real canon image #2 from batch 1.
3. **The Gamemaster** (2026-04-22) — fully-mechanized cyborg skull with dual red goggle-eyepieces (not thin prosecutor in spectacles; that's a flashback form).
4. **The Seer** (2026-04-22) — winged blue-skinned angel with living wooden staff + blue crystal (not plain linen-robe + burnt wooden staff).
5. **The Watcher** (2026-04-22) — corporate three-piece suit + white Covid mask + third eye (not monastic white robes).
6. **Engineer + Prince** (2026-04-22) — MERGED as one two-phase character (Prince was the Engineer's earlier identity).
7. **Collector + Corey** (2026-04-22) — SPLIT into two distinct characters (hooded entity in observation tank + child disciple wearing Collector facemask).
8. **Eidola** (2026-04-22) — full lore rewrite as Project Sorrow survivor teaching ethics at AI-Archon school (cyberpunk dark-magic aesthetic).
9. **Matrikala** (2026-04-22) — full lore rewrite as Celebration survivor with canonical burn scars + green-glass pendant.
10. **Nilmorg** (2026-04-22) — bald pale demon in corporate suit with yellow solid-eye-orbs (not theatrical DMC kart-track checkerboard showman). Image #2 from batch 2.
11. **Palimpsest Host / the Meme** (2026-04-22, two-pass) — SAME ENTITY as the Meme, true form is corporate holo-face cybernetic-hands executive. Minnie is a child avatar. Image #1 from batch 2.
12. **The Necromancer** (2026-04-22) — cyberpunk-punk undead elf with red-lensed sunglasses (not Medusa-hair floating undead).
13. **The Warlord** (2026-04-22) — yellow armor (not brass-dusky-chrome), helm stays down through Act 1, host-face-under-helm canonized as blonde tattooed punk woman for reveal cinematic.
14. **The Antiquarian** (2026-04-22) — confirmed + refined (silver-and-dark mixed hair not pure silver; dark eyebrows never grey; open-neck shirt not cravat).
15. **The Programmer** (2026-04-22) — young cyberpunk phase with steampunk goggles + flat cap on Shibuya rooftop (not middle-aged battlefield figure).
16. **The Architect** (2026-04-22) — validated against user image #3; existing canon correct, no rewrite.
17. **CADES** (2026-04-22, post-commit codebase audit) — RETRACTED from the NPC roster. CADES = Comprehensive Analysis & Defense Engagement System (a game-mode / FPS, per `CodexPage.tsx:1163`), not a character. Part 2H canon dropped; allocated VFX atlases re-purpose as generic CRT-broadcast overlays. Effective NPC count drops from 23 to 22. Grand total drops ~32 assets.
18. **The Authority** (2026-04-22, post-commit codebase audit) — VALIDATED. VO manifest populated + Act 1 match opponent wiring confirmed. Environmental-hall + silhouette canon consistent with shipped code. No rewrite needed.
19. **Prince Phase 1** (2026-04-23) — provisionally locked the in-repo `mascoteer_prince_original.png` as canon for Phase 1 commission. User can override by dropping an alternative at `apps/client/public/references/npcs/engineer_prince/phase1_prince/front.png`. Closes the last placeholder slot.
20. **Goggle-lineage** (2026-04-23) — locked as intentional connecting motif: the red steampunk goggles are a tool of a specific technical order both the Engineer and the Antiquarian-when-young (Programmer) passed through. Optional one-sentence lore-tip can land in either character's dialog tree at writer convenience.
21. **CIN-WARLORD-REVEAL-01 timing** (2026-04-23) — locked as Act 3. Preserves the faceless-through-all-of-Act-1 mystery the rest of her canon depends on. Commissioning moves from P1 wave (weeks 5-7) to P2 wave (weeks 8-9).

### 10.4 — Open questions — ALL RESOLVED (2026-04-23)

- [x] **Prince phase 1 canonical look — RESOLVED 2026-04-23.** Provisionally locked the in-repo candidate `docs/art-originals/celebration/mascoteers/mascoteer_prince_original.png` as Phase 1 canon. Part 2V/W.3 updated from placeholder to canon with the candidate explicitly cited. User can override at any time by dropping a different image at `apps/client/public/references/npcs/engineer_prince/phase1_prince/front.png` and bumping the change log; until then, commission proceeds against the candidate. CIN-PRINCE-01 start frame can now be commissioned.

- [x] **Goggle-lineage between Engineer (2V/W) and Programmer (2R) — RESOLVED 2026-04-23 as INTENTIONAL CONNECTING MOTIF.** The red steampunk goggles are a SIGNAL-INSIGHT tool developed by a specific technical order — the same order that taught both the Programmer/Antiquarian (in his cyberpunk-Shibuya phase) AND the Engineer (in his memoir-mode phase). They are not classmates and not contemporaries — but both passed through the same technical-mystery tradition. A one-sentence lore note can land in either character's dialog tree at writer convenience: e.g. when the Engineer's goggles are equipped, an optional Antiquarian lore-tip can fire ("The lenses you wear were forged in the same workshop as my own, once. We met the truth through different fires."). Non-blocking for art commission.

- [x] **Part 2G Authority — VALIDATED.** Codebase confirms VO manifest + Act 1 match opponent wiring. Environmental-hall + silhouette canon is consistent with shipped code. No rewrite needed. Commission against spec.

- [x] **Part 2H CADES — RETRACTED.** Codebase audit (`CodexPage.tsx:1163`) reveals CADES = Comprehensive Analysis & Defense Engagement System — a game-mode / FPS, not an NPC. The 4 VFX atlases allocated to it re-purpose cleanly as generic CRT-broadcast overlays for Part 2Q Palimpsest Host + CIN-WARLORD-REVEAL-01 backdrop. Drop CADES from the 23-NPC roster; effective NPC count is now **22**.

- [x] **CIN-WARLORD-REVEAL-01 plot beat timing — RESOLVED 2026-04-23 as ACT 3.** The faceless-through-all-of-Act-1 design described in Part 2T works SPECIFICALLY because she stays unknown for most of the player's journey. Breaking the armor at Act 2 collapses the asset that the rest of her canon is built around. Preserve the mystery; spend the reveal late. Commission CIN-WARLORD-REVEAL-01 in the P2 wave (weeks 8-9 per the §10.1 roadmap), not P1.

**All four §10.4 open questions are now closed. Phase 2 art commission is no longer blocked on canon decisions.**

---

## END OF PRODUCTION BIBLE

> This document is the canonical art production bible for the Living Character Sheet initiative of Dischordian Saga. It supersedes scattered canon references in `docs/production/COMPLETE_ART_PROMPT_BIBLE.md`, `VISUAL_PRODUCTION_BIBLE.md`, `MISSING_ART_PROMPTS.md`, and the various act-specific asset builds — WHERE THOSE FILES CONFLICT WITH THIS ONE, THIS ONE WINS (per 2026-04-22 user canonical-correction passes).
>
> Updates to this file should trigger a bump to the 10.3 change log and a git commit with a `CANONICAL` tag in the message.

