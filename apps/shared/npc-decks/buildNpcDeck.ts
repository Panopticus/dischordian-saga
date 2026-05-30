// apps/shared/npc-decks/buildNpcDeck.ts
//
// Pure deck-composition resolver. Given an NpcDeck declaration and a
// snapshot of which perspective aspects the player has learned,
// returns the concrete 39-card deck the engine consumes at match
// init.
//
// Determinism contract: same (npcDeck, learnedAspects) input → bit-
// identical output. The function does NOT shuffle — that's the
// engine's job in createMatchState, seeded by matchId. The result
// here is an authored card list; the engine treats it as the
// pre-shuffle deck.

import type { NpcDeck, CardDefIdRef, PerspectiveAspectId } from "./_template";

export interface BuildNpcDeckResult {
  /** General card-def id (the boss face). */
  general: CardDefIdRef;
  /** The composed 39-card deck. Format-legal by construction. */
  deck: ReadonlyArray<CardDefIdRef>;
  /** Echo channel — which aspects were applied as deck mutations. */
  appliedAspects: ReadonlyArray<PerspectiveAspectId>;
  /** Echo channel — which cross-memory upgrades fired (one entry
   *  per swapped card). Empty when the NPC has no crossMemoryUpgrades
   *  authored or the player carries no other-NPC memories. */
  appliedCrossMemoryUpgrades: ReadonlyArray<{
    weakerCardDefId: CardDefIdRef;
    strongerCardDefId: CardDefIdRef;
    threshold: number;
  }>;
}

/** Optional context for buildNpcDeck — currently just the
 *  cross-NPC memory count (the number of OTHER NPCs the player has
 *  defeated). Pass an empty object or omit for the legacy behavior. */
export interface BuildNpcDeckContext {
  crossMemoryCount?: number;
}

/** Compose the NPC's concrete deck for a single challenge match.
 *
 *  Algorithm:
 *    1. Start with coreMemories (the lived experience).
 *    2. Append inheritedFragments (Highlander chain cards).
 *    3. For each advantage card: include the secret-weapon variant
 *       if the gating aspect is UNLEARNED, the replacement if
 *       LEARNED.
 *    4. For each crossMemoryUpgrade whose threshold is met by
 *       ctx.crossMemoryCount, swap the FIRST occurrence of the
 *       weaker card in the composed deck for the stronger variant.
 *       The NPC adapts mechanically when the player carries more
 *       prior victories.
 *
 *  The composed length is invariant under aspect / cross-memory
 *  changes because every swap is 1:1 — the deck stays at exactly
 *  39 cards. This keeps replay determinism intact. */
export function buildNpcDeck(
  npcDeck: NpcDeck,
  learnedAspects: ReadonlySet<PerspectiveAspectId>,
  ctx?: BuildNpcDeckContext,
): BuildNpcDeckResult {
  const deck: CardDefIdRef[] = [];
  const applied: PerspectiveAspectId[] = [];
  const appliedUpgrades: Array<{
    weakerCardDefId: CardDefIdRef;
    strongerCardDefId: CardDefIdRef;
    threshold: number;
  }> = [];

  for (const cardDefId of npcDeck.coreMemories) {
    deck.push(cardDefId);
  }

  for (const fragment of npcDeck.inheritedFragments) {
    deck.push(fragment.cardDefId);
  }

  for (const swap of npcDeck.advantageCards) {
    if (learnedAspects.has(swap.gatedByAspect)) {
      deck.push(swap.replacement);
      applied.push(swap.gatedByAspect);
    } else {
      deck.push(swap.cardDefId);
    }
  }

  // Cross-memory upgrades. Iterate in declaration order; each
  // upgrade whose threshold ≤ crossMemoryCount fires once. The
  // swap mutates the first matching card def id occurrence, so a
  // single weaker card listed multiple times in coreMemories is
  // upgraded one at a time — authors get fine-grained control by
  // declaring multiple upgrade entries with the same weakerCardDefId.
  const crossMemoryCount = ctx?.crossMemoryCount ?? 0;
  if (npcDeck.crossMemoryUpgrades && crossMemoryCount > 0) {
    for (const upgrade of npcDeck.crossMemoryUpgrades) {
      if (crossMemoryCount < upgrade.threshold) continue;
      const idx = deck.indexOf(upgrade.weakerCardDefId);
      if (idx === -1) continue;
      deck[idx] = upgrade.strongerCardDefId;
      appliedUpgrades.push({
        weakerCardDefId: upgrade.weakerCardDefId,
        strongerCardDefId: upgrade.strongerCardDefId,
        threshold: upgrade.threshold,
      });
    }
  }

  return {
    general: npcDeck.general,
    deck,
    appliedAspects: applied,
    appliedCrossMemoryUpgrades: appliedUpgrades,
  };
}

