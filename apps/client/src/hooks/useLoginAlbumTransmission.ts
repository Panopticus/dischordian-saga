/* ═══════════════════════════════════════════════════════
   useLoginAlbumTransmission — on-login Meme broadcast hook

   On first authenticated mount, queries the unified login
   transmission queue (Dischordian Logic T01..T09 → TV
   transmissions in broadcastOrder) and pops the CRT modal.

   Three actions on the modal:
     - WATCH (accept): plays the audio/video. Completion fires
       the reward grant.
     - SKIP: closes the modal but keeps the entry in the player's
       INBOX tab so they can watch it later. Persists across
       browser sessions, unlike Close (per-session-only).
     - MUTE FUTURE: writes settings.muteLoginTransmissions=true
       so future transmissions auto-route to the inbox without
       popping. Also skips the current entry.

   When muteLoginTransmissions is true, the hook silently skips
   any newly-popped transmission so it lands in the inbox
   instead of opening the modal.

   Audio/video is delegated to the global PlayerContext (album
   tracks) or rendered inline by LoginMemeBroadcast (TV
   transmissions with iframe/video).

   Mounted exactly once in AppShellImmersive.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePlayerContext } from "@/hooks/usePlayerContext";
import { hasSeenT01InTitle } from "@/lib/dischordiaT01SeenInTitle";
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

/** Album-track variant of the queue payload. */
export interface LoginAlbumTransmission {
  kind: "album";
  trackId: string;
  title: string;
  audioUrl: string;
  durationMs: number;
  intro: string;
  outro: string;
  firstEver: boolean;
  firstEverIntroId: "login_first_ever" | null;
}

/** TV-episode variant of the queue payload. */
export interface LoginTvTransmission {
  kind: "tv";
  transmissionId: string;
  title: string;
  videoUrl: string | null;
  driveFileId: string | null;
  lengthSeconds: number;
  epoch: number;
  episodeNumber: number;
  intro: string;
  outro: string;
  synopsis: string;
  reward: { xp: number; dream: number; achievement?: string };
  relatedLoredexEntries: string[];
}

export type LoginTransmission = LoginAlbumTransmission | LoginTvTransmission;

function loginItemKey(t: LoginTransmission): string {
  return t.kind === "album" ? `album:${t.trackId}` : `tv:${t.transmissionId}`;
}

function dismissKey(userId: string | number | undefined, itemKey: string) {
  return `loginMemeDismissed:${userId ?? "anon"}:${itemKey}`;
}

function isDismissedThisSession(
  userId: string | number | undefined,
  itemKey: string,
): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(dismissKey(userId, itemKey)) === "1";
  } catch {
    return false;
  }
}

function markDismissedThisSession(
  userId: string | number | undefined,
  itemKey: string,
): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(dismissKey(userId, itemKey), "1");
  } catch {
    /* sessionStorage may be unavailable in private mode */
  }
}

type Album1TrackId = "T01" | "T02" | "T03" | "T04" | "T05" | "T06" | "T07" | "T08" | "T09";

