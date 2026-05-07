/**
 * Completeness gate — shared types.
 *
 * The "tracked-vs-shipped" gate: every subsystem that declares a contract
 * (a discriminated union, an enum, a registry, a schema kind) and depends
 * on a runtime to honor that contract registers a parity check here. The
 * check returns a {@link ParityResult} comparing the declared surface to
 * the implemented surface.
 *
 * Two flavors of parity:
 *
 * - **Hard parity** (default): any declared item without an implementation
 *   is a build failure. Use for small enums where 100% coverage is the
 *   only sensible state — Effect ops, Trigger kinds, Keyword behaviors,
 *   Condition kinds, CardUnlockCondition kinds, etc.
 *
 * - **Ratcheted parity**: a per-subsystem `.adopted` registry tracks which
 *   items have crossed the threshold. The gap can be positive without
 *   failing the gate, but it can only shrink — once an item is adopted
 *   (or the count crosses a target) it can never regress. Use for large
 *   migration surfaces — DB foreign keys, `trial_categories` per card,
 *   `touch-action` per canvas component, list virtualization per list.
 *
 * Every check is a plain async function that does its own scanning. Tests
 * (vitest) and the `ship:check` harness both call the same function so
 * they can never disagree. Do not duplicate the scanning logic in two
 * places.
 */

/**
 * One row in the ship:check table.
 */
export interface ParityResult {
  /** Number of items declared in the contract (e.g. union variants, enum members, schema kinds, registry entries). */
  declared: number;
  /** Number of items the runtime actually honors (handler present, UI surface present, FK declared, etc.). */
  implemented: number;
  /** declared - implemented. Always non-negative; if a check produces a negative gap, it is a bug in the check. */
  gap: number;
  /** Outcome class. {@link runParityCheck} sets this from {@link gap} and the subsystem's ratchet config. */
  status: ParityStatus;
  /** Free-form lines describing which items are missing, surfaced to the user when the row is FAIL or RATCHET. */
  notes?: string[];
}

export type ParityStatus = "PASS" | "FAIL" | "RATCHET";

/**
 * One subsystem registered with the gate. The registry collects these
 * and the harness iterates them.
 */
export interface CompletenessEntry {
  /** Stable identifier — used in CI logs and for `--only` filtering. snake_case. */
  id: string;
  /** Human-facing column value (≤ 40 chars). */
  name: string;
  /** One-line description for `ship:check --explain`. */
  description: string;
  /** The actual check. Must be deterministic and side-effect-free. */
  check: () => Promise<RawParityCount> | RawParityCount;
  /**
   * Ratchet config. Absent ⇒ hard parity (any gap fails).
   *
   * When present, the gate compares `gap` to `target`. If `gap === 0` the
   * row is PASS. If `0 < gap <= worstSoFar` the row is RATCHET (allowed
   * but tracked). If `gap > worstSoFar` the ratchet has slipped — FAIL.
   *
   * The `worstSoFar` value lives in `apps/shared/_completeness/ratchet-state.json`,
   * which is committed and updated only by the `ship:check --update-ratchet`
   * flow. Manual edits are caught by a hash check.
   */
  ratchet?: {
    /** Eventual target gap, usually 0. Surfaced in the row notes. */
    target: number;
  };
}

/**
 * Internal shape returned by check functions before the harness folds in
 * status. Lets check functions stay focused on counting and reporting
 * which specific items are missing.
 */
export interface RawParityCount {
  declared: number;
  implemented: number;
  /** Optional human-readable list of missing items. Truncated to ~10 lines on display. */
  missing?: string[];
}
