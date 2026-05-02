# Dreamer-Vision Veo 3.1 Flash Production Spec

**Audience.** Producer (you). Output of this doc is three Veo 3.1 generations + three keyframe stills, drop-uploaded to the dgrsart S3 bucket.

**Why this doc.** The recruitment plan §Part 1.5 calls for three video flashes that punch through the Dreamer-Vision slideshow cutscenes (Vision 3 once, Vision 4 twice). The renderer (`apps/client/src/components/SongSlideshow.tsx`) accepts mixed image-or-video frames and falls back to the keyframe still on video-load failure, so you can ship the keyframes first and the MP4s when ready — Vision 3 + 4 will render either way.

**Where the contract lives.** The asset ids + relPaths are declared in `apps/shared/expansionArt/cinematicsManifest.ts` under the `dreamer_visions` `VfxCategory`. The art-coverage probe (`scripts/_check-art-coverage.mjs`) HEAD-checks every entry on every CI run. Once you upload, the next probe pass goes from 6 missing → 0 missing for these slugs.

**Aesthetic anchor.** All three flashes are unbranded — never include the word "Dreamer," any glyph, any signature. The Dreamer never speaks; the visions are *shown*, not narrated. The stills should feel like the frame after a thought arrives but before you can name it. Painterly palettes only — never photographic. Reference Album 1 frame palette (cel-shaded, high-contrast, oil-paint texture).

---

## Shared production parameters

| Parameter | Value |
| --- | --- |
| Resolution | 3168 × 1344 (matches Album 1 frame aspect — 21:9 ultrawide) |
| Codec | H.264 baseline + AAC if any audio (CRF 20 target) |
| Container | `.mp4` |
| Color space | Rec. 709 |
| Frame rate | 24 fps |
| Audio | None for #1 + #2 (silent, song bed pauses underneath); #3 may have its own audio (song has ended by then) |
| Mute attribute | Renderer plays with `playsInline` and `muted={false}` — silent flashes ship with no audio track at all so the absent track plays as silence, not a request to autoplay audio |
| Keyframe still (fallback) | First frame of the MP4, exported as 3168 × 1344 WebP at quality 85 |

### Output paths (must match `cinematicsManifest.ts` declarations)

| Asset | Video path | Keyframe path |
| --- | --- | --- |
| substrate_pulse | `cdn/client-public/videos/vfx/dreamer_visions/vfx_substrate_pulse.mp4` | `cdn/client-public/art/vfx/dreamer_visions/kf_substrate_pulse.webp` |
| iris_collapse | `cdn/client-public/videos/vfx/dreamer_visions/vfx_iris_collapse.mp4` | `cdn/client-public/art/vfx/dreamer_visions/kf_iris_collapse.webp` |
| cryo_frost_retreat | `cdn/client-public/videos/vfx/dreamer_visions/vfx_cryo_frost_retreat.mp4` | `cdn/client-public/art/vfx/dreamer_visions/kf_cryo_frost_retreat.webp` |

Upload via `pnpm assets:upload` (idempotent, ETag-aware) once the local files are at `apps/client/public/videos/vfx/dreamer_visions/` + `apps/client/public/art/vfx/dreamer_visions/`.

---

## Flash 1 — `vfx_substrate_pulse`

**Used by.** Vision 3 ("The Hidden Hand", threshold 13). Inserted between frames 6 and 7 of the slideshow.

**Narrative role.** First time the Dreamer's signal punches through *as system*, not as picture. The slideshow has been showing the player imagery from Album 1; this flash is the substrate underneath the imagery briefly becoming legible. The captions before are *"thirteen hands counted / the fourteenth is yours"* and the captions after open with *"do you see what you have always seen / or did the Architect tell you / what to look at"*. The flash is the "what" the Architect did not tell.

**Duration.** **3.0 seconds** (declared as `VISION_3_FLASH_DURATION_MS = 3_000` in `dreamerVisions.ts` — the renderer pauses the song bed for exactly this duration).

### Veo 3.1 prompt (paste into the Veo prompt field verbatim)

```
A cinematic ultrawide painterly close-up of a circuit-board lattice
seen at the scale of a city. The board is dark amber and obsidian,
veined with luminous cyan ink that flows along the traces like
liquid mercury. Halfway through the shot, a single bright pulse —
like a heartbeat — travels along three parallel ink-traces from
the lower-left corner to the upper-right, illuminating the entire
lattice for one frame at peak brightness, then receding. The camera
holds completely still throughout. Style: cel-shaded oil paint,
high contrast, no photographic detail, no humans, no faces, no
text, no glyphs. Lighting is the only motion. Aspect 21:9.
3 seconds. 24 fps.
```

### Motion / camera guidance

- Camera fixed; no zoom, no pan, no parallax.
- The single pulse is the only motion. It travels diagonally across the frame in ~1.5s, peaks brightness at ~1.8s, fades over the remaining 1.2s.
- No wipes, no fade-in, no fade-out at the boundaries — the renderer hard-cuts to and from the flash. Treat the first and last frame as if they could each be the held still.

### Keyframe still

- Export the **first frame** as `kf_substrate_pulse.webp` (3168 × 1344, quality 85).
- The first frame is the lattice at rest, before the pulse begins. This is what the player sees if the MP4 fails to load — a held image of the circuit board, no animation. Per the plan §Part 1.5 the flash *is* the caption, so a held still is a valid degraded experience.

### Audio

