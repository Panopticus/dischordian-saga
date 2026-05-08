# Parallax Room Layers — Art Production Bible

> **Style**: Hyper-realistic science fiction. Photorealistic materials, volumetric lighting, cinematic depth.
> **Format**: 2048×1152 PNG — foreground/background layers need transparency for parallax compositing
> **Process**: Generate full scene → separate into 3 layers via Photopea/Photoshop → export each with alpha
> **Midjourney params**: `--ar 16:9 --v 6.1 --s 750 --q 2`
> **Negative**: `cartoon, anime, low quality, blurry, watermark, flat lighting, illustration`

Each room has 3 depth layers that shift relative to mouse/gyroscope input:
- **Background** (depth -0.3): distant elements visible through windows/gaps, moves OPPOSITE to input
- **Midground** (depth 0): the room itself, stays static (anchor layer)
- **Foreground** (depth 0.3): close objects at frame edges, moves WITH input

Generate each layer 10% larger than viewport (2048×1152) to account for parallax offset without showing edges.

---

## Room 1: Cryo Bay

### Background Layer
```
Deep space nebula view through frosted viewport window, distant blue and purple nebula with scattered stars, viewed through thick scratched glass with ice crystal formations on edges, cold void of space beyond, frost patterns on glass surface, hyper-realistic deep space photography through frozen window, volumetric cold mist, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

### Midground Layer
```
Hyper-realistic cryo pod bay interior, rows of hexagonal cryogenic pods receding into distance, pods have frosted glass lids with status displays showing vital signs, ice crystals forming on metal surfaces, cold blue emergency lighting from floor strips, condensation dripping from ceiling, medical monitoring equipment between pods, military-grade industrial design, photorealistic metal and ice textures, volumetric cold fog at floor level, 8K cinematic interior --ar 16:9 --v 6.1 --s 750 --q 2
```

### Foreground Layer (transparent background)
```
Close-up frost and condensation on glass surface in foreground, ice crystals sharp and detailed, water droplets, edge of a nearby cryo pod visible at left frame, medical monitoring cable at right frame, emergency light casting blue glow on frost, extreme depth of field with foreground elements sharp and background implied to be out of focus, hyper-realistic macro frost photography, transparent background behind elements --ar 16:9 --v 6.1 --s 750 --q 2
```

---

## Room 2: Bridge

### Background Layer
```
Panoramic starfield through massive bridge viewport, thousands of stars with a dominant ringed gas giant planet in the distance, subtle lens flare from a nearby sun, deep space majesty, the infinite viewed from a command position, hyper-realistic space photography, volumetric star glow, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

### Midground Layer
```
Hyper-realistic spaceship bridge command center, captain's elevated chair center, semicircular array of holographic control consoles with floating blue displays, tactical table with 3D star map projection, overhead status boards showing ship systems, brushed titanium floor with illuminated path strips, multiple crew stations visible, dark with console glow providing most illumination, cinematic sci-fi bridge interior, photorealistic surfaces, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

### Foreground Layer (transparent background)
```
Edge of a command console in sharp foreground detail, holographic readout floating at frame edge showing navigation data, blinking indicator lights in red and blue, a forgotten coffee mug on console edge, cable conduit running along ceiling at top of frame, extreme close detail on brushed metal and glowing buttons, hyper-realistic sci-fi interface detail, transparent background --ar 16:9 --v 6.1 --s 750 --q 2
```

---

## Room 3: Medical Bay

### Background Layer
```
Wall of bio-scan displays and medical readouts on far wall, cascading vital sign waveforms in green and blue, X-ray holographic scans of alien anatomies, specimen jars with preserved organisms on illuminated shelves, cold clinical white-blue backlighting, medical data streaming, hyper-realistic hospital technology wall, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

### Midground Layer
```
Hyper-realistic sci-fi medical bay interior, central examination table with retractable surgical arms above, robotic surgical equipment folded to ceiling, diagnostic scanning ring around table, glass-fronted pharmaceutical cabinets, stainless steel everything, emergency crash cart, bio-containment equipment, harsh clinical lighting with subtle green tint, sterile and intimidating, photorealistic medical surfaces, 8K cinematic --ar 16:9 --v 6.1 --s 750 --q 2
```

### Foreground Layer (transparent background)
```
IV drip stand with glowing blue fluid in foreground left, articulated medical scanner arm extending from right frame, surgical tray with precision instruments visible at bottom edge, bio-hazard containment warning stripe on foreground pillar, sharp detail on medical instruments and tubing, hyper-realistic medical equipment close-up, transparent background --ar 16:9 --v 6.1 --s 750 --q 2
```