/** Reward tier as a function of how many perspective aspects the
 *  player learned BEFORE issuing the challenge. Used by the server
 *  dispatcher to pick which `defeated_npc_<npcKey>_tier_<N>` reward
 *  source to fan out. Bounded to [0, 3]; counts above the NPC's
 *  declared aspect count clamp to 3 (the "full understanding"
 *  tier).
 *
 *  The thresholds are deliberately coarse — content authors don't
 *  have to balance per-aspect reward economy, just per-NPC. */
export function npcDuelRewardTier(
  learnedAspectCount: number,
  totalAspectCount: number,
): 0 | 1 | 2 | 3 {
  if (totalAspectCount <= 0) return 0;
  if (learnedAspectCount <= 0) return 0;
  if (learnedAspectCount >= totalAspectCount) return 3;
  // Two interior tiers: t1 below half, t2 at-or-above half.
  const ratio = learnedAspectCount / totalAspectCount;
  return ratio < 0.5 ? 1 : 2;
}

/** Count how many of the NPC's declared aspects appear in the
 *  player's learned-aspects set. Used by callers (server router,
 *  dispatcher, dialog runner) that want a single number for the
 *  reward tier without iterating themselves. */
export function countLearnedAspectsForNpc(
  npcDeck: NpcDeck,
  learnedAspects: ReadonlySet<PerspectiveAspectId>,
): number {
  let n = 0;
  for (const aspect of npcDeck.perspectiveAspects) {
    if (learnedAspects.has(aspect.id)) n++;
  }
  return n;
}

/** Assert that the NpcDeck is well-formed:
 *    - every advantageCards[i].gatedByAspect appears in perspectiveAspects;
 *    - every perspectiveAspects[i].id appears on exactly one
 *      advantageCards[i].gatedByAspect (no orphan aspects, no double-gating);
 *    - inheritedFragments + advantageCards + coreMemories sum to 39.
 *
 *  Throws a descriptive Error on violation. Called by the deck
 *  registry barrel at load time + by the unit tests. */
export function assertNpcDeckIsLegal(npcDeck: NpcDeck): void {
  const aspectIds = new Set(npcDeck.perspectiveAspects.map((a) => a.id));
  const gatedAspectIds = new Set<PerspectiveAspectId>();
  for (const swap of npcDeck.advantageCards) {
    if (!aspectIds.has(swap.gatedByAspect)) {
      throw new Error(
        `[npc-decks:${npcDeck.npcKey}] advantageCards references unknown aspect "${swap.gatedByAspect}"`,
      );
    }
    if (gatedAspectIds.has(swap.gatedByAspect)) {
      throw new Error(
        `[npc-decks:${npcDeck.npcKey}] aspect "${swap.gatedByAspect}" is gated by more than one advantage card`,
      );
    }
    gatedAspectIds.add(swap.gatedByAspect);
  }
  for (const aspect of npcDeck.perspectiveAspects) {
    if (!gatedAspectIds.has(aspect.id)) {
      throw new Error(
        `[npc-decks:${npcDeck.npcKey}] perspectiveAspect "${aspect.id}" is not gated by any advantage card`,
      );
    }
  }
  const total =
    npcDeck.coreMemories.length +
    npcDeck.inheritedFragments.length +
    npcDeck.advantageCards.length;
  if (total !== 39) {
    throw new Error(
      `[npc-decks:${npcDeck.npcKey}] composed deck size is ${total}, expected 39 (core ${npcDeck.coreMemories.length} + fragments ${npcDeck.inheritedFragments.length} + advantage ${npcDeck.advantageCards.length})`,
    );
  }
}
