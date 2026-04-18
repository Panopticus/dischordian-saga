# Authoring cross-game narrative threads

**Status:** authoring landing pad for Tier 4D. The registry lives at
`apps/shared/crossGameNarrativeThreads.ts`. Writers add threads + beats;
game-specific code emits beat flags; consuming games read the registry to
surface consequences.

## Why this exists

The Dischordian Saga ships as a transmedia project:

- **Loredex OS** — card game + narrative layer (this repo)
- **Cades FPS** — ground combat in `games/cades-fps/`
- **Dead Man's Circuit** — decoding puzzle game in `games/dead-mans-circuit/`

Events in one game canonically affect the others. The Fall of Cades is
seeded by Iron Lion's Mechronis expulsion in Loredex Act 1, happens in
Cades FPS, and leaves a pilgrimage pin on Loredex's Act 5 star map. Without
a registry, the three games drift.

## Entry shape

```ts
interface CrossGameThread {
  id: "cades_fall",                                   // globally unique
  title: "The Fall of Cades",
  originGame: "cades_fps",                            // canon authority
  participatingGames: ["cades_fps", "loredex"],
  beats: [
    {
      id: "cades_fall_expulsion",                     // thread-unique
      emittedBy: "loredex",                           // must be a participant
      label: "Mechronis expulsion",
      canonicalDescription:
        "Iron Lion walks out of Mechronis after the Act 1 Cycle B match...",
      order: 1,                                       // lower = earlier
    },
    // ...
  ],
}
```

## Authoring rules

1. **Every id is globally unique.** Thread ids, beat ids — each namespace is
   flat. Test enforces this.
2. **Origin game must be in `participatingGames`.** The origin is the canon
   authority; it would be incoherent for it to not participate. Test
   enforces this.
3. **Every beat's `emittedBy` must be a participant.** Test enforces this.
4. **Write the `canonicalDescription` as reference prose, not rendered
   dialog.** Writers on each game translate the description into game-
   appropriate rendering. The description is the shared source of truth.
5. **Use `order` to express canon sequencing, not real-time sequencing.**
   Two beats with the same order are intentionally unsequenced siblings.

## Runtime integration (receiving side)

```ts
import { getOrderedBeats, getThread } from "@shared/crossGameNarrativeThreads";

// In the Loredex Ark, when Cades FPS has emitted cades_fall_fall:
const beats = getOrderedBeats("cades_fall");
const fallHappened = flags.has("xgame_cades_fall_fall");
if (fallHappened) {
  // Add pilgrimage pin to Act 5 star map
}
```

## Runtime integration (emitting side)

```ts
// In Cades FPS, when the fall happens:
await fetch("/api/cross-game-thread/emit", {
  method: "POST",
  body: JSON.stringify({ beatId: "cades_fall_fall" }),
});
// The server sets xgame_cades_fall_fall on the player's flag set.
```

The server-side emit endpoint is out of scope for this scaffolding PR;
document the contract here and a future PR wires it up.

## Seed threads (shipped)

Three threads demonstrate the shape:

- **cades_fall** — Loredex (expulsion) → Cades FPS (arrival, fall) → Loredex
  (Act 5 map update)
- **programmers_gift** — Loredex (gift awarded) → Dead Man's Circuit (puzzle
  decoded)
- **last_words_echo** — Loredex (Last Words Light/Dark choice) → Cades FPS
  (radio fragment) → Dead Man's Circuit (closing motif)

## Verification

- `pnpm test apps/shared/crossGameNarrativeThreads.test.ts` — 9 tests
  covering id uniqueness, participant coherence, ordering, and the
  resolver helpers.
- `pnpm check` — type-check catches schema violations.
