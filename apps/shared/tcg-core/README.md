# tcg-core — the Loredex OS card engine

The runtime for every card duel in the game: 9×5 board, mana curve, keywords, effects, replays. CONTRIBUTING.md tells you to read this first; it's that.

## Layout

```
apps/shared/tcg-core/
├── types/                  Static shapes (Card, Effect, Trigger, GameState, …)
├── cards/
│   ├── schema.ts           Zod validators for CardDefinition (.strict() everywhere)
│   ├── loader.ts           Builds the registry; cardDefinitionSchema.parse() per card
│   ├── index.ts            Barrel — every card def is imported + spread here
│   └── definitions/
│       └── <faction>/<id>.ts   One file per card
├── engine/
│   ├── reducer.ts          Pure reduce(state, action) → state
│   ├── effectInterpreter.ts  Walks effect trees against a draft GameState
│   ├── conditions.ts       Condition.kind dispatcher
│   ├── triggers.ts         Trigger.kind dispatcher
│   ├── targeting.ts        Selector resolution
│   ├── rng.ts              Seeded RNG (Math.random is BANNED in this dir)
│   └── version.ts          RULES_VERSION — bump when interpretation changes
├── balance/                Stat-curve checkers, trial-category proposers
└── compat/                 Adapter layer for the legacy server router
```

## Adding a card

1. **Pick a faction directory** under `cards/definitions/`. The faction must already exist in `factionSchema` — adding a new faction is a separate, larger change (see "Adding a faction" below).

2. **Create the file** as `<id>.ts` where `<id>` is unique across the registry.
   ```ts
   import type { CardDefinition } from "../../types/Card";

   export const cardDef: CardDefinition = {
     id: "s2_unit_ledger_clerk" as CardDefinition["id"],
     name: "Ledger Clerk",
     faction: "new_babylon",
     cardType: "unit",
     rarity: "common",
     cost: 2,
     attack: 2,
     health: 3,
     keywords: [],
     trial_categories: ["evidence"],   // sorted canonical order
     rulesVersion: "1.1.0",
     description: "A minor functionary of the Authority.",
     flavorText: "She files everything in triplicate. Even her own thoughts.",
   };
   ```

3. **Wire it into the barrel** — `cards/index.ts`:
   ```ts
   import { cardDef as ledger_clerk } from "./definitions/new_babylon/ledger_clerk";
   // …
   export const ALL_CARD_DEFINITIONS = [
     // …existing entries
     ledger_clerk,
   ];
   ```
   Forgetting either the import or the spread silently drops the card. (Tracked: a Vite glob-import would replace this manual step.)

4. **Run `pnpm check && pnpm test`.** Schema errors look like `CardRegistryLoadError[<id>]: validation failed at index N: <zod path>` — they tell you exactly which field is wrong.

5. **Run `pnpm ship:check`.** Trial-category coverage and stat-budget compliance are gated; if you exceed the curve, add a `balanceException` block with a written reviewer note.

### Casts you'll see

`as CardDefinition["id"]` and `as CardDefinition["abilities"][number]["id"]` are intentional. The engine uses branded types (`CardDefId`, `AbilityId`) to prevent accidental string-mixing; the cast lets authors write a human-readable id while keeping the brand internal. Do not generalize the cast.

## Schema strictness

Every Zod schema in `cards/schema.ts` uses `.strict()`. Misspelled fields (`flavourText` instead of `flavorText`) blow up at registry load with a clean error. Don't soften this — the strictness is what makes the type-safety of card data trustworthy.

## RULES_VERSION

`engine/version.ts` exports the current `RULES_VERSION`. Every card carries its own `rulesVersion`. They should match. Bumping the engine in a way that changes effect interpretation requires:

1. Bump `RULES_VERSION` in `engine/version.ts`.
2. Update every card definition's `rulesVersion`.
3. Add a replay-pin so old replays don't drift.
4. Document the change in the engine's changelog.

If you don't need to change interpretation, don't bump it.

## Effect ops

The set of `EffectOp` discriminator literals in `types/Effect.ts` must match the `case` branches in `engine/effectInterpreter.ts`. The `effect.op handlers` ship-check entry enforces this — adding an op without a handler fails CI.

The interpreter caps recursion at `MAX_INTERPRET_DEPTH = 64` (effectInterpreter.ts). Authored cards never come close; if you need more, raise the cap *and* log a warning in the same PR — it's almost certainly a bug.

## Adding a faction

Currently invasive: TS union in `types/Card.ts` is derived from the Zod `factionSchema`, so:

1. Add the faction string literal to `factionSchema` in `cards/schema.ts`.
2. Add the faction to any `Record<Faction, …>` exhaustiveness sites the typecheck flags (e.g. `apps/shared/tradeEmpire/itemTags.ts`).
3. Create `cards/definitions/<new_faction>/` and start adding cards.
4. Add a faction art manifest under `apps/shared/expansionArt/` if the faction needs custom art keys.

A `pluginManifest` for community-pack factions is on the roadmap; today, factions are part of the core engine type surface.

## Determinism

`Math.random()` is banned in this directory (`engine/rng.ts:8`). Every random decision — shuffle, random-target effect, mulligan redraw, AI exploration — must route through the seeded `Rng` from `engine/rng.ts`. The server persists `GameState.rngState` between actions so replays reconstruct exactly.

ESLint catches direct `Math.random()` use. The `lookahead.ts` `pickEpsilonGreedy` requires an explicit `rng` argument (no Math.random default).

## Compat layer

`compat/legacyClient.ts` and `compat/viewAdapter.ts` exist to bridge the legacy server router (`apps/server/routers/cardGame.ts`) into engine-shaped GameState. New work should route through `engine/reduce()`; the legacy router is being retired.

## When in doubt

Read the existing definitions for cards that look similar to yours. The `s1_char_*` files are the most representative reference patterns; `s2_hierarchy_*` shows the multi-tier imprint pattern.
