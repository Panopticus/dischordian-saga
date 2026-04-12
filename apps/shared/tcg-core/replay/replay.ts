/**
 * Deterministic match replay.
 *
 * Given a seed, a sequence of Actions, and a rulesVersion, replays an
 * entire match through the pure reducer and returns the final state +
 * the full state sequence for scrubbing.
 *
 * This is the foundation of the replay/spectation system (WS9). Because
 * the reducer is pure and the RNG is seeded, the same (seed, actions)
 * input always produces byte-identical output — provable via
 * `hashState(finalState)` matching the persisted `finalStateHash`.
 *
 * Usage:
 *   const result = replayMatch({
 *     matchId: "m1",
 *     seed: "deadbeef",
 *     rulesVersion: "1.0.0",
 *     actions,
 *     p1Config, p2Config,
 *     registry,
 *   });
 *   assert(hashState(result.finalState) === storedHash);
 */
import {
  createMatchState,
  reduce,
  hashState,
  isReplayCompatible,
  RULES_VERSION,
  type GameState,
  type Action,
  type CardRegistry,
  type MatchConfig,
  type GameEvent,
} from "../index";

export interface ReplayInput {
  matchId: string;
  seed: string;
  rulesVersion: string;
  actions: readonly Action[];
  p1Config: MatchConfig;
  p2Config: MatchConfig;
  registry: CardRegistry;
}

export interface ReplayStep {
  actionIndex: number;
  action: Action;
  stateAfter: GameState;
  events: readonly GameEvent[];
  error?: string;
}

export interface ReplayResult {
  /** Whether the replay completed without errors. */
  ok: boolean;
  /** The initial state before any actions. */
  initialState: GameState;
  /** Every step of the replay. */
  steps: ReplayStep[];
  /** The final state after all actions. */
  finalState: GameState;
  /** Canonical hash of the final state — compare against stored hash. */
  finalStateHash: string;
  /**
   * If the stored rulesVersion differs from the current engine,
   * this flag indicates whether the replay is compatible (same
   * major.minor) or archived (major/minor mismatch).
   */
  versionCompatible: boolean;
  /** Number of actions that failed to apply (reducer returned error). */
  errorCount: number;
}

/**
 * Replay an entire match deterministically.
 *
 * Walks the action log through the reducer one action at a time,
 * recording each intermediate state for the replay viewer's timeline
 * scrubber. If any action fails (reducer returns an error), the step
 * is recorded with the error message but the replay continues from
 * the unchanged state — this mirrors how the server handles invalid
 * actions during a live match.
 */
export function replayMatch(input: ReplayInput): ReplayResult {
  const versionCompatible = isReplayCompatible(
    input.rulesVersion,
    RULES_VERSION
  );

  const initialState = createMatchState({
    matchId: input.matchId,
    seed: input.seed,
    p1: input.p1Config,
    p2: input.p2Config,
    registry: input.registry,
  });

  const steps: ReplayStep[] = [];
  let current = initialState;
  let errorCount = 0;

  for (let i = 0; i < input.actions.length; i++) {
    const action = input.actions[i];
    const result = reduce(current, action, input.registry);

    if (result.error) {
      steps.push({
        actionIndex: i,
        action,
        stateAfter: current, // unchanged on error
        events: [],
        error: `${result.error.code}: ${result.error.message}`,
      });
      errorCount++;
    } else {
      current = result.state;
      steps.push({
        actionIndex: i,
        action,
        stateAfter: current,
        events: result.events,
      });
    }
  }

  return {
    ok: errorCount === 0,
    initialState,
    steps,
    finalState: current,
    finalStateHash: hashState(current),
    versionCompatible,
    errorCount,
  };
}

/**
 * Verify a replay against a stored hash.
 *
 * Quick check: replays the match and compares the final state hash
 * against the expected hash. Returns true if they match.
 */
export function verifyReplay(
  input: ReplayInput,
  expectedHash: string
): boolean {
  const result = replayMatch(input);
  return result.finalStateHash === expectedHash;
}
