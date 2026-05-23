# Axis-State Art — Prompt & Composition Guide

**Companion to:** `docs/production/AXIS_STATE_ART_PRODUCER_BRIEF.md`.
**Audience:** producers + art-direction AI tooling (Midjourney /
SDXL / DALL·E / Nano Banana / Imagen / human painters).

The producer brief tells you **what, where, and how to deliver**.
This document tells you **how to make each PNG match the baseline
so it overlays perfectly** — exact dimensions, the composition
lock that keeps the room recognizable across states, and a
per-axis prompt vocabulary you can paste into your generator of
choice.

---

## 1. Hard technical specs

Every PNG you deliver — baseline, axis 9, axis 11, axis 12 — must
match these specs exactly. The `compositeResolver` stacks variants
as full-canvas layers at parallax depths −0.30 (baseline) → −0.15
(axis 11); any pixel-level drift between baseline and a variant
makes the parallax-shift effect visibly "swim."

| Property | Value | Notes |
|---|---|---|
| **Resolution** | **2752 × 1536 px** | Canonical for every room shipped to date — confirmed across cryo_bay, archives, bridge, captains_quarters, trade_hub, medical_bay baselines. |
| **Aspect ratio** | 1.792 : 1 | Slightly wider than 16:9 (1.778) — do NOT crop to true 16:9. |
| **Format** | PNG | 8-bit/color RGB, non-interlaced. No alpha channel — variants are full-canvas replacements, not transparent overlays. |
| **Color profile** | sRGB | No embedded ICC outside sRGB; the client doesn't color-manage. |
| **File size** | 5–7 MB typical | Existing baselines are 5.8–7.0 MB. Avoid aggressive compression that introduces banding in the dark passages (cryo-bay shadows, archives midtones). |
| **DPI** | irrelevant | Web delivery; the client never reads DPI metadata. |
| **Bleed / safe zone** | none for room art | The `<ParallaxRoom>` component renders with `fit="contain"` by default and `fit="cover"` for some surfaces. Keep important content within the inner 92% of the canvas (≈2530 × 1413 px centered) so cover-fit crops don't cut subjects. |
| **Filename** | `state_<axis>_<value>.png` | Strict — Phase-H normaliser rejects deviations. See producer brief §"ZIP delivery convention." |

**No filename variations:** no `_v2`, no `_001`, no `_final`. One
PNG per (room, axis, state) tuple. Re-deliveries overwrite.

---

## 2. The composition lock

Variants are **full-canvas replacements**, not alpha overlays.
The compositeResolver chooses one variant per axis and renders it
at near-baseline parallax depth. The visual model is "the same
room, painted with a different mood/condition" — *not* "a
different room." If a variant moves the camera, repositions the
hero prop, or changes the architectural footprint, parallax
breaks and players read it as a discontinuity.

**Lock these from the baseline:**

- **Camera position + lens.** Same focal length, same height,
  same yaw/pitch. Lift the baseline into your generator as an
  img2img seed or composition reference at high (≥0.7) strength.
- **Architectural footprint.** Walls, floor, ceiling, doors,
  windows in identical positions. The viewer's eye should land
  on the same focal point.
- **Hero prop / furniture placement.** Beds, terminals, sarcophagi,
  workbenches — same pose, same dressings. State changes the
  *condition* (corruption, lighting, livery) not the *inventory*.
- **Horizon line + perspective vanishing points.** Pixel-aligned
  with the baseline. Test by toggling between baseline and variant
  in a viewer — if anything visibly jumps more than 1–2 px, redo.
- **Edge composition.** Keep the silhouettes of objects within
  ~5 px of their baseline positions. The parallax effect tolerates
  drift but small mismatches read as ghosting.

**Free to vary:**

- Lighting color temperature + intensity (huge range — see Axis 11).
- Material rendering of walls/props (clean → exposed → corrupted
  is a material progression).
- Particulate FX (smoke, dust, viral motes, banners, motes of light).
- Surface decoration — banners, glyphs, posters, signage (this is
  most of Axis 12).
