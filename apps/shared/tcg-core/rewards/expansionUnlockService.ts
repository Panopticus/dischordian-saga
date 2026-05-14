/**
 * Expansion Unlock Service.
 *
 * Dispatcher for `CardDefinition.unlockCondition`. Cards in the
 * registry whose unlockCondition is set are NOT discoverable in
 * the deck-builder, pack-opening pool, or reward grants until the
 * gate is satisfied for the active player.
 *
 * Backed by a pure-function evaluator over a `PlayerExpansionState`
 * snapshot. No server wiring is performed here; consumer code (deck
 * builder, pack-opening service, etc.) calls
 * `isCardUnlocked(def, state)` before exposing a card.
 *
 * Currently consumed by:
 *   - apps/shared/tcg-core/cards/definitions/s2_hierarchy/** (124
 *     cards: 28 act-exclusive, 7 secret, 3 author-special).
 *
 * Pure / serializable / no I/O — runs in both client and server.
 */
import type {
  CardDefinition,
  CardUnlockCondition,
} from "../types/Card";

/**
 * Player progression snapshot consulted by every unlock evaluator.
 * Each consumer is responsible for sourcing this from its own
 * persistence layer (server: durable storage; client: cached copy
 * over websocket).
 */
export interface PlayerExpansionState {
  /** Acts the player has completed (1..7). */
  readonly completedActs: ReadonlySet<1 | 2 | 3 | 4 | 5 | 6 | 7>;
  /** Acts whose secret-reveal path the player has triggered (1..7). */
  readonly secretActsRevealed: ReadonlySet<1 | 2 | 3 | 4 | 5 | 6 | 7>;
  /** Highest battle-pass tier the player has reached (S2). */
  readonly battlePassTier: number;
  /** True if the player is a S2 founding-author entitlement holder. */
  readonly hasFoundingAuthor: boolean;
  /** True if the player owns the S2 author's edition. */
  readonly hasAuthorsEditionS2: boolean;
  /** DLC chapter ids the player has finished (e.g.
   *  "dlc_advocate_01_sacrum_echo"). Sourced from
   *  `gameData.narrativeFlags["dlc_chapter_<id>_complete"]`. */
  readonly completedDlcChapters: ReadonlySet<string>;
  /** Crew-Bene-Gesserit Breeding Program — generations completed
   *  per blood classification. Wave-6 gate: 5+ PURE generations
   *  unlocks the Season-2 Advocate-body coordinate hook. Sourced
   *  from `gameData.bloodlineGenerations`. Missing classifications
   *  default to 0. */
  readonly bloodlineGenerations: Readonly<Record<string, number>>;
  /** Mystery Engine arc episodes the player has closed. Keys are
   *  `<arcId>:<episodeId>` (e.g. `"arc.the_watcher:watcher.e5"`).
   *  Sourced from `gameData.completedMysteryEpisodes` — written by
   *  mysteryService.ts on episode-close. Used by the
   *  `arc_episode_complete` CardUnlockCondition kind. */
  readonly completedMysteryEpisodes: ReadonlySet<string>;
}

/** Default snapshot — nothing unlocked. Useful for tests + unauth flows. */
export const NULL_PLAYER_EXPANSION_STATE: PlayerExpansionState = Object.freeze({
  completedActs: new Set<never>(),
  secretActsRevealed: new Set<never>(),
  battlePassTier: 0,
  hasFoundingAuthor: false,
  hasAuthorsEditionS2: false,
  completedDlcChapters: new Set<string>(),
  bloodlineGenerations: Object.freeze({}),
  completedMysteryEpisodes: new Set<string>(),
});

/**
 * Evaluate a single CardUnlockCondition against the player snapshot.
 * Returns `true` iff the gate is satisfied.
 */
export function evaluateUnlockCondition(
  cond: CardUnlockCondition,
  state: PlayerExpansionState,
): boolean {
  switch (cond.kind) {
    case "act_completion":
      return state.completedActs.has(cond.act);
    case "secret":
      return state.secretActsRevealed.has(cond.act);
    case "battle_pass":
      return state.battlePassTier >= cond.tier;
    case "founding_author":
      return state.hasFoundingAuthor;
    case "authors_edition":
      // Only "s2" is currently defined in the type union.
      return cond.season === "s2" ? state.hasAuthorsEditionS2 : false;
    case "dlc_chapter_completion":
      return state.completedDlcChapters.has(cond.chapterId);
    case "bloodline_threshold": {
      const gens = state.bloodlineGenerations[cond.classification] ?? 0;
      return gens >= cond.minGenerations;
    }
    case "arc_episode_complete":
      return state.completedMysteryEpisodes.has(
        `${cond.arcId}:${cond.episodeId}`,
      );
  }
}

/**
 * True iff the card is unlocked for the active player. Cards without
 * an unlockCondition are always unlocked (by the absence of a gate).
 */
export function isCardUnlocked(
  card: CardDefinition,
  state: PlayerExpansionState,
): boolean {
  if (!card.unlockCondition) return true;
  return evaluateUnlockCondition(card.unlockCondition, state);
}

/**
 * Filter helper. Returns the subset of cards the active player can
 * see. Use this on every card-enumeration surface (deck builder,
 * pack pool, reward grant menu) — the same way `isReservedCard()`
 * is used today.
 */
export function filterUnlockedCards(
  cards: readonly CardDefinition[],
  state: PlayerExpansionState,
): CardDefinition[] {
  return cards.filter((c) => isCardUnlocked(c, state));
}

/**
 * Inverse of filterUnlockedCards — surfaces cards still locked. Useful
 * for "X cards remaining to unlock" UI cues.
 */
