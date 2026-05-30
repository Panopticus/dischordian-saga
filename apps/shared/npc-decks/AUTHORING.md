# NPC Deck Authoring Contract

This document describes how to add a new NPC to the dialog → duel →
harvest loop introduced by the pilot wiring on `the_degen`.

The loop:

```
   Dialog tree (perspective_gathering) → challenge: { npcKey }
        ↓
   buildNpcDeck(npcKey, learnedAspects)
        ↓
   DuelystGameUI (existing surface)
        ↓
   dispatchNpcDuelVictory({ userId, npcKey, learnedAspects })
        ↓
   grantCardReward × N + flag writes
```

The system is two infrastructure files + per-NPC content:

- **Infrastructure (Phase 1; shipped, stable)**
  - `apps/shared/npc-decks/_template.ts` — the `NpcDeck` type
  - `apps/shared/npc-decks/buildNpcDeck.ts` — composition resolver,
    reward-tier projection, legality assertion
  - `apps/shared/npc-decks/index.ts` — registry barrel; load-time
    legality check
  - `apps/server/services/dispatchNpcDuelVictory.ts` — server
    match-end dispatcher
  - `apps/shared/campaign/applyDialogChoice.ts` — `challenge` outcome
    fold (`ChallengeWrite`)
  - `apps/shared/campaign/dispatchOutcomeBundle.ts` —
    `recordChallengeIntent` callback

- **Per-NPC content (every wave)**
  - `apps/shared/npc-decks/<npc>.ts` — `NpcDeck` declaration
  - `apps/shared/npc-decks/index.ts` — add to `ENTRIES`
  - `apps/shared/npcs/dialogTrees/<npc>/perspective_gathering.ts` —
    dialog tree with N aspect-gathering nodes + a challenge node
  - `apps/shared/npcs/dialogTrees/index.ts` — register the new tree
  - `apps/shared/tcg-core/rewards/cardRewardRegistry.ts` — four
    reward sources (`defeated_npc_<npc>_tier_0|1|2|3`)

---

## Adding a new NPC end-to-end

### 1. Author the deck

Create `apps/shared/npc-decks/<npcKey>.ts` exporting an `NpcDeck`:

```ts
import type { NpcDeck } from "./_template";

export const <NPC_KEY_UPPER>_DECK: NpcDeck = {
  npcKey: "<npc_key>",
  general: "<general_card_def_id>",        // a cardType: "general" card
  coreMemories: [/* 33 card def ids */],
  inheritedFragments: [
    {
      fromNpcId: "<npc_key>" | "potential",
      cardDefId: "<card_def_id>",
      flavorOverride: "...optional flavor text override...",
    },
    // 2-4 of these
  ],
  advantageCards: [
    {
      cardDefId: "<secret_weapon_card_def_id>",
      gatedByAspect: "<npc_key>:<aspect_name>",
      replacement: "<weaker_revealed_card_def_id>",
    },
    // one per declared aspect
  ],
  challengeMotive: [/* 2-4 card def ids the NPC wants from the player */],
  perspectiveAspects: [
    { id: "<npc_key>:<aspect_1>", label: "Human-readable label" },
    // typically 3 aspects (motive / wound / contradiction)
  ],
};
```

**Deck legality rules** (enforced by `assertNpcDeckIsLegal` at module load):
- `coreMemories.length + inheritedFragments.length + advantageCards.length === 39`
- Every `advantageCards[i].gatedByAspect` appears in `perspectiveAspects`
- Every `perspectiveAspects[i].id` is gated by exactly one advantage card
- (Card def ids are not validated here; runtime fails at match init if unknown.)

### 2. Register the deck

Add to `apps/shared/npc-decks/index.ts`:

```ts
import { <NPC_KEY_UPPER>_DECK } from "./<npc_key>";

const ENTRIES: ReadonlyArray<NpcDeck> = [
  THE_DEGEN_DECK,
  <NPC_KEY_UPPER>_DECK,
];
```

### 3. Author the perspective-gathering dialog tree

Create `apps/shared/npcs/dialogTrees/<npc_key>/perspective_gathering.ts`.

Pattern (see `the_degen/perspective_gathering.ts` for the canonical
worked example):

- **Root node** — offer N aspect-gathering choices + a direct
  challenge choice. Each aspect choice writes `sets: "<npc_key>:<aspect>"`
  so the dispatcher reads it later, and optionally `publicFlag:` for
  cross-NPC echoes.
- **One node per aspect** — the NPC's voice answering the question.
  All terminate to an `after_aspect` node.
- **`after_aspect`** — offer remaining aspect questions + the
  challenge choice + a `come back` exit.
- **`challenge_offer`** — pre-duel confirmation. The choice that
  fires the duel carries `challenge: { npcKey: "<npc_key>" }`.
- **`challenge_accepted`** — terminal stub the runner shows briefly
  while the duel mounts. The runner reads the `challenge` outcome
  off the choice that brought us here, not off the node we land on.

