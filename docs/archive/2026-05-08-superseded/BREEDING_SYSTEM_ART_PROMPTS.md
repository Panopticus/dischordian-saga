# BREEDING SYSTEM ART PROMPTS — Batch Generation Queue

> Art assets needed for the Crew Genetics & Breeding system.
> The system is fully functional in code — these visuals bring it to life.
>
> **Global Style**: Dark sci-fi, Void Energy aesthetic, Blade Runner meets Mass Effect
> **Global Negative**: `cartoon, anime, low quality, blurry, watermark, flat lighting, illustration, painting`
> **Tools**: NanoBanna 2 (primary), Magnific AI (upscaling), Remove.bg / Photopea (transparency)

---

## SECTION 1: GENETIC TEMPLATE PORTRAITS (8)

Each template needs a 512×512 PNG portrait with transparent background.
These appear in the BreedingSelector, OffspringReviewModal, and CloneFromTemplateModal.

### 1A. Terran Prime (Human)

**Path:** `cdn/crew/templates/tpl-terran-prime.png`
**Size:** 512×512 PNG, transparent background

```
Portrait of a baseline human in a deep-space crew uniform, male or female,
mid-30s, weathered but adaptable expression, mixed ethnicity suggesting
genetic diversity, short practical hair, standard-issue dark grey flight
suit with subtle cyan status indicators on the collar, warm skin tones
under cold ship lighting, determined but approachable gaze, the face of
someone who survives everything, photorealistic sci-fi crew portrait,
dark void background, dramatic rim lighting, transparent background
--ar 1:1 --v 6.1 --s 750 --q 2
```

### 1B. Demagi Ashborn

**Path:** `cdn/crew/templates/tpl-demagi-ashborn.png`
**Size:** 512×512 PNG, transparent background

```
Portrait of a Demagi Ashborn, humanoid with warm bronze-red skin bearing
faint glowing ember-like veins beneath the surface, thermal resonance
visible as a subtle orange heat-shimmer around their form, dark eyes
with molten amber irises, ritual scarification marks on cheekbones and
forehead in geometric patterns, short dark hair with red-ember highlights
at the tips, wearing dark leather-and-metal armor with arcane rune
engravings that faintly glow orange, inner flame aesthetic, the face of
someone forged by ritual fire, dark sci-fi portrait, dramatic warm
rim lighting from internal heat, transparent background
--ar 1:1 --v 6.1 --s 750 --q 2
```

### 1C. Quarchon Observer

**Path:** `cdn/crew/templates/tpl-quarchon-observer.png`
**Size:** 512×512 PNG, transparent background

```
Portrait of a Quarchon Observer, tall humanoid with pale translucent skin
showing faint dimensional refraction patterns beneath the surface like
light through a prism, large eyes with layered irises that show multiple
focal planes simultaneously, high angular cheekbones, no visible hair
but a smooth cranial ridge with subtle phase-shift shimmer, wearing a
dark indigo observation suit with crystalline sensor arrays at the temples,
expression of unsettling calm intelligence, seeing across dimensions,
the face of someone who perceives reality in layers, purple and cyan
dimensional glow, dark sci-fi portrait, transparent background
--ar 1:1 --v 6.1 --s 750 --q 2
```

### 1D. Abyssal Bloodsworn

**Path:** `cdn/crew/templates/tpl-abyssal-bloodsworn.png`
**Size:** 512×512 PNG, transparent background

```
Portrait of an Abyssal Bloodsworn, humanoid with pale grey skin and
visible dark crimson veins pulsing beneath the surface carrying Blood
Weave energy, sharp predatory features with angular jaw and pronounced
brow, eyes with deep red sclera and black irises, small horn-like
protrusions at the temples fused with dark metallic plating, teeth
slightly too sharp, wearing dark bone-and-metal armor with Hierarchy
of the Damned insignia, expression of controlled menace, predator
held in check, the face of demonic genetic stock, dark maroon and
black color palette, dramatic red rim lighting, sci-fi horror portrait,
transparent background --ar 1:1 --v 6.1 --s 750 --q 2
```

### 1E. Voltari Stormborn

**Path:** `cdn/crew/templates/tpl-voltari-stormborn.png`
**Size:** 512×512 PNG, transparent background

