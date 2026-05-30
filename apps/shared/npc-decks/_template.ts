// apps/shared/npc-decks/_template.ts
//
// Per-NPC deck registry — type definitions.
//
// Every NPC the player can challenge declares its own NpcDeck. The deck
// composes at match init via `buildNpcDeck(npcKey, playerState)` which
// reads the player's learned perspective aspects and challenge motive
// to produce a concrete 39-card list. This is the load-bearing seam for
// the "more you learn, the better your odds + better reward" mechanic
// the dialog tree → duel → harvest loop rides on.
//
// Conventions:
//   - coreMemories + inheritedFragments + (swap-resolved advantageCards)
//     MUST sum to exactly 39 cards (Duelyst format size). Enforced by
//     `assertNpcDeckIsLegal()` in buildNpcDeck.ts.
//   - perspectiveAspects MUST have ids of the form "<npcKey>:<aspect>"
//     so the resolver can pluck them out of the player's narrative-flag
//     set without ambiguity.
//   - All CardDefIds referenced MUST exist in the shipped card registry;
//     unknown ids fail the deck-legality assertion at load time.
//   - challengeMotive cards are NOT added to the NPC's deck — they
//     describe what the NPC wants from the *player's* deck. The dialog
//     authoring uses them to surface conditional opening lines ("I sense
//     you carry the <card.name>; I want it.").

import type { NpcKey } from "../npcs/types";

/** Stable id for a perspective aspect — "<npcKey>:<aspect>" by convention.
 *  Each aspect is set by exactly one dialog choice via `sets:` and
 *  represents one of the NPC's load-bearing inner facets (motive /
 *  wound / contradiction by default; bibles may author more). */
export type PerspectiveAspectId = string;

/** Card-id reference. Stays a plain string at this layer — the deck
 *  registry validates against the shipped `ALL_CARD_DEFINITIONS` at
 *  load time via assertNpcDeckIsLegal so authors can't reference
 *  unknown ids. */
export type CardDefIdRef = string;

/** A single advantage-card swap entry. Each perspective the player
 *  learns about the NPC strips one of these out of the deck and
 *  substitutes its replacement — knowledge becomes strategic
 *  vulnerability for the NPC. */
export interface AdvantageCardSwap {
  /** The NPC's secret-weapon card. Present in the composed deck iff
   *  the gating aspect has NOT been learned by the player. */
  cardDefId: CardDefIdRef;
  /** Perspective aspect that exposes (and removes) this card. MUST
   *  match one of the perspectiveAspects[i].id values declared on the
   *  same NpcDeck. */
  gatedByAspect: PerspectiveAspectId;
  /** Replacement card swapped in when the aspect is learned. Authors
   *  pick a weaker / thematically-revealed card. */
  replacement: CardDefIdRef;
}

/** A card the NPC inherited from a canon-authored Highlander defeat.
 *  Renders in the deck with an alternate flavor line attributing it
 *  to the prior owner. Static per NPC — no runtime inheritance.
 *  The `fromNpcId` is "potential" for cards taken from un-named
 *  defeated potentials (the most common case for Phase 1 authoring). */
export interface InheritedFragment {
  fromNpcId: NpcKey | "potential";
  cardDefId: CardDefIdRef;
  /** Optional flavor override used by the renderer; ungated by the
   *  engine (purely cosmetic). */
  flavorOverride?: string;
}

/** A single perspective aspect the player can learn about this NPC.
 *  Aspects are independent of the perspectiveCanon registry — they
 *  represent per-NPC inner facets (motive / wound / contradiction)
 *  while perspectiveCanon represents whole-storyline lenses.
 *
 *  Each aspect is set by exactly one dialog choice via `sets:` and
 *  read by the dispatcher at match-end to size the card-harvest. */
export interface PerspectiveAspect {
  /** "<npcKey>:<aspect>" — e.g. "the_degen:lonely_void". */
  id: PerspectiveAspectId;
  /** Human-readable label for the codex / authoring docs. */
  label: string;
}

/** A cross-NPC memory upgrade — fires when the player has defeated
 *  enough OTHER NPCs that the current NPC adapts mechanically.
 *
 *  The mechanic: every NPC the player has defeated is recorded as
 *  `player_carries_<npcKey>_memory` in npc_public_flags. When the
 *  count of carried-memories (excluding the current NPC) crosses
 *  the threshold, buildNpcDeck swaps the weaker card for the
 *  stronger variant. The NPC is "playing harder" because they
 *  respect (or fear) the player's track record.
 *
 *  Authoring contract: thresholds are 1-indexed (threshold:1 fires
 *  on first carried memory). Upgrades are applied in the order
 *  declared, one per crossed threshold. The deck size stays at
 *  39 — each upgrade is a 1:1 swap. */
export interface CrossMemoryUpgrade {
  /** The card in coreMemories that gets replaced when threshold met. */
  weakerCardDefId: CardDefIdRef;
  /** The card swapped in. */
  strongerCardDefId: CardDefIdRef;
  /** How many other-NPC memories the player must carry for this
   *  upgrade to fire. */
  threshold: number;
}

/** The full per-NPC deck declaration. One per NPC that the player
 *  can challenge. Authored as static data — no runtime state. */
export interface NpcDeck {
  /** Canonical NPC key (apps/shared/npcs/types.ts NpkKey union). */
  npcKey: NpcKey;
  /** General card id (the boss face). Must be a `cardType: "general"`
   *  CardDefinition. */
  general: CardDefIdRef;
  /** The NPC's lived-experience deck. 25-28 cards by convention —
   *  the exact count balances against the inheritedFragments and
   *  advantageCards counts so the composed deck is exactly 39 cards
   *  (Duelyst format size). */
  coreMemories: ReadonlyArray<CardDefIdRef>;
  /** Cards inherited from canon-authored Highlander defeats. 2-4
   *  per NPC by convention. Each represents a potential the NPC
   *  defeated in lore. */
  inheritedFragments: ReadonlyArray<InheritedFragment>;
  /** Advantage-card swaps — each one is gated by a perspective
   *  aspect. The composed deck includes the secret-weapon card
   *  when the aspect is UNLEARNED, the replacement when LEARNED. */
  advantageCards: ReadonlyArray<AdvantageCardSwap>;
  /** Cards the NPC wants from the player's collection. Surfaced by
   *  dialog authoring as opening-line conditionals; on player-loss,
   *  one is taken (recovered on rematch win). */
  challengeMotive: ReadonlyArray<CardDefIdRef>;
  /** Per-NPC perspective aspects. Each entry's id MUST appear in
   *  exactly one advantageCards[i].gatedByAspect or the resolver
   *  cannot translate learning into deck mutation. */
  perspectiveAspects: ReadonlyArray<PerspectiveAspect>;
  /** Optional cross-NPC adaptation. When the player has defeated
   *  multiple other NPCs (each leaves a `player_carries_<key>_memory`
   *  public flag), the NPC fields stronger variants of cards from
   *  their coreMemories. NPCs without crossMemoryUpgrades behave
   *  identically regardless of the player's track record — only
   *  bibles that warrant the adaptation (Locke noting prior
   *  contracts, the Seer naming the version where the player
   *  arrived carrying more) author this. */
  crossMemoryUpgrades?: ReadonlyArray<CrossMemoryUpgrade>;
}