- Background sky/window content (Axis 11 cycle-phase changes the
  sky behind windows — see "cryo_bay × cycle_dawn" reference if
  available).
- Crowd / NPC presence in the deep background — keep within the
  same silhouette envelopes if possible.

**Hard rule:** if you can swap baseline ↔ variant in a 60Hz
crossfade and a player can't tell which is "the room" and which
is "the state," the composition lock is right.

---

## 3. Workflow recipes

### A. Midjourney / DALL·E / Imagen (text-to-image with image reference)

Best when you have the baseline available as a reference image.

```
[BASELINE_IMAGE_URL]  --iw 2  --ar 1792:1000  --s 250  --v 6
<state-specific prose from §4 below>
```

- `--iw 2` (or strongest available "image weight") pins
  composition.
- `--ar 1792:1000` matches the 2752 × 1536 canvas (Midjourney
  accepts non-square; upscale to 2752 × 1536 in post if needed).
- `--s 250` (medium-high stylize) preserves the painterly look
  of the existing room art.

### B. Stable Diffusion / SDXL (img2img + ControlNet)

Best for pixel-exact composition matching.

1. Load `art/rooms/<zipDir>/baseline.png` as the img2img init.
2. ControlNet: **canny** preprocessor (high threshold ~150,
   low ~100) at strength ~0.6 to lock geometry.
3. Denoising strength: **0.30 – 0.45**. Below 0.30 the state
   barely registers; above 0.45 composition drifts.
4. Sampler: DPM++ 2M Karras, 30–40 steps.
5. Resolution: render 2752 × 1536 natively if VRAM allows;
   otherwise render 1792 × 1000 and upscale 1.536× to canvas.
6. Prompt: paste the state-specific prose from §4.
7. Negative prompt template:

   ```
   different room, different camera angle, different furniture
   placement, watermark, text overlay, low resolution, blurry,
   compression artifacts, banding
   ```

### C. Human painter (Photoshop / Procreate / Krita)

1. Open `baseline.png` as a flat layer at the bottom.
2. New layer for each state-treatment pass (color grade,
   particles, banners). Paint on layers above the baseline.
3. **Before export, flatten and re-save as 8-bit RGB PNG.** The
   loader expects RGB; an RGBA export accidentally turns the
   composite-resolver into an alpha-blend surface, which is
   not what the layer stack is designed for.
4. Filename `state_<axis>_<value>.png`. Drop into the ZIP tree
   under the room's zipDir.

---

## 4. Per-axis prompt vocabulary

Each state has a target visual treatment, a percentage budget
(how much of the canvas should visibly change), and a prose block
ready to paste into a prompt. Compose with the baseline's
existing tone; don't over-stylize.

### 4.1 Axis 9 — TV-infection (Hierarchy thought-virus)

5 states, sequential corruption. Treat as a progression: the same
TV-shaped affliction at five intensities. Visual motifs: CRT
phosphor glow, scan-lines, RGB chromatic aberration, broadcast-
static motes, displaced-pixel artifacts on edges. The "virus" is
mediated through screens — every CRT/HUD/monitor in the room is
the infection's vector.

| State | % canvas change | Visual brief |
|---|---:|---|
| `clean` | ~5% | All screens display calm corporate broadcast. Color temperature neutral. No scan-lines. Render this as the room "as designed before the virus arrived." Often visually similar to baseline; the difference is the **screens** carrying clean content where the baseline shows nothing or news-cycle content. |
| `exposed` | ~15% | Hairline scan-lines appear on screens. One or two screens flicker (paint the flicker as motion-blur sweeps). Faint chromatic-aberration fringes on screen edges. Air still clear. |
| `spreading` | ~35% | Multiple screens carry shifting RGB phosphor noise. Air carries faint pixel-shaped motes drifting toward CRTs. Wall surfaces near screens show first signs of digital-decay rasterization (a 4–8 px square mosaic creep). |
| `corrupted` | ~60% | Screens are alive with phosphor-static. Walls within 1 m of any CRT show heavy mosaic rasterization. Floor reflects screen-light in cyan/magenta chromatic bands. NPC silhouettes (if any) blur at edges as if their renderer were dropping frames. |
| `quarantined` | ~30% | Aftermath state — emergency seals. Yellow-and-black hazard tape across doorways. Screens dark, glass cracked. Hierarchy quarantine banners (red-on-grey hazard glyphs) on walls. Scan-line residue on dark glass. Read as "the virus was contained, the room is sealed." Often the most visually distinctive state — almost-monochrome with one accent color. |

