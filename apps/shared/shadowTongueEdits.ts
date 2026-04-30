/* ═══════════════════════════════════════════════════════
   SHADOW TONGUE — ACTIVE EDITS CATALOG

   Typed shape for the `shadowTongueState.activeEdits` JSON
   column (apps/db/schema.ts line 3427), which has been
   defined-but-empty since the column was added. This module
   gives that column a structure the engine can write, the
   client can read, and the uncorruption mini-loop can clear.

   Pure data + pure functions only. No `Date.now()`, no
   `Math.random()`, no DB access — the server callers stamp
   timestamps from the engine's tick, the tRPC router owns
   persistence. Mirrors the `apps/shared/` Tier-2 contract
   (see CLAUDE.md). Safe to import from both client and
   server.

   See plan §2.4 for the data-model design and §2.5 for the
   uncorruption mini-loop that drives `clearEdit`.
   ═══════════════════════════════════════════════════════ */

/** What kind of edit Shadow Tongue applied to the artifact.
 *
 *  - `scrub` — text was deleted, leaving a smoothed surface where
 *    something used to be. The unnameable hue glows where the
 *    original glyphs were.
 *  - `rewrite` — text was replaced with a slightly-different version
 *    in the same hand. Two-layer rendering: warm-gold underlayer +
 *    indigo overlayer.
 *  - `elevate` — text was upgraded to read as more authoritative
 *    than the original (the most pernicious case — readers trust
 *    the edit because it sounds smarter).
 */
export type EditType = "scrub" | "rewrite" | "elevate";

/** A single Shadow Tongue edit on a specific artifact in a specific
 *  room. The id is `<room>_<artifact>` and is unique per edit. */
export interface ActiveEdit {
  /** Stable id — `<room>_<artifact>`, e.g. "archives_lectern". */
  id: string;
  /** Room id (kebab-case). Must be a universal room — see the
   *  §6.3b parity probe for enforcement. */
  room: string;
  /** Artifact slug within the room — `lectern`, `reactor-schematic`,
   *  `starmap`, etc. Free-form string but conventionally kebab-case. */
  artifact: string;
  /** Edit type. */
  type: EditType;
  /** Engine tick when ST applied this edit. Pure caller-supplied
   *  number — do not rely on any wall-clock here. */
  createdAt: number;
  /** Engine tick when the player cleared this edit via the
   *  uncorruption mini-loop, or `null` if still active. */
  uncorruptedAt: number | null;
}

/** Map of edit id → edit record. Mirrors the JSON column shape. */
export type ActiveEdits = Record<string, ActiveEdit>;

/* ─── PURE HELPERS ─── */

/** Empty edits map. Use as a starting state. */
export const EMPTY_ACTIVE_EDITS: ActiveEdits = Object.freeze({});

/** Compose `<room>_<artifact>` to a stable id.
 *  Underscored separator deliberately — matches the existing
 *  `archives_lectern` convention used in the plan §2.3. */
export function makeEditId(room: string, artifact: string): string {
  return `${room}_${artifact}`;
}

/** Returns true if the given edit is currently active (not yet
 *  uncorrupted). Missing entries return false. */
export function isEditActive(
  edits: ActiveEdits | null | undefined,
  id: string,
): boolean {
  if (!edits) return false;
  const edit = edits[id];
  return Boolean(edit && edit.uncorruptedAt === null);
}

/** Count of currently-active edits. The CorruptibleBio crossout
 *  density cap (plan §7 risk #5) reads this. */
export function countActiveEdits(
  edits: ActiveEdits | null | undefined,
): number {
  if (!edits) return 0;
  let n = 0;
  for (const id in edits) {
    if (edits[id]?.uncorruptedAt === null) n++;
  }
  return n;
}

/** Returns the list of active edits scoped to a given room. */
export function activeEditsInRoom(
  edits: ActiveEdits | null | undefined,
  room: string,
): readonly ActiveEdit[] {
  if (!edits) return [];
  const out: ActiveEdit[] = [];
  for (const id in edits) {
    const e = edits[id];
    if (e && e.room === room && e.uncorruptedAt === null) out.push(e);
  }
  return out;
}

/** Apply a new edit. Returns a new map (does not mutate input).
 *
 *  If an edit with the same id already exists AND is active, the
 *  prior `createdAt` is preserved (Shadow Tongue does not get to
 *  reset his own timestamp by re-editing). If the prior edit was
 *  uncorrupted, the new edit replaces it cleanly — Shadow Tongue
 *  has re-corrupted a previously-cleansed artifact. */
export function recordEdit(
  edits: ActiveEdits | null | undefined,
  edit: ActiveEdit,
): ActiveEdits {
  const next: ActiveEdits = { ...(edits ?? {}) };
  const prior = next[edit.id];
  if (prior && prior.uncorruptedAt === null) {
    // Don't overwrite an active edit's createdAt.
    next[edit.id] = { ...edit, createdAt: prior.createdAt };
  } else {
    next[edit.id] = edit;
  }
  return next;
}

/** Mark an edit as uncorrupted at the given tick. Returns a new
 *  map. Idempotent: clearing an already-cleared edit is a no-op
 *  on `uncorruptedAt` (the first clear wins). Clearing an unknown
 *  id is a no-op. */
export function clearEdit(
  edits: ActiveEdits | null | undefined,
  id: string,
  tickAt: number,
): ActiveEdits {
  const src = edits ?? {};
  const prior = src[id];
  if (!prior) return src as ActiveEdits;
  if (prior.uncorruptedAt !== null) return src as ActiveEdits;
  return { ...src, [id]: { ...prior, uncorruptedAt: tickAt } };
}

/* ─── PARSING — DB JSON column is `Record<string, unknown>` ─── */

/** Type-guard for an unknown value being a well-formed `ActiveEdit`. */
function isActiveEdit(v: unknown): v is ActiveEdit {
  if (!v || typeof v !== "object") return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.room === "string" &&
    typeof e.artifact === "string" &&
    (e.type === "scrub" || e.type === "rewrite" || e.type === "elevate") &&
    typeof e.createdAt === "number" &&
    (e.uncorruptedAt === null || typeof e.uncorruptedAt === "number")
  );
}

/** Parse the raw DB JSON value into a typed `ActiveEdits` map.
 *  Drops malformed entries silently (forward-compat with future
 *  edit shapes). Returns the empty map on null/undefined. */
export function parseActiveEdits(raw: unknown): ActiveEdits {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    return {};
  const out: ActiveEdits = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (isActiveEdit(value) && value.id === id) {
      out[id] = value;
    }
  }
  return out;
}

/** Serialize an `ActiveEdits` map for DB write. Identity in shape
 *  (the JSON column is the same shape as the runtime type), but
 *  this exists so callers don't reach past the module boundary. */
export function serializeActiveEdits(
  edits: ActiveEdits,
): Record<string, ActiveEdit> {
  return edits;
}
