/* ═══════════════════════════════════════════════════════
   LOREDEX DISCOVERY — shared writer

   The canonical "what has the player discovered in the Loredex"
   set lives in localStorage["loredex_discovered"]; LoredexContext
   reads it at mount, useNarrativeIntegration writes to it from the
   narrative-flag side. This helper centralises the write so any
   surface (slideshow completion, transmissions, etc.) can mark
   entries as discovered without duplicating the localStorage
   shape.

   Dispatches a `loredex-discovered` window event so live listeners
   (e.g. a future LoredexContext effect) can re-pick-up the set
   without waiting for a remount.
   ═══════════════════════════════════════════════════════ */

const STORAGE_KEY = "loredex_discovered";

export function discoverLoredexEntries(ids: readonly string[]): string[] {
  if (typeof window === "undefined") return [];
  const newlyDiscovered: string[] = [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
    const set = new Set<string>(JSON.parse(raw));
    for (const id of ids) {
      if (id && !set.has(id)) {
        set.add(id);
        newlyDiscovered.push(id);
      }
    }
    if (newlyDiscovered.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
      window.dispatchEvent(
        new CustomEvent("loredex-discovered", { detail: newlyDiscovered }),
      );
    }
  } catch {
    /* localStorage unavailable / quota — discovery is best-effort */
  }
  return newlyDiscovered;
}
