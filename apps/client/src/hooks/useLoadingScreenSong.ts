/* ═══════════════════════════════════════════════════════
   useLoadingScreenSong — Cold-boot title song for returning players

   When a player who has already created a character AND already
   watched the pre-auth opening cinematic returns to the game, this
   hook tries to play "The Enigma's Lament" (Album 1 / T01) under
   the loading screen so the boot has a recognisable musical
   identity. The song stops on the first user interaction (click,
   key, touch) so it doesn't fight whatever the player does next —
   sign-in, navigation, or the awakening cinematic's own BEGIN
   gesture, which has its own theme bed.

   Why returning-player-only:
     • First-time players already get T01 via the meme cinematic →
       title bed → login pipeline (TitlePage + DischordiaOpening-
       Cinematic). Playing it here would double-play.
     • Players without a character would be in the meme cinematic
       path, not on a generic cold-boot loading screen.

   Why session-scoped (not load-scoped):
     • The loading screen flashes on every Suspense fallback /
       route transition; playing T01 on each one is intrusive. We
       arm at most once per browser session, so the song attempts
       playback only on the literal cold-boot loading screen.

   Autoplay note:
     • Browsers reject `audio.play()` without sticky activation.
       The first attempt may silently fail; that's intentional —
       no fallback retry, no popup, no nudge. The hook is "play if
       we can, otherwise stay quiet."
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { TITLE_T01_LOREDEX_ENTRY } from "@/lib/titleT01Entry";
import { hasSeenOpening } from "@/lib/dischordiaOpeningSeen";

const SESSION_TRIED_KEY = "loading_screen_song_attempted_this_session";

/** Returns true if we've already attempted the cold-boot song this
 *  browser session, regardless of whether it actually played. */
function alreadyAttempted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(SESSION_TRIED_KEY) === "1";
  } catch {
    return true;
  }
}

function markAttempted(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_TRIED_KEY, "1");
  } catch {
    /* private mode — accept that we'll re-attempt next mount */
  }
}

interface Options {
  /** When false, the hook is a no-op (used to gate on
   *  "user has created a character" — caller decides). */
  enabled: boolean;
}

export function useLoadingScreenSong({ enabled }: Options): void {
  const player = usePlayer();
  const armedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (armedRef.current) return;
    if (alreadyAttempted()) return;
    if (!hasSeenOpening()) return;
    // The first-visit pipeline (DischordiaOpeningCinematic →
    // TitlePage preroll) handles T01 for new players; only fire
    // for returning ones whose opening flag has already shipped.

    armedRef.current = true;
    markAttempted();

    // Best-effort play. If autoplay is blocked, this resolves to a
    // paused state and we exit silently — no retry, no UI nudge.
    try {
      player.playSong(TITLE_T01_LOREDEX_ENTRY);
    } catch {
      /* swallow — autoplay restrictions, transient player state */
    }

    // Stop on the first user gesture so the song doesn't fight
    // login clicks, navigation, or the awakening cinematic's BEGIN
    // gesture (which spins up its own theme bed). One-shot listener;
    // we explicitly remove it from inside the handler so the same
    // gesture can also activate whatever the player intended.
    const stopOnGesture = () => {
      try {
        player.pause();
      } catch {
        /* ignore — player may already be paused */
      }
      window.removeEventListener("pointerdown", stopOnGesture, true);
      window.removeEventListener("keydown", stopOnGesture, true);
      window.removeEventListener("touchstart", stopOnGesture, true);
    };
    // `capture: true` so we fire before any other handler can
    // intercept and start its own audio (e.g. the AwakeningPage
    // cinematic's BEGIN click).
    window.addEventListener("pointerdown", stopOnGesture, true);
    window.addEventListener("keydown", stopOnGesture, true);
    window.addEventListener("touchstart", stopOnGesture, true);

    return () => {
      window.removeEventListener("pointerdown", stopOnGesture, true);
      window.removeEventListener("keydown", stopOnGesture, true);
      window.removeEventListener("touchstart", stopOnGesture, true);
    };
  }, [enabled, player]);
}
