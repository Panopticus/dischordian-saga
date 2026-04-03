# DISCHORDIAN SAGA — Art Production Bible

## Overview

This document contains every art asset needed across the entire Dischordian Saga
application, organized by priority. Each asset includes exact specifications and
AI image generation prompts optimized for Midjourney/DALL-E/Flux.

**Tools Recommended:**
- **NanoBanna 2** — Character art, creatures, environments
- **Magnific AI** — Upscaling generated images to production resolution
- **Remove.bg or Photopea** — Background removal for sprites

**Global Style Guide:**
- Dark sci-fi aesthetic with bio-mechanical horror elements
- Color palette: deep blacks, dark purples, toxic greens, corrupted reds, cold cyans
- Lighting: dramatic rim lighting, glowing energy effects, volumetric fog
- No text in generated images (we overlay text in code)
- Transparent backgrounds for all sprites (PNG with alpha)

---

## PRIORITY 1: Terminus Swarm (Tower Defense)

### 1A. Enemy Sprites (12 + 2 bosses)

**Format:** 96×96 PNG, transparent background
**Upscale to:** 256×256 with Magnific, then downscale to 96×96 for crisp detail
**Style:** Mechanical demon insectoid hybrids. Part machine, part undead insect.
Bio-organic armor plating mixed with corroded metal. Glowing green/red viral veins.

---

**1. Undead Grub** (Tier 1 — swarm fodder)
```
Tiny insectoid larva creature, biomechanical design, corroded metal exoskeleton
mixed with pale rotting flesh, small segmented body, glowing green eyes,
mechanical mandibles, undead appearance, dark sci-fi horror style,
top-down game sprite perspective, dark background, dramatic lighting,
96x96 pixel art style but rendered in high detail
```

**2. Plague Ant** (Tier 2 — poison trail)
```
Medium insectoid soldier creature, biomechanical ant-like form, six mechanical legs
with corroded bronze plating, abdomen dripping toxic green ichor, compound eyes
glowing sickly yellow, mandibles fused with metal pincers, corrupted organic
carapace with circuit-like veins pulsing green, dark sci-fi horror aesthetic,
top-down game sprite, transparent background
```

**3. Infected Spore** (Tier 2 — flying, explodes)
```
Floating biomechanical spore pod, translucent membrane with visible viral
particles inside, pulsing green bioluminescence, trailing tendrils of infection,
mechanical core visible through organic shell, hovering/flying pose,
sci-fi horror pathogen design, game sprite top-down view, transparent background
```

**4. Corrupt Mantis** (Tier 3 — fast, dodges)
```
Sleek predatory insectoid, mantis-like biomechanical hunter, elongated limbs with
razor-sharp metallic blade arms, aerodynamic corrupted exoskeleton in dark teal,
glowing cyan sensor eyes, speed lines implied by pose, crouched and ready to strike,
dark sci-fi horror insect warrior, game sprite top-down, transparent background
```

**5. Rot Crawler** (Tier 3 — armored, slow)
```
Massive heavily armored beetle-like creature, thick corroded iron plating over
decomposing organic mass, multiple short stubby mechanical legs, front-facing
battering ram horn of fused metal and bone, glowing red cracks in armor showing
internal corruption, slow tank-like siege beast, dark sci-fi horror,
game sprite top-down, transparent background
```

**6. Venom Wasp** (Tier 3 — flying, fast)
```
Aggressive flying wasp-like biomechanical creature, iridescent corrupted wings
with circuit patterns, sleek yellow-and-black mechanical body, oversized stinger
dripping purple venom, compound eyes burning orange, in aggressive flight pose,
dark sci-fi horror insect, game sprite top-down, transparent background
```

**7. Bile Hulk** (Tier 4 — massive HP, explodes on death)
```
Bloated grotesque biomechanical monstrosity, swollen translucent abdomen filled
with toxic green-yellow bile visible through stretched membrane, stumpy mechanical
legs barely supporting massive body, corroded metal plates on back, open mouth
with rows of mechanical teeth, pustules and boils across surface, about to burst,
dark sci-fi body horror, game sprite top-down, transparent background
```

**8. Infected Reaper** (Tier 4 — armored, cleaves)
```
Elite biomechanical warrior insectoid, tall imposing stance, massive scything
blade-arms made of fused bone and corrupted metal, heavy segmented armor
with red pulsing viral veins, skull-like face plate with glowing red eyes,
battle-scarred carapace, death incarnate pose, dark sci-fi horror elite warrior,
game sprite top-down, transparent background
```

