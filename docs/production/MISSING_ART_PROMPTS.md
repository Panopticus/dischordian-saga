# MISSING ART PROMPTS — Batch Generation Queue

> **10 art assets** referenced in code but not yet generated.
> Each entry includes the exact file path, dimensions, format,
> and a ready-to-paste NanoBanna 2 / Midjourney prompt.
>
> **Global Style**: Dark sci-fi, Void Energy aesthetic, Blade Runner meets Mass Effect
> **Global Negative**: `cartoon, anime, low quality, blurry, watermark, flat lighting, illustration, painting`
> **Process**: Generate at 2x target resolution → Magnific upscale if needed → downscale for crisp detail
> **Tools**: NanoBanna 2 (primary), Magnific AI (upscaling), Remove.bg / Photopea (transparency)

---

## 1. ARENA DEFAULT — Neutral Fighting Stage

**Path:** `apps/client/public/art/arenas/arena-default.jpg`
**Size:** 1920×1080 JPG
**Referenced in:** `assetPreloader.ts` — `/fight` and `/pvp` route preload
**Usage:** Fallback arena background when no character-specific stage is assigned

```
A neutral sci-fi fighting arena interior, wide combat platform of dark brushed titanium
with glowing cyan grid lines embedded in the floor, four angular support pillars at
corners with pulsing energy conduits, a circular observation gallery above with empty
seats behind dark tinted glass, volumetric fog drifting across the floor, dramatic
overhead spotlights creating pools of white light on the fighting surface, dark void
beyond the arena boundaries, adaptable neutral-toned environment that can accept any
color-temperature overlay, industrial combat architecture, hyper-realistic, cinematic
composition, 8K detail, dark sci-fi aesthetic --ar 16:9 --v 6.1 --s 750 --q 2
```

**Post-processing:** Save as JPG (quality 90). No transparency needed. Ensure neutral
color balance so CSS ambient-color overlays (orange, red, purple, cyan) tint correctly.

---

## 2. HEALTH BAR — Fighting Game UI Element

**Path:** `apps/client/public/art/ui/health-bar.png`
**Size:** 512×64 PNG, transparent background
**Referenced in:** `assetPreloader.ts` — `/fight` route preload
**Usage:** Health bar UI overlay during PvP combat encounters

```
A horizontal sci-fi health bar UI element, sleek metallic frame with beveled edges,
interior gradient fill from bright green on the left through amber to red on the right,
hexagonal segmented divisions along the bar, small holographic tick marks at 25% intervals,
subtle circuit-trace engraving on the metal frame, glowing cyan accent line along the top
edge, dark sci-fi HUD aesthetic, game UI design, transparent background,
high detail --ar 8:1 --v 6.1 --s 250 --q 2
```

**Post-processing:** Remove.bg for clean transparency. Trim to exact bar bounds.
Export as PNG with alpha. The bar fill will be masked/clipped in code — the asset
only needs to provide the frame and full-health gradient reference.

---

## 3. CHESS PIECES SPRITE SHEET

**Path:** `apps/client/public/art/chess/pieces-sprite.png`
**Size:** 768×256 PNG, transparent background (6 columns × 2 rows)
**Referenced in:** `assetPreloader.ts` — `/chess` route preload
**Usage:** Fallback sprite sheet for chess pieces (CDN individual pieces are primary)

```
A sprite sheet of sci-fi chess pieces arranged in a 6×2 grid, top row white pieces
bottom row black pieces, left to right: King Queen Bishop Knight Rook Pawn,
each piece rendered as a holographic crystalline sculpture with internal energy glow,
white pieces emit warm amber light and black pieces emit cool indigo light,
elegant futuristic redesign of classic chess silhouettes, each piece approximately
128×128 pixels with transparent gaps between, dark sci-fi aesthetic,
game asset sprite sheet, transparent background, sharp detail
--ar 3:1 --v 6.1 --s 500 --q 2
```

**Post-processing:** Remove.bg for transparency. Ensure each piece is centered in its
128×128 cell. Final export 768×256 PNG. Individual pieces are also available via
CloudFront CDN — this sprite sheet serves as a preload/fallback.

---

## 4. CHESS BOARD — Holographic Playing Surface

**Path:** `apps/client/public/art/chess/board.png`
**Size:** 1024×1024 PNG
**Referenced in:** `assetPreloader.ts` — `/chess` route preload
**Usage:** Base chess board texture (companion to existing `chess-holographic-board.png`)

