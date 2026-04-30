/* ═══════════════════════════════════════════════════════
   DISCHORDIA OPENING — first-visit gate

   Tracks whether the 3:09 pre-auth opening cinematic has
   been seen on this device. Read synchronously by TitlePage
   so first paint never flashes the title behind the video.

   Per-device localStorage. The same flag is also handed to
   the server on first authenticated mount so the album
   cursor can seed at index 1 (T01 already delivered) — see
   useLoginAlbumTransmission for the post-auth handoff.
   ═══════════════════════════════════════════════════════ */
const STORAGE_KEY = "dischordia_opening_cinematic_seen";

export function hasSeenOpening(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markOpeningSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* localStorage may be unavailable in private mode */
  }
}

export function clearOpeningSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const DISCHORDIA_OPENING_SEEN_KEY = STORAGE_KEY;
