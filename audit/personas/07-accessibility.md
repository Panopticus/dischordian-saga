# Accessibility Specialist — Audit

## Top 5 findings

### F1: 9×5 Duelyst board is a bare `<canvas>` with zero a11y surface
- file: /home/user/dischordian-saga/apps/client/src/game/duelyst/DuelystGameUI.tsx:1692
- severity: critical
- category: screen_reader_game_board
- WCAG ref: 2.1.1 Keyboard (A); 4.1.2 Name/Role (A); 1.3.1 Info/Relationships (A)
- finding: Board renders as `<canvas ref={canvasRef} />` — no `aria-label`, no `role`, no `tabIndex`, no `onKeyDown`. All move/attack/summon (1153–1263) flows through Pixi pointer events. Keyboard users cannot focus a tile; screen-reader users get nothing for the 45-cell tactical surface. Wrapper `role="application" aria-label="Card battle game"` at 1473 announces once then goes silent. `announce()` is invoked only ~5 times in 2,043 LOC (902/923/937/1074/1080) for global state, never for tile selection, valid-move ranges, or unit positions.
- fix: Overlay a parallel DOM grid: `role="grid" aria-rowcount="5" aria-colcount="9"` with one `role="gridcell"` per tile carrying `aria-label="Row 3 Col 5, Maelis Drakar 4HP"`, roving tabindex on arrows, Enter/Space to commit. Mirror Pixi highlight into `aria-selected`/`aria-current="location"`; pipe outcomes through `announce()`.

### F2: Tutorial overlays — not dialogs, trap nothing, announce nothing
- file: /home/user/dischordian-saga/apps/client/src/components/LoreTutorialEngine.tsx:292; /home/user/dischordian-saga/apps/client/src/components/MechanicTutorialOverlay.tsx:140
- severity: high
- category: focus_management
- WCAG ref: 2.4.3 Focus Order (A); 4.1.2 Name/Role (A)
- finding: Both overlays render fixed teaching cards as plain `<div>` with no `role="dialog"`, `aria-modal`, or `aria-labelledby`. MechanicTutorialOverlay's only ARIA is `aria-label="Dismiss"` on close. The repo has a working `useFocusTrap` hook (a11y.tsx:34); neither overlay calls it. Typewriter reveal (LoreTutorialEngine.tsx:389) lives outside any `aria-live` region — AT users hear nothing through the onboarding that gates the rest of the game.
- fix: Wrap roots in `role="dialog" aria-modal="true" aria-labelledby={...}`, call `useFocusTrap(open)`, restore focus on close, place typewriter inside `aria-live="polite"`.

### F3: axe suite covers 3 anonymous routes; auth-gated surfaces unreachable
- file: /home/user/dischordian-saga/apps/e2e/accessibility-audit.spec.ts:64
- severity: high
- category: keyboard
- WCAG ref: meta — gap in conformance verification
- finding: All `auth-gated` describes `test.skip` unless `E2E_AUTH_OPEN_ID` is set (65, 164, 249, 296, 359). Without that fixture only `/`, `/terms`, `/privacy` get audited — no `<canvas>`, no dialogs, no board, no framer-motion. The "landing page has aria-live region" assertion at 348 is `≥ 0` (tautological).
- fix: Add the auth storageState (or mock-auth bypass) to CI; tighten the live-region assertion to `> 0`; add a Duelyst spec that loads a seeded match and asserts axe + grid-keyboard parity.

### F4: Hand cards are clickable `<div>`s, not buttons
- file: /home/user/dischordian-saga/apps/client/src/game/duelyst/DuelystGameUI.tsx:1900
- severity: high
- category: keyboard
- WCAG ref: 2.1.1 Keyboard (A); 4.1.2 Name/Role (A)
- finding: Hand slots use `aria-label={card.name}` but the element (~1907 `onClick`, sibling `onMouseEnter/Leave`) is a `<div>` — no `role="button"`, no `tabIndex`, no Enter/Space handler. Not focusable or keyboard-activatable. Concede (1831) and End Turn (1812) are real `<button>`s; the primary play surface isn't.
- fix: Convert to `<button type="button">` (or `role="button" tabIndex={0}` + key handlers); reuse `announce()` on selection.

### F5: Void Energy materials lack documented contrast ratios; high-contrast toggle patches Tailwind, not tokens
- file: /home/user/dischordian-saga/apps/client/src/index.css (`html.high-contrast`); /home/user/dischordian-saga/apps/client/src/engine/void-materials.css
- severity: medium
- category: contrast
- WCAG ref: 1.4.3 Contrast (AA); 1.4.11 Non-Text Contrast (AA)
- finding: `grep -rE "WCAG|contrast.?ratio|4\.5:1"` over apps/client/src returns zero hits. Sole shipping-doc reference is one line at docs/production/act1/public-witness-ui-spec.md:218. The high-contrast toggle (App.tsx:823, SettingsPage.tsx:568) patches Tailwind opacity utilities (`.bg-card\/40`, `.text-muted-foreground\/60`) but does not re-target `--energy-*` or `glass|flat|retro` material tokens — components under `.void-energy-adopted` ignore the user's preference.
- fix: Add a contrast-ratio test over `--energy-*` and material token pairs to `pnpm ship:check`; re-target `html.high-contrast` at token CSS vars, not utility classes; document per-material fg/bg pairs.

## Strengths to preserve
- `prefers-reduced-motion` honored across 30+ surfaces (`useReduceMotion`, `voidMotion`, `motionIntensity`, BoardRenderer, combatJuice, haptics, view transitions). Best-implemented a11y axis — do not regress during Void Energy migration.
- Strong primitives in `components/a11y.tsx` (`useFocusTrap`, `SkipToContent`, global `announce()`). AppShell.tsx:521 wires real `<main id="main-content" role="main">` + skip link; `<html lang="en">` set; 122 landmark tags.
- Heavy Radix adoption (~20 components in components/ui/) ships correct focus + ESC + ARIA. Migrate bespoke overlays (F2) onto this baseline.

## Convergence hints
- F1, F4 converge with **mobile-engineer**: parallel-DOM grid + real `<button>` hand cards solve keyboard a11y and `touch-action` together.
- F3 converges with **qa-engineer**, **devops-sre**: auth storageState fixture also unlocks auth-gated axe runs.
- F5 converges with **staff-engineer**: contrast parity belongs under `pnpm ship:check` completeness registry alongside Tier-3A.
- F2 converges with the **writer/narrative** persona: silent typewriters render onboarding voice invisible to AT users.