- **None.** Ship the MP4 with no audio track. The renderer pauses the song bed for the 3-second duration and resumes after.

---

## Flash 2 — `vfx_iris_collapse`

**Used by.** Vision 4 ("The Dreamer Sees You", threshold 23). The **opening** flash — fires before any image frames.

**Narrative role.** Vision 4 is the closest the Dreamer ever comes to direct address. Six frames + two flashes. The opening flash signals *the lens has changed*: until now the player has been the observer. This frame closes that lens. The first image frame after the flash is captioned *"the Dreamer is many"*.

**Duration.** **4.0 seconds**.

### Veo 3.1 prompt

```
A cinematic ultrawide painterly close-up of a single human-scaled
eye filling the entire frame. The iris is deep cyan, the pupil
black with a faint inner glow. Over four seconds the iris closes
inward at constant speed — the pupil and iris contract together
like a camera shutter, the visible eye becoming smaller and smaller
until only a thin horizontal slit of cyan remains, then black.
The closure is mechanical, smooth, irreversible. The surrounding
sclera (white of the eye) is replaced by a textured deep navy that
fills the frame. Style: cel-shaded oil paint, high contrast, no
photographic skin, no human face beyond the eye itself, no text,
no glyphs. Aspect 21:9. 4 seconds. 24 fps.
```

### Motion / camera guidance

- Camera fixed.
- Closure is the only motion. Constant rate of contraction across 4 seconds.
- Final frame: full black (the iris has closed completely). The renderer hard-cuts from the final black frame into the first image frame ("the Dreamer is many") — the cut should land *just* after full closure, never with a re-opening.
- No fade-in / fade-out at boundaries.

### Keyframe still

- Export the **first frame** (the open eye, fully visible) as `kf_iris_collapse.webp`.
- Held-still degraded experience: the player sees the open eye for 4 seconds before the next slide. That reads as "the Dreamer's gaze before it closes," which is acceptable.

### Audio

- **None.** Silent. The song bed pauses underneath.

---

## Flash 3 — `vfx_cryo_frost_retreat`

**Used by.** Vision 4 ("The Dreamer Sees You", threshold 23). The **closing** flash — fires after the last image frame, ending the cutscene.

**Narrative role.** The vision-cycle closes. After this flash the title screen returns and the player has the `dreamer_witnessed` achievement quietly written. Per the plan §Part 1.5: *"audio override allowed; the song has ended."* This is the only flash that can ship with its own audio.

**Duration.** **5.0 seconds**.

### Veo 3.1 prompt

```
A cinematic ultrawide painterly shot of frost spreading across a
large pane of dark glass, then receding. The first second: the
glass is mostly clear, with thin crystalline frost beginning to
bloom from the bottom-left corner. Seconds 2-3: the frost spreads
across the entire pane in branching dendritic patterns until the
glass is fully frosted, opaque white-blue. Seconds 3-4: the frost
holds at full coverage, motionless. Seconds 4-5: the frost retreats
in reverse — the dendritic patterns fade from outside-in, returning
the glass to clear. The camera is fixed throughout. Style: cel-
shaded oil paint, high contrast, no photographic detail, no humans,
no text, no glyphs. Aspect 21:9. 5 seconds. 24 fps.
```

### Motion / camera guidance

- Camera fixed.
- Three motion phases: spread (1-3s), hold (3-4s), retreat (4-5s). The retreat is the inverse of the spread — both are dendritic, both are silent.
- Final frame: the glass is clear again. The renderer hard-cuts from the final frame back to the title screen.

### Keyframe still

- Export the **frame at 3.5 seconds** (full frost, motionless) as `kf_cryo_frost_retreat.webp`. The first frame is too clear to read as a "the vision is closing" moment; the mid-hold frame is the iconic still.

### Audio

- **Optional.** This is the only flash where audio is permitted (per plan §Part 1.5). Recommendation: a low cyo-glass crackle on the spread + a long sustained tone on the hold + reversed crackle on the retreat. Mix at -18 dBFS so it doesn't clip when the player still has the music app open.
- If shipping silent: matches the other two flashes. Both are valid.

---

## Verification after upload

1. Run the coverage probe locally:
   ```bash
   AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... pnpm tsx scripts/_check-art-coverage.mjs
   ```
2. Look for the per-pack tally line:
   ```
   vfx-mp4                21    ← was 18 pre-upload, now 21 once the 3 flashes land
   vfx-keyframes          21    ← same; matches keyframe count
   ```
3. Manual smoke: in the dev build, force `awareness >= 23` for your account, log in. Vision 4 should fire with both flashes playing (or held-still keyframes if the MP4 produced 404).
4. Mobile smoke: the renderer uses `playsInline` for iOS Safari; verify the flashes play inline rather than fullscreen-takeover on an iPhone.

---

## Honest scope notes

- **The keyframe stills are NOT optional.** The renderer falls back to the still on video-load failure; if the still is also missing, the player sees a black frame for 3-5 seconds. Ship the stills first if Veo rendering takes longer than expected.
- **Frame size is fixed.** The slideshow renderer expects 21:9 ultrawide because that matches the Album 1 painterly frames the rest of the cutscene draws from. A 16:9 flash would letterbox-mismatch.
- **No glyphs, no text, no faces.** The plan's §"silence-shape" canon: the Dreamer never names himself. Any glyph or signature in the flash breaks that canon.
- **Once the MP4s land** the coverage probe goes green; no engineering follow-up needed. The renderer is already wired (PR #336 added the video-frame extension).