**9. Neural Parasite** (Tier 4 — disables turrets)
```
Ethereal horror floating creature, jellyfish-like biomechanical form with
trailing psionic tendrils, translucent head dome showing pulsing brain-like
neural mass inside, purple bioluminescent glow, tendrils of thought-virus
energy reaching outward, psychic horror aesthetic, flying/hovering pose,
dark sci-fi horror, game sprite top-down, transparent background
```

**10. Swarm Queen** (Tier 5 — spawns minions)
```
Massive insectoid queen, elongated biomechanical abdomen constantly birthing
smaller creatures, regal corrupted crown of fused metal and chitin, four
powerful arms with different weapons (blade, claw, tendril, shield),
commanding presence, surrounded by smaller organisms, dark royal purple
and toxic green color scheme, dark sci-fi horror hive matriarch,
game sprite top-down, transparent background
```

**11. Hive Tyrant** (Boss — regenerates, spawns)
```
Colossal apex predator insectoid, towering biomechanical horror, massive
armored carapace with regenerating organic tissue visible in wounds,
four arms ending in different organic weapons, head crowned with bony
horns and multiple glowing red eyes, legs like industrial pistons,
trails of corruption in its wake, absolute terror incarnate,
dark sci-fi horror final boss creature, game sprite top-down, transparent background
```

**12. Avatar of The Source** (Final Boss)
```
Nightmarish manifestation of sentient plague, vaguely humanoid but
fundamentally alien, body made of writhing viral tendrils and corrupted
machinery, a dark crown of neural connections, eyes that are windows
to infinite corruption, ground around it decaying, mechanical and organic
components in constant flux, the physical form of a planet-spanning
consciousness, ultimate dark sci-fi horror entity, red and black
with pulsing green viral energy, game sprite top-down, transparent background
```

---

### 1B. Turret Sprites (8 types)

**Format:** 128×128 PNG, transparent background
**Upscale to:** 256×256 with Magnific, then downscale
**Style:** Salvaged Inception Ark technology. Industrial sci-fi. Repurposed
ship systems. Mix of polished metal and battle-worn surfaces.

---

**1. Pulse Cannon** (Basic turret)
```
Small automated defense turret, industrial sci-fi design, rotating barrel
on a circular base plate, blue energy glow from the barrel tip, salvaged
spaceship technology aesthetic, riveted metal panels, status light indicators,
mounted on floor plate, top-down game view, transparent background
```

**2. Arc Emitter** (Chain lightning)
```
Tesla coil-like defense turret, twin electrical prongs crackling with
cyan lightning arcs between them, circular base with capacitor banks,
salvaged spaceship electrical system repurposed as weapon, sparking
energy effects, industrial sci-fi, top-down game view, transparent background
```

**3. Cryo Array** (Slow enemies)
```
Cryogenic cooling turret, cluster of frost-covered cooling pipes pointing
outward from central hub, ice crystal formations on the emitter tips,
cold blue mist emanating, repurposed life support cooling system,
frost and ice aesthetic, industrial sci-fi, top-down game view,
transparent background
```

**4. Flame Projector** (Area DOT)
```
Flamethrower turret, industrial nozzle mounted on swivel base, flame
pilot light visible, fuel line connections to base, heat shimmer effect,
orange-red glow from barrel, repurposed engine exhaust system, heavy duty
industrial construction, sci-fi, top-down game view, transparent background
```

**5. Missile Battery** (Long range, splash)
```
Missile launcher turret, quad-tube missile rack on rotating platform,
targeting dish on top, armored housing with blast shields, one tube
showing loaded missile with red warhead visible, military-grade spaceship
weapons system, heavy and imposing, industrial sci-fi,
top-down game view, transparent background
```

**6. Shield Pylon** (Buffs nearby turrets)
```
Energy shield generator, tall hexagonal crystal projector on reinforced
base, translucent green energy shield bubble emanating from top,
circular glowing ring around base, spaceship shield generator
technology, protective and supportive appearance, green glow,
industrial sci-fi, top-down game view, transparent background
```

**7. EMP Mine** (Stun enemies)
```
Electromagnetic pulse device, low-profile disc-shaped mine on floor,
concentric rings of metal with central yellow pulsing core, warning
chevrons on the housing, crackling static electricity arcs,
emergency countermeasure device, industrial hazard aesthetic,
yellow warning colors, top-down game view, transparent background
```

**8. Nanite Swarm** (Heals turrets)
```
Repair drone hub, small circular platform with multiple tiny metallic
drones hovering above it in a cloud formation, green repair beam effects,
holographic maintenance interface projecting upward, automated repair
system, helpful and constructive appearance, green and silver,
industrial sci-fi, top-down game view, transparent background
```

---

### 1C. Map Backgrounds (2 maps minimum)

