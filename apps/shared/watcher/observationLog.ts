/* ═══════════════════════════════════════════════════════
   WATCHER OBSERVATION LOG — typed event record

   The Watcher subsystem (see docs/built/WATCHER_DESIGN.md) records
   real player actions back at them at narrative beats with growing
   specificity. This file is the typed schema for those observations
   plus the pure helpers that operate on a log array.

   Storage lives in `userProgress.gameData.watcherLog` (server-side
   JSON column) with a localStorage mirror for offline. The server
   appends; the client reads + appends; both treat the log as
   append-only.

   PRIVACY GUARANTEE: every observation kind below is derived from
   data the server already holds (clicks, latencies, navigation
   events, locally-readable browser state). No new fingerprinting,
   no third-party calls, no IP/geolocation. The "uncanny" effect
   comes from accuracy of what we already see, not new collection.
   ═══════════════════════════════════════════════════════ */

/**
 * Discriminated union of every observation the Watcher can record.
 * Adding a new kind requires:
 *   1. A new variant here.
 *   2. (Optional) a new line/trigger in `watcherLines.ts` that
 *      consumes it.
 *   3. A test in `watcher.test.ts` covering the trigger predicate.
 */
export type WatcherObservation =
  /** Player skipped a cinematic, dialog, or VO line. */
  | { kind: "skip"; surface: string; at: number }
  /** A scene/dialog choice was committed; latency is from prompt-shown
   *  to commit-click. Used to infer Speedrunner / Roleplayer profile. */
  | { kind: "choice_latency"; surface: string; latencyMs: number; at: number }
  /** Tab was hidden mid-scene for at least `seconds`. */
  | { kind: "tab_hidden"; surface: string; seconds: number; at: number }
  /** Idle (no input) for at least `seconds` while a surface was active. */
  | { kind: "idle"; surface: string; seconds: number; at: number }
  /** Player conceded / fled a PvP match before turn `turn`. */
  | { kind: "pvp_retreat"; matchId: string; turn: number; at: number }
  /** A persisted replay was rewatched. */
  | { kind: "replay_rewatch"; replayId: string; at: number }
  /** Session began between local-clock 00:00–04:00. */
  | { kind: "late_night_session"; localHour: number; at: number }
  /** Player picked the same narrative choice twice within a 24-hour window
   *  (different sessions OR a rewind / load). */
  | { kind: "same_choice_twice"; choiceId: string; at: number }
  /** Player picked LOOK AWAY in the SurveillanceOpening handshake. Recorded
   *  exactly once; the Watcher references it 7 acts later. */
  | { kind: "first_dissent"; at: number }
  /** Player typed their name in the Awakening — recorded so the Watcher
   *  can address them by it later. The name itself is NOT stored here
   *  (it lives in `state.playerName`); this is just the moment of
   *  commitment. */
  | { kind: "name_committed"; at: number }
  /** Player attempted to enter a locked door; tally per door. */
  | { kind: "locked_door_attempt"; doorId: string; at: number };

/** Discriminator-only kind union, derived. */
export type WatcherObservationKind = WatcherObservation["kind"];

/** Persisted log shape. Stored at `userProgress.gameData.watcherLog`. */
export interface WatcherLog {
  /** Schema version. Bump when the WatcherObservation union changes
   *  in a non-additive way. Migration is best-effort: unknown kinds
   *  are dropped, never thrown on. */
  schemaVersion: 1;
  /** Append-only event list. Capped at MAX_LOG_ENTRIES (oldest dropped). */
  events: WatcherObservation[];
}

/** Cap to keep the JSON column from growing unboundedly. The Watcher
 *  almost always operates on aggregates (counts, last-N) so trimming
 *  the oldest is safe. */
export const MAX_LOG_ENTRIES = 500;

/** Construct an empty log. */
export function emptyLog(): WatcherLog {
  return { schemaVersion: 1, events: [] };
}

/** Append an observation, trimming to MAX_LOG_ENTRIES. Returns a new
 *  log; does not mutate. */
export function appendObservation(
  log: WatcherLog,
  obs: WatcherObservation,
): WatcherLog {
  const events = [...log.events, obs];
  if (events.length > MAX_LOG_ENTRIES) {
    events.splice(0, events.length - MAX_LOG_ENTRIES);
  }
  return { schemaVersion: log.schemaVersion, events };
}

/** Count observations of a given kind. */
export function countByKind(log: WatcherLog, kind: WatcherObservationKind): number {
  let n = 0;
  for (const e of log.events) if (e.kind === kind) n++;
  return n;
}

/** Returns the most recent observation of a given kind, or undefined. */
export function lastOfKind<K extends WatcherObservationKind>(
  log: WatcherLog,
  kind: K,
): Extract<WatcherObservation, { kind: K }> | undefined {
  for (let i = log.events.length - 1; i >= 0; i--) {
    if (log.events[i].kind === kind) {
      return log.events[i] as Extract<WatcherObservation, { kind: K }>;
    }
  }
  return undefined;
}

/** True if any event with kind exists in the log. */
export function hasKind(log: WatcherLog, kind: WatcherObservationKind): boolean {
  return log.events.some(e => e.kind === kind);
}

/** Returns the number of unique surfaces a kind has fired on. Used by
 *  triggers like "skipped 3 different cinematics" to distinguish broad
 *  disengagement from one stuck button. */
export function uniqueSurfacesForKind(
  log: WatcherLog,
  kind: "skip" | "choice_latency" | "tab_hidden" | "idle",
): number {
  const surfaces = new Set<string>();
  for (const e of log.events) {
    if (e.kind === kind) surfaces.add(e.surface);
  }
  return surfaces.size;
}

/** Defensive parser: accepts unknown JSON, returns a valid log. Drops
 *  malformed events rather than throwing — the log must never crash
 *  the boot path. */
export function parseLog(raw: unknown): WatcherLog {
  if (!raw || typeof raw !== "object") return emptyLog();
  const obj = raw as { schemaVersion?: unknown; events?: unknown };
  if (obj.schemaVersion !== 1) return emptyLog();
  if (!Array.isArray(obj.events)) return emptyLog();
  const valid: WatcherObservation[] = [];
  for (const e of obj.events) {
    if (isValidObservation(e)) valid.push(e);
  }
  return { schemaVersion: 1, events: valid };
}

function isValidObservation(e: unknown): e is WatcherObservation {
  if (!e || typeof e !== "object") return false;
  const r = e as { kind?: unknown; at?: unknown };
  if (typeof r.kind !== "string") return false;
  if (typeof r.at !== "number") return false;
  // Rather than enumerate every kind here, we trust the discriminator
  // and let consumers handle unknown kinds defensively. Adding a kind
  // never breaks parsing; removing one degrades to "unknown event" in
  // older clients.
  return true;
}
