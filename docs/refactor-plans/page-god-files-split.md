# Refactor plan — page god-files

Three pages in `apps/client/src/pages/` exceed 2,000 LOC each:

| File              | LOC   | Audit finding |
|-------------------|------:|---------------|
| `ArkExplorerPage.tsx` | 2,848 | Staff F5 |
| `ChessPage.tsx`       | 2,547 | Staff F5 |
| `FightPage.tsx`       | 2,158 | Staff F5 |

Each is doing route-level orchestration, state management, presentation, and (in two cases) game logic in one file. The audit's recommended fix: extract feature-sub-components into `apps/client/src/features/<feature>/` so the page becomes a thin layout shell.

## Common shape after split

```
apps/client/src/features/<feature>/
├── index.ts                 re-exports public surface
├── <Feature>Page.tsx        ~300 LOC — route shell, layout
├── hooks/use<Feature>State.ts   shared state hook
├── components/
│   ├── <Feature>Hud.tsx
│   ├── <Feature>SidePanel.tsx
│   ├── <Feature>Modal*.tsx
│   └── ...
└── lib/
    └── <local helpers>
```

The page file shrinks to a layout shell that composes feature components; everything stateful moves into the feature folder.

## ChessPage (2,547 LOC)

Worst offender for orchestration sprawl: maps tournament state, AI personality, post-game review, opening book selection, multiplayer pairing, and time-control countdowns all in one component.

Suggested extractions:
1. **`features/chess/hooks/useChessGameState.ts`** — owns the chess.js game state + useStockfish wiring (~400 LOC).
2. **`features/chess/components/ChessBoardView.tsx`** — react-chessboard wrapper + click handlers (~300 LOC).
3. **`features/chess/components/ChessHud.tsx`** — clock, move list, captured pieces (~250 LOC).
4. **`features/chess/components/ChessOpponentPicker.tsx`** — opponent character carousel + AI personality preview (~200 LOC).
5. **`features/chess/components/ChessTournamentBracket.tsx`** — Climb/tournament progression UI (~300 LOC).
6. **`features/chess/components/ChessPostGameReview.tsx`** — already partially extracted; finish moving wiring here (~300 LOC).
7. **`pages/ChessPage.tsx`** — pure layout (~300 LOC).

## ArkExplorerPage (2,848 LOC)

Combines hotspot logic, item collection, room transitions, lore discovery animation, and clue-tracking. Each is independently shippable.

Suggested extractions:
1. **`features/ark/hooks/useArkRoomState.ts`** — room/hotspot state slice from GameContext (~300 LOC).
2. **`features/ark/components/ArkRoomCanvas.tsx`** — canvas rendering of the room background (~400 LOC).
3. **`features/ark/components/HotspotLayer.tsx`** — clickable hotspot overlay + tooltips (~250 LOC).
4. **`features/ark/components/InventoryDrawer.tsx`** — pickup/equip flow (~200 LOC).
5. **`features/ark/components/LoreDiscoveryToast.tsx`** — animated toast on first-time discovery (~150 LOC).
6. **`features/ark/components/RoomTransitionScreen.tsx`** — between-room loading shell (~200 LOC).
7. **`pages/ArkExplorerPage.tsx`** — pure layout + composition (~400 LOC).

## FightPage (2,158 LOC)

Orchestrates the FightEngine2D integration, training mode, intro cinematics, post-fight rewards. Note this is downstream of the FightEngine2D split (see `fight-engine-2d-split.md`) — that landing first removes some of the bulk here.

Suggested extractions:
1. **`features/fight/hooks/useFightSession.ts`** — session config + result handler (~250 LOC).
2. **`features/fight/components/FightCanvas.tsx`** — wraps FightEngine2D mounting + canvas sizing (~200 LOC).
3. **`features/fight/components/FightIntroCinematic.tsx`** — pre-fight intro screen (~300 LOC).
4. **`features/fight/components/FightHudOverlay.tsx`** — HP bars + super meter + timer overlay (~250 LOC).
5. **`features/fight/components/FightTouchControls.tsx`** — mobile virtual stick + buttons (~200 LOC).
6. **`features/fight/components/FightResultScreen.tsx`** — win/lose ceremony + reward distribution (~300 LOC).
7. **`pages/FightPage.tsx`** — pure layout (~250 LOC).

## Why this isn't done in this audit pass

Each split is 1-3 PRs of focused work. They need:
- Manual smoke at each step (audit finding 5.F1: golden-path E2E doesn't actually assert game state).
- Coordination with the FightEngine2D split (which itself is a 6-PR plan).
- Per-page screenshots so PR reviewers can see UI regressions.

The audit pass set up enabling conditions:
- Batch 7 added `useMemo` to GameContext — every page's render-fan-out cost is dramatically reduced, so extracting components no longer risks "this used to re-render unnecessarily and now never re-renders" surprises.
- Wave 2.3 integration-test harness opens the door for sub-component tests against real DB state.
- Batch 9 tightened E2E assertions on Duelyst so the existing patterns can be copied per-page.

When the team is ready, the recommended order is: ChessPage first (cleanest sub-component boundaries), then ArkExplorerPage (most discrete sub-features), then FightPage (depends on FightEngine2D split landing first).