### 4. Register the dialog tree

Add to `apps/shared/npcs/dialogTrees/index.ts`:

```ts
import { <NPC_KEY_UPPER>_PERSPECTIVE_GATHERING } from "./<npc_key>/perspective_gathering";

const PER_NPC_TREES: ReadonlyArray<NpcDialogTree> = [
  // ...
  <NPC_KEY_UPPER>_PERSPECTIVE_GATHERING,
];
```

### 5. Register the four reward sources

Add to `apps/shared/tcg-core/rewards/cardRewardRegistry.ts`:

```ts
{
  id: "defeated_npc_<npc_key>_tier_0",
  sourceSystem: "npc_duel",
  triggerCondition: "Defeat <npc_key> with 0 perspective aspects learned",
  rewardType: "fixed",
  fixedCardDefId: "<a single generic memory card>",
  rarity: "common",
  description: "...",
},
{
  id: "defeated_npc_<npc_key>_tier_1",
  sourceSystem: "npc_duel",
  triggerCondition: "Defeat <npc_key> with some perspective aspects learned",
  rewardType: "random_pool",
  pool: [/* 3-5 weighted entries from coreMemories */],
  rarity: "rare",
  description: "...",
},
{
  id: "defeated_npc_<npc_key>_tier_2",
  sourceSystem: "npc_duel",
  triggerCondition: "Defeat <npc_key> with most perspective aspects learned",
  rewardType: "random_pool",
  pool: [/* 6-8 weighted entries */],
  rarity: "epic",
  description: "...",
},
{
  id: "defeated_npc_<npc_key>_tier_3",
  sourceSystem: "npc_duel",
  triggerCondition: "Defeat <npc_key> with all perspective aspects learned",
  rewardType: "fixed",
  fixedCardDefId: "<signature card — usually the NPC's own>",
  rarity: "legendary",
  description: "...",
},
```

The server dispatcher's tier-3 path additionally grants every
`coreMemories` card as a memorial — there's no extra config needed
for the full-deck inheritance; it falls out of the tier-3 branch.

### 6. (Optional) Cross-NPC echo lines

If the new NPC has feelings about defeats of already-shipped NPCs,
author conditional opening lines on its `first_meeting` tree:

```ts
{
  label: "...",
  nextId: "...",
  requires: "player_carries_<other_npc_key>_memory",  // public_flag
}
```

These are pure dialog authoring — no infrastructure change. The
public-flag rail is the same one `dispatchNpcDuelVictory` writes on
victory.

### 7. Verify

- `pnpm check` — the registry barrel's load-time
  `assertNpcDeckIsLegal()` will catch malformed decks during typecheck
  (the assertion fires at module evaluation).
- `pnpm vitest run apps/shared/npc-decks` — runs the deck-composition
  + reward-tier + legality tests against the registry.
- `pnpm vitest run apps/shared/npcs/dialogTrees` — runs the dialog
  tree connectivity + npcKey consistency lints against every tree
  in `ALL_NPC_DIALOG_TREES`.

---

## Reward economy

The four tiers exist so authors don't have to balance per-aspect.
The mapping is fixed by `npcDuelRewardTier()`:

| learned aspects | total aspects | tier | grants |
|---|---|---|---|
| 0 | N | 0 | 1 fixed card |
| 1 | 3 | 1 | 3 pool draws |
| 2 | 3 | 2 | 6 pool draws |
| 3 | 3 | 3 | 1 signature + 33 memorial |

For NPCs with 4+ aspects, tier 1 covers `< 0.5` of aspects learned
and tier 2 covers `>= 0.5` (rounded by integer ratio). Tier 3 only
fires when ALL declared aspects are learned.

---

## Loss path

`dispatchNpcDuelLoss(userId, npcKey)` walks the NPC's
`challengeMotive` list in declaration order, decrements the
`user_cards.quantity` of the first owned match by 1 (deleting the
row if quantity drops to 0), and writes two flags:

- `lost_to_npc:<npcKey>` (always written)
- `taken_by_<npcKey>:<cardDefId>` (written only when a match was found)

On the next victory against the same NPC, `dispatchNpcDuelVictory`
reads every `taken_by_<npcKey>:*` flag, increments the corresponding
card's quantity, and clears each flag. The result is "you lost a
card to them and won it back on rematch" — Pokémon-style mutual
stakes, fully resolved through the existing user_cards table without
a new schema.

The router exposes `recordLoss(npcKey)` for the client to call from
the match-end handler. `NpcDuelOverlay` already wires this in its
loss branch and renders the consolation card naming what was taken.

For NPCs whose `challengeMotive` doesn't intersect the player's
collection, the loss has no card penalty — only the
`lost_to_npc:<npcKey>` flag is written. That's intentional: a
player who hasn't built a deck the NPC cares about doesn't get
punished for losing.
