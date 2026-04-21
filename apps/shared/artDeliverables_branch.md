# Art & VFX Deliverables — `claude/fix-error-branding-cN41Z`

This document lists every new asset or visual direction introduced by the
opening-experience polish branch. It is scoped to things a future
art-generation pass would need to produce; it does **not** re-catalogue the
pre-existing `act1ArtPrompts.ts` / `suitArtPrompts.ts` / `roomStateArtPrompts.ts`
corpus (those remain the canonical source for their respective domains).

Each item includes: the code location that references it, what the asset
looks like, and the behavior / performance / motion constraints it must
honor.

---

## 1. Studio credit typography (F1)

**Copy:**
```
DGRS LABS PRESENTS
A PANO PRODUCTION
```

**Call sites:**
- `apps/client/src/components/OpeningCinematic.tsx:221-227` — intro overlay
- `apps/client/src/components/OpeningCinematic.tsx:238-246` — "BEGIN EXPERIENCE" splash

**Direction:**
- Two-part credit. "DGRS LABS PRESENTS" is the smaller, dimmer eyebrow
  (text-[9px] sm:text-[11px], opacity 0.7). "A PANO PRODUCTION" is the
  main line (text-[10px] sm:text-xs), full opacity.
- Both lines share the existing `font-mono`, `tracking-[0.5em]`,
  `void-text-energy` treatment; do not introduce new fonts or colors.
- Motion: inherits the existing `motion.div` opacity fade at the outer
  container — no change.

**Art assets needed:** none. Pure typography.

---

## 2. Landing page (F12) — layer stack + diegetic boot

**Call site:** `apps/client/src/pages/TitlePage.tsx`

### 2.1 Diegetic boot sequence (shipped in this branch)

Types on over ~3s in the logo/CTA column:

```
> CoNEXUS HANDSHAKE . . .
> LINK ESTABLISHED
> ARK DESIGNATION: 1047
> AWAITING OPERATOR
```

