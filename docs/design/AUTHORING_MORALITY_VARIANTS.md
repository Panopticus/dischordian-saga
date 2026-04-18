# Authoring morality / trust / act variants

**Status:** authoring landing pad. The infrastructure lives at
`apps/shared/moralityTrustActVariants.ts`. Writers extend the
`VARIANT_REGISTRY` array; the resolver applies a deterministic best-match
priority so writers never reason about precedence.

## The four gates

Every variant declares up to four gates. The resolver checks each; the entry
with the most specific passing gates wins.

| Gate | Values | Notes |
|---|---|---|
| `morality` | `machine` / `balanced` / `humanity` / `any` | Derived from `state.moralityScore` via `bandForMorality` (≤ -20 = machine, ≥ 20 = humanity, else balanced). |
| `trust` | `cold` / `neutral` / `warm` / `confidant` / `any` | Derived from companion trust via `bandForTrust` (≥ 80 = confidant, ≥ 50 = warm, ≥ 25 = neutral, else cold). Requires `trustCompanionId`. |
| `act` | `0`–`7` or `"any"` | Matches `state.narrativeAct` exactly. |
| `requiredFlags` | `string[]` or omitted | All flags must be true on `state.narrativeFlags`. |

## Shape of an entry

```ts
{
  id: "comms_array_first_entry_humanity",
  surface: "room",                     // one of: room, transmission, npc_line, journal, wheel_followup
  targetId: "comms-relay",             // surface-specific id
  text: "Elara exhales. Whatever you are on the way to, you are walking there with her.",
  morality: "humanity",
  trust: "any",
  act: 1,
}
```

## Authoring rules

1. **Every entry is a real alternative.** Never write `"[placeholder]"` or
   `"TODO"`. The test suite rejects stub markers and the release gate
   refuses to pass.
2. **One id per entry, globally.** Pattern: `{surface}_{descriptor}`.
3. **If you gate on trust, specify the companion.** The test enforces this.
4. **Prefer multiple specific entries over one generic one with conditionals
   inside the text.** The resolver picks the best match; let it.
5. **Don't duplicate the default.** The non-variant fallback is the room's
   base line. Only write a variant when the gated state *should* change the
   text.

## Consumer integration

```ts
import {
  VARIANT_REGISTRY,
  resolveVariant,
  type VariantResolutionInput,
} from "@shared/moralityTrustActVariants";

const input: VariantResolutionInput = {
  moralityScore: state.moralityScore ?? 0,
  narrativeAct: state.narrativeAct ?? 0,
  trustByCompanion: state.companionTrust ?? {},
  flags: new Set(
    Object.entries(state.narrativeFlags)
      .filter(([, v]) => v)
      .map(([k]) => k),
  ),
};

const variant = resolveVariant(
  VARIANT_REGISTRY,
  "room",
  "comms-relay",
  input,
);

// variant?.text is what to render. If null, use the default line.
```

## Seed entries

The registry ships with three seed entries that exercise the resolver in
tests. They are not exhaustive — they are there to show the shape and
prevent the resolver from dying in an empty-registry world.

## Verification

- `pnpm test apps/shared/moralityTrustActVariants.test.ts` — 8 tests covering
  bands, uniqueness, and all four gate combinations.
- `pnpm check` — type-check ensures every entry conforms to the schema.

## Relationship to other narrative infra in this PR

- `companionAskTopics.ts` — Q&A surface, gated by `unlockFlag + unlockedFromAct`.
  This module is the wider "any-line-on-any-surface" sibling.
- `companionComments.ts` — one-shot reactive toasts, gated by `trigger` ids.
  Use that when you want to *fire* a line on an event; use variants when you
  want to *select* a line on an existing surface.
- `act1OpponentDialog.ts` — structured per-opponent tables. Variants could
  layer on top once we want morality-gated alternates for specific opponent
  post-match reactions.