**Prompt template (paste, fill state):**

```
Painting of the same [ROOM_NAME] interior, locked composition and
camera, [STATE-SPECIFIC VISUAL from table above], retaining
identical furniture placement and architectural footprint from
the source image. Painterly sci-fi illustration, muted color
palette, cinematic lighting, no text overlays, no signage other
than what's specified, no watermarks. 16:9 wide-cinema framing.
```

For example, `cryo_bay × tv_spreading`:

> Painting of the same cryo_bay interior — rows of sarcophagus
> pods, blue glow from cryo lights, central observation walkway —
> locked composition and camera. Multiple wall-mounted screens
> carry shifting RGB phosphor noise. Faint pixel-shaped motes
> drift through the air toward each CRT. Wall surfaces within
> 1m of any screen show 4-8 pixel square mosaic creep, as if the
> wall were being slowly rasterized. Retaining identical
> sarcophagus placement and walkway footprint from the source.
> Painterly sci-fi, muted blues with cyan/magenta chromatic
> fringes near screens, cinematic lighting, no text overlays,
> no signage. 16:9 wide-cinema framing.

### 4.2 Axis 11 — Cycle-phase (diurnal lighting)

5 states, lighting-only changes. **Lowest authoring overhead** —
the room geometry and furnishing stay identical; only the
windows, sky, and ambient light shift. This is the cheapest axis
to ship; a 5-PNG cryo_bay × cycle_* set is a good pilot run.

| State | % canvas change | Visual brief |
|---|---:|---|
| `dawn` | ~25% | Soft warm pink/orange light from windows or skylights. Long thin shadows raking across the floor. Color temp ~3200K through window glass, ~4500K from interior fixtures. Read as "first light." Particulate (dust motes in light shafts) gives breath. |
| `midday` | ~30% | Bright white light, 5600K, sun-equivalent. Shadows short and crisp under the camera. Interior fixtures barely register against the sun. Read as "highest visibility." |
| `dusk` | ~30% | Warm magenta/orange falling on horizontal surfaces. Color temp 2800K from windows. Interior fixtures (3200K) start to dominate. Long shadows rake the *opposite* direction from dawn. Read as "the day folding down." |
| `nightwatch` | ~35% | No sky light. Interior fixtures (2700K, low intensity) carry the room. Windows are dark with subtle reflections of the interior. Read as "the room is awake but the world outside is asleep." This is the most common "evening operations" tone. |
| `longnight` | ~40% | Deep cycle dark — the saga's canonical "Longnight." Interior light reduced to safety-fixtures only (red emergency hue, ~1900K). Windows pitch black, sometimes with faint stars or void-color. Shadows pool in the corners. Read as "the cycle has gone full dark; only what is essential is lit." |

**Prompt template (paste, fill state):**

```
Same [ROOM_NAME] interior, locked composition and camera, lit
[STATE-LIGHTING from table above]. Architecture, furniture, and
prop placement identical to the source image. Painterly sci-fi
illustration. Lighting is the only thing that changes. 16:9
wide-cinema framing.
```

### 4.3 Axis 12 — Faction-livery (which faction visibly holds the room)

8 states. Heaviest decorative authoring of the three axes —
banners, glyphs, signage, sometimes uniform-wearing crowd
silhouettes in the deep background. The geometry stays locked;
the room gets re-dressed.

Per-faction visual vocabulary:

