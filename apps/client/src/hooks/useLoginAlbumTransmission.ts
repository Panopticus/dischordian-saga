/* ═══════════════════════════════════════════════════════
   useLoginAlbumTransmission — on-login Meme broadcast hook

   On first authenticated mount, queries the server for the
   next undelivered Dischordian Logic track and pops a CRT
   modal ("LoginMemeBroadcast"). Drives the phase machine
   for first-words → intro → playing → outro → done, and
   persists per-session dismissal to sessionStorage so a
   refresh doesn't re-pop within the same browser session.

   Audio is delegated to the global PlayerContext so the
   song survives route changes and the minimized mini-card.

   Mounted exactly once in AppShellImmersive.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { usePlayer } from "@/contexts/PlayerContext";
import type { LoredexEntry } from "@/contexts/LoredexContext";

export type LoginMemePhase =
  | "idle"
  | "first-words"
  | "intro"
  | "playing"
  | "outro"
  | "done"
  | "minimized"
  | "dismissed";

export interface LoginAlbumTransmission {
  trackId: string;
  title: string;
  audioUrl: string;
  durationMs: number;
  intro: string;
  outro: string;
  firstEver: boolean;
  firstEverIntroId: "login_first_ever" | null;
}

function dismissKey(userId: string | number | undefined, trackId: string) {
  return `loginMemeDismissed:${userId ?? "anon"}:${trackId}`;
}

function isDismissedThisSession(
  userId: string | number | undefined,
  trackId: string,
): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(dismissKey(userId, trackId)) === "1";
  } catch {
    return false;
  }
}

function markDismissedThisSession(
  userId: string | number | undefined,
  trackId: string,
): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(dismissKey(userId, trackId), "1");
  } catch {
    /* sessionStorage may be unavailable in private mode */
  }
}

export function useLoginAlbumTransmission() {
  const { isAuthenticated, user } = useAuth();
  const player = usePlayer();
  const acceptMutation = trpc.transmissions.acceptAlbumTransmission.useMutation();
  const queryEnabled = isAuthenticated;

  const { data: transmission } = trpc.transmissions.getNextAlbumTransmission.useQuery(
    undefined,
    { enabled: queryEnabled, staleTime: 60_000 },
  );

  const [phase, setPhase] = useState<LoginMemePhase>("idle");
  // Has the popup already opened in this React lifetime? Prevents
  // state churn from re-popping after the player dismisses it.
  const sessionFiredRef = useRef(false);
  const acknowledgedAcceptRef = useRef(false);

  // Initial open: as soon as we get a non-null transmission and we
  // haven't already dismissed it in this session, advance from idle.
  useEffect(() => {
    if (sessionFiredRef.current) return;
    if (!queryEnabled) return;
    if (!transmission) return;
    if (isDismissedThisSession(user?.id, transmission.trackId)) {
      sessionFiredRef.current = true;
      setPhase("dismissed");
      return;
    }
    sessionFiredRef.current = true;
    setPhase(transmission.firstEver ? "first-words" : "intro");
  }, [queryEnabled, transmission, user?.id]);

  const accept = useCallback(() => {
    if (!transmission) return;
    if (acknowledgedAcceptRef.current) return;
    acknowledgedAcceptRef.current = true;

    // CRITICAL: playSong must be called synchronously inside the
    // user-gesture handler. Don't await any async work first or the
    // browser autoplay policy will block the audio. The tRPC mutation
    // is fire-and-forget.
    const synth: LoredexEntry = {
      id: `album1_${transmission.trackId.toLowerCase()}`,
      type: "song",
      name: transmission.title,
      audio_url: transmission.audioUrl,
      album: "Dischordian Logic",
    };
    player.playSong(synth);
    setPhase("playing");

    // Notify server we accepted (completed=false until song actually
    // ends; the audio.ended path below sends completed=true).
    if (isAuthenticated) {
      acceptMutation.mutate({
        trackId: transmission.trackId as
          | "T01" | "T02" | "T03" | "T04" | "T05" | "T06" | "T07" | "T08" | "T09",
        completed: false,
      });
    }
  }, [transmission, player, acceptMutation, isAuthenticated]);

  const dismiss = useCallback(() => {
    if (!transmission) return;
    markDismissedThisSession(user?.id, transmission.trackId);
    setPhase("dismissed");
  }, [transmission, user?.id]);

  const minimize = useCallback(() => {
    setPhase("minimized");
  }, []);

  const expand = useCallback(() => {
    if (!player.currentSong) return;
    setPhase("playing");
  }, [player.currentSong]);

  // Watch the audio engine for completion. When the current song
  // matches our transmission and currentTime crosses the duration
  // threshold (or `ended` is reached, signaled by isPlaying flipping
  // false at duration), fire the completion mutation and advance to
  // outro.
  useEffect(() => {
    if (!transmission) return;
    if (phase !== "playing" && phase !== "minimized") return;
    if (player.currentSong?.id !== `album1_${transmission.trackId.toLowerCase()}`) {
      return;
    }
    const finished =
      player.duration > 0 &&
      player.currentTime > 0 &&
      player.currentTime >= player.duration - 1.5;
    if (!finished) return;

    if (isAuthenticated) {
      acceptMutation.mutate({
        trackId: transmission.trackId as
          | "T01" | "T02" | "T03" | "T04" | "T05" | "T06" | "T07" | "T08" | "T09",
        completed: true,
      });
    }
    setPhase((p) => (p === "minimized" ? "done" : "outro"));
  }, [
    transmission,
    phase,
    player.currentSong?.id,
    player.currentTime,
    player.duration,
    isAuthenticated,
    acceptMutation,
  ]);

  return useMemo(
    () => ({
      transmission: transmission ?? null,
      phase,
      accept,
      dismiss,
      minimize,
      expand,
      setPhase,
    }),
    [transmission, phase, accept, dismiss, minimize, expand],
  );
}
