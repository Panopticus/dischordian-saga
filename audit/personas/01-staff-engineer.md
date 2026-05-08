# Staff Engineer — Architecture Review

## Top 5 findings

### F1: GameContext.tsx is a 3,960-line monolithic store with 100 inline `setState(prev => ...)` mutations
- file: `/home/user/dischordian-saga/apps/client/src/contexts/GameContext.tsx`:1727-3956
- severity: critical
- category: architecture
- finding: One context exposes ~150 callbacks across awakening, rooms, cards, decks, narrative flags, mystery items, quests, morality, transmissions, tutorials, crafting, companions, romance, arks, diplomacy, and faction war. The `GameContextValue` interface alone runs 200+ lines. Every consumer re-renders on any unrelated mutation (no slices, no selectors); `setState(prev => ...)` is invoked 100 times — a hand-rolled reducer with no audit trail. Persisted save state, UI ephemera, and progression all share one blob.
- fix: Replace with Zustand/Jotai stores split per domain (`useAwakeningStore`, `useRoomStore`, `useCardCollectionStore`, `useMoralityStore`, `useCompanionStore`, `useFactionWarStore`). Move setters into named reducer cases under `apps/client/src/state/<domain>/`. Isolate the persisted slice (`GAME_STORAGE_KEY`) behind a single persist middleware.

### F2: Server `cardGame.ts` (2,173 lines) reimplements TCG combat in parallel with `apps/shared/tcg-core`
- file: `/home/user/dischordian-saga/apps/server/routers/cardGame.ts`:1228-1545 (playCard / attackWithCharacter / endTurn)
- severity: critical
- category: architecture
- finding: The router defines its own `GameState`, `PlayerState`, `CardInPlay` types (lines 76-122) and hand-rolls combat — bespoke energy/health/trait logic that bypasses tcg-core's `reduce`, `interpret`, and `effectInterpreter`. This is the drift `RULES_VERSION` and the `tcg.effect_op_coverage` ship-check exist to prevent. `compat/legacyClient.ts` and `compat/viewAdapter.ts` exist for this transition but are unused here. Line 1266 calls `Math.random()` mid-mutation, breaking replay determinism.
- fix: Make `cardGame.ts` an auth + persistence shell only. Route all gameplay through `import { reduce } from "@shared/tcg-core"` against a `GameState`; persist the resulting state hash. Delete the inline combat types. Add a ship-check `server.cardGame_uses_engine` that fails on `Math.random` or hand-rolled `player.field.push` outside the compat layer.

### F3: `apps/shared/expansionArt/*` imports from `apps/client` — hard layer violation
- file: `/home/user/dischordian-saga/apps/shared/expansionArt/_assetManifest.ts`:1 (and 7 siblings: `guildCutscenesManifest.ts`, `cinematicsManifest.ts`, `album{1..5}Slideshows.ts`)
- severity: high
- category: architecture
- finding: `import { assetUrl } from "../../client/src/lib/assetUrl"` reaches up out of `shared` into the client. CLAUDE.md aliases (`@shared` → `apps/shared`, `@` → `apps/client/src`) define a one-way dependency direction. Server imports of these manifests (content APIs) drag client code into the server bundle. The `suitAdapters/*` directory compounds this with 11 files importing `@/game/passiveBonusAggregator`; `tradeEmpire/houses.ts` imports `@/game/tradeEmpire`.
- fix: Move `assetUrl` to `apps/shared/lib/assetUrl.ts` (pure URL builder, no client dep). Re-export from `@/lib/assetUrl`. Hoist `AggregatedBonus` and `GalacticFactionId` types into `apps/shared/types/`. Add an ESLint `no-restricted-imports` rule banning `@/` and `../../client` from `apps/shared/**`.

### F4: `FightEngine2D` is a single 4,558-line class entangling sim and presentation
- file: `/home/user/dischordian-saga/apps/client/src/game/FightEngine2D.ts`:1000 (one `export class FightEngine2D` running to EOF)
- severity: high
- category: architecture
- finding: One class owns the 38-value `FighterState2D` state machine, AABB collision, hurtbox/hitbox tables, special-move parsing, AI (4 styles × 4 difficulties), `FightSoundManager` dispatch, camera, particle effects, training telemetry, and HUD callbacks. Simulation and presentation are inseparable; the engine cannot be unit-tested headlessly. Contrast `tcg-core/engine/` (~25 small files).
- fix: Split into `fight/sim/` (pure: `StateMachine.ts`, `Collision.ts`, `MoveResolver.ts`, `AiController.ts` per style) and `fight/render/` (canvas, sprites, camera). Make `FightEngine2D` a thin coordinator: `tick(input) → SimState`, renderer reads SimState. Lift `FighterState2D` into a discriminated `state: { kind; frame; ... }` so transitions are exhaustive.

### F5: 152-import root router + 3 page god-files signal missing feature-module boundary
- file: `/home/user/dischordian-saga/apps/server/routers.ts`:10-152; `/home/user/dischordian-saga/apps/client/src/pages/{ChessPage,ArkExplorerPage,FightPage}.tsx`
- severity: medium
- category: architecture
- finding: `routers.ts` enumerates 142 feature routers in one file — every feature add/remove churns a hot file. Client mirrors this: `ChessPage.tsx` 2,547 lines / 76 hooks; `ArkExplorerPage.tsx` 2,848 lines / 76 hooks (defines `ElaraPopup`, `RoomScene`, `parseMysteryAction` inline); `FightPage.tsx` 2,158 lines / 38 hooks (embeds `FighterCard`, `FighterDetailPanel`, `MatchupBar`, `LorePopup`, `StatBar`, `VsIntro`). No `apps/client/src/features/{chess,ark,fight}/` module exists.
- fix: Compose sub-routers in `apps/server/routers/_groups/{tcg,chess,economy,narrative,social,admin}.ts`; `routers.ts` shrinks to ~30 lines. Extract sibling components into `features/<feature>/components/`; cut each page to layout + state wiring under 600 lines.

## Convergence hints
- `routers/cardGame.ts:1266` `Math.random()` mid-mutation: replay-determinism persona should confirm `RULES_VERSION` impact.
- `apps/server/task7-design-system.test.ts` etc. import via the `@/` client alias from inside `apps/server/` — build-config persona should confirm whether server resolves `@/` intentionally or tests are mis-located.
- `routers/architectConsole.ts` is 2,238 lines for only 8 procedures, signaling heavy inline business logic — service-layer persona should confirm whether services are missing under `apps/server/services/`.