| State | Banner colors | Iconography | Particulate / texture | Tone |
|---|---|---|---|---|
| `none` | none (or faded prior banner) | minimal, generic | dust, motes | "Between regimes." Unclaimed; the room reads as institutional but unaffiliated. |
| `hierarchy` | red-on-black, gold leaf | Hierarchy sigil (architect's compass), ranked column flags, corporate banners | clean lacquer, faint corporate-fluorescent | "The Authority has just stamped this room." Crisp, surveilled, expensive. |
| `dreamers` | indigo + violet, silver | Dreamer's spiral (Möbius / lemniscate), moon glyphs | dreamy haze, gauze veils | "A dreamer has decorated this from a half-remembered ritual." Soft, ceremonial. |
| `pureflame` | white + gold, candle-yellow accents | Pureflame icon (vertical flame in a halo), candle racks | smoke, candle haze | "The Pureflame keeps vigil here." Reverent, smoke-touched, ritual-warm. |
| `insurgency` | red + black with rebar-grey, stencil graffiti | Insurgency tag (broken circle / cell sigil), wheatpasted posters | grit, smoke, sparks | "The insurgents have taken this room." Tagged, salvaged, awake. |
| `panopticon` | grey + lens-aperture orange | Panopticon eye sigil, lens housings, surveillance-cam glyph | dust on glass, faint reflective sweeps | "The eye is here." Reflective surfaces, cameras visible, low-grade paranoia. |
| `collectors` | deep blue + bone-white | Collectors' filing glyph (folded crane / cabinet), specimen-jar labels | archival dust, faint formaldehyde | "Collected and catalogued." Museum-quiet, archival, slightly funereal. |
| `multi` | layered banners — two or three of the above visible | competing sigils overlaying each other | mixed | "More than one faction visibly co-present." Use when no single livery dominates; the room reads as contested. |

**Prompt template (paste, fill faction):**

```
Same [ROOM_NAME] interior, locked composition and camera, now
visibly held by the [FACTION_NAME]. Re-dress with [BANNER_COLORS
+ ICONOGRAPHY + PARTICULATE from table above]. Walls and overhead
surfaces carry [FACTION] banners. Geometry, furniture, and prop
placement identical to the source image — only the dressing and
signage change. Painterly sci-fi, muted base palette with [FACTION]
accent color, cinematic lighting, no English text on banners
(stylized glyph only). 16:9 wide-cinema framing.
```

For `multi`: name two or three factions (e.g. "Hierarchy and
Insurgency visibly co-present — Hierarchy banners on the rear
wall, insurgency stencils on the foreground pillar"). The
visual tension is the point.

---

## 5. Validation checklist (per PNG, before ZIP-up)

Run through before adding any PNG to the producer ZIP:

- [ ] Exactly **2752 × 1536**. (Verify with `file
      <path>.png` or your image tool's properties panel.)
- [ ] **8-bit RGB**, no alpha channel. (PNG export → "RGB" not
      "RGBA.")
- [ ] **sRGB** color profile (or no profile — the client treats
      missing as sRGB).
- [ ] Filename matches `state_<axis>_<value>.png` exactly:
      `state_tv_corrupted.png`, `state_cycle_dawn.png`,
      `state_faction_panopticon.png`. Strict snake-case for both
      axis name and state name.
- [ ] Open `baseline.png` and your new PNG side-by-side. Toggle
      back and forth. Architecture should not jitter; hero props
      should not jump. If they do, redo with stronger
      composition lock.
- [ ] No text overlays in any language. Banners use stylized
      glyphs only (the saga's typography is in-engine).
- [ ] No watermarks, no signatures.
- [ ] File size in the 4–8 MB range (5–7 MB typical). Compress
      with `pngquant --quality 85-95` if you exceed 10 MB.

A producer can deliver one PNG, one room, one axis — there's no
minimum batch size. The audit script tightens the ratchet for
every (room, axis, state) tuple that lands.

---

## 6. Smallest pilot drop (recommended first ZIP)

To exercise the entire pipeline end-to-end with minimal art
investment:

**5 PNGs, cryo_bay × cycle, all 5 states.**

- `cryo_bay/state_cycle_dawn.png`
- `cryo_bay/state_cycle_midday.png`
- `cryo_bay/state_cycle_dusk.png`
- `cryo_bay/state_cycle_nightwatch.png`
- `cryo_bay/state_cycle_longnight.png` (already exists — re-deliver
  if the producer wants to apply the locked-composition standard
  to it consistently, otherwise skip)

cryo_bay was chosen because:
- It's the player's first room — instant validation when they
  enter the saga.
- Cycle-phase is the cheapest axis (lighting only, no decoration).
- The baseline ships with deep cool blues — the dawn / dusk
  warm variants will be visually most different and demonstrate
  the system clearly.

Once the pilot ZIP lands, runs through Phase-H ingest, and the
axis11 ratchet shrinks by 4 (`midday/dawn/dusk/nightwatch`
added; `longnight` already present), the same workflow can scale
to the full 633 PNGs across rooms and axes.

---

## 7. Reference image links (working URLs)

For seed / img2img / composition-reference workflows:

```
Cryo Bay   baseline: https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/cryo_bay/baseline.png
Cryo Bay   longnight: https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/cryo_bay/state_cycle_longnight.png
Archives   baseline: https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/archives/baseline.png
Bridge     baseline: https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/bridge/baseline.png
Trade Hub  baseline: https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/trade_hub/baseline.png
Medical    baseline: https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/medical_bay/baseline.png
```

The full per-axis room roster is in
`docs/production/AXIS_STATE_ART_PRODUCER_BRIEF.md` §"Rooms in
scope" — pull baseline URLs by substituting the room slug into
`https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/<slug>/baseline.png`.

---

## 8. What can go wrong (and how to catch it)

| Symptom | Cause | Fix |
|---|---|---|
| Variant overlay "swims" during parallax shift in `<ParallaxRoom>` | Composition drift > 5 px from baseline | Redo with tighter img2img lock (denoise ≤ 0.40) or stronger ControlNet (≥ 0.7) |
| Client renders nothing where the variant should land | PNG saved as RGBA — the compositeResolver expects RGB | Re-export flattened 8-bit RGB |
| Variant ignored entirely | Filename doesn't match `state_<axis>_<value>.png` exactly | Rename; the Phase-H normaliser is strict |
| State reads as "wrong faction / wrong cycle" | Visual treatment too subtle — under the % budget in §4 | Push the state harder; the canvas is 2752 × 1536 — small accents disappear at typical viewing zoom |
| Banner text visible in English / Latin letters | Generator hallucinated readable glyphs | Negative prompt: `text, letters, english, signage` — or paint over banner text in post |
| File size > 15 MB | Insufficient compression | Run through `pngquant --quality 85-95` or save with PNG-24 + selective dithering |

---

## 9. Sanity script (post-delivery, before ZIP-up)

Quick local check producers can run on a delivery folder:

```bash
# Check every PNG in a delivery folder is 2752x1536 RGB.
find <delivery_folder> -name '*.png' -print0 \
  | xargs -0 -I {} file {} \
  | awk '!/2752 x 1536, 8-bit\/color RGB/ {print "FAIL:", $0}'
```

Empty output = every PNG is conformant. Any line = redo that
PNG before ZIPing.

---

## 10. Summary

- **2752 × 1536 px, 8-bit RGB PNG.** Non-negotiable.
- **Lock composition from baseline.** Same camera, same
  architecture, same hero props. Variants change condition,
  lighting, and dressing — not geometry.
- **Axis 9 (tv):** corruption progression. Screens are the
  vector. 5%→60%→back-to-30% canvas-change budget across the
  clean→corrupted→quarantined arc.
- **Axis 11 (cycle):** lighting-only. Cheapest to author; best
  pilot.
- **Axis 12 (faction):** re-dress. Banners + glyphs +
  particulate, geometry locked.
- **Filename strict.** `state_<axis>_<value>.png`, snake_case,
  no version suffixes.
- **Pilot drop:** 5 PNGs, cryo_bay × cycle. Validates the whole
  pipeline.

When in doubt, the rule is: **if you can crossfade baseline ↔
variant and a player can't tell which is "the room," the
composition lock is right.**
