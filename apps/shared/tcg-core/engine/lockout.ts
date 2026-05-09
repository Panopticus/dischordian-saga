/**
 * §5.5 Warlord three-move lockout — pure helpers.
 *
 * Authored against the spec at
 * docs/production/act1/warlord-three-move-mechanic.md. The lockout is
 * activated when the Warlord plays the `s1_warlord_three_moves` card on
 * her third turn; it constrains the player's hand for the next three
 * player turns by Warlord-selecting two cards as playable and locking
 * the rest.
 *
 * This module contains the pure machinery: card-evaluation heuristic,
 * playable-set selection, lockout activation/tick/clear, and the
 * locked-card check. The cast interceptor in engine/playCard.ts and the
 * end-turn / refresh-turn hooks in engine/{reducer,turn}.ts call these
 * helpers; no side-effects (events / state mutation) live here.
 */
import type { Draft } from "immer";
import type { GameState, PlayerState } from "../types/GameState";
import type { CardInstance, CardDefinition } from "../types/Card";
import type { GameEvent } from "../types/Event";
import type { Side } from "../types/Ids";
import type { CardRegistry } from "../types/GameState";

/**
 * The Warlord-only card whose cast initiates the lockout. The cast
 * interceptor in playCard.ts compares against this id.
 */
export const THREE_MOVES_CARD_DEF_ID = "s1_warlord_three_moves";

/**
 * How many player turns the lockout lasts (spec §2.2 — "the lockout
 * reduces the player's option set for turns 4, 5, and 6").
 */
export const LOCKOUT_DURATION_TURNS = 3;

/**
 * How many cards remain unlocked per player turn during the lockout
 * (spec §2.4 — "the player's visible hand is narrowed to two playable
 * cards per turn"). Spec §4 designates this a tuning knob — bump to 3
 * if playtest shows sub-target win rates across deck compositions; do
 * not lower below 2.
 */
export const LOCKOUT_NARROW_TO = 2;

/**
 * Faction whose cards are categorically immune to lockout narrowing
 * (spec §2.4 escape hatch — "Insurgency's mechanical identity is
 * breaking rules, and the lockout is a rule").
 */
const LOCKOUT_IMMUNE_FACTION = "insurgency" as const;

/* ──────────────────────────────────────────────────────────────────── */
/*  Card evaluation: "least favorable to player's current board"       */
/* ──────────────────────────────────────────────────────────────────── */

/**
 * Score a single hand card against the current board, higher = more
 * favorable to the player. Used inversely by the Warlord's selection:
 * the two HIGHEST-scoring (most-favorable) non-immune cards become the
 * locked set, leaving the player with the LEAST-favorable two as their
 * "choice" — the spec's framing is that the Warlord prunes the future
 * branches she judges weakest for her, which is the player's strongest.
 *
 * The heuristic is deliberately simple — first-cut Act 1 difficulty
 * tuning is more about indicator legibility than AI sophistication.
 * Reference factors and weights:
 *
 *   +25  card cost ≤ player.mana                  (immediately playable)
 *   +12  per friendly unit on board, if card has any heal/buff op
 *        (heuristic via card-type proxy: spells with `buff`/`heal` ops)
 *   +10  card.cardType === 'unit' AND board has empty tiles
 *   + 8  card.cardType === 'spell' (utility scales with board state)
 *   + 5  per offensive keyword (rush/celerity/blast/frenzy)
 *   - 5  per cost point exceeding player.mana       (unaffordable)
 *
 * The output is a non-negative integer; comparisons are stable in
 * insertion order on ties (the selection step uses an order-preserving
 * sort).
 */