---

## Room 4: Engineering

### Background Layer
```
Massive reactor core visible through reinforced blast shield window, swirling blue-orange plasma energy contained in magnetic field rings, the beating heart of the ship, immense power barely controlled, emergency containment warnings around the viewport, deep industrial glow, hyper-realistic nuclear fusion reactor, volumetric energy glow, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

### Midground Layer
```
Hyper-realistic spaceship engineering deck, multi-level catwalks and pipe systems, massive conduits running floor to ceiling, tool stations with equipment scattered, welding sparks frozen in air, pressure gauges and valve wheels, industrial grating floor with visible lower level, yellow caution stripes on edges, emergency lighting mixed with work lamps, grease and wear visible on surfaces, lived-in industrial workspace, photorealistic, 8K cinematic --ar 16:9 --v 6.1 --s 750 --q 2
```

### Foreground Layer (transparent background)
```
Burst of steam from pressure vent at left frame edge, thick cable bundle running diagonally across upper frame, yellow-black hazard stripe on foreground railing, dripping condensation from overhead pipe, close-up texture of worn industrial metal with rivet detail, emergency valve wheel at frame edge, hyper-realistic industrial close-up detail, transparent background --ar 16:9 --v 6.1 --s 750 --q 2
```

---

## Room 5: Archives

### Background Layer
```
Endless vertical data tower shelves receding into darkness, thousands of glowing data crystals on shelves stretching impossibly high, faint blue light from crystals creating a galaxy effect, the collected knowledge of a civilization stored in darkness, library of babel meets server farm, hyper-realistic data storage architecture, volumetric crystal glow, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

### Midground Layer
```
Hyper-realistic archives reading room, heavy wooden-metal hybrid desk with scattered manuscripts and data tablets, floating holographic data crystals slowly orbiting a central reader device, the Antiquarian's personal workspace with magnifying apparatus, bookends holding physical volumes alongside digital storage, warm amber reading lamp contrasting cold crystal glow, scholarly order amid technological wonder, photorealistic textures, 8K cinematic --ar 16:9 --v 6.1 --s 750 --q 2
```

### Foreground Layer (transparent background)
```
Stack of ancient physical books at left frame edge, leather spines with alien text, magnifying apparatus with brass fittings extending from right frame, floating data crystal passing through foreground casting prismatic light, dust motes visible in reading lamp light, close-up texture on aged paper and polished brass, hyper-realistic scholarly close-up detail, transparent background --ar 16:9 --v 6.1 --s 750 --q 2
```

---

## Room 6: Observation Deck

### Background Layer
```
Breathtaking panoramic nebula and galaxy view, vast cosmic vista with swirling purple and gold gas clouds, distant star clusters, a binary star system visible in upper quadrant, the overwhelming beauty and scale of deep space, awe-inspiring cosmic photography, hyper-realistic deep space nebula, volumetric stellar glow, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

### Midground Layer
```
Hyper-realistic observation deck interior, curved transparent dome ceiling revealing space above, minimal sparse seating arranged for contemplation, single brass telescope on tripod pointing upward, reflective dark floor mirroring the stars above, the most peaceful room on the ship, architectural beauty in service of wonder, soft indirect lighting from dome frame, photorealistic glass and metal, 8K cinematic --ar 16:9 --v 6.1 --s 750 --q 2
```

### Foreground Layer (transparent background)
```
Metal railing in foreground with frost condensation, single green potted plant on railing ledge — the only living green thing on the entire ship — small alien succulent with bioluminescent leaf tips, droplets of condensation on curved glass dome edge at top of frame, close-up detail showing the contrast between cold metal and warm life, hyper-realistic botanical detail, transparent background --ar 16:9 --v 6.1 --s 750 --q 2
```

---

## Asset Summary

| Room | Layers | Format | Total Files |
|------|--------|--------|-------------|
| Cryo Bay | 3 (BG + Mid + FG) | PNG | 3 |
| Bridge | 3 | PNG | 3 |
| Medical Bay | 3 | PNG | 3 |
| Engineering | 3 | PNG | 3 |
| Archives | 3 | PNG | 3 |
| Observation Deck | 3 | PNG | 3 |
| **Total** | | | **18** |

## Layer Separation Process

1. Generate the full room scene as a single image using the Midground prompt
2. Generate the Background separately (space/distant view)
3. Generate Foreground elements on solid color background → Remove.bg for transparency
4. Composite and verify in Photopea that layers don't have visible seams
5. Each layer should be 2048×1152 to allow 10% parallax overflow