**Format:** 1920×1080 PNG
**Style:** Interior of a crashed Inception Ark. Dark corridors, flickering
emergency lights, hull breaches showing alien sky, debris, damaged panels.

**1. Landing Bay**
```
Interior of a massive crashed spaceship landing bay, viewed from above
at slight angle, dark metallic floor with grid lines visible, emergency
red lighting, hull breach in one wall showing dark alien sky beyond,
scattered debris and wreckage, flickering holographic displays,
damaged support columns, industrial sci-fi environment,
dark moody atmosphere with volumetric fog, suitable as game background
```

**2. Corridor B**
```
Long narrow spaceship corridor interior from above, dark metal walls
with exposed wiring and sparking conduits, emergency lighting strips
along floor creating eerie glow, blast doors partially jammed open,
alien biological growth starting to creep along walls (thought virus
infection), claustrophobic atmosphere, industrial sci-fi horror,
suitable as game background
```

---

### 1D. Towers of Hanoi Gears

**Format:** Various sizes (64px to 192px wide), transparent background
**Style:** Bronze/copper mechanical gears, steampunk-meets-sci-fi

**Gear Set (5 sizes)**
```
Mechanical gear/cog, copper and bronze metal, precision machined teeth,
slight patina and age marks, sci-fi mechanical component, clean design
with visible engineering quality, warm metallic tones, [SIZE] gear,
isolated on transparent background, studio lighting, photorealistic
```
Generate 5 variations at different sizes: tiny, small, medium, large, extra-large.

---

### 1E. Terminus Planet

**Format:** 512×512 PNG, transparent background

```
Dark corrupted rogue planet floating in the void of space, no star
illuminating it, surface covered in glowing red-green viral infection
patterns visible from orbit like circuitry on the surface, dark
atmosphere with toxic green clouds, biomechanical structures visible
on surface, crashed spaceship wreckage visible as tiny dots on surface,
ominous and dread-inducing, the epicenter of a cosmic plague,
dark sci-fi horror aesthetic, transparent background
```

---

## PRIORITY 2: Dischordia Card Game

### 2A. Card Back Design

**Format:** 600×900 PNG

```
Ornate card back design for a dark sci-fi trading card game called
Dischordia, centered geometric pattern combining mechanical gears
and organic viral tendrils, the pattern radiates from a central
eye-like symbol, color scheme of deep purple and dark cyan with
gold filigree borders, mysterious and premium feeling, no text,
symmetrical design, suitable for card game reverse side
```

### 2B. Pack Wrapper Art (3 seasons)

**Format:** 600×900 PNG each

**Season 1: Genesis**
```
Trading card game booster pack wrapper design, "Genesis" theme,
dark sci-fi aesthetic, central image of an Inception Ark ship
emerging from a portal, cyan and teal energy effects, metallic
foil-like border treatment, premium collectible packaging feel,
dark background with star field, no readable text
```

**Season 2: Schism**
```
Trading card game booster pack wrapper design, "Schism" theme,
dark sci-fi aesthetic, central image showing two factions splitting
apart with a crack of purple energy between them, one side order
(blue/gold), one side chaos (red/purple), dramatic fracture line
composition, metallic border, premium packaging feel, no text
```

**Season 3: Convergence**
```
Trading card game booster pack wrapper design, "Convergence" theme,
dark sci-fi aesthetic, central image of multiple faction symbols
being drawn together into a single point of blinding orange-gold
light, dramatic energy convergence effect, all factions represented
as colored energy streams, metallic border, premium feel, no text
```

---

## PRIORITY 3: Branding & UI

### 3A. Dischordian Saga Logo

**Format:** SVG or 2000×600 PNG, transparent background

```
Logo design for "Dischordian Saga", dark sci-fi video game branding,
futuristic angular font style, the word "DISCHORDIAN" larger with
"SAGA" smaller underneath, subtle glitch/corruption effect on the
letters, cyan glow on edges, dark chrome metallic texture on letter
faces, small geometric emblem between the words (hexagonal eye symbol),
transparent background, suitable for dark backgrounds
```

### 3B. Dischordia Sub-Logo

**Format:** SVG or 1200×400 PNG, transparent background

```
Logo for "Dischordia" tactical card game, subset of Dischordian Saga,
angular futuristic font, letters have subtle cracks revealing different
faction colors underneath (cyan, purple, orange, green, red, gold),
minimalist design, game logo suitable for title screens,
transparent background
```

### 3C. Terminus Swarm Sub-Logo

**Format:** SVG or 1200×400 PNG, transparent background