```
Portrait of a Voltari Stormborn, humanoid with deep violet-blue skin
and visible electromagnetic current running in branching lightning
patterns across their neck and jawline, eyes crackling with faint
violet-white electrical discharge, short silver-white hair standing
slightly on end from static charge, wearing a conductive dark flight
suit with exposed circuit-trace patches at the shoulders and forearms,
expression of sharp alertness like a living conductor sensing every
signal, the face of someone from the storm-world Violetta, purple
and electric-white palette, dramatic violet rim lighting with tiny
lightning arcs, dark sci-fi portrait, transparent background
--ar 1:1 --v 6.1 --s 750 --q 2
```

### 1F. Construct Lattice

**Path:** `cdn/crew/templates/tpl-construct-lattice.png`
**Size:** 512×512 PNG, transparent background

```
Portrait of a Construct Lattice entity, a humanoid form assembled from
interlocking dark gunmetal geometric plates and lattice-work segments,
visible internal glow at the joints in cool slate-blue, face constructed
from precision-machined panels with two optical sensors that emit soft
white light where eyes would be, no mouth but a speaker grille at the
lower face plate, subtle nano-repair filaments visible at panel seams,
the look of a machine that chose consciousness, Architect-era design
language with hexagonal motifs, expression conveyed through eye-light
intensity and head tilt, dark metallic and slate palette, dramatic
cool lighting, dark sci-fi portrait, transparent background
--ar 1:1 --v 6.1 --s 750 --q 2
```

### 1G. Void Echo Hybrid (Ne-Yon)

**Path:** `cdn/crew/templates/tpl-void-echo-hybrid.png`
**Size:** 512×512 PNG, transparent background

```
Portrait of a Void Echo Hybrid, a humanoid showing traits from multiple
species simultaneously — one eye warm amber like the Demagi and one eye
cool cyan like a Terran, skin that shifts between warm bronze and cool
pale in patches, faint quantum shimmer at the edges of their silhouette
as if their form is not fully committed to one reality, mixed features
that are beautiful but unsettling in their impossibility, short dark
hair with individual strands that seem to phase in and out, wearing
a dark experimental bodysuit with the Collector's seal on the chest,
expression of brilliant instability, the face of too much potential,
emerald and void-black palette with prismatic edge-glow, dark sci-fi
portrait, transparent background --ar 1:1 --v 6.1 --s 750 --q 2
```

### 1H. Terminus Reclaimed

**Path:** `cdn/crew/templates/tpl-terminus-reclaimed.png`
**Size:** 512×512 PNG, transparent background

```
Portrait of a Terminus Reclaimed human, a survivor who endured Thought
Virus exposure, pale scarred skin with faint amber-gold antibody
luminescence visible at the temples and along the jaw, eyes with golden
flecks in otherwise grey irises, expression of haunted resilience,
short-cropped hair with premature grey streaks, visible scarring on
the neck where viral infection was fought off, wearing a battered dark
hazmat-style crew suit with amber quarantine markings and a cracked
but functional bio-filter collar, the face of someone who paid the
price of survival, amber and muted earth tones, dramatic warm-gold
rim lighting, dark sci-fi portrait, transparent background
--ar 1:1 --v 6.1 --s 750 --q 2
```

---

## SECTION 2: INCUBATION POD STATES (4)

Each pod state needs a 512×768 PNG showing a vertical cloning pod.
These appear in IncubatorMonitor.tsx.

### 2A. Pod — Empty

**Path:** `cdn/crew/pods/pod-empty.png`
**Size:** 512×768 PNG, transparent background

```
A vertical cylindrical cloning pod in dormant state, dark transparent
glass tube on a heavy industrial metal base and cap, interior completely
dark and empty, no fluid, status lights on the base panel are dim grey
and unlit, faint dust motes visible inside, cable conduits connecting
to the floor, the pod is waiting for a template, cold and clinical,
medical bay aesthetic, dim blue-grey ambient lighting, photorealistic
sci-fi cloning equipment, transparent background
--ar 2:3 --v 6.1 --s 750 --q 2
```

### 2B. Pod — Gestating

**Path:** `cdn/crew/pods/pod-gestating.png`
**Size:** 512×768 PNG, transparent background

```
A vertical cylindrical cloning pod actively growing a humanoid form,
glass tube filled with warm amber-gold suspension fluid that glows
softly from internal bioluminescence, a small translucent humanoid
silhouette visible forming inside the fluid — not yet fully defined,
umbilical-like nutrient cables connecting to the form, cyan scanning
light sweeping slowly up the pod from external sensors on the frame,
status panel on the base showing active readouts with cyan indicators,
subtle bubbles rising through the amber fluid, warm amber interior
glow contrasting with cool cyan medical scanning light, the miracle
of manufactured life in progress, photorealistic sci-fi cloning pod,
transparent background --ar 2:3 --v 6.1 --s 750 --q 2
```

