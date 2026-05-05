/**
 * Loredex completion-flag producers — Audit follow-up #5.
 *
 * Each target maps a Loredex completion gate (consumed by the
 * Epoch Witness votes) to the entry ids whose discovery satisfies
 * the gate. The LoredexCompletionFlagWatcher (mounted near the
 * GameProvider in App.tsx) reads `discoveredIds` from LoredexContext
 * and fires `setNarrativeFlag(target.flag)` when every entry id is
 * discovered.
 *
 * This closes the four "no producer" entries in the
 * narrativeFlagAudit.test.ts KNOWN_ORPHANS list:
 *   - iron_lion_loredex_complete
 *   - agent_zero_loredex_complete
 *   - battle_of_nexon_loredex_complete
 *   - programmer_and_antiquarian_loredex_complete
 *
 * Pragmatic interpretation: completion = the canonical entry for
 * the subject is discovered. Tighter "all entries that mention X"
 * semantics can extend this list later without changing the watcher;
 * the watcher's contract is "fire when every required id is in the
 * discovered set."
 */

export interface LoredexCompletionTarget {
  /** Narrative flag to fire once every required entry is discovered. */
  readonly flag: string;
  /** Entry ids whose discovery is required. */
  readonly requiredEntryIds: readonly string[];
}

export const LOREDEX_COMPLETION_TARGETS: readonly LoredexCompletionTarget[] = [
  {
    flag: "iron_lion_loredex_complete",
    requiredEntryIds: ["entity_23"], // Iron Lion
  },
  {
    flag: "agent_zero_loredex_complete",
    requiredEntryIds: ["entity_24"], // Agent Zero
  },
  {
    flag: "battle_of_nexon_loredex_complete",
    requiredEntryIds: ["entity_102"], // The Battle of Nexon
  },
  {
    flag: "programmer_and_antiquarian_loredex_complete",
    // Paired-entity gate — both must be discovered.
    requiredEntryIds: ["entity_1", "entity_66"], // The Programmer + The Antiquarian
  },
];

/**
 * Pure helper — given the player's discovered-entries set, return
 * the flags that should be fired. Pure so it's trivially unit-testable
 * without mounting React.
 */
export function flagsToFireForDiscovery(
  discoveredIds: ReadonlySet<string>,
): readonly string[] {
  const out: string[] = [];
  for (const t of LOREDEX_COMPLETION_TARGETS) {
    const allDiscovered = t.requiredEntryIds.every((id) =>
      discoveredIds.has(id),
    );
    if (allDiscovered) out.push(t.flag);
  }
  return out;
}
