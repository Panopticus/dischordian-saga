# Void Energy Adoption Roadmap (Tier 3A)

**Status:** Multi-slice sprint. The infrastructure (ratchet + token scale +
intentional/adopted registries) is landed; the per-file migration happens
incrementally.

**Authoritative upstream:** [dimonb19/void-energy-ui](https://github.com/dimonb19/void-energy-ui).
The Saga is a React codebase; the reference library is Svelte 5 + Astro. The
5 Laws and the token dictionary transfer directly; framework-specific rules
(Svelte runes, `.scss` abstracts, `-legacy` coexistence) do not.

## The 5 Laws (as applied to this React codebase)

> Cited verbatim from the reference project's `CLAUDE.md`, with React
> adaptations noted.

### Law 1 — Hybrid Protocol
> **Tailwind = page composition and consumer-side geometry. CSS custom
> properties = visual physics/materials.**

- Tailwind handles layout (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, responsive
  breakpoints, container queries).
- Visual materials (shadow, blur, glow, border materials) route through
  `var(--void-*)` / `var(--energy-*)` / `var(--space-*)` tokens. Inline
  `style={{...}}` is fine for one-off material routing; prefer the
  `.void-*` utility classes in `engine/void-materials.css` where they exist
  (`.void-text`, `.void-bg-surface`, `.void-border`, `.void-glow`, etc.).
- **Don't move layout into tokens.** `p-4`, `flex`, `gap-6` stay in Tailwind.
- **Don't move materials into raw Tailwind color ramps.** `text-amber-400`
  is prohibited on adopted files — use `void-text-accent` or `var(--energy-accent)`.

### Law 2 — Token Law
> **No raw values (px, #hex, rgb, rgba, hsl). Only semantic tokens.**

The ratchet at `scripts/void-energy-lint.mjs` enforces this for every path
in `.void-energy-adopted`. Allowlisted pixel values: `0px`, `1px`, `2px`,
`3px` and their negatives (minimal adjustments — borders, tiny offsets).
Everything else must flow through `--space-*`, `--ve-radius-*`,
`--physics-border-width`, `--energy-*`, etc.

Escape hatches:

- `// void-ignore` on its own line exempts the next non-blank line.
- `// void-ignore` at the end of a line exempts that line.
- Whole files with legitimate narrative-signal colors (speaker accents,
  faction identity, per-NPC color registries) go in `.void-energy-intentional`.

### Law 3 — Runes Doctrine (N/A to React)
The reference project's Svelte 5 rune requirement has no React equivalent.
React hooks are the established reactive primitive here; nothing to enforce.

### Law 4 — State Protocol
> **State visible to CSS via data attributes or ARIA, not utility classes.**

- Write `data-state="active"`, `aria-pressed`, `aria-checked`. Never
  `className="is-active"` or `className="open"`.
- The ratchet flags `is-active|is-open|is-disabled|is-selected|is-hidden|is-visible|is-loading|is-error` inside
  className strings on adopted files.

### Law 5 — Spacing Gravity
> **Default generous. When unsure, go ONE size up, never down.**

Concrete floors (from `.claude/rules/spacing-protocol.md`):

| Surface / context | Floor |
|---|---|
| Floating surfaces (`.void-elevated`, raised cards) | `p-lg` / `gap-lg` |
| Sunk surfaces (`.void-sunk`, wells) | `p-md` / `gap-md` |
| Sunk-dense (justified exceptions) | `p-sm` / `gap-sm` |
| Page-wrapper sections | `gap-2xl` (64px) |
| Content blocks inside sections | `gap-xl` (48px) |
| Inside floating cards | `gap-lg` (32px) standard; `gap-md` compact |
| Form field groups | `gap-md` (24px) |
| Tight couplings (label↔input, icon+text, title+subtitle) | `gap-xs` (8px) |

**`gap-xs` and `gap-sm` apply ONLY to semantically linked units.** Everything
else requires `gap-md` minimum.

## Token dictionary (Saga ↔ library)

Both catalogs coexist in `engine/void-materials.css`. The `--ve-*` prefix is
legacy Saga; the `--space-*`, `--energy-*`, and `--bg-*` names are the
library convention.

### Spacing (library-parity, new in this sprint)
| Token | Value | Tailwind utility |
|---|---|---|
| `--space-xs` / `--spacing-xs` | 8px | `gap-xs`, `p-xs`, `m-xs` |
| `--space-sm` / `--spacing-sm` | 16px | `gap-sm`, `p-sm`, `m-sm` |
| `--space-md` / `--spacing-md` | 24px | `gap-md`, `p-md`, `m-md` |
| `--space-lg` / `--spacing-lg` | 32px | `gap-lg`, `p-lg`, `m-lg` |
| `--space-xl` / `--spacing-xl` | 48px | `gap-xl`, `p-xl`, `m-xl` |
| `--space-2xl` / `--spacing-2xl` | 64px | `gap-2xl`, `p-2xl`, `m-2xl` |
| `--space-3xl` / `--spacing-3xl` | 96px | `gap-3xl`, `p-3xl`, `m-3xl` |
| `--space-4xl` / `--spacing-4xl` | 128px | `gap-4xl`, `p-4xl`, `m-4xl` |
| `--space-5xl` / `--spacing-5xl` | 160px | `gap-5xl`, `p-5xl`, `m-5xl` |

All scale with `--ve-density`.

### Color / material (pre-existing; library-alias column added)
| Saga canonical | Library equivalent | Example use |
|---|---|---|
| `--bg-void` | `--bg-canvas` | page canvas |
| `--bg-surface` | `--bg-surface` | cards, panels |
| `--bg-elevated` | `--bg-raised` (library) / `--bg-spotlight` | modal/float |
| `--bg-sunk` | `--bg-sunk` | inputs, wells |
| `--text-primary` | `--text-main` | body + headings |
| `--text-dim` | `--text-dim` | labels, captions |
| `--text-muted` | `--text-mute` | low-emphasis |
| `--energy-primary` | `--energy-primary` | primary actions, focus |
| `--energy-secondary` | `--energy-secondary` | supporting accent |
| `--energy-accent` | `--color-premium` (library) | premium / golden accents |
| `--energy-success` | `--color-success` | success, humanity axis |
| `--energy-error` | `--color-error` | error, machine axis |
| `--energy-system` | `--color-system` | system purple |
| `--energy-premium` | `--color-premium` | currency / rewards |

### Physics (new aliases)
| Token | Default | Use |
|---|---|---|
| `--physics-blur` | `var(--ve-blur, 0px)` | glass backdrop filter |
| `--physics-border-width` | `var(--ve-border-width, 1px)` | retro-physics thicker borders |
| `--ve-radius-sm` / `-md` / `-lg` / `-xl` | 6/10/16/24 px | corner radius (zeroed in retro) |

## Ratchet behavior

`scripts/void-energy-lint.mjs` scans every path in `.void-energy-adopted`
and flags:

| Violation | Pattern |
|---|---|
| Hex literal | `#[0-9a-fA-F]{3,8}` |
| Tailwind color ramp | `(text|bg|border|ring|from|to|via)-(slate|gray|…|rose)-\d{2,3}` |
| `rgb()/rgba()/hsl()/hsla()` literal | `(rgb|rgba|hsl|hsla)\s*\(` |
| Raw px after colon (outside allowlist) | `:[^;]*?(-?\d+)px` |
| State-via-class | `is-(active|open|disabled|selected|hidden|visible|loading|error)` in a className string |

The `// void-ignore` directive matches the reference project's
`scripts/scan-physics.ts` semantics: same-line inline exempt, or a bare
comment line that exempts the next non-blank line.

Commands:
- `pnpm lint:void-energy` — local + CI. Exits 1 on violations.
- Invoked directly: `node scripts/void-energy-lint.mjs`.

## Migration protocol (per file)

Lifted from the reference project's `CLAUDE.md` migration protocol, adapted
for React:

1. **Pre-flight audit.** Read the file + adjacent component + the Saga's
   `engine/void-materials.css`. Identify which colors / spacings / radii
   you're going to replace and which ones (narrative-signal) should be
   exempted.
2. **Report findings.** In the commit message, list what's being migrated,
   which tokens replace what, and any `.void-energy-intentional` additions.
3. **Preserve behavior.** Migration changes *how* materials are expressed,
   not *what* the UI does.
4. **Match patterns.** Use utility classes (`void-text-*`, `void-bg-*`,
   `void-border`, `void-glow`) where they exist; fall back to inline
   `style={{ color: "var(--energy-*)" }}` for one-offs.
5. **No inventions.** Use only tokens + classes already in
   `engine/void-materials.css`. If a needed token is missing, land it in a
   separate prep commit before the migration.
6. **Incremental scope.** One PR = one thematic slice (chrome components, or
   page-level shells, or one dialog surface). Don't mix.
7. **Verify across presets.** Before marking a file adopted, visually
   confirm it renders correctly under all three physics (`glass`, `flat`,
   `retro`) and both modes (`light`, `dark`). Glass + retro auto-correct
   to dark if someone sends them light.
8. **Register the file** in `.void-energy-adopted` as the last step. The
   ratchet is now watching.

## Current status

**Inventory (pre-migration counts):**
- 106 component files under `apps/client/src/components/` with Tailwind
  color ramps.
- 75 component files with hex literals.

**Adopted to date:** see `.void-energy-adopted`.
**Intentional exceptions:** see `.void-energy-intentional`.

## Slice plan

1. **Slice 1 (this PR family)** — 4 chrome utility components
   (`ReconnectingOverlay`, `MoralityShiftToast`, `AutoTutorialPrompt`,
   `GameErrorBoundary`) + ratchet infrastructure + spacing scale + roadmap.
2. **Slice 2** — page-level shells (`Act1CardLadderPage.tsx`,
   `WitnessingHubPage.tsx`, `ArkExplorerPage.tsx`). Each is one PR; each
   migration re-themes dozens of downstream components via prop inheritance.
3. **Slice 3** — dialog stack (`NarrativeEngine`, `LoreTutorialEngine`,
   `DialogWheel`). Careful review needed — some colors are semantic (warning,
   success), others are speaker-accent (`.void-energy-intentional`).
4. **Slice 4** — prelude beat handlers (`components/prelude/*`).
5. **Slice 5** — card / battle UI (`game/duelyst/*`). Late in the sprint —
   testing is expensive.
6. **Slice 6** — long-tail utility components (toasts, badges, trait panels).
   Batch-process once Slices 1–5 land.

## Done state

- `.void-energy-adopted` contains every component path (minus
  `.void-energy-intentional` narrative-signal files).
- `grep -rE 'text-cyan-\d+|bg-amber-\d+|text-rose-\d+' apps/client/src/components` returns only
  intentional paths.
- Storybook-equivalent surface (Loredex pages + UI-library demos) renders
  every component under all three physics values without layout drift.
- Ratchet runs in CI and fails any PR that regresses an adopted file.

## Relationship to the narrative PR infra (Dialogue Completeness)

The UI components shipped by the dialogue-completeness PR
(`Act1OpponentTauntOverlay`, `CompanionAskPanel`, `CompanionCommentToast`,
`PreludeTutorCard`) use per-speaker accent colors — cyan for Elara, rose
for The Human, amber for Locke, violet for The Seer. That coloring is
**narrative signal, not theme chrome**, and lives in
`.void-energy-intentional`. When the long-tail slice rolls around, revisit
those files: the signal survives, but the *chrome* around it (backgrounds,
borders, shadows) should still migrate to Void Energy tokens.
