/* ═══════════════════════════════════════════════════════
   MATRIX SAVE FLAGS — Persistence Keys

   Canonical narrative-flag names for the diegetic-tutorial
   architecture. Both the runtime UI (HellboxPortalPage,
   MatrixSchoolEpisodePage) and any future consumers (the
   prelude bridge that wires Beat B/C, the goggles arc gate,
   the Mol'Garath audience trigger) must use these flag names
   so save state is consistent.

   See plan §4 (Hellbox & Two Schools) and §11 (Implementation
   Phases).
   ═══════════════════════════════════════════════════════ */

/** Set when the player first discovers the Hellbox in the medbay (Beat B). */
export const HELLBOX_DISCOVERED_FLAG = "hellbox_discovered";

/** Set when the compelled-transport cinematic (Beat C) plays through. */
export const HELLBOX_FIRST_TOUCH_FLAG = "hellbox_first_touch_complete";

/**
 * Compose the per-episode completion flag for a Matrix-of-Dreams Level.
 * Flag value: true once the player finishes every scene in the episode at
 * least once. Replayability is permitted — the flag does not unset.
 */
export function episodeCompletionFlag(episodeId: string): string {
  return `matrix_episode_${episodeId}_complete`;
}

/** Inverse: try to extract the episode id from a completion-flag key. */
export function extractEpisodeIdFromFlag(flagKey: string): string | undefined {
  const prefix = "matrix_episode_";
  const suffix = "_complete";
  if (!flagKey.startsWith(prefix) || !flagKey.endsWith(suffix)) return undefined;
  return flagKey.slice(prefix.length, flagKey.length - suffix.length);
}

/** Set when Mol'Garath's post-Tier-3 audience scene plays through. */
export const MOL_GARATH_AUDIENCE_FLAG = "mol_garath_audience_complete";

/** Set when the Hamlet conspiracy board's final connection is named correctly. */
export const HAMLET_FINAL_CONNECTION_FLAG = "hamlet_warlord_substrate_named";

/** Set when the Apprentice graduates and inherits the Goggles in Act 7. */
export const GOGGLES_INHERITED_FLAG = "goggles_inherited";

/**
 * Compose the per-clue flag for the Hamlet conspiracy board. Set when an
 * episode that surfaces this clue (per its conspiracyClue field) completes.
 * The conspiracy board reads either this flag OR the source-episode
 * completion flag — but the per-clue flag is preferred because it lets
 * future content (e.g. clues that surface mid-episode without finishing)
 * wire in cleanly.
 */
export function hamletClueFlag(clueId: string): string {
  return `hamlet_clue_${clueId}`;
}

/** Inverse: extract the clue id from a hamlet-clue flag, if it is one. */
export function extractClueIdFromFlag(flagKey: string): string | undefined {
  const prefix = "hamlet_clue_";
  if (!flagKey.startsWith(prefix)) return undefined;
  return flagKey.slice(prefix.length);
}

/**
 * Compose the per-Hamlet-board-connection flag (set when the player pins a
 * connection on the conspiracy board).
 */
export function hamletConnectionFlag(connectionId: string): string {
  return `hamlet_connection_${connectionId}`;
}
