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
