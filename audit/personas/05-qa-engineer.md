# QA / Test Engineer — Audit

## Top 5 findings

### F1: 143 of 165 server routers have zero adjacent test (87% golden-path gap)
- file: `/home/user/dischordian-saga/apps/server/routers/`
- severity: high
- category: golden_path
- finding: `ls apps/server/routers/*.test.ts` returns 22 test files against 143 router files (the rest are `*.test.ts` siblings). The three largest game-mode routers — `chess.ts` (2,706 LOC), `architectConsole.ts` (2,238), `cardGame.ts` (2,173) — have **no `chess.test.ts`, no `architectConsole.test.ts`, no `cardGame.test.ts`**. The two `cardGame.npcReactions.test.ts` / `chess.npcReactions.test.ts` files only cover NPC-reaction side effects, not the move/play loop. Combined with no ship-check parity for game-mode routers, regressions in match-state mutations are entirely uncaught at unit level.
- fix: add `chess.test.ts` (legal-move generation, win/draw detection, ELO update), `cardGame.test.ts` (deck draw, mulligan, turn pass, win), `architectConsole.test.ts` (mutation-auth gating, write-once invariants), `tradeWars.test.ts`, `casino.test.ts`. Extend `apps/shared/_completeness/registry.ts` with a "router has at least one happy-path test" parity entry so this regresses loudly.

### F2: Critical-path E2E specs run, but assertions are anaemic placeholders
- file: `/home/user/dischordian-saga/apps/e2e/critical-paths.spec.ts`, `apps/e2e/game-modes.spec.ts`, `apps/e2e/stripe-checkout.spec.ts`
- severity: high
- category: e2e_gap
- finding: CI sets `E2E_AUTH_OPEN_ID: "e2e-test-user"` so auth-gated specs execute, but the assertions are class-prefix wildcards — e.g. `game-modes.spec.ts:18-21`:
  ```ts
  await expect(
    page.locator("cg-board, [class*='chessboard'], [class*='chess'], [data-board]").first(),
  ).toBeVisible({ timeout: 10_000 });
  ```
  Passes if any element with `chess` in its class name renders — does not verify board state, a move, or a game outcome. Same pattern for `/cards/play` and `/duelyst`. `stripe-checkout.spec.ts:55-58` only asserts `expect(res.status()).not.toBe(500)` — a 404 would pass. None of the four critical surfaces (card duel, chess multiplayer, store checkout, OAuth login) have an actual interaction asserted; `auth-roundtrip.spec.ts` is the closest to a real flow.
- fix: replace class-prefix `locator` with `data-testid` selectors (`data-testid="chess-board"`, `data-testid="card-hand"`); add real interactions (drag a piece, draw a card, end turn); harden Stripe spec to `expect(res.status()).toBe(400)` plus a body shape.

### F3: Server "router tests" mock nothing and never touch a DB — they test constants
- file: `/home/user/dischordian-saga/apps/server/routers/account.test.ts`, `store.purchaseGrants.test.ts`
- severity: high
- category: mocking_smell
- finding: `grep -c "vi.mock\|jest.mock\|vi.fn"` against the three sampled router tests returns **0**. `account.test.ts` is 26 lines and only asserts `CURRENT_AGREEMENT_VERSIONS.terms_of_service` is truthy + ISO-date-shaped. `store.purchaseGrants.test.ts:1-15` documents the gap explicitly: *"No DB is available in the test env, so the focus is contract-level… The transactional + idempotent paths require a real MySQL fixture to exercise meaningfully; those land in a follow-up integration test once the harness has one."* That follow-up has not landed. The CI `db-smoke` job spins MySQL but only runs `pnpm db:smoke`, never `pnpm test` against it.
- fix: stand up a `vitest.integration.config.ts` that depends on the existing `mysql:8.0` service container, add `pnpm test:integration` step to CI between `db:smoke` and `e2e`, and port `store.purchaseGrants` idempotency assertions into a real-DB test.

### F4: Vitest has no coverage reporter — coverage numbers are unknowable
- file: `/home/user/dischordian-saga/vitest.config.ts`, `package.json`
- severity: medium
- category: ci_integration
- finding: `grep -E 'coverage|c8|istanbul' vitest.config.ts package.json` returns one unrelated hit (`assets:coverage`). `vitest.config.ts` has no `test.coverage` block, no `@vitest/coverage-v8` dependency, no `pnpm test:coverage` script. The 9,400 unit tests run blind — when test count goes up but real branch coverage drops, no signal fires. The 119/323K client and 166/124K server "ratios" in the brief are file counts, not coverage. CI runs `pnpm run test` and `pnpm run ship:check` but neither emits a coverage-threshold gate.
- fix: install `@vitest/coverage-v8`, add `test.coverage = { provider: 'v8', reporter: ['text', 'json-summary'], thresholds: { lines: 60, branches: 50 } }` (start lenient, ratchet upward). Wire `pnpm test --coverage` into CI and upload the json-summary as a build artifact so ship-check can read it.

### F5: Zero snapshot files — no regression fingerprint for replays / serialised effects
- file: `/home/user/dischordian-saga/apps/`
- severity: low
- category: snapshot_abuse
- finding: `find apps -name '__snapshots__' -type d` returns **0** directories. `grep -l 'toMatchInlineSnapshot\|toMatchSnapshot'` returns nothing. The flip side of "no snapshot abuse" is "no fingerprint regression detection" for serialised-effect outputs (CardDefinitions, replay tapes, trial-category resolution) where the value is structural and large. `RULES_VERSION` bumps in `tcg-core/engine/version.ts` can silently change effect interpretation without a frozen-output diff. Playwright config sets `snapshotPathTemplate: "{testDir}/__screenshots__/..."` but no spec calls `toHaveScreenshot()` — `visual-regression.spec.ts` exists but ships no committed baselines.
- fix: add inline snapshots to `apps/shared/tcg-core/replay/*.test.ts` for canonical replay-tape outputs pinned to the current RULES_VERSION. Tie regeneration to a deliberate version-bump review gate.

## Coverage gap table

| Router | LOC | Test files | LOC/test |
|--|--|--|--|
| chess.ts | 2,706 | 1 (npcReactions only) | 2,706 |
| architectConsole.ts | 2,238 | 0 | ∞ |
| cardGame.ts | 2,173 | 1 (npcReactions only) | 2,173 |
| tradeWars.ts | 1,626 | 0 | ∞ |
| tradeEmpire.ts | 1,623 | 1 (npcReactions only) | 1,623 |

(Adjacent `*.npcReactions.test.ts` files only cover the NPC-reaction side-effect path, not move/play/match logic — counted but flagged.)

## Convergence hints

- Cross-cite with **DB engineer**: F3 (no real-DB tests) is the same complaint from the harness side that the DB persona will see as "no FK-coverage parity" — fix is one `mysql:8.0` service-container fixture extended to vitest.
- Cross-cite with **Staff engineer / DevOps**: F4 (no coverage reporter) and F1 (no router-test parity check) both want a new ship-check subsystem entry in `apps/shared/_completeness/registry.ts`. One PR lands both.
- Cross-cite with **Security**: F2's Stripe spec (`expect(res.status()).not.toBe(500)`) is also a security smell — webhook signature rejection should assert `=== 400` with a specific error body, not a not-5xx range.
- Flag to **a11y persona**: `accessibility-audit.spec.ts` and `accessibility.spec.ts` live at e2e level — verify they aren't also auth-skipped placeholders.
