# Authoring multistate room-mystery responses

**Status:** authoring guide for the lucid / fragmented / luminous (Elara) and
shadow / balanced / warm (Human) banded-narration pattern.

The pattern was established in
[`apps/shared/roomMysteries/bridge.ts`](../../apps/shared/roomMysteries/bridge.ts) —
the canonical reference. audit/16 PR 30 (Co6) extracted the authoring helpers
to [`apps/shared/roomMysteries/_template.ts`](../../apps/shared/roomMysteries/_template.ts)
so other rooms can adopt the pattern with less boilerplate.

## When to use multistate

Use banded triplets when a beat **carries narrative weight** — a clue that
reveals character history, a hotspot reaction that varies with the
narrator's cognitive state, a Human reaction that rotates by hidden-light
band. Don't use it for surface-level descriptions (the room's first-look
prose). Single-string narration is the right default; the triplet is the
exception you reach for when the line *should* land differently for a
fragmented Elara than for a luminous one.

## The two band axes

| Narrator | Bands | Driven by |
| --- | --- | --- |
| **Elara** | `lucid` / `fragmented` / `luminous` | Her stability score (`elaraStability` in GameContext) |
| **The Human** | `shadow` / `balanced` / `warm` | His hidden-light band (`humanLight` in GameContext) |

Bands are surfaced by the runtime via the resolver helpers
(`resolveBandedNarration`, `resolveHumanBandedNarration`). The author never
calls those — you produce the triplets, the runtime picks the band.

## Helpers (`_template.ts`)

```ts
import {
  bandedNarration,
  bandedHumanNarration,
  tieredResponses,
} from "./_template";
```

### `bandedNarration(lucid, fragmented, luminous)`

Build an `ElaraBandedText` triplet. Equivalent to writing
`{ lucid, fragmented, luminous }` longhand, but reads as one line of
authoring intent rather than three.

```ts
narration: bandedNarration(
  "Lucid: she sees the seams clearly. The Captain's chair is empty for a reason; the reason has a name; the name has been blank since they erased it.",
  "Fragmented: chair. chair. empty. empty. empty chair. they took the name. they took. they took.",
  "Luminous: the chair is empty because the previous bridge crew chose not to commit the name to the room's record — committing the name would have committed it to me, and they did not want me to carry the name without my consent. That is, in its way, an act of love.",
),
```

### `bandedHumanNarration(shadow, balanced, warm)`

Same idea for the Human's reaction strip. Reads from his hidden-light band:

```ts
humanReaction: {
  voId: "detective.bridge.captains-chair.look.t1",
  narration: bandedHumanNarration(
    "Shadow: she's not going to read it. She's going to ask me to read it for her.",
    "Balanced: the name is Theo Kael. The crew refused to write it because Elara had loved him too. I'll write it when she asks me to.",
    "Warm: she's going to ask me to write it. I will write it. The handwriting will be hers, not mine — that's the only way it counts.",
  ),
},
```

### `tieredResponses([...])`

Author a sequence of tier responses (Sierra-style "click again, learn a little
more"). Each entry is a partial `VerbResponse`; the helper is currently a
passthrough that exists primarily for **readability** — the call name signals
authoring intent and the array is the future hook for tier-aware automation
(consistency invariants, tier-N "you keep coming back to this" defaults, etc.).

```ts
tiers: tieredResponses([
  {
    narration: bandedNarration(
      "Tier 2 lucid line.",
      "Tier 2 fragmented line.",
      "Tier 2 luminous line.",
    ),
  },
  {
    narration: bandedNarration(
      "Tier 3 lucid line.",
      "Tier 3 fragmented line.",
      "Tier 3 luminous line.",
    ),
  },
]),
```

## The Bridge example

`apps/shared/roomMysteries/bridge.ts` is the canonical use of the pattern at
scale — 40+ banded triplets across 7 hotspots. Read it as the reference for:

- **How dense to author** (the Bridge banded text averages ~80 words per
  triplet — long enough to land, short enough to fit in the popup).
- **When to vary substantially** vs **when to vary the rhythm only** (the
  fragmented Elara is recognisable by repetition + sentence fragments;
  the luminous Elara is recognisable by retroactive context).
- **How to thread the Human's reaction** to the same beat (his band reflects
  the player's current relationship-with-him state, not Elara's stability).

## When NOT to use multistate

- **Surface-level look responses.** A first-pass description of the
  Captain's coffee cup doesn't need three bands. Single-string narration is
  fine.
- **Inventory grants.** A `use_item` response that grants a key + sets a
  flag should typically have a single-line confirmation; the bands-per-beat
  budget is for narrative weight, not mechanical confirmation.
- **Red-herring asides.** The `apps/client/src/game/adventureFeatures.ts`
  red-herring registry is intentionally band-agnostic — those are quick
  jokes; narrative weight isn't called for.

## Authoring rules

1. **Every band's text must stand on its own.** A reader who only ever
   sees the lucid path should still get the full beat. Don't author
   "lucid sets up, luminous pays off" — that breaks players who reach
   the beat in the wrong order.
2. **Keep the rhythm consistent across bands.** Fragmented is repetition +
   short sentences; lucid is grounded prose; luminous is retroactive
   context with longer clauses. If your triplet has the SAME rhythm
   across all three bands, the band axis isn't doing work — drop it.
3. **No band exceeds 200 words.** The popup truncates aggressively past
   that point. The Bridge averages 80; cap your authoring at 200.
4. **The Human's bands aren't aligned to Elara's.** Don't try to map
   shadow↔fragmented or warm↔luminous. They're independent state
   variables; a player can be `lucid + shadow` or `fragmented + warm`.

## Verification

- `pnpm test apps/shared/roomMysteries/_template.test.ts` — exercises the
  helpers + the resolver round-trip.
- `pnpm check` — type-check ensures every banded triplet conforms.

## Roadmap

- The Bridge file (`apps/shared/roomMysteries/bridge.ts`) currently uses
  the longhand `{ lucid, fragmented, luminous }` literal in every
  triplet — the helpers ship in this PR but the file itself isn't yet
  refactored. Future PR will mechanically replace each literal with a
  `bandedNarration(...)` call (no semantic change; pure ergonomic win).
- Cipher Den, Memorial Corridor, and Archives are candidates for adopting
  the pattern next — each has narrative-weight beats that currently render
  as single-string narration.