- Font: monospace, 11px, letterSpacing 0.2em, `rgba(0,255,255,0.7)`.
- Stagger: `delay: 0.5 + i * 0.6`, `duration: 0.3` per line (framer-motion).
- `aria-hidden` — screen readers skip it (it's HUD chrome, not content).
- "ARK DESIGNATION: 1047" is an intentional easter egg that primes the
  Bridge Power Relay puzzle (F10). Players who read the boot on their
  first session pre-know the number before they reach the console.

**Reduced-motion:** no bespoke handling — framer-motion's global reduce
honors `prefers-reduced-motion` and collapses the stagger.

**Art assets needed:** none. Pure typography.

### 2.2 Parallax HUD + video backdrop (deferred; assets required)

The plan (`/root/.claude/plans/the-first-image-is-noble-melody.md` §F12)
specifies a seven-layer stack back-to-front. Asset production required:

| Layer | Asset | Path | Spec |
|-------|-------|------|------|
| 1 | Hero video | `public/videos/title/ark-drift-loop.{mp4,webm}` | 10–20s seamless loop of the Ark drifting past a nebula. Muted, autoplay, loop, playsInline. Poster fallback: existing `public/art/ui/title-bg.png`. |
| 2 | Far nebula | `public/art/ui/title/nebula-far.png` | 1200×675 max. Slow horizontal drift; pointer-offset amplitude ≤ 6px. |
| 3 | Mid Ark silhouette | `public/art/ui/title/ark-mid.png` | 1200×675 max. Pointer + `deviceorientation` parallax; max 12px offset; clamped on mobile. |
| 4 | Foreground dust | CSS-only | Disabled under `prefers-reduced-motion`. |
| 5 | Scanlines | CSS-only (existing) | Keep. |
| 6 | Vignette | CSS-only (existing) | Keep. |
| 7 | Diegetic boot | Typography (shipped) | See §2.1. |

**Perf constraints:**
- Parallax PNGs ≤ 1200×675.
- **No** CSS `filter: blur()` on moving layers.
- Single RAF loop shared with the existing scanline loop
  (`TitlePage.tsx:139-147`).
- Device-tilt listener detached under reduced-motion; dust disabled;
  parallax amplitude halved on mobile.
- Graceful degrade: if video file is 404, poster PNG fills the slot and
  the page still ships the diegetic boot + scanlines.

### 2.3 Title stack cleanup

The redundant `<h1>THE DISCHORDIAN</h1>` + `<h1>SAGA</h1>` pair was
removed (`TitlePage.tsx:299-303` now holds only a comment explaining why).
The logo image `public/art/logos/dischordian-saga.png` carries the title by
itself. No new logo art needed; the existing asset stays.

---

## 3. Companion visual direction (F13)

**Call sites:**
- `apps/client/src/companion/CompanionHost.tsx` — holographic panel
- `apps/shared/characterBible.md` — voice + visual bible

### 3.1 Holographic panel chrome

The `CompanionHost` renders the active `CompanionLine` as a small panel
in the bottom-right. Color theming is routed by `line.speaker`:

| Speaker | Border tint | Glow tint | Portrait gradient |
|---------|-------------|-----------|-------------------|
| `elara` | `var(--energy-primary)` @ 25% | `var(--energy-primary)` @ 12% | radial, `--energy-primary` 70% → transparent |
| `human` | `var(--energy-premium)` @ 25% | `var(--energy-premium)` @ 12% | radial, `--energy-premium` 70% → transparent |

The portrait is a **6×6** (sm) or **8×8** (md) disc. For the initial
ship it is a generated-gradient placeholder — future asset requirement is
a set of proper holographic portraits per band.

### 3.2 Elara portrait — stability band variants

Per `apps/shared/characterBible.md` the `elara_stability` scalar maps to
three bands. Each band wants a distinct portrait (or a single portrait
with band-driven post-processing — art team's call).

| Band | Visual direction |
|------|------------------|
| `fragmented` (stability ≤ −30) | Heavier scanline artifacts, color-bleed cyan→magenta, occasional frame duplication, pupil misalignment. Portal-GLaDOS tilt. |
| `lucid` (default, −30 < s < 40) | Clean holographic register, warm cyan core, stable outline. Default state. |
| `luminous` (stability ≥ 40) | Warmer timbre, less reverb, slightly brighter core, cleaner edges, the hint of a human face breaking through the chrome. |

Animation: subtle ambient loop (breathing-scale 0.98→1.02) for lucid and
luminous; stutter loop for fragmented (intentionally glitchy).

### 3.3 The Human portrait — light band variants

| Band | Visual direction |
|------|------------------|
| `shadow` (light ≤ −30, default at opening) | Cold blue-grey register. Silhouette-heavy. Eyes underlit. Clone's body reads as *newly-built*, not lived-in. |
| `balanced` (−30 < l < 40) | Warmer neutrals entering the palette. Micro-expressions visible. Less mechanical outline. |
| `warm` (light ≥ 40) | A gift-register. Amber-adjacent highlights, fuller mouth, held gaze. Never sentimental — the warmth is verdict-weight. |

**Contrast rule:** when both companions are on-screen in a duet beat,
Elara's panel stays on `--energy-primary` and Human's on
`--energy-premium`. Never mirror them. The palette asymmetry is the
visual expression of their narrative asymmetry.

---

## 4. Bridge Power Relay puzzle — mobile layout (F10)

**Call site:** `apps/client/src/components/PuzzleSystem.tsx:439-464`

Eleven switches (1–11). The layout changed in this branch from a single
row (which clipped on narrow viewports) to:

- Mobile (< sm breakpoint): `grid-cols-6 gap-2`, two rows wrap.
- Desktop (≥ sm): `flex justify-center gap-3`, single row.
- Each switch is a 40×56px well with a 12×12px status dot. Toggled-on
  wells glow `var(--energy-primary)`; off wells are dim.

No new art asset needed — the relay is CSS/DOM only.

---

## 5. Loredex brand spoof chrome (F9)

**Call site:** `apps/client/src/components/AppShell.tsx:310-340`

The header chrome's wordmark swaps on a narrative flag:

| Flag state | Wordmark | Link behavior |
|------------|----------|---------------|
| `loredex_unlocked` false (default) | `CoNEXUS OS` | Link inert (renders as `<div>`) |
| `loredex_unlocked` true | `LOREDEX OS` | Link navigates |

Typography unchanged (`font-display text-xs font-bold tracking-[0.25em]
text-[var(--neon-cyan)] glow-cyan`); only the word swaps. The glyph icon
(`Terminal` lucide, 14px, `--neon-cyan`) is shared between states — same
glyph for both identities, which is part of the spoof.

**Counter chrome** on the same header swaps from literal counts to
`N / ???`:

- `<span className="text-[var(--neon-cyan)]">{visibleEntries.length}</span>`
  followed by dimmed `{" / ???"}` and the word `ENTRIES`.
- Same pattern for `relationships` / `LINKS` in `--orb-orange`.

No new art asset needed — pure typography.

---

## 6. VFX / motion not shipped but implied by dialog

The dialog in `elaraLines.ts` + `humanLines.ts` contains beats that will
want bespoke VFX support when VO lands. Flagging them here so the art
track can plan ahead; none are blocking for this branch.

- **Fragmented-band Elara lines** use `…` pauses and deliberate empty-
  string pauses. The panel should render the typewriter as stuttered
  during fragmented band (subtle 2-frame hitch every 6–10 glyphs).
- **Human silence beats** (`human_silence_shadow` / `_balanced` /
  `_warm`) are empty-text lines with `durationMs` set. They need a
  visual treatment for "he's in the room but not saying anything" —
  suggested: portrait pulses once, then fades to 60% opacity for the
  silence duration. No text bubble.
- **Human reveal scene** (`human_reveal_approach_*` / `_voice_*` /
  `_admission_*`): staged three-beat duet. On the `_voice_` beat the
  Human's portrait should *materialize in* rather than hard-appear —
  reuse the existing `hologram-materialize.webm` if palette allows,
  or commission a noire-tinted variant.
- **Virus whisper beats** (`virus_whisper_01_*` through `_04_*`): low-
  priority ambient register. The CompanionHost panel should desaturate
  slightly during these (stability-neutral cue) — a CSS filter, no
  new asset required.

---

## 7. Summary of new content-delivery items

**Typography / copy changes only (no asset pipeline needed):**
- Studio credit (F1)
- Title-page duplicate `<h1>` removal + diegetic boot sequence (F12)
- Bridge relay responsive layout (F10)
- Loredex ↔ CoNEXUS brand swap (F9)

**Asset pipeline items (need generation):**
- `public/videos/title/ark-drift-loop.{mp4,webm}` — hero video loop
- `public/art/ui/title/nebula-far.png` — parallax layer 2
- `public/art/ui/title/ark-mid.png` — parallax layer 3
- Elara portrait set × 3 stability bands (fragmented / lucid / luminous)
- Human portrait set × 3 light bands (shadow / balanced / warm)

**Nice-to-have (flagged in §6):**
- Noire-tinted `hologram-materialize` variant for the Human reveal
- Stutter-typewriter treatment for fragmented Elara lines