export function scoreHandCardForLockout(
  card: CardInstance,
  def: CardDefinition,
  player: PlayerState,
  board: GameState["board"],
  side: Side,
): number {
  let score = 0;

  // Affordability: immediately playable cards are most favorable.
  const overage = def.cost - player.mana;
  if (overage <= 0) score += 25;
  else score -= 5 * overage;

  // Friendly board count (excluding general).
  let friendlyCount = 0;
  let emptyTiles = 0;
  for (const e of Object.values(board)) {
    if (e.card.owner === side && !e.isGeneral) friendlyCount++;
  }
  // Cheap empty-tile estimate: 9 wide × 5 tall - occupied count.
  emptyTiles = 9 * 5 - Object.keys(board).length;

  // Heal/buff spells scale with friendly presence.
  const opNames = collectOpNames(def);
  if (opNames.has("heal") || opNames.has("buff")) {
    score += 12 * friendlyCount;
  }

  // Units want empty space to deploy into.
  if (def.cardType === "unit" && emptyTiles > 0) score += 10;

  // Spells with utility keywords scale linearly with board complexity.
  if (def.cardType === "spell") score += 8;

  // Aggressive keywords add value regardless of board state.
  const offensiveKeywords = new Set([
    "rush",
    "celerity",
    "blast",
    "frenzy",
  ]);
  for (const kw of def.keywords) {
    if (offensiveKeywords.has(kw)) score += 5;
  }

  // audit/16 PR 20 (finding TCG4) — late-game scoring override.
  //
  // Pre-audit, scoring favoured affordability above all else.
  // Late game (mana ≥ 6) affordability is a given — every card
  // in hand is castable — so the early-game weight on
  // "immediately playable" stops carrying signal. The audit
  // asked for a late-game branch that uses raw threat + AoE
  // awareness + combo potential instead.
  //
  // The branch ADDS to the existing score (it doesn't replace),
  // so cards that score well early continue to score well late;
  // the additions reward late-game-relevant attributes.
  if (player.mana >= 6) {
    // Raw threat: stat total per cost dominates vs affordability.
    // Higher-impact units (huge legendaries, finishers) get a
    // significant boost in the lockout's "favourable" set.
    const power = def.baseStats?.power ?? 0;
    const health = def.baseStats?.health ?? 0;
    const rawThreat = power + health;
    if (rawThreat >= 12) score += 20;
    else if (rawThreat >= 8) score += 12;

    // AoE awareness — cards with `deal_damage_all` or other
    // board-clearing ops are disproportionately valuable late
    // because the board is fuller. Detected via collected ops.
    if (
      opNames.has("deal_damage_all") ||
      opNames.has("destroy_all") ||
      opNames.has("banish_all")
    ) {
      score += 18;
    }

    // Combo potential: spells with multiple effect ops (the
    // chain length is a proxy for combo flexibility). A 4-op
    // spell at high mana is usually a finisher; a 2-op spell
    // is utility.
    const opCount = opNames.size;
    if (def.cardType === "spell" && opCount >= 4) score += 10;
  }

  return Math.max(0, score);
}

/**
 * Walk the card's effect tree and collect the set of `op` names. Used
 * by the heuristic to detect heal/buff cards without hard-coding card
 * ids. Loose any-typing because the effect tree is intentionally
 * unstructured at the TS layer (see types/Card.ts comment).
 */
function collectOpNames(def: CardDefinition): Set<string> {
  const out = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visit = (n: any): void => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) {
      for (const c of n) visit(c);
      return;
    }
    if (typeof n.op === "string") out.add(n.op);
    for (const k of Object.keys(n)) visit(n[k]);
  };
  for (const a of def.abilities) visit(a.effect);
  return out;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Playable-set selection                                              */
/* ──────────────────────────────────────────────────────────────────── */

export interface PartitionedHand {
  /** EntityIds the player MAY play this turn. */
  playable: readonly string[];
  /** EntityIds the player MAY NOT play this turn (lockout-narrowed). */
  locked: readonly string[];
}

/**
 * Pick which of the player's hand cards remain playable during a
 * lockout turn. Insurgency-faction cards are unconditionally playable
 * (spec §2.4 escape hatch); all other cards are sorted by
 * `scoreHandCardForLockout` and the top `narrowTo` are LOCKED (the
 * Warlord prunes the player's strongest branches), leaving the rest
 * unlocked. If the non-immune set is smaller than `narrowTo`, the
 * Warlord still locks all of it — the immune cards alone become the
 * playable set.
 *
 * Tied scores resolve in entityId-stable insertion order; this keeps
 * the selection deterministic across replays.
 */
export function partitionLockedHand(
  hand: readonly CardInstance[],
  registry: CardRegistry,
  player: PlayerState,
  board: GameState["board"],
  side: Side,
  narrowTo: number = LOCKOUT_NARROW_TO,
): PartitionedHand {
  const immune: string[] = [];
  const ranked: Array<{ entityId: string; score: number }> = [];
  for (const card of hand) {
    const def = registry.get(card.defId);
    if (!def) {
      // Unknown defId — defensively treat as immune so the player
      // isn't locked out of a card the registry can't classify.
      immune.push(card.entityId);
      continue;
    }
    if (def.faction === LOCKOUT_IMMUNE_FACTION) {
      immune.push(card.entityId);
      continue;
    }
    ranked.push({
      entityId: card.entityId,
      score: scoreHandCardForLockout(card, def, player, board, side),
    });
  }

  // Sort highest score first, ties broken by entityId for replay stability.
  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entityId < b.entityId ? -1 : a.entityId > b.entityId ? 1 : 0;
  });

  // Top `narrowTo` non-immune cards are locked (Warlord prunes strongest).
  const lockedFromRanked = ranked.slice(0, narrowTo).map((r) => r.entityId);
  const playableFromRanked = ranked.slice(narrowTo).map((r) => r.entityId);

  return {
    playable: [...immune, ...playableFromRanked],
    locked: lockedFromRanked,
  };
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Activation / tick / clear                                           */
/* ──────────────────────────────────────────────────────────────────── */