```
A top-down view of a holographic chess board, 8×8 grid of alternating squares,
light squares rendered as translucent amber-gold holographic panels with faint circuit
traces, dark squares rendered as deep indigo-black panels with subtle star-field
texture visible through the surface, thin glowing cyan lines separating each square,
the board floating on a dark void with soft ambient glow underneath, edge frame of
brushed dark titanium with corner energy nodes, hyper-realistic holographic game board,
dark sci-fi aesthetic, sharp geometric precision --ar 1:1 --v 6.1 --s 750 --q 2
```

**Post-processing:** Ensure perfectly square output. The board must read clearly
at small sizes — contrast between light and dark squares is critical.
Export as 1024×1024 PNG.

---

## 5. TRADE FRAME — Trading Interface Border

**Path:** `apps/client/public/art/ui/trade-frame.png`
**Size:** 1024×768 PNG, transparent background
**Referenced in:** `assetPreloader.ts` — `/trade` route preload
**Usage:** Decorative frame/border surrounding the trade window interface

```
An ornate sci-fi trading terminal frame border, rectangular with rounded inner corners,
constructed of dark brushed bronze metal with New Babylon trade guild insignia
(balanced scales with one side weighted) at the top center, purple and gold accent
lighting along the inner edge, holographic price ticker strip running along the top
inner border, diplomatic seal watermarks in the corner panels, the interior is completely
transparent (cut out), luxurious dark commerce aesthetic mixing opulent gold with
corporate purple, game UI decorative frame, transparent background
--ar 4:3 --v 6.1 --s 500 --q 2
```

**Post-processing:** Remove.bg / Photopea — ensure the interior of the frame is fully
transparent. Only the border frame itself should be opaque. Export as PNG with alpha.

---

## 6. GRID TILE — Tower Defense Placement Cell

**Path:** `apps/client/public/art/td/grid-tile.png`
**Size:** 64×64 PNG, transparent background
**Referenced in:** `assetPreloader.ts` — `/terminus` route preload
**Usage:** Repeating tile texture for the Terminus Swarm tower defense grid

```
A single square sci-fi floor tile viewed from directly above, industrial grating pattern
with a hexagonal mesh center, dark gunmetal base with subtle green-tinted edge glow,
four small corner bolts, faint circuit traces running to the edges suggesting power
connectivity, the tile should read as "placeable turret foundation", worn industrial
surface with micro-scratches, dark sci-fi military infrastructure aesthetic,
game tile sprite, transparent background --ar 1:1 --v 6.1 --s 250 --q 2
```

**Post-processing:** Remove.bg for transparency. Downscale to exactly 64×64.
The tile must seamlessly repeat when placed in a grid — ensure edges align.
Consider generating at 512×512 and downscaling for maximum crispness.

---

## 7. ROOM — Archives Reading Room

