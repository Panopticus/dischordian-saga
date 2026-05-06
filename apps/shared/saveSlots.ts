/* ═══════════════════════════════════════════════════════
   SAVE SLOTS — multi-slot state + cross-arc flag allowlist

   Plan §B7. Today every player has a single gameData blob;
   there's no way to fork a save before a hard choice or
   carry forward into a new arc with a controlled subset of
   flags. This module is the pure data layer for both:

     • Multi-slot saves: copy / restore / list / delete a
       named snapshot of gameData (kept inside gameData
       itself under a `saveSlots` field so no DB migration
       is needed).
     • Cross-arc allowlist: only the flags / fields named
       in CROSS_ARC_ALLOWLIST carry into a new arc when the
       player commits to prestige / NG+. Everything else
       resets, the way ME's import filter works.

   Pure data + helpers — no DB. The gameState router calls
   into these helpers so the schema change stays isolated.
   ═══════════════════════════════════════════════════════ */

export interface SaveSlot {
  id: string;
  /** Player-supplied label. Truncated to 40 chars on save. */
  label: string;
  createdAt: number;
  updatedAt: number;
  /** Snapshot of the full gameData blob at save time. */
  data: Record<string, unknown>;
}

export const MAX_SAVE_SLOTS = 6;
export const MAX_SLOT_LABEL_LEN = 40;

/* ─── Slot ops ─── */

export function listSlots(gameData: Record<string, unknown>): SaveSlot[] {
  const raw = gameData.saveSlots;
  if (!Array.isArray(raw)) return [];
  return raw.filter(isSaveSlot).slice().sort((a, b) => b.updatedAt - a.updatedAt);
}

function isSaveSlot(x: unknown): x is SaveSlot {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Partial<SaveSlot>;
  return (
    typeof o.id === "string" &&
    typeof o.label === "string" &&
    typeof o.createdAt === "number" &&
    typeof o.updatedAt === "number" &&
    typeof o.data === "object" &&
    o.data !== null
  );
}

export function getSlot(
  gameData: Record<string, unknown>,
  slotId: string,
): SaveSlot | undefined {
  return listSlots(gameData).find((s) => s.id === slotId);
}

/** Save the current gameData (minus its own saveSlots field —
 *  no recursive nesting) into a new or existing slot. Returns
 *  the updated gameData. */
export function saveToSlot(
  gameData: Record<string, unknown>,
  slotId: string,
  label: string,
  now: number = Date.now(),
): { gameData: Record<string, unknown>; slot: SaveSlot } | { error: string } {
  const slots = listSlots(gameData);
  const existing = slots.find((s) => s.id === slotId);
  if (!existing && slots.length >= MAX_SAVE_SLOTS) {
    return { error: `Maximum ${MAX_SAVE_SLOTS} slots reached. Delete one before saving.` };
  }
  const trimmed = label.trim().slice(0, MAX_SLOT_LABEL_LEN);
  const dataSnapshot = { ...gameData };
  delete dataSnapshot.saveSlots; // no recursive nesting

  const newSlot: SaveSlot = {
    id: slotId,
    label: trimmed || (existing?.label ?? "Untitled save"),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    data: dataSnapshot,
  };
  const nextSlots = existing
    ? slots.map((s) => (s.id === slotId ? newSlot : s))
    : [...slots, newSlot];

  return {
    gameData: { ...gameData, saveSlots: nextSlots },
    slot: newSlot,
  };
}

/** Restore from a named slot — replaces the live gameData with
 *  the slot's snapshot, but preserves the saveSlots array so
 *  the player keeps access to their other saves. */
export function restoreFromSlot(
  gameData: Record<string, unknown>,
  slotId: string,
): { gameData: Record<string, unknown> } | { error: string } {
  const slot = getSlot(gameData, slotId);
  if (!slot) return { error: `Slot ${slotId} not found` };
  const slots = listSlots(gameData);
  return { gameData: { ...slot.data, saveSlots: slots } };
}

export function deleteSlot(
  gameData: Record<string, unknown>,
  slotId: string,
): { gameData: Record<string, unknown> } {
  const slots = listSlots(gameData).filter((s) => s.id !== slotId);
  return { gameData: { ...gameData, saveSlots: slots } };
}

/* ─── Cross-arc allowlist ─── */

/** Top-level gameData fields that survive a cross-arc reset.
 *  Everything else is wiped to its default at NG+. */
export const CROSS_ARC_ALLOWED_FIELDS: ReadonlySet<string> = new Set([
  "saveSlots", // never lose other slots
  "totalPlaytime",
  "lifetimePrestigeStats",
  "moralityScore", // morality survives the arc
  "achievementsEarned",
  "loredexEntries",
]);

/** Sticky narrative flags that carry forward. The allowlist
 *  is intentionally narrow — most flags are arc-local. */
export const CROSS_ARC_ALLOWED_FLAGS: ReadonlySet<string> = new Set([
  "narrative_spine_complete",
  "vortex_endgame_light_variant",
  "vortex_endgame_dark_variant",
  "kael_questline_complete",
  "lyra_vox_unlocked",
  "trade_empire_unlocked",
]);

/** Build the carryforward gameData for a new arc — strips
 *  every field not in CROSS_ARC_ALLOWED_FIELDS, and inside
 *  narrativeFlags strips every flag not in CROSS_ARC_ALLOWED_FLAGS. */
export function buildCrossArcCarryforward(
  gameData: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(gameData)) {
    if (CROSS_ARC_ALLOWED_FIELDS.has(k)) out[k] = v;
  }

  // Carry the allowlisted subset of narrativeFlags through
  // even though the field itself isn't in the top-level
  // allowlist (we want a *filtered* copy, not the whole bag).
  const flagsRaw = gameData.narrativeFlags;
  if (flagsRaw && typeof flagsRaw === "object") {
    const filtered: Record<string, boolean> = {};
    for (const [flag, value] of Object.entries(flagsRaw as Record<string, unknown>)) {
      if (CROSS_ARC_ALLOWED_FLAGS.has(flag) && value === true) {
        filtered[flag] = true;
      }
    }
    out.narrativeFlags = filtered;
  }

  return out;
}
