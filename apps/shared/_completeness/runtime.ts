/**
 * Completeness gate — runtime.
 *
 * Folds raw parity counts into PASS/FAIL/RATCHET rows and orchestrates
 * the registry walk. The CLI calls {@link runAll}; vitest tests can
 * call {@link runParityCheck} on individual entries to assert hard
 * parity without invoking the harness.
 *
 * Ratchet state lives in `ratchet-state.json` next to this file. Two
 * supported edit paths:
 *   - `pnpm ship:check --update-ratchet` (operator-driven; takes the
 *     current gap as the new ceiling for an entry).
 *   - Direct edit during code review when intentionally regressing
 *     adoption (rare; flagged in PR description).
 *
 * The file is committed. CI compares the live gap against the recorded
 * ceiling, so the ratchet is enforced uniformly between local and CI.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import type {
  CompletenessEntry,
  ParityResult,
  RawParityCount,
} from "./types";
import { COMPLETENESS_REGISTRY } from "./registry";

const RATCHET_STATE_PATH = path.resolve(
  // import.meta.dirname is available under Node 20.11+ and tsx; this
  // module is consumed by both the harness (tsx) and vitest (which
  // sets __dirname). Prefer import.meta.dirname; fall back to __dirname
  // when present (older toolchains).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).dirname ?? __dirname,
  "ratchet-state.json",
);

interface RatchetState {
  /**
   * Map of entry id → recorded worst-so-far gap. Once the live gap drops
   * below this number, the gate auto-tightens (no manual update needed
   * for improvements). Regressions above the recorded ceiling fail.
   */
  worstByEntry: Record<string, number>;
  /**
   * Schema version — bump when the file format changes.
   */
  version: 1;
}

function loadRatchetState(): RatchetState {
  if (!fs.existsSync(RATCHET_STATE_PATH)) {
    return { worstByEntry: {}, version: 1 };
  }
  const raw = fs.readFileSync(RATCHET_STATE_PATH, "utf-8");
  const parsed = JSON.parse(raw) as RatchetState;
  if (parsed.version !== 1) {
    throw new Error(
      `ratchet-state.json: unsupported version ${parsed.version} — expected 1`,
    );
  }
  return parsed;
}

/**
 * Runs a single entry's check, folds in PASS/FAIL/RATCHET status.
 * Pure (modulo whatever the check function reads).
 */
export async function runParityCheck(
  entry: CompletenessEntry,
  ratchetState: RatchetState = loadRatchetState(),
): Promise<ParityResult> {
  const raw: RawParityCount = await entry.check();
  if (raw.implemented < 0 || raw.declared < 0) {
    throw new Error(
      `${entry.id}: check returned negative count (declared=${raw.declared}, implemented=${raw.implemented})`,
    );
  }
  if (raw.implemented > raw.declared) {
    // Implemented > declared means the runtime honors more items than
    // the contract declares. Either the check is buggy or the
    // contract is stale. Surface as a hard error; the operator should
    // either tighten the check or expand the contract.
    throw new Error(
      `${entry.id}: implemented (${raw.implemented}) exceeds declared (${raw.declared}) — contract is stale or check is double-counting`,
    );
  }
  const gap = raw.declared - raw.implemented;

  let status: ParityResult["status"];
  if (gap === 0) {
    status = "PASS";
  } else if (entry.ratchet) {
    const ceiling = ratchetState.worstByEntry[entry.id];
    if (ceiling === undefined) {
      // First time we're seeing this entry: lock in the current gap
      // as the ceiling. The operator should `--update-ratchet` to
      // commit the seed value; until then we treat it as RATCHET so
      // the build doesn't fail on the introduction PR.
      status = "RATCHET";
    } else if (gap <= ceiling) {
      status = "RATCHET";
    } else {
      status = "FAIL";
    }
  } else {
    status = "FAIL";
  }

  return {
    declared: raw.declared,
    implemented: raw.implemented,
    gap,
    status,
    notes: raw.missing,
  };
}

/**
 * Runs every registered subsystem. Returns rows in registry order.
 */
export async function runAll(
  registry: ReadonlyArray<CompletenessEntry> = COMPLETENESS_REGISTRY,
): Promise<Array<{ entry: CompletenessEntry; result: ParityResult }>> {
  const ratchetState = loadRatchetState();
  const out: Array<{ entry: CompletenessEntry; result: ParityResult }> = [];
  for (const entry of registry) {
    const result = await runParityCheck(entry, ratchetState);
    out.push({ entry, result });
  }
  return out;
}

/**
 * Updates the ratchet state file to record the current gap for any
 * RATCHET-status entry. Called by `ship:check --update-ratchet`.
 *
 * Returns the list of entries whose ceiling changed, for logging.
 */
export async function tightenRatchet(
  rows: Array<{ entry: CompletenessEntry; result: ParityResult }>,
): Promise<string[]> {
  const state = loadRatchetState();
  const tightened: string[] = [];
  for (const { entry, result } of rows) {
    if (!entry.ratchet) continue;
    if (result.status !== "RATCHET" && result.status !== "PASS") continue;
    const previous = state.worstByEntry[entry.id];
    if (previous === undefined || result.gap < previous) {
      state.worstByEntry[entry.id] = result.gap;
      tightened.push(`${entry.id}: ${previous ?? "(unset)"} → ${result.gap}`);
    }
  }
  fs.writeFileSync(RATCHET_STATE_PATH, JSON.stringify(state, null, 2) + "\n");
  return tightened;
}

/**
 * Exported for the test suite — does not load from disk.
 */
export function _runParityCheckWithState(
  entry: CompletenessEntry,
  state: RatchetState,
): Promise<ParityResult> {
  return runParityCheck(entry, state);
}
