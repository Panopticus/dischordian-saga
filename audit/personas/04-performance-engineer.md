# Performance Engineer — Audit

## Top 6 findings

### F1: GameContext provider value is a fresh object literal every render
- file: /home/user/dischordian-saga/apps/client/src/contexts/GameContext.tsx:3820-3952
- severity: critical
- category: render
- impact: Any `setState` in GameContext (morality, hotspot click, flag set, auto-save, NPC convo) re-renders every `useGame()` consumer. `<GameProvider>` wraps `<AuthGate>` + the whole `<Router>` (App.tsx:859), so one flag flip invalidates ArkExplorerPage (2,848), ChessPage (2,547), FightPage (2,158), DuelystGameUI (2,043) at once.
- finding: `value={{ state, ...100+ callbacks }}` is inline — new identity each render. 126 `useCallback`/`useMemo` sites are wasted because the wrapper identity changes anyway. No selector splitting.
- fix: `useMemo` the value. Better: split `GameStateContext` from `GameActionsContext` so action-only consumers stop re-rendering. Or migrate to Zustand (already used by `moralityStore`) for selector-grained subscriptions.

### F2: three.js + 5 postprocessing passes leak into the initial chunk
- file: apps/client/src/components/AppShellImmersive.tsx:29 → ShaderOverlay.tsx:23 → engine/cinematicComposer.ts:23-28
- severity: high
- category: bundle
- impact: AppShellImmersive is eagerly imported in App.tsx:24, dragging three.js + EffectComposer + RenderPass + UnrealBloomPass + ShaderPass + OutputPass into the **initial** chunk. Players hitting `/terms`, `/privacy`, `/leaderboard` pay for bloom shaders before first paint.
- finding: Static chain; bundler can't split. 194 `lazy()` for 182 `<Route>` — page code splits cleanly. The leak is the eager AppShell import.
- fix: `React.lazy()` ShaderOverlay inside AppShellImmersive, gate mount on `qualityTier !== 'low'` (already detected). Pixi and Stockfish are correctly route-split.

### F3: effectInterpreter recursion is unbounded; per-target allocations gratuitous
- file: apps/shared/tcg-core/engine/effectInterpreter.ts:565-572 (foreach), 601-612 (repeat), 397-405 + 629-633 (random_empty rescan), 794 (Object.values per push)
- severity: medium
- category: engine
- impact: Nested `foreach { foreach { … } }` is O(N²) with no guard. `summon`/`teleport` `random_empty` rescans all 45 tiles inside the per-target loop. `pushStep` does `Object.values(draft.board)` per target — Immer proxy traps per access. With 32 ops × 464 cards this is the hottest fan-out.
- finding: No depth cap, no iteration cap, no per-resolve memoization. Each `foreach` allocates a fresh ExecCtx via `withIt`.
- fix: `ctx.depth` counter, throw past 64. Cache empty-tile list per resolve, invalidate on summon/teleport/destroy. Build a `(row,col)→entityId` index once per resolve.

### F4: Marketplace `searchListings` runs LIKE '%…%' + count(*) per page; `myListings` has no LIMIT
- file: apps/server/routers/marketplace.ts:441-485, 488-494
- severity: high
- category: n_plus_1
- impact: Two roundtrips (rows + `count(*)`) per page with leading-wildcard `LIKE` (unindexable) on `itemName`. `myListings` returns *all* of a power-seller's rows on every poll. `getLeaderboard` (pvp.ts:85-93) is `publicProcedure` with no rate limit and no cache.
- finding: PvP batches via `inArray` correctly (pvp.ts:134-141, 446-461) — no N+1 there. The morality `.map` (mkt:460-482) processes every row even when `moralityScore === 0`.
- fix: Composite index `(status, itemType, createdAt)` + cursor pagination; FULLTEXT on `itemName`. Cap `myListings` at `.limit(100)`. 30s cache on `getLeaderboard`. Hoist morality short-circuit above the map.

### F5: 89 console.* sites in client + PvP WS sends 3× full-state stringify per action
- file: 89 sites across apps/client/src; apps/server/pvpWs.ts:176-187, 380-383
- severity: medium
- category: logging
- impact: Each `console.*` in prod is ~20-100µs (DevTools-protocol message even when closed). Per PvP action `pvpWs` runs `getPlayerView` + `JSON.stringify` three times (p1, p2, spectators) — ~30 stringifies/turn of redundant work.
- finding: No `esbuild.drop` configured. `send()` stringifies inside the per-recipient loop, not once.
- fix: Vite build: `esbuild.drop: ['console', 'debugger']` in production. Compute `getPlayerView` once per state version, stringify once per distinct view, send cached buffer. JSON-Patch deltas after the initial snapshot.

### F6: setCompanionContext effect rebuilds a Set from Object.entries on every flag change
- file: apps/client/src/App.tsx:614-626
- severity: low-medium
- category: render
- impact: Each `setNarrativeFlag` walks all flags, filters truthy, allocates a fresh `Set`. Couples with F1's fan-out.
- finding: Effect dep array combines `elaraStability`, `humanLight`, `narrativeFlags` — Set rebuilds even when only stability changes.
- fix: Split into two `useEffect`s by concern; memoize the truthy-flag Set via `useMemo([narrativeFlags])`.

## Bundle hot list

1. **three.js + postprocessing** — leaks into the **initial chunk** via App.tsx → AppShellImmersive → ShaderOverlay → cinematicComposer; hits every route. Also pulled by lazy `ParallaxDepthBackground` (SpaceStation, DegensCasino) and lazy `CharacterModel3D` via FightEngine2D (FightPage) — those land in route chunks, OK. The eager AppShell import is the fix.
2. **pixi.js** — only `BoardRenderer.ts` → `DuelystGameUI` → lazy `DuelystPage` (App.tsx:190). **Correctly route-split.**
3. **Stockfish** — `lib/stockfishWorker.ts:8` fetches engine from CDN into a Web Worker on demand; `ChessPage` lazy. **Correctly lazy + off main thread.**

## Convergence hints

1. **DB engineer**: `marketListings` needs `(status, itemType, createdAt)` composite index + FULLTEXT on `itemName` to kill the leading-wildcard scan. Verify `pvpLeaderboard.elo DESC` index for `getLeaderboard` top-50.
2. **Frontend Architect**: GameContext (3,960 LOC, 100+ callbacks, single fat value) is the single largest perf+maintainability lever in the client. Splitting state-vs-actions lets existing `useCallback` work pay off and likely halves render time on busy routes.
3. **Observability engineer**: 89 `console.*` sites + per-recipient stringifies pair with `esbuild.drop` + a Sentry breadcrumb policy so prod loses cost without losing diagnostics.
