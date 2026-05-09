/* ═══════════════════════════════════════════════════════
   UNSEALING — UnlockGate schema for narrative-flavor
   sealed objects (sealed letters, locked terminals,
   encrypted data crystals).

   audit/16 PR 10 (Cluster AR2 — ARG persona).

   Pre-audit, sealed letters in apps/shared/roomMysteries/
   antiquarianLibrary.ts (and elsewhere) were narrative
   flavor — their seal was decoration. Players who tried to
   open them got a stock "the seal holds" line forever; no
   mechanical path led to unsealing because no UnlockGate
   schema existed.

   This module is that schema. Each UnlockGate names ONE
   way a seal can be broken (a clue collected, a puzzle
   solved, a flag triggered, an item used). A sealed
   object's `unsealedBy` list cross-references gates by id;
   when ANY listed gate's predicate passes, the seal opens
   (OR-logic across the gate list).

   Schema-only ship. The Antiquarian Library hotspot
   consumer + the per-letter unseal-evaluation runtime are
   queued for a follow-up; this PR lands the schema +
   seed gates so authors can populate sealed objects today.
   ═══════════════════════════════════════════════════════ */

/** A condition that can break a seal. Each kind references
 *  exactly one piece of player state. */
export type UnlockGateKind =
  | { kind: "clue_collected"; clueId: string }
  | { kind: "puzzle_solved"; puzzleId: string }
  | { kind: "narrative_flag"; flag: string }
  | { kind: "item_used"; itemId: string }
  /** Cross-room dependency — another sealed object must
   *  have already been unsealed. Lets authors thread an
   *  unsealing chain (Letter A unseals first, which
   *  unlocks Letter B's gate, etc.). */
  | { kind: "other_unseal"; gateId: string };

export interface UnlockGate {
  /** Stable id; pattern: "gate_{descriptor}". Sealed
   *  objects reference these via `unsealedBy`. */
  id: string;
  /** Player-facing label rendered when the gate's
   *  predicate is hinting at the player ("…you might be
   *  able to break this if you find the lectern key"). */
  label: string;
  /** The discriminated condition. */
  condition: UnlockGateKind;
}

/** Seed gates from the audit'd Antiquarian Library + Cipher
 *  Den seals. Authors extend this list as new sealed
 *  objects ship. */
export const UNLOCK_GATES: readonly UnlockGate[] = [
  {
    id: "gate_lectern_key",
    label: "the indigo lectern's master key",
    condition: { kind: "item_used", itemId: "lectern_master_key" },
  },
  {
    id: "gate_archives_pattern_solved",
    label: "the Archives' filing pattern decoded",
    condition: { kind: "puzzle_solved", puzzleId: "archives" },
  },
  {
    id: "gate_shadow_tongue_revealed",
    label: "the Shadow Tongue's identity revealed",
    condition: { kind: "narrative_flag", flag: "shadow_tongue_identity_known" },
  },
  {
    id: "gate_third_letter_examined",
    label: "the third sealed letter examined under the warm-gold lamp",
    condition: { kind: "clue_collected", clueId: "third_letter_warm_gold_underlayer" },
  },
];

/* ─── Pure helpers ─────────────────────────────────────── */

export interface UnsealEvalState {
  collectedClues: ReadonlySet<string>;
  solvedPuzzles: ReadonlySet<string>;
  narrativeFlags: ReadonlySet<string>;
  /** Items the player has used (one-shot — `used`, not
   *  `held`. The ARG audit'd intent is "the lectern key
   *  is consumed by the unsealing"). */
  itemsUsed: ReadonlySet<string>;
  /** Set of gate ids that have already been satisfied —
   *  used to evaluate `other_unseal` dependencies. */
  unsealedGates: ReadonlySet<string>;
}

export function isGateSatisfied(
  gate: UnlockGate,
  state: UnsealEvalState,
): boolean {
  const c = gate.condition;
  switch (c.kind) {
    case "clue_collected":
      return state.collectedClues.has(c.clueId);
    case "puzzle_solved":
      return state.solvedPuzzles.has(c.puzzleId);
    case "narrative_flag":
      return state.narrativeFlags.has(c.flag);
    case "item_used":
      return state.itemsUsed.has(c.itemId);
    case "other_unseal":
      return state.unsealedGates.has(c.gateId);
    default: {
      // Defensive — TS exhaustive. If the union grows,
      // the consumer should update.
      const _exhaustive: never = c;
      return false;
    }
  }
}

/** A sealed object's `unsealedBy` is a list of gate ids; the
 *  seal opens when ANY listed gate is satisfied (OR-logic).
 *  Returns the satisfied gate if any, null otherwise. */
export function findSatisfiedGate(
  unsealedBy: readonly string[],
  state: UnsealEvalState,
  registry: readonly UnlockGate[] = UNLOCK_GATES,
): UnlockGate | null {
  for (const gateId of unsealedBy) {
    const gate = registry.find((g) => g.id === gateId);
    if (!gate) continue;
    if (isGateSatisfied(gate, state)) return gate;
  }
  return null;
}

/** Evaluates a sealed object's full set of gates and returns
 *  the unseal verdict. Useful for UI surfaces that want to
 *  show a tooltip listing every potential path to unsealing. */
export interface UnsealVerdict {
  unsealed: boolean;
  satisfiedGate: UnlockGate | null;
  /** All possible gates from the unsealedBy list; UI can
   *  render these as "ways to break this seal". */
  allGates: readonly UnlockGate[];
}

export function evaluateUnseal(
  unsealedBy: readonly string[],
  state: UnsealEvalState,
  registry: readonly UnlockGate[] = UNLOCK_GATES,
): UnsealVerdict {
  const allGates = unsealedBy
    .map((id) => registry.find((g) => g.id === id))
    .filter((g): g is UnlockGate => Boolean(g));
  const satisfiedGate = findSatisfiedGate(unsealedBy, state, registry);
  return {
    unsealed: satisfiedGate !== null,
    satisfiedGate,
    allGates,
  };
}
