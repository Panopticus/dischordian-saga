# Void Energy UI — Upstream Research & Integration Report

> Research comparing [dimonb19/void-energy-ui](https://github.com/dimonb19/void-energy-ui)
> (the canonical Svelte/Astro design system) against our React port in Dischordian Saga.

## What void-energy-ui IS

A **framework-agnostic, physics-based design system** for the CoNexus storytelling platform.
Built on Svelte 5 + Astro + Tailwind + bespoke SCSS, it defines materials — not pixels.

### The Triad Architecture

Every pixel is calculated by the intersection of three layers:

1. **Atmosphere** (The Soul) — color palette + fonts. Examples: `slate`, `terminal`, `frost`, `meridian`
2. **Physics** (The Laws) — material behavior: `glass` | `flat` | `retro`
3. **Mode** (The Polarity) — `light` | `dark`

### Immutable Physics Constraints

| Violation | Correction | Reason |
|-----------|-----------|--------|
| Glass + Light | Forces FLAT physics | Glass glows require darkness |
| Retro + Light | Forces DARK mode | CRT phosphor needs black canvas |

### DOM Contract

```html
<html data-atmosphere="void" data-physics="glass" data-mode="dark">
```

---

## Gap Analysis: Upstream vs Our Port

### 1. MOTION PRIMITIVES (Critical Gap)

**Upstream has:** A complete physics-aware transition system (`transitions.svelte.ts`):
- `materialize()` — Entry: blur fade-in with Y-translation (glass), sharp scale (flat), instant (retro)
- `dematerialize()` — Exit for floating UI: upward float + blur (glass), grayscale dissolve (retro)
- `emerge()` — Layout-aware entry: animates height/padding/margin + visual
- `dissolve()` — Layout-aware exit: collapses height while fading
- `implode()` — Horizontal collapse for list removals (compositor-only, zero layout reflow)
- `live()` — List reflow animation (wraps Svelte's FLIP)

Each primitive reads the current physics type and adapts:
- Glass: blur + spring curves + 300ms
- Flat: no blur + ease-out + 200ms
- Retro: stepped easing or instant (0ms)

**We have:** Basic CSS transition-duration variables (`--speed-fast/base/slow`) but no
JS motion primitives. Components use ad-hoc framer-motion animations that don't respond
to physics type. This means glass and retro surfaces animate identically.

### 2. NARRATIVE EFFECTS (Major Gap)

**Upstream has:** 18 categorized effects for story text:
- **One-shot** (punctuate moments): `shake`, `quake`, `jolt`, `glitch`, `surge`, `warp`
- **Continuous** (sustain mood): `drift`, `flicker`, `breathe`, `tremble`, `pulse`, `whisper`, `fade`, `freeze`, `burn`, `static`, `distort`, `sway`

Design principles:
- Most steps should have NO effect (null) — effects are seasoning
- Never combine one-shot + continuous on same step
- Match intensity to narrative weight

**We have:** Nothing. NPC dialog text appears uniformly regardless of narrative weight.

### 3. PALETTE MODEL (Moderate Gap)

**Upstream palette has 14 semantic tokens:**
```
bg-canvas, bg-surface, bg-sunk, bg-spotlight,
energy-primary, energy-secondary,
border-color,
text-main, text-dim, text-mute,
color-premium, color-system, color-success, color-error
```

**Our palette has 13 tokens** but is missing:
- `sunk` — recessed inputs/wells (we only have canvas/surface/elevated)
- `spotlight` — ambient lighting for depth
- `secondary` energy color — we only have primary + accent
- `premium` (gold) — for premium/paid content
- `system` (purple) — for system-level UI

We also lack the OKLCH-calculated light/dark variant generation for semantic colors.

### 4. FONT/TYPOGRAPHY SYSTEM (Major Gap)

**Upstream has:**
- 16 font families with weight-specific .woff2 files
- Per-atmosphere font assignments (`font-atmos-heading`, `font-atmos-body`)
- Atmosphere changes swap the entire typographic personality
- Fluid typography via `clamp()` functions
- Font preload system that only loads fonts for the active atmosphere

**We have:** No per-atmosphere font system. All themes use the same fonts.

### 5. CSS ARCHITECTURE (Structural Issue)

**Problem:** We have TWO files defining `.void-surface` / `.void-elevated` behavior:
- `void-physics.css` — physics-specific shadows, blur, borders, hover states, scrollbars
- `void-materials.css` — overlapping surface/elevated definitions with different values

This creates specificity conflicts. The upstream has ONE source: the SCSS engine
compiles to a single output with no duplication.

### 6. DEPTH TIERS (Minor Gap)

**Upstream:** Three explicit depth tiers with computed shadow progressions:
- **Sunk (-Z):** Inputs, wells, sidebars (inset shadows)
- **Float (+Z):** Cards, surfaces (0.05-0.1 opacity shadows for flat, energy-tinted for glass)
- **Lift (++Z):** Modals, active elements (stronger shadows + glow for glass)

**We have:** Float and lift only. No sunk tier with inset shadows.

### 7. DARK MODE SHADOW ADJUSTMENT (Minor Gap)

**Upstream:** Flat physics on dark backgrounds automatically increases shadow opacity
from 0.05-0.1 to 0.3-0.4 for visibility. Our flat shadows are static.

### 8. KINETIC TEXT (Future Opportunity)

The upstream has a standalone `kinetic-text` package with:
- Typewriter/decode text effects at the character level
- Per-grapheme layout caching
- PRNG-based stagger patterns
- Void Energy host adapter for theme-aware rendering

This could replace our basic text reveal for NPC dialog.

### 9. AtmosphereScope (Future Opportunity)

The upstream has an `AtmosphereScope` Svelte component that lets nested sections
override the atmosphere locally (not just globally on `<html>`). Useful for:
- Side-by-side theme previews
- Embedded content from different narrative contexts
- NPC dialog panels with their own atmosphere

### 10. View Transitions API (Future Opportunity)

The upstream integrates with the browser's View Transitions API for smooth
theme changes, with fallbacks for unsupported browsers or reduced-motion preferences.

---

## Integration Priority

| Priority | Item | Impact | Effort |
|----------|------|--------|--------|
| P0 | Consolidate CSS (fix duplication) | Fixes bugs now | Small |
| P0 | Motion primitives | Every animation becomes physics-aware | Medium |
| P1 | Expanded palette (sunk, premium, system) | Richer material vocabulary | Small |
| P1 | Atmosphere fonts | Each theme gets typographic personality | Medium |
| P1 | Narrative effects | Story moments gain visual weight | Medium |
| P2 | Sunk depth tier | Input/well surfaces look properly recessed | Small |
| P2 | Dark-mode shadow adjustment | Flat surfaces gain depth on dark bg | Small |
| P3 | AtmosphereScope component | Local theme overrides | Medium |
| P3 | Kinetic text | NPC dialog text effects | Large |
| P3 | View Transitions API | Smooth theme changes | Small |

---

## Implementation Notes

### Motion Primitives (React Port)

The upstream uses Svelte transitions (`in:materialize`, `out:implode`). For React, we
should create framer-motion variants that read the current physics type:

```tsx
// Concept: physics-aware framer-motion variants
const materialize = (physics: PhysicsType) => ({
  initial: {
    opacity: 0,
    y: 15,
    scale: 0.96,
    filter: physics === 'glass' ? 'blur(12px)' : 'blur(0px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: physics === 'retro' ? 0 : physics === 'glass' ? 0.3 : 0.2,
      ease: physics === 'retro' ? 'linear' : [0.4, 0, 0.2, 1],
    },
  },
});
```

### Narrative Effects

Map to CSS animations + optional framer-motion orchestration:
- One-shot effects: trigger via className after text reveal completes
- Continuous effects: apply as CSS animation during text reveal
- Each effect has physics-specific behavior (retro uses stepped timing, glass adds blur)
