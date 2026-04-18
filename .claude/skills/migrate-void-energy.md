---
description: Apply the Void Energy axis migration to a file you're about to edit. Replaces Tailwind color ramps with void-* utility classes, hex with var(--energy-*) / var(--bg-*) / var(--text-*) tokens, and rgba() with color-mix(). Runs scripts/void-energy-migrate.mjs. Use when: opening a component file that still has text-amber-300 / #33E2E6 / rgba(...) style colors, before making other changes. The hook also runs this at commit time, but invoking it early lets you review the diff against your other work.
---

# /migrate-void-energy

Migrate a single file off hardcoded Tailwind color ramps and onto Void
Energy semantic tokens. Same axis recipe used for Slices 3–6.

## When to use

- Opening a component file that contains `text-amber-*` / `bg-stone-*` /
  `#33E2E6` / `rgba(51,226,230,...)` and you're about to edit it.
- Reviewing a PR flagged by the ratchet with "this adopted file has a
  new hardcoded color."
- Running ahead of the pre-commit hook so you can preview the diff.

## Don't use on

- Data files whose hex literals feed `lerpColor()` at runtime:
  - `apps/client/src/contexts/MoralityThemeContext.tsx`
  - `apps/client/src/data/arenaAssets.ts`
  - `apps/client/src/data/moralityUnlockables.ts`
  - `apps/client/src/game/arenaHazards.ts`
  - `apps/client/src/game/gameData.ts`
  - `apps/client/src/game/storyModeChapters.ts`

  The migrator skips these automatically, but be aware that their hex
  literals are load-bearing, not chrome.

## How

1. Run the migrator on the file:
   ```bash
   pnpm migrate:void-energy <file>
   ```
   Or programmatically:
   ```bash
   node scripts/void-energy-migrate.mjs apps/client/src/components/Foo.tsx
   ```
2. Verify it still compiles:
   ```bash
   pnpm check
   ```
3. If clean, add the path to `.void-energy-adopted` (sorted):
   ```bash
   echo "apps/client/src/components/Foo.tsx" >> .void-energy-adopted
   sort -u -o .void-energy-adopted .void-energy-adopted
   ```
4. Run the ratchet to confirm:
   ```bash
   pnpm lint:void-energy
   ```

## Axis map (for context)

- cyan / green / emerald / lime / teal → `--energy-success`
- amber → `--energy-accent`
- yellow / orange → `--energy-premium`
- red / rose / pink → `--energy-error`
- purple / violet / fuchsia → `--energy-system`
- blue / sky / indigo → `--energy-primary` (via `--electric-blue`)
- stone / gray / slate / zinc / neutral → `--text-*` / `--bg-canvas` / `--material-border`

Hex `#33E2E6`/`#22d3ee` → `var(--energy-primary)`, `#FF8C00`/`#F59E0B` →
`var(--energy-premium)` / `var(--energy-accent)`, etc.

Template-literal alphas like `rgba(34,211,238,${expr})` become
`color-mix(in oklch, var(--energy-primary) calc((${expr}) * 100%),
transparent)`.

## Residuals the migrator can't fix

- **Raw-px values** outside `0-3px` must be snapped to `--space-*`
  tokens (xs=8, sm=16, md=24, lg=32, xl=48, 2xl=64) or annotated with
  `// void-ignore — <reason>`.
- **State-via-class** (`is-active`, `is-open`, etc.) must be rewritten
  as `data-state="active"` / `aria-pressed` / `aria-checked`.

When those show up in the ratchet output, fix them by hand and re-run.

## Full context

See `docs/design/VOID_ENERGY_ADOPTION_ROADMAP.md` for the five laws,
the token dictionary, and the organic-migration pattern.