### 2C. Pod — Ready

**Path:** `cdn/crew/pods/pod-ready.png`
**Size:** 512×768 PNG, transparent background

```
A vertical cylindrical cloning pod with a fully formed humanoid body
floating serenely inside, eyes closed, perfectly still, amber-gold
suspension fluid now warmed to a soft golden glow, the body is healthy
and complete, status panel on the base showing all-green indicators,
a bright green ready-light strip running up both sides of the pod frame,
nutrient cables gently detaching, the glass surface showing condensation
from the warmth inside, the moment before birth — quiet and perfect,
warm gold interior with vibrant green status lighting, photorealistic
sci-fi cloning pod, transparent background
--ar 2:3 --v 6.1 --s 750 --q 2
```

### 2D. Pod — Malfunction

**Path:** `cdn/crew/pods/pod-malfunction.png`
**Size:** 512×768 PNG, transparent background

```
A vertical cylindrical cloning pod in critical malfunction state,
glass tube containing cloudy dark amber fluid with visible impurities,
the form inside is indistinct and wrong — flickering, degraded,
red warning lights flashing on the base panel and along the frame,
hairline cracks in the glass with small amber fluid leaks, sparking
electrical discharge from a damaged conduit at the base, emergency
hazard stripes on the floor around the pod, the pod's genetic integrity
has failed, red and dark amber crisis palette, photorealistic sci-fi
cloning equipment in distress, transparent background
--ar 2:3 --v 6.1 --s 750 --q 2
```

---

## SECTION 3: BLOODLINE HOUSE CRESTS (9)

Each house needs a 256×256 PNG heraldic crest/emblem in its signature color.
These appear in BreedingSelector bloodline picker and CrewRosterPage houses tab.

### 3A–3I. House Crests

**Size:** 256×256 PNG each, transparent background
**Style suffix for all:** `heraldic emblem, metallic engraving, sci-fi coat of arms, dark background, transparent background --ar 1:1 --v 6.1 --s 500 --q 2`

| # | House | Color | Prompt core |
|---|-------|-------|-------------|
| 3A | House Resonance | #22d3ee Cyan | `Cyan glowing sound-wave ripple pattern forming a circular crest, digital echo motif, resonance frequency visualization` |
| 3B | House Ashkari | #ef4444 Red | `Red burning flame contained within a forged iron shield crest, ritual fire and geometric scarification patterns etched in metal` |
| 3C | House Vigil | #dc2626 Dark Red | `Dark crimson watchtower silhouette within a circular crest, eternal flame at the peak, vigilant eye motif, blood-red metal` |
| 3D | House Parallax | #a855f7 Purple | `Purple crystalline prism crest refracting light into dimensional layers, temporal spiral motif, seeing-beyond-the-veil aesthetic` |
| 3E | House Voltane | #8b5cf6 Violet | `Violet lightning bolt contained within a conductor coil crest, electromagnetic storm motif, crackling energy arcs` |
| 3F | House Lattice | #64748b Slate | `Slate-grey interlocking hexagonal lattice forming a geometric crest, machine-precision construction, architectural solidity` |
| 3G | House Synthesis | #10b981 Emerald | `Emerald green double-helix DNA strand weaving through a harmony symbol crest, organic and digital fusion, synergy motif` |
| 3H | House Aegis | #f59e0b Amber | `Amber-gold shield crest with bio-hazard trefoil transformed into a protective ward, survivor's strength, quarantine-to-fortress motif` |
| 3I | House Mol'Kari | #991b1b Maroon | `Dark maroon demonic horned skull crest with Blood Weave tendrils wrapping the base, abyss-forged metal, Hierarchy of the Damned insignia` |

---

## SECTION 4: BREEDING UI BACKGROUNDS (3)

### 4A. Incubator Bay Background

**Path:** `cdn/crew/bg/incubator-bay.jpg`
**Size:** 1920×1080 JPG

