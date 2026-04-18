# Void Energy Adoption Roadmap (Tier 3A)

**Status:** Dedicated sprint. Not session-commit work. This doc is the landing
pad the audit promised — a concrete inventory + migration order + ratchet
mechanism so the 170+ component refactor can start and stay started.

## Current state

The Void Energy design system (physics types `glass | flat | retro`) ships:

- `apps/client/src/engine/voidEngine.ts` — physics resolution
- `apps/client/src/engine/voidPresets.ts` — framer-motion presets
- `apps/client/src/engine/void-materials.css` — material classes
- `apps/client/src/engine/voidMotion.ts` — motion tokens
- `apps/client/src/engine/voidNarrative.ts` — narrative-tied physics

What adopts it so far (non-exhaustive):

- `App.tsx`, `LivingBackground.tsx`, `LoadingScreen.tsx`, `NPCDialog.tsx`,
  `TimeMachineView.tsx`, `UniverseAtmosphere.tsx`, the `components/void/*`
  family, and `contexts/MoralityThemeContext.tsx`.

What has not yet adopted it (measurable counts):

- **106 files** under `apps/client/src/components/` contain hardcoded
  Tailwind color classes (`text-cyan-*`, `bg-rose-*`, `text-amber-*`, etc.).
- **75 files** in the same tree contain hex color literals (`#rrggbb`).

Neither count represents independent work units 1:1 — some files appear in
both sets and some contain a single color reference that is fully themed. The
counts are a floor, not a ceiling, for the refactor.

## Migration order (highest ROI first)

1. **Page-level shells** — `apps/client/src/pages/*` surfaces that host the
   longest-running screens (`Act1CardLadderPage.tsx`, `WitnessingHubPage.tsx`,
   `ArkExplorerPage.tsx`). One file change per page can re-theme dozens of
   downstream components by prop inheritance.
2. **Dialog surfaces** — the narrative stack: `NarrativeEngine.tsx`,
   `LoreTutorialEngine.tsx`, `DialogWheel.tsx`, and the new
   `CompanionAskPanel` / `CompanionCommentToast` / `PreludeTutorCard`. These
   are the components the player stares at for minutes at a time.
3. **Beat-specific UI** — `components/prelude/*` Beat handlers. These run
   once during onboarding but are the player's first impression.
4. **Card / battle UI** — `game/duelyst/*` is the biggest downstream
   ripple; save for late in the sprint because testing is expensive.
5. **Long-tail utility components** — toasts, badges, trait panels. Low
   visibility per file, high count; batch-process once earlier tiers are
   done.

## Ratchet — keep done files done

`scripts/void-energy-lint.ts` (shipped in this PR) scans files listed in
`.void-energy-adopted` for hardcoded color literals and fails if any are
present. Add a file to `.void-energy-adopted` when you land its migration;
CI will block future PRs from reintroducing the regression. This is the
"stove-is-hot" rule that makes the long sprint safe to tackle in slices.

## What "complete" looks like

- `.void-energy-adopted` contains all 106 component paths (and the 75 hex
  files, to the extent they overlap).
- `grep -rc 'text-cyan-\\|text-rose-\\|text-amber-\\|bg-cyan-\\|bg-rose-\\|bg-amber-' apps/client/src/components`
  returns a count that only includes components explicitly marked as
  theme-intentional (ladder opponent accents, companion-color identity, etc.)
  and those files are listed in `.void-energy-intentional` with a written
  justification.
- The Storybook-equivalent surface (Loredex pages that document components)
  renders every component under all three physics values without layout drift.

## Relationship to the prelude/Act 1 work in this PR

The UI components added in this PR
(`Act1OpponentTauntOverlay`, `CompanionAskPanel`, `CompanionCommentToast`,
`PreludeTutorCard`) use per-speaker accent colors that are **intentional**,
not theme-default. They are legitimate candidates for
`.void-energy-intentional` on the migration sprint — a speaker's color is a
narrative signal, not a visual-theme default.
