/* ═══════════════════════════════════════════════════════
   DISCHORDIA T01 SEEN-IN-TITLE — first-session handoff

   Tracks whether the player has reached the T01 album intro
   stage during the first-visit title flow on this device.
   Set when the title cinematic completes (or AWAKEN fires)
   and the T01 audio + slideshow stage takes over.

   Read by useLoginAlbumTransmission to suppress the post-
   login modal pop on the FIRST authenticated session only —
   if the player AWAKENed before T01 finished, T01 stays as
   their next transmission for login #2 but the modal does
   not pop again on this same first session.

   Per-device localStorage. Cleared by the inbox replay path
   when a player asks to re-watch the opening.
   ═══════════════════════════════════════════════════════ */
const STORAGE_KEY = "dischordia_t01_seen_in_title";

export function hasSeenT01InTitle(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markT01SeenInTitle(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* localStorage may be unavailable in private mode */
  }
}

export function clearT01SeenInTitle(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const DISCHORDIA_T01_SEEN_IN_TITLE_KEY = STORAGE_KEY;