```
Hyper-realistic interior of a spaceship cloning bay, rows of vertical
cylindrical cloning pods receding into the background, some pods dark
and empty while others glow with warm amber suspension fluid, cold
blue-white clinical overhead lighting contrasting with warm amber pod
glow, industrial metal flooring with drainage grates, medical monitoring
stations between pods showing holographic readouts, the Ark's medical
bay at 3am — quiet and sacred, DNA helix hologram rotating slowly above
a central console, condensation on metal surfaces, volumetric fog at
floor level, cinematic sci-fi medical facility, 8K detail
--ar 16:9 --v 6.1 --s 750 --q 2
```

### 4B. Genetic Archive Background

**Path:** `cdn/crew/bg/genetic-archive.jpg`
**Size:** 1920×1080 JPG

```
Hyper-realistic interior of the Collector's genetic archive vault, a
circular chamber with eight illuminated specimen alcoves arranged around
the perimeter — each alcove contains a glowing genetic sample canister
in a different color (cyan, red, dark red, purple, violet, slate, emerald,
amber), a central holographic display table projecting a rotating 3D
DNA double-helix, dark obsidian walls with the Collector's cataloguing
inscriptions in faint gold, reverential museum-like atmosphere with
dramatic spotlight on each alcove, the collected genetic heritage of
a dozen species preserved in darkness, cinematic composition, 8K detail
--ar 16:9 --v 6.1 --s 750 --q 2
```

### 4C. Family Tree Background

**Path:** `cdn/crew/bg/family-tree.jpg`
**Size:** 1920×1080 JPG

```
Hyper-realistic holographic family tree visualization floating in a dark
command chamber, branching lines of light connecting portrait nodes in
a generational hierarchy, bloodline colors flowing through the connection
lines (cyan, red, purple, amber, emerald), older generations at the top
fading into dimmer nodes while recent generations glow brightly at the
bottom, genetic trait symbols floating as small icons near each node,
the tree of a civilization being rebuilt from genetic blueprints,
holographic display with depth and parallax, dark void background with
constellation-like quality, cinematic data visualization, 8K detail
--ar 16:9 --v 6.1 --s 750 --q 2
```

---

## SECTION 5: CINEMATIC KEYFRAMES (2 pairs for CIN-042)

Start/end frames for Kling video generation. First Clone Born sequence.

### 5A. CIN-042 Start — Empty Pod at 3am

**Path:** `cdn/crew/cinematics/cin042_start.png`
**Size:** 1920×1080 PNG

```
Interior of the Ark's medical bay at 3am, dim blue emergency lighting,
a single active cloning pod at center frame gently humming, the pod is
filled with amber suspension fluid but the form inside is barely visible
— just the faintest suggestion of a shape beginning to coalesce, Elara's
holographic form standing beside the pod in translucent cyan light, her
hand reaching toward the glass but not yet touching, her expression is
one of unfamiliar tenderness — an AI experiencing something like hope
for the first time, cold medical blue ambient mixed with warm amber pod
glow and cyan holographic light, volumetric haze, film grain, anamorphic
lens flare, cinematic wide shot, the quiet before a miracle, 8K detail
--ar 16:9 --v 6.1 --s 750 --q 2
```

### 5B. CIN-042 End — First Life

**Path:** `cdn/crew/cinematics/cin042_end.png`
**Size:** 1920×1080 PNG

```
Interior of the Ark's medical bay, same angle as start frame but now
the cloning pod glows with intense warm golden light, a tiny perfect
humanoid body is fully formed floating in the amber fluid, eyes closed
in serene pre-birth sleep, Elara's holographic hand is now pressed flat
against the glass, her cyan form reflected in the amber surface, a single
holographic tear tracking down her translucent cheek, the pod's status
panel shows all-green indicators, the golden light from inside the pod
illuminates the entire bay with warmth that was not there before, the
first new life aboard the Ark in centuries, volumetric golden glow,
film grain, anamorphic lens flare, cinematic emotional climax, 8K detail
--ar 16:9 --v 6.1 --s 750 --q 2
```

---

## BATCH GENERATION CHECKLIST

| # | Asset | Count | Size | Format | Status |
|---|-------|-------|------|--------|--------|
| 1A–1H | Genetic Template Portraits | 8 | 512×512 | PNG alpha | Pending |
| 2A–2D | Incubation Pod States | 4 | 512×768 | PNG alpha | Pending |
| 3A–3I | Bloodline House Crests | 9 | 256×256 | PNG alpha | Pending |
| 4A–4C | UI Backgrounds | 3 | 1920×1080 | JPG | Pending |
| 5A–5B | CIN-042 Keyframes | 2 | 1920×1080 | PNG | Pending |
| **Total** | | **26** | | | |
