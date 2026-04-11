/* ═══════════════════════════════════════════════════════
   LOREDEX REWRITE — Shadow Tongue Apprentice overrides

   §7.3 F2 Infiltration path. The Hierarchy apprenticeship
   lets the player permanently rewrite fragments of the
   Loredex — "lie to the universe and make it true."

   Implementation: a localStorage-backed override layer,
   keyed by loredex entry id. Whoever reads a loredex
   entry in the client should merge in the override via
   `applyLoredexOverride()`.

   The server-side Loredex remains untouched; this is a
   per-player, per-device reality distortion. Intentional.
   ═══════════════════════════════════════════════════════ */

const STORAGE_KEY = "loredex_overrides_v1";

export interface LoredexOverride {
  /** Entry id (e.g. "entity_1") */
  entityId: string;
  /** Which field was altered (bio is the most common target) */
  field: "bio" | "history" | "status";
  /** The text that was replaced — we keep this so future stages can reveal what was changed */
  originalFragment: string;
  /** The replacement text */
  rewrittenFragment: string;
  /** ISO timestamp of when the rewrite was committed */
  appliedAt: number;
  /** Which stage authored the rewrite */
  authoredByStage: string;
}

type OverrideMap = Record<string, LoredexOverride>;

function readMap(): OverrideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: OverrideMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage quota or private mode — fail silently, this is cosmetic
  }
}

/** Get the current override for a single loredex entry, or null. */
export function getLoredexOverride(entityId: string): LoredexOverride | null {
  return readMap()[entityId] ?? null;
}

/** Get all overrides currently applied to this player's loredex. */
export function getAllLoredexOverrides(): LoredexOverride[] {
  return Object.values(readMap());
}

/**
 * Write a new override. Overwrites any existing override for the same entry.
 * Returns the resulting override object so callers can chain logging.
 */
export function applyLoredexOverride(override: Omit<LoredexOverride, "appliedAt">): LoredexOverride {
  const map = readMap();
  const record: LoredexOverride = { ...override, appliedAt: Date.now() };
  map[override.entityId] = record;
  writeMap(map);
  return record;
}

/** Merge an override into a loredex entry's bio at read time. */
export function applyOverrideToBio(entityId: string, originalBio: string): string {
  const ov = getLoredexOverride(entityId);
  if (!ov || ov.field !== "bio") return originalBio;
  // Simple find-and-replace. If the original fragment isn't found, append a note
  // so the rewrite is visible regardless.
  if (originalBio.includes(ov.originalFragment)) {
    return originalBio.replace(ov.originalFragment, ov.rewrittenFragment);
  }
  return `${originalBio}\n\n[LOREDEX REWRITE — Shadow Tongue Apprentice] ${ov.rewrittenFragment}`;
}

/** Clear all overrides. Intended for debug / new-game reset. */
export function clearAllLoredexOverrides(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
