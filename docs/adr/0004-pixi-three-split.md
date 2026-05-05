# ADR-0004 — Pixi for cards, Three for scenes

Status: accepted

## Context

We have two visual surfaces with different needs:

- **Card duels** — 2D, layered sprites, lots of small animations,
  needs to render predictably across mobile GPUs.
- **Cinematic scenes / 3D character models** — 3D, post-processing,
  shaders, parallax, depth-of-field.

Options:

- **Pixi only** — works for cards beautifully; 3D scenes would need
  a custom layer.
- **Three only** — works for 3D; flat 2D cards become heavy and
  janky compared to Pixi's batched sprite renderer.
- **Both** — heaviest bundle but best per-surface fit.

## Decision

Both. Pixi handles the card duel surface (`game/duelyst/...`),
Three handles 3D character models and scene effects (`game/CharacterModel3D.ts`,
`shaders/`).

## Consequences

- Two libraries to learn, two animation paradigms.
- Bundle cost: vendor-pixi + vendor-three are separate chunks
  (`vite.config.ts` `manualChunks`); each loads only when its
  surface mounts.
- Quality-tier gating: `getQualityTier()` disables shader overlays
  on low-power devices, falls back to CSS effects.
- Pixel-ratio clamp at 2× across both engines.
- The downside: every team member needs to know which engine owns
  which surface, and we can't share render-pipeline tricks (e.g.,
  bloom in Three doesn't help Pixi).

## Alternatives considered

- **All Three** — explored briefly; the card-duel UI got janky on
  mid-tier Android. Not viable for the primary gameplay surface.
- **All Pixi** — shaders feasible, but the 3D character models
  would need a massive lift.