/**
 * Activate the lockout. Called by playCard.ts when the Warlord casts
 * `s1_warlord_three_moves`. Sets `state.lockout` and pushes the
 * `architect_reality_edit_witnessed` + `warlord_lockout_started`
 * events. The playable/locked partitioning is intentionally LEFT
 * EMPTY here — re-evaluation happens at the start of each player turn
 * in refreshTurnForPlayer (spec §2.4.3 — "re-evaluated per turn").
 *
 * @param playerSide which side the player is on (lockout targets the
 *   non-Warlord player; on Three Moves cast, this is the side opposite
 *   the casting player).
 */
export function activateLockout(
  draft: Draft<GameState>,
  playerSide: Side,
  events: GameEvent[],
): void {
  draft.lockout = {
    targetSide: playerSide,
    turnsRemaining: LOCKOUT_DURATION_TURNS,
    playableEntityIds: [],
    lockedEntityIds: [],
    witnessed: true,
  };
  events.push({
    type: "architect_reality_edit_witnessed",
    player: playerSide,
  });
  events.push({
    type: "warlord_lockout_started",
    player: playerSide,
    turnsRemaining: LOCKOUT_DURATION_TURNS,
  });
}

/**
 * Recompute the player's playable/locked hand partition for the
 * current turn. Called from refreshTurnForPlayer when a player turn
 * begins under an active lockout. No-op if the lockout is absent.
 */
export function reevaluateLockout(
  draft: Draft<GameState>,
  playerSide: Side,
  registry: CardRegistry,
  events: GameEvent[],
): void {
  if (!draft.lockout) return;
  const player = draft.players[playerSide];
  const partitioned = partitionLockedHand(
    player.hand,
    registry,
    player,
    draft.board,
    playerSide,
  );
  // Copy into mutable arrays — Immer drafts unwrap readonly arrays
  // and direct assignment of a `readonly string[]` into a Draft slot
  // is structurally incompatible. Same pattern as PlayerState.deck
  // (see GameState.ts header comment on the array-mutability rule).
  draft.lockout.playableEntityIds = [...partitioned.playable];
  draft.lockout.lockedEntityIds = [...partitioned.locked];
  events.push({
    type: "warlord_lockout_re_evaluated",
    player: playerSide,
    playableEntityIds: partitioned.playable,
    lockedEntityIds: partitioned.locked,
  });
}

/**
 * Decrement the lockout countdown. Called from end_turn AFTER the
 * player's turn ends (spec §2.3 — "as the player completes each of
 * turns 4, 5, 6, the corresponding tile dims"). Clears the lockout
 * and emits `warlord_lockout_ended` when the counter reaches 0.
 */
export function tickLockout(
  draft: Draft<GameState>,
  playerSide: Side,
  events: GameEvent[],
): void {
  if (!draft.lockout) return;
  draft.lockout.turnsRemaining -= 1;
  if (draft.lockout.turnsRemaining <= 0) {
    draft.lockout = undefined;
    events.push({ type: "warlord_lockout_ended", player: playerSide });
  } else {
    events.push({
      type: "warlord_lockout_ticked",
      player: playerSide,
      turnsRemaining: draft.lockout.turnsRemaining,
    });
  }
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Play-time guard                                                     */
/* ──────────────────────────────────────────────────────────────────── */

/**
 * True iff `cardEntityId` is currently locked for `actingSide` under
 * the active lockout. Returns false when no lockout is active or when
 * `actingSide` is not the lockout's target side — the Warlord plays
 * freely even while the lockout is in effect against the player.
 */
export function isCardLocked(
  state: Pick<GameState, "lockout">,
  cardEntityId: string,
  actingSide: Side,
): boolean {
  if (!state.lockout) return false;
  if (state.lockout.targetSide !== actingSide) return false;
  return state.lockout.lockedEntityIds.includes(cardEntityId);
}