export function filterLockedCards(
  cards: readonly CardDefinition[],
  state: PlayerExpansionState,
): CardDefinition[] {
  return cards.filter((c) => !isCardUnlocked(c, state));
}

/**
 * Convenience constructor: partial-state -> full state with sane
 * defaults. Saves a lot of `new Set([1,2,3])` boilerplate at call
 * sites + tests.
 */
export function makePlayerExpansionState(
  partial: Partial<{
    completedActs: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6 | 7>;
    secretActsRevealed: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6 | 7>;
    battlePassTier: number;
    hasFoundingAuthor: boolean;
    hasAuthorsEditionS2: boolean;
    completedDlcChapters: ReadonlyArray<string>;
    bloodlineGenerations: Readonly<Record<string, number>>;
    completedMysteryEpisodes: ReadonlyArray<string>;
  }>,
): PlayerExpansionState {
  return {
    completedActs: new Set(partial.completedActs ?? []),
    secretActsRevealed: new Set(partial.secretActsRevealed ?? []),
    battlePassTier: partial.battlePassTier ?? 0,
    hasFoundingAuthor: partial.hasFoundingAuthor ?? false,
    hasAuthorsEditionS2: partial.hasAuthorsEditionS2 ?? false,
    completedDlcChapters: new Set(partial.completedDlcChapters ?? []),
    bloodlineGenerations: { ...(partial.bloodlineGenerations ?? {}) },
    completedMysteryEpisodes: new Set(partial.completedMysteryEpisodes ?? []),
  };
}

/**
 * Per-player entitlements that aren't part of the in-game flag stream
 * (those live in store / battle-pass progress / founder-edition rosters,
 * not the narrative flag bag). Optional — pass an empty object for
 * unauth players or when flags-only resolution is sufficient.
 */
export interface PlayerEntitlements {
  battlePassTier?: number;
  hasFoundingAuthor?: boolean;
  hasAuthorsEditionS2?: boolean;
  /** Bloodline generation counts per BloodClassification.
   *  Optional — defaults to {} (zero generations across the
   *  board). Sourced from gameData.bloodlineGenerations. */
  bloodlineGenerations?: Readonly<Record<string, number>>;
}

/**
 * Adapter: derive a `PlayerExpansionState` from the canonical
 * narrative `flags` record + an optional entitlements bag.
 *
 * Acts: a player has "completed" act N when `flags.act_N_complete` is
 * truthy. This matches the convention enforced by
 * `apps/shared/act{2..7}CompletionGate.ts`, which is the single
 * server-side write path for those flags.
 *
 * Secret-reveals: act N's secret-reveal path is "triggered" when
 * `flags.secret_act_N_revealed` is truthy. Forward-looking — these
 * flags are written by the (still-to-build) Acts 4-7 secret-reveal
 * hooks; the unlock service is forwards-compatible.
 *
 * Pass-through fields (battlePassTier, hasFoundingAuthor,
 * hasAuthorsEditionS2) come from `entitlements`, which the server
 * sources from store + battle-pass + founder-roster tables.
 *
 * Pure / synchronous / no I/O. Safe to call from React render paths.
 */
export function derivePlayerExpansionStateFromFlags(
  flags: Readonly<Record<string, unknown>>,
  entitlements: PlayerEntitlements = {},
): PlayerExpansionState {
  const completedActs: Array<1 | 2 | 3 | 4 | 5 | 6 | 7> = [];
  const secretActsRevealed: Array<1 | 2 | 3 | 4 | 5 | 6 | 7> = [];
  for (const n of [1, 2, 3, 4, 5, 6, 7] as const) {
    if (flags[`act_${n}_complete`]) completedActs.push(n);
    if (flags[`secret_act_${n}_revealed`]) secretActsRevealed.push(n);
  }
  /* DLC chapter completion is flag-driven: any flag matching
   * `dlc_chapter_<id>_complete` flips the chapter into the completed
   * set. The DLC chapter registry is the source of truth for which
   * chapter ids exist; this scan accepts any flag with the prefix so
   * the unlock service stays decoupled from the registry import
   * graph (the registry can grow without touching this file). */
  const completedDlcChapters: string[] = [];
  for (const key of Object.keys(flags)) {
    if (!flags[key]) continue;
    const m = /^dlc_chapter_(.+)_complete$/.exec(key);
    if (m) completedDlcChapters.push(m[1]);
  }
  /* Mystery Engine completed-episode keys are flag-driven by the
   * convention `mystery_<arcId-with-dots>_<episodeId-with-dots>_complete`
   * — but to keep the key simple and avoid double-encoding the dots,
   * the writer (mysteryService.ts on episode close) emits the flag
   * `mystery_episode_complete:<arcId>:<episodeId>` and the unlock
   * service strips the prefix. */
  const completedMysteryEpisodes: string[] = [];
  for (const key of Object.keys(flags)) {
    if (!flags[key]) continue;
    if (key.startsWith("mystery_episode_complete:")) {
      completedMysteryEpisodes.push(key.slice("mystery_episode_complete:".length));
    }
  }
  return {
    completedActs: new Set(completedActs),
    secretActsRevealed: new Set(secretActsRevealed),
    battlePassTier: entitlements.battlePassTier ?? 0,
    hasFoundingAuthor: entitlements.hasFoundingAuthor ?? false,
    hasAuthorsEditionS2: entitlements.hasAuthorsEditionS2 ?? false,
    completedDlcChapters: new Set(completedDlcChapters),
    bloodlineGenerations: { ...(entitlements.bloodlineGenerations ?? {}) },
    completedMysteryEpisodes: new Set(completedMysteryEpisodes),
  };
}
