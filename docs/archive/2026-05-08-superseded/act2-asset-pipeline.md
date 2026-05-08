# Act 2 — Asset Pipeline

Status of every Act 2 asset the client code references. All code paths
that depend on these are wired — dropping files at the indicated paths
lights them up without further changes.

## Status at a glance

| Bucket | Count | Status |
|---|---|---|
| SVG icon | 1 | ✅ Authored |
| Voice-over MP3 | 29 | ⏳ External pipeline (user-run ElevenLabs batches) |
| Ambient audio bed | 2 | ⏳ External pipeline (synthesized) |
| Image / cinematic frame | 12 | ⏳ External pipeline (generative image model) |

Authored-in-repo means the file exists and will load. Everything else
ships as a fallback (toast instead of VO, reduced-motion prose instead
of cinematic frames) and will upgrade automatically the moment the
real asset lands at the referenced path.

## What's authored in this branch

- `apps/client/public/art/ui/icon-memory-energy.svg` — hand-authored
  per the spec in `MISSING_ART_PROMPTS.md` §A2.13. Crystalline
  hexagon + inner clock-face + corner lattice nubs, stroke-only
  `currentColor` so it theme-tints via CSS.

## External pipeline — voice-over (29 MP3s + 2 ambient beds)

Script: **`docs/production/act2-vo-script.md`** — 30 lines across 8
sections. Every line includes the target path, speaker direction, and
source file reference.

The client references each URL from an optional `audioUrl` field on
its data shell:

| Directory | Source shell | Lines |
|---|---|---|
| `apps/client/public/vo/act2/` | `narrativeActs.ts` (humanVoAudioUrl) + `Act2InterludePage.tsx` | 3 (Human commentary 1–2, Elara recognition) |
| `apps/client/public/audio/act2/` | `act2Interlude.ts`, `songSlideshows.ts`, `companionComments.ts` | 26 (bench framing, Zephyr classroom, Game Masters, Climb reactions, Silence bed) |

Generate with the same ElevenLabs pipeline used for the Act 1 VO
delivery (PRs #125–#128). Presets reused: `EngineerZero` (Elara),
`TrenchCoat` (The Human), `Quarchon9` (Zephyr-9). New presets
required: `FrontManLeft` + `FrontManRight` for the two Game Masters
(see direction §5 in the script).

## External pipeline — imagery (12 frames)

Prompts: **`docs/production/MISSING_ART_PROMPTS.md` §A2.1–A2.12** —
every prompt includes Midjourney-style flags (`--ar 16:9 --v 6.1 --s
750 --q 2`), path, size, and reference to the component that consumes
it.

Grouped by layer:

- **Engineer's Bench room states (×4)** — off / powered / light-humming
  / dark-humming. `EngineersBenchPage.tsx` swaps the `LivingBackground`
  src based on `flags.engineers_bench_powered_on` + craft alignment.
  Missing images → falls back to the shared `LivingBackground` default
  gradient (not broken, just generic).
- **Zephyr-9 classroom (×1)** — `EngineersBenchPage.tsx` Zephyr sidebar.
  Missing → sidebar renders without background imagery.
- **Game Master portraits (×2 + goggles prop)** — `GameMastersArenaAct2Page.tsx`
  + Ark hotspot icon. Missing → broken image placeholder (cosmetic).
- **Silence cinematic frames (×3 + hero composite)** —
  `songSlideshows.ts` `SILENCE_OF_TWO_WITNESSES_SLIDESHOW`. The
  slideshow ships a `reducedMotionFallback.heroImageUrl` + prose so
  the cinematic still PLAYS without the frames — just uses the
  composite hero + text captions.
- **Memory Energy HUD icon (×1)** — ✅ authored above.

## Verifying asset pickup

Drop a file, reload the page, and the corresponding surface should
light up immediately. Vite's dev server serves `apps/client/public`
as static assets; no build step required.

```bash
# Quick verify any path is being served
curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:5173/audio/act2/bench-first-power-on.mp3
```

## Tracking

- ✅ Code wiring complete — no additional code changes required to
  consume generated assets.
- ⏳ Generation work lives outside this branch. Track via separate
  batch PRs that add the `*.mp3` + `*.webp` files with commit
  messages like `chore(vo): generate Act 2 bench + Zephyr lines`.
