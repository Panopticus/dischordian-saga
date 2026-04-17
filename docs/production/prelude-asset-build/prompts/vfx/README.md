# Prelude VFX Video Prompts — Seedance 2.0

This directory contains generation prompts for the 13 Prelude VFX effects that need to be rendered as video overlays. The other 22 effects are implemented as React components in `apps/client/src/components/prelude/vfx/` and do not need video generation.

## Delivery specifications (ALL videos must meet these specs exactly)

```
Resolution:     1920×1080 (16:9)
Codec:          VP9 (required for WebM)
Container:      WebM
Alpha channel:  YES — transparent background, REQUIRED for overlay compositing
Frame rate:     24 fps
Audio:          None (silent — ambient audio is separate)
Color space:    sRGB
File size:      < 2 MB per base clip (< 5 MB for loops and variants)
Naming:         Exact filename from manifest (see below) — no "_original" suffix
Destination:    apps/client/public/art/vfx/prelude/
```

### Conversion from MP4 (if Seedance outputs MP4 first)

```bash
ffmpeg -i source.mp4 -c:v libvpx-vp9 -pix_fmt yuva420p -crf 30 -b:v 0 -an output.webm
```

The `-pix_fmt yuva420p` flag is **required** to preserve the alpha channel.

### Variants

Some effects need multiple files per effect. Each variant is a separate file:
- Base: `{name}.webm`
- Variant: `{name}-{suffix}.webm`

Example: `holo-pedestal-bloom.webm`, `holo-pedestal-bloom-activation.webm`, `holo-pedestal-bloom-steady_state.webm`

## The 13 video effects

Each prompt has three components (start_frame, end_frame, motion) following the same format used for cutscenes. The frame prompts are for Nano Banana 2 (or equivalent still-image generator), and the motion prompt goes to Seedance 2.0 along with the start + end frames.

| File | Effect | Duration | Priority |
|------|--------|----------|----------|
| `iris-hatch-open.txt` | Twelve-petal brass iris opening | 3s one-shot | P0 |
| `role-wireframe-bloom.txt` | Crewmate wireframe hologram | 2.5s one-shot | P0 |
| `starfield-drift.txt` | Parallax starfield panorama | 10s loop | P0 |
| `human-palm-frost.txt` | **Frost forming into open palm shape** | 4s one-shot | **P0 — HIGHEST PRIORITY** |
| `starlight-shaft-dust.txt` | Volumetric light shaft with dust | 8s loop | P0 |
| `mission-glyph-bloom.txt` | Holographic glyph bloom | 1.5s one-shot | P0 |
| `diploma-ink-bloom.txt` | Pale-gold bloom over calligraphy | 2s one-shot | P0 |
| `memo-holo-rise.txt` | Holographic sheet rising projection | 3.5s one-shot | P0 |
| `memo-paper-drift.txt` | Paper drifting from shelf to floor | 5s one-shot | P0 |
| `log5-beam-transfer.txt` | Cyan beam tracing across room | 3s one-shot | P0 |
| `holo-pedestal-bloom.txt` | Pedestal activation + steady-state (3 files) | 3s + loop | P0 |
| `enigma-hand-on-rim.txt` | Subtle edge glow on hand contact | 2s one-shot | P0 |
| `galley-steam-residue.txt` | Steam ribbon from coffee mug (optional) | 6s loop | P1 |

All specs are from `PRELUDE_SHIP_READY_BIBLE.md` §18. Canonical colors:
- Cyan: `#22d3ee`
- Amber: `#fbbf24`
- Gold: `#fde68a`
- Deep violet: `#1e1b4b`
- Foxfire green: `#4ade80`
- Sepia: yellow-brown tones
