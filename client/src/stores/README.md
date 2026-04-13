# Zustand Stores — Migration Path

## Why this folder exists

The project has **10 React Contexts** (GameContext, LoredexContext, GamificationContext, PlayerContext, etc.). The biggest — `GameContext` — has **77 consumers** and **2,200+ lines**.

React Context re-renders EVERY consumer on ANY state change, regardless of which slice changed. At 77 consumers, this is a significant perf tax that will compound as the app grows.

**Zustand** fixes this: components subscribe only to the slices they read. A component that only reads `state.apprentice` does NOT re-render when `state.moralityScore` changes.

## Migration strategy (cautious)

We're **NOT** rewriting GameContext all at once. 77 consumers = too risky in a single refactor.

Instead, we're doing a **parallel migration**:

1. **New state lives here** (in Zustand). `apprenticeStore`, `legionStore`, `darkArtsStore`.
2. **GameContext keeps its existing state** unchanged. Legacy consumers keep working.
3. **When a context slice becomes expensive**, it gets a sibling Zustand store + a bridge hook. Consumers migrate one at a time.
4. **Cross-store sync** happens in a `useEffect` in App.tsx when needed (see `bridgeGameContext.ts`).

## Current stores

- **`apprenticeStore.ts`** — Apprentice roster (current + fallen + cohort state). Replaces the `state.apprentice` + `state.apprenticeFallen` + `state.legionGraduates` fields from GameContext.
- **`darkArtsStore.ts`** — Corruption level + purge history + dark-ability usage. Replaces `state.corruptionLevel` + `state.purgeRitualsCompleted` + `state.darkAbilitiesUsed`.

## Adding a new store

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MyStore {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set(s => ({ count: s.count + 1 })),
    }),
    { name: "dischordian-my-store" },
  ),
);
```

## Anti-patterns to avoid

- ❌ Don't select the whole store: `const state = useStore()`. This re-renders on every change.
- ✅ Select only what you read: `const count = useStore(s => s.count)`.
- ❌ Don't put derived state in the store — compute it in the selector.
- ❌ Don't nest stores. Flat is fine. Coupling happens in `useEffect` bridges.