```
Logo for "Terminus Swarm" tower defense game, angular militaristic font,
letters formed from mechanical insectoid elements, red and dark metal
color scheme, subtle corruption/infection spreading across the text,
threatening and intense atmosphere, game title suitable for splash screens,
transparent background
```

---

## PRIORITY 4: Cinematics (Video)

These are opportunities for you to create short video cinematics using
your video creation skills. Listed in narrative order:

### 4A. Comms Room Discovery (10-15 sec)
**Trigger:** Player solves Towers of Hanoi puzzle
**Scene:** The comms array powers on with cascading gear sounds. Static
fills the screen. Through the static, a desperate voice breaks through.
Red warning lights flash. A star map appears showing a distant rogue planet.
**Mood:** Discovery, dread, urgency

### 4B. First View of Terminus (15-20 sec)
**Trigger:** Player first launches Terminus Swarm
**Scene:** Camera pushes through space toward a dark planet with no star.
As it gets closer, the surface glows with viral infection patterns. Crashed
Inception Arks are visible scattered across the surface. The Thought Virus
tendrils are visible crawling over the wreckage.
**Mood:** Horror, isolation, scale of the catastrophe

### 4C. Hive Tyrant Introduction (10 sec)
**Trigger:** Wave 10 boss encounter
**Scene:** Ground trembles. Camera shakes. From the hive tunnels, the
massive Hive Tyrant emerges. Close-up of its face — multiple eyes,
mechanical mandibles. It lets out a roar that distorts the audio.
**Mood:** Terror, awe, "oh no" moment

### 4D. The Source Reveal (20-30 sec)
**Trigger:** Wave 20 final boss
**Scene:** Deep beneath the surface of Terminus. A chamber of fused
metal and organic matter. At the center, a figure — once human, now
something far worse. Kael, the Recruiter, transformed into Patient Zero.
The Source speaks: "I was the first to see the truth. Now you will too."
**Mood:** Revelation, existential horror

### 4E. First Wave Discovery (20-30 sec)
**Trigger:** After completing wave 10 for the first time
**Scene:** Data logs from Ark #25 play back. The first Potentials landed
on Terminus thinking it was habitable. They went underground. They found
The Source. One by one, they were infected. The last log shows a Potential
screaming as viral tendrils reach for their face.
**Mood:** Tragic revelation, horror

---

## ASSET DELIVERY SPECIFICATIONS

### File Naming Convention
```
{game}_{category}_{name}_{size}.png

Examples:
terminus_enemy_undead-grub_96.png
terminus_turret_pulse-cannon_128.png
terminus_map_landing-bay_1920x1080.png
dischordia_card-back_600x900.png
dischordia_pack_season1_600x900.png
branding_logo_dischordian-saga_2000x600.png
```

### Color Reference (Hex)

| Element | Color | Hex |
|---------|-------|-----|
| Thought Virus | Toxic Green | #44cc44 |
| Thought Virus Glow | Sickly Yellow-Green | #88cc44 |
| Ark Technology | Cold Cyan | #00bcd4 |
| Corruption | Deep Red | #cc2244 |
| Neural/Psionic | Purple | #aa44dd |
| Salvage/Metal | Amber/Bronze | #cd7f32 |
| Viral Ichor | Acid Green | #66aa22 |
| Void Energy | Dark Cyan | #0088aa |
| The Source | Blood Red | #ff0044 |
| Empire/Architect | Gold | #ff8c00 |
| Dreamer | Cyan | #00bcd4 |
| Insurgency | Orange | #ff6600 |
| New Babylon | Purple | #9c27b0 |
| Antiquarian | Teal | #009688 |

### Resolution Pipeline
1. Generate at highest available resolution
2. Upscale with Magnific AI to 4x if needed
3. Remove background (for sprites) using remove.bg or manual masking
4. Export as PNG with alpha transparency
5. Downscale to target size using bicubic resampling
6. Verify on dark background (all assets display on near-black backgrounds)

---

## TOTAL ASSET COUNT

| Category | Count | Priority |
|----------|-------|----------|
| Enemy sprites | 12 | P1 |
| Turret sprites | 8 | P1 |
| Map backgrounds | 2+ | P1 |
| Hanoi gears | 5 | P1 |
| Terminus planet | 1 | P1 |
| Ark wreckage shot | 1 | P1 |
| Card back | 1 | P2 |
| Pack wrappers | 3 | P2 |
| App logo | 1 | P3 |
| Sub-logos | 2 | P3 |
| Cinematics | 5 | P4 |
| **TOTAL** | **41 assets** | |

---

*Last updated: Session 01Gpmvt9893MfBsehFMfkZ3z*
*Generated by Claude Code for the Dischordian Saga project*
