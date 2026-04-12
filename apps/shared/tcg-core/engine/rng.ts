/**
 * Deterministic RNG for tcg-core.
 *
 * The engine must be fully reproducible from (seed, action log). That means
 * every random decision — shuffle, random-target effect, coin flip, mulligan
 * redraw, AI exploration — must route through this RNG and only this RNG.
 *
 * Math.random() is banned in apps/shared/tcg-core/** and apps/server/tcg/**
 * (enforced via ESLint no-restricted-globals; see .eslintrc).
 *
 * Implementation: seedrandom in its "state: true" mode, which supports
 * serializing the internal PRNG state as a string so that GameState can carry
 * it across reducer calls. The state string is opaque — treat it as a blob.
 */
import seedrandom from "seedrandom";

/** Opaque serializable PRNG state. Store on GameState.rngState. */
export type RngState = string;

export interface Rng {
  /** Next float in [0, 1). Advances the underlying state. */
  next(): number;
  /** Current serializable state. Safe to store on GameState. */
  state(): RngState;
}

/**
 * Construct an Rng from a seed or from a previously-serialized state.
 *
 * - If `seedOrState` is falsy, uses empty string (seedrandom-deterministic).
 * - If `isState` is true, interprets the argument as a serialized state from
 *   a prior .state() call rather than a fresh seed.
 */
export function createRng(seedOrState: string, isState = false): Rng {
  // seedrandom's second-arg options: state=true to enable state export;
  // when restoring from a state string, pass the state via the first arg and
  // set state=<state object>. We instead parse the JSON state ourselves to
  // keep the interface simple.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prng: any;
  if (isState && seedOrState) {
    const parsed = JSON.parse(seedOrState);
    prng = seedrandom("", { state: parsed });
  } else {
    prng = seedrandom(seedOrState, { state: true });
  }
  return {
    next: () => prng() as number,
    state: () => JSON.stringify(prng.state()),
  };
}

/**
 * Integer in [min, max] inclusive. Uses `rng.next()` once.
 * Unbiased for ranges up to 2^32-1.
 */
export function rngInt(rng: Rng, min: number, max: number): number {
  if (min > max) throw new RangeError("rngInt: min > max");
  const span = max - min + 1;
  return min + Math.floor(rng.next() * span);
}

/**
 * Fisher-Yates shuffle using the provided Rng. Returns a new array; input
 * array is not mutated.
 */
export function rngShuffle<T>(rng: Rng, arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rngInt(rng, 0, i);
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

/**
 * Pick a uniformly random element from `arr`. Returns undefined if empty.
 */
export function rngPick<T>(rng: Rng, arr: readonly T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[rngInt(rng, 0, arr.length - 1)];
}