**Path:** `apps/client/public/art/rooms/room-archives.png`
**Size:** 1920×1080 PNG
**Referenced in:** `WitnessingHubPage.tsx`, `Act1CardLadderPage.tsx`
**Usage:** Background for the Witnessing Hub and Act 1 Card Ladder — the ship's archival library
**Color accent:** Amber (#f59e0b)

```
Hyper-realistic archives reading room aboard a deep-space vessel, heavy wooden-metal
hybrid desk with scattered manuscripts and data tablets, floating holographic data
crystals slowly orbiting a central reader device, the Antiquarian's personal workspace
with brass magnifying apparatus, bookends holding physical leather-bound volumes
alongside luminous digital storage crystals, warm amber reading lamp casting a golden
pool of light contrasting with cold blue crystal glow from endless vertical data tower
shelves receding into darkness behind, thousands of glowing data crystals on shelves
stretching impossibly high creating a galaxy effect, scholarly order amid technological
wonder, the collected knowledge of a civilization stored in this room, dust motes
visible in lamplight, photorealistic textures, volumetric lighting, cinematic
composition, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

**Post-processing:** Export as 1920×1080 PNG. Used as a `LivingBackground` with 4
amber particles at 10% opacity overlaid in code.

---

## 8. ROOM — Bridge Command Center

**Path:** `apps/client/public/art/rooms/room-bridge.png`
**Size:** 1920×1080 PNG
**Referenced in:** `ResponsiveImage.tsx` (component example / default fallback image)
**Usage:** Ark bridge — the ship's command center

```
Hyper-realistic spaceship bridge command center, captain's elevated chair at center
facing a massive panoramic viewport showing stars and a distant ringed gas giant,
semicircular array of holographic control consoles with floating blue displays,
tactical table with 3D star map projection, overhead status boards showing ship
systems in cyan and amber readouts, brushed titanium floor with illuminated path
strips in soft blue, multiple crew stations visible but unoccupied, dark with console
glow providing most illumination, a forgotten coffee mug on one console edge,
the bridge of a vessel that has traveled too far and too long, photorealistic
surfaces, volumetric lighting, cinematic sci-fi interior, 8K detail
--ar 16:9 --v 6.1 --s 750 --q 2
```

**Post-processing:** Export as 1920×1080 PNG. May also be used with the
ResponsiveImage component's WebP optimization pipeline.

---

## 9. ROOM — Observation Deck

**Path:** `apps/client/public/art/rooms/room-observation-deck.png`
**Size:** 1920×1080 PNG
**Referenced in:** `VortexIncursionPage.tsx`
**Usage:** Background for the Vortex Incursion narrative game mode
**Color accent:** Violet (#a78bfa)

```
Hyper-realistic observation deck interior aboard a deep-space vessel, curved transparent
dome ceiling revealing a breathtaking panoramic view of swirling purple and gold nebula
gas clouds and distant star clusters, minimal sparse seating arranged for contemplation,
a single brass telescope on a tripod pointing upward through the dome, reflective dark
floor mirroring the cosmic vista above, the most peaceful room on the ship now tinged
with unease as faint violet vortex distortions shimmer at the dome edges, soft indirect
lighting from the dome's metal frame, a single small alien succulent with bioluminescent
leaf tips on the railing — the only living green thing on the entire ship, architectural
beauty in service of cosmic wonder, photorealistic glass and metal textures, volumetric
stellar glow, cinematic composition, 8K detail --ar 16:9 --v 6.1 --s 750 --q 2
```

**Post-processing:** Export as 1920×1080 PNG. Used as a `LivingBackground` with 5
violet particles and scanlines enabled in code.

---

## 10. DARREN FESSLER BADGE — Memorial Portrait

**Path:** `apps/client/public/art/crew/darren-fessler-badge.png`
**Size:** 512×512 PNG, transparent background
**Referenced in:** `darrenMemorial.ts` — THE ASSISTANT memorial card art
**Usage:** Portrait badge for the in-memoriam Dischordia card honoring Darren Fessler

**Character Reference:**
- Late 30s male, perpetually tired, kind eyes behind black-rimmed glasses
- Ill-fitting charcoal cardigan over a Palimpsest crew polo shirt
- Carries a clipboard (the one "the Host was not allowed to see")
- Segment Producer on "The Palimpsest" — the uncredited script doctor who held things together
- The only crew member the Shadow Tongue could not successfully edit from reality
- Posthumous tribute — tone should be solemn, respectful, warm

```
Portrait badge of a tired but kind man in his late 30s, black-rimmed glasses slightly
askew, charcoal cardigan over a dark crew polo with a small embroidered logo, holding
a well-worn clipboard close to his chest, gentle apologetic expression, warm amber
lighting from the left casting a golden glow on his face, dark void background fading
to transparency, a faint holographic memorial border around the portrait in soft gold,
subtle lens flare suggesting remembrance, the face of someone who held everything
together and was never credited, cinematic memorial portrait, solemn warmth,
photorealistic, transparent background --ar 1:1 --v 6.1 --s 750 --q 2
```

**Post-processing:** Remove.bg for clean transparency. The memorial gold border
should remain. Export as 512×512 PNG with alpha. This asset appears on the
THE ASSISTANT card — a memorial-rarity Dischordia card unlocked after Episode 12.

---

## BATCH GENERATION CHECKLIST

| # | Asset | Path | Size | Format | Status |
|---|-------|------|------|--------|--------|
| 1 | Arena Default | `art/arenas/arena-default.jpg` | 1920×1080 | JPG | Pending |
| 2 | Health Bar | `art/ui/health-bar.png` | 512×64 | PNG alpha | Pending |
| 3 | Chess Pieces Sprite | `art/chess/pieces-sprite.png` | 768×256 | PNG alpha | Pending |
| 4 | Chess Board | `art/chess/board.png` | 1024×1024 | PNG | Pending |
| 5 | Trade Frame | `art/ui/trade-frame.png` | 1024×768 | PNG alpha | Pending |
| 6 | Grid Tile | `art/td/grid-tile.png` | 64×64 | PNG alpha | Pending |
| 7 | Archives Room | `art/rooms/room-archives.png` | 1920×1080 | PNG | Pending |
| 8 | Bridge Room | `art/rooms/room-bridge.png` | 1920×1080 | PNG | Pending |
| 9 | Observation Deck | `art/rooms/room-observation-deck.png` | 1920×1080 | PNG | Pending |
| 10 | Darren Badge | `art/crew/darren-fessler-badge.png` | 512×512 | PNG alpha | Pending |

**Estimated generation time:** ~30 minutes for all 10 assets (2-3 attempts each)