export function useLoginAlbumTransmission() {
  const { isAuthenticated, user } = useAuth();
  const player = usePlayer();
  const playerCtx = usePlayerContext();
  const acceptAlbumMutation = trpc.transmissions.acceptAlbumTransmission.useMutation();
  const skipMutation = trpc.transmissions.skipLoginTransmission.useMutation();
  const recordWatchedMutation = trpc.transmissions.recordWatched.useMutation();
  const saveSettingsMutation = trpc.settings.saveSettings.useMutation();

  const settingsQuery = trpc.settings.getSettings.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
  const muteLoginTransmissions = settingsQuery.data?.muteLoginTransmissions ?? false;

  const queryEnabled = isAuthenticated && settingsQuery.data !== undefined;

  const { data: transmission } = trpc.transmissions.getNextLoginTransmission.useQuery(
    { playerContext: playerCtx },
    { enabled: queryEnabled, staleTime: 60_000 },
  );

  const [phase, setPhase] = useState<LoginMemePhase>("idle");
  const sessionFiredRef = useRef(false);
  const acknowledgedAcceptRef = useRef(false);
  const completionFiredRef = useRef(false);

  // Initial open OR auto-skip when muted. As soon as we have a
  // transmission and have read the mute setting, decide.
  useEffect(() => {
    if (sessionFiredRef.current) return;
    if (!queryEnabled) return;
    if (!transmission) return;

    const itemKey = loginItemKey(transmission as LoginTransmission);

    // First-session suppression: if the queue's first item is T01
    // AND the player AWAKENed (or watched) T01 in the title flow on
    // this device, we don't want the modal to also pop T01 in the
    // same browser session. Server cursor still says T01 so it'll
    // re-pop on the NEXT session — exactly the desired behavior.
    // (When T01 was completed naturally, the title flow advanced
    // the cursor past T01 server-side, so this branch never fires.)
    if (
      transmission.kind === "album" &&
      transmission.trackId === "T01" &&
      hasSeenT01InTitle()
    ) {
      sessionFiredRef.current = true;
      setPhase("dismissed");
      return;
    }

    // Mute is active: silently route to inbox and stay idle.
    if (muteLoginTransmissions) {
      sessionFiredRef.current = true;
      skipMutation.mutate({
        item:
          transmission.kind === "album"
            ? { kind: "album", trackId: transmission.trackId as Album1TrackId }
            : { kind: "tv", transmissionId: transmission.transmissionId },
      });
      setPhase("dismissed");
      return;
    }

    if (isDismissedThisSession(user?.id, itemKey)) {
      sessionFiredRef.current = true;
      setPhase("dismissed");
      return;
    }
    sessionFiredRef.current = true;
    if (transmission.kind === "album") {
      setPhase(transmission.firstEver ? "first-words" : "intro");
    } else {
      // TV transmissions skip the album's first-words/intro phases —
      // they have their own intro/outro carried by the modal.
      setPhase("intro");
    }
  }, [
    queryEnabled,
    transmission,
    user?.id,
    muteLoginTransmissions,
    skipMutation,
  ]);

  const accept = useCallback(() => {
    if (!transmission) return;
    if (acknowledgedAcceptRef.current) return;
    acknowledgedAcceptRef.current = true;

    if (transmission.kind === "album") {
      // CRITICAL: playSong synchronously inside the user-gesture
      // handler. Browser autoplay policies otherwise block audio.
      const synth: LoredexEntry = {
        id: `album1_${transmission.trackId.toLowerCase()}`,
        type: "song",
        name: transmission.title,
        audio_url: transmission.audioUrl,
        album: "Dischordian Logic",
      };
      player.playSong(synth);
      setPhase("playing");

      if (isAuthenticated) {
        acceptAlbumMutation.mutate({
          trackId: transmission.trackId as Album1TrackId,
          completed: false,
        });
      }
    } else {
      // TV transmission: the modal renders the <video>/<iframe>
      // inline; no global PlayerContext takeover. We just flip phase
      // and the modal handles playback + completion notification.
      setPhase("playing");
    }
  }, [transmission, player, acceptAlbumMutation, isAuthenticated]);

  const skip = useCallback(() => {
    if (!transmission) return;
    skipMutation.mutate({
      item:
        transmission.kind === "album"
          ? { kind: "album", trackId: transmission.trackId as Album1TrackId }
          : { kind: "tv", transmissionId: transmission.transmissionId },
    });
    markDismissedThisSession(user?.id, loginItemKey(transmission as LoginTransmission));
    setPhase("dismissed");
  }, [transmission, skipMutation, user?.id]);

  const muteFuture = useCallback(() => {
    if (!transmission) return;
    saveSettingsMutation.mutate({ muteLoginTransmissions: true });
    skipMutation.mutate({
      item:
        transmission.kind === "album"
          ? { kind: "album", trackId: transmission.trackId as Album1TrackId }
          : { kind: "tv", transmissionId: transmission.transmissionId },
    });
    markDismissedThisSession(user?.id, loginItemKey(transmission as LoginTransmission));
    setPhase("dismissed");
  }, [transmission, saveSettingsMutation, skipMutation, user?.id]);

  const dismiss = useCallback(() => {
    if (!transmission) return;
    markDismissedThisSession(user?.id, loginItemKey(transmission as LoginTransmission));
    setPhase("dismissed");
  }, [transmission, user?.id]);

  const minimize = useCallback(() => {
    setPhase("minimized");
  }, []);

  const expand = useCallback(() => {
    if (!player.currentSong) return;
    setPhase("playing");
  }, [player.currentSong]);

  // Album completion watcher — only relevant for album tracks; TV
  // transmissions complete via the modal's own video onEnded handler.
  useEffect(() => {
    if (!transmission || transmission.kind !== "album") return;
    if (phase !== "playing" && phase !== "minimized") return;
    if (player.currentSong?.id !== `album1_${transmission.trackId.toLowerCase()}`) {
      return;
    }
    const finished =
      player.duration > 0 &&
      player.currentTime > 0 &&
      player.currentTime >= player.duration - 1.5;
    if (!finished) return;
    if (completionFiredRef.current) return;
    completionFiredRef.current = true;

    if (isAuthenticated) {
      acceptAlbumMutation.mutate({
        trackId: transmission.trackId as Album1TrackId,
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
    acceptAlbumMutation,
  ]);

  /** TV completion handler — wired from the modal's <video onEnded>. */
  const reportTvCompleted = useCallback(() => {
    if (!transmission || transmission.kind !== "tv") return;
    if (completionFiredRef.current) return;
    completionFiredRef.current = true;
    if (isAuthenticated) {
      recordWatchedMutation.mutate({
        transmissionId: transmission.transmissionId,
        xp: transmission.reward.xp,
        dream: transmission.reward.dream,
        achievement: transmission.reward.achievement,
        loredexEntries: transmission.relatedLoredexEntries,
      });
    }
    setPhase((p) => (p === "minimized" ? "done" : "outro"));
  }, [transmission, isAuthenticated, recordWatchedMutation]);

  return useMemo(
    () => ({
      transmission: (transmission ?? null) as LoginTransmission | null,
      phase,
      accept,
      skip,
      muteFuture,
      dismiss,
      minimize,
      expand,
      setPhase,
      reportTvCompleted,
    }),
    [
      transmission,
      phase,
      accept,
      skip,
      muteFuture,
      dismiss,
      minimize,
      expand,
      reportTvCompleted,
    ],
  );
}
