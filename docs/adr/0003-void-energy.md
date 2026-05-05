# ADR-0003 — Void Energy design system

Status: accepted (in-progress migration)

## Context

The client originally used scattered Tailwind utility classes,
inline hex colours, and ad-hoc `is-active` / `data-state` patterns
to express UI state. As the codebase scaled this became:

- Colour drift (5 different "amber" shades across pages)
- State leakage (utility classes used as state markers, breaking
  CSS-only theming)
- A11y gaps (state in classes is invisible to assistive tech)

The Tier-3A "Void Energy" system enforces:

- Design tokens for every colour / spacing value (no raw
  hex/rgb/hsl, no Tailwind colour-ramp utilities like
  `text-amber-400`)
- State expressed via `data-*` / ARIA attributes, never via utility
  classes (`is-active`, `is-open` are flagged)
- Material variants (`glass`, `flat`, `retro`) as named primitives

## Decision

Adopt Void Energy gradually via a ratchet — `.void-energy-adopted`
lists files under enforcement. New code touching an adopted file
must comply or `pnpm lint:void-energy` fails. New code in a non-
adopted file is unconstrained until the file is added to the list.

## Consequences

- Migration is incremental: ~112 of ~1000 client files adopted as
  of 2026-05-05. Realistic finish window: 12-18 months at current
  pace.
- CI now runs the void-energy lint (added in G7), so the ratchet
  no longer slips.
- New devs need to learn the token names; documented in
  `apps/client/src/styles/void-energy/README.md`.
- The downside: a parallel design system during migration is
  cognitive overhead. Worth it for the consistency end-state.

## Alternatives considered

- **Big-bang migration** — too risky on a live game.
- **CSS variables only** — doesn't solve the state-in-classes
  problem.
- **shadcn-ui style primitives** — already used (Radix
  underneath), but doesn't enforce the colour/state discipline.
