/* ═══════════════════════════════════════════════════════
   DISCHORDIAN SAGA — SHOW-WITHIN-THE-SHOW EPISODE REGISTRY

   Canonical list of in-game "Dischordian Saga" episodes
   the player watches diegetically — the show that is the
   game, that the Antiquarian is also writing down.

   Each entry pairs an MP4 (served from the CDN) with the
   narrative flag that triggers it and, where applicable,
   the governance vote that opens immediately after the
   broadcast ends. Episodes that haven't been produced
   yet declare `durationSec: null` — the player component
   uses that as the signal to render a diegetic
   "broadcast not yet decoded" fallback overlay instead of
   trying to stream a missing video.
   ═══════════════════════════════════════════════════════ */

import type { HoloRecordingId } from "./engineerRecordings";

export interface DischordianSagaEpisode {
  /** 1-indexed season. */
  season: number;
  /** 1-indexed episode within the season. */
  episode: number;
  /** Stable slug — used in asset filenames. */
  slug: string;
  /** Display title. */
  title: string;
  /** Path under the CDN's cdn/client-public/ root.
   *  Resolved at render time via `assetUrl(...)`. */
  videoPath: string;
  /** Producer-supplied duration in seconds; null when
   *  the episode hasn't been produced yet. The player
   *  uses null as the signal to render the diegetic
   *  fallback overlay rather than attempt playback. */
  durationSec: number | null;
  /** Narrative flag that triggers this episode the first
   *  time it's encountered in-game. */
  triggerFlag: string;
  /** Optional: vote id (from engineerGovernanceVotes /
   *  governance) that opens immediately after the
   *  episode dismisses. */
  voteId?: string;
  /** Path to captions VTT under the same CDN prefix. */
  captionsPath?: string;
  /** The Engineer recording this episode is paired with,
   *  if any — used by the observation-deck handler to
   *  decide whether to play the episode or the existing
   *  audio-only recording. */
  pairedRecordingId?: HoloRecordingId;
  /** One-line in-fiction synopsis for the production
   *  pipeline and the Loredex entry. */
  synopsis: string;
}

export const DSAGA_EPISODES: readonly DischordianSagaEpisode[] = [
  {
    season: 1,
    episode: 1,
    slug: "the-worlds-i-saved",
    title: "The Worlds I Saved",
    videoPath: "videos/episodes/s01e01-the-worlds-i-saved.mp4",
    durationSec: null,
    triggerFlag: "engineer_recording_3_discovered",
    voteId: "engineer_vote_thought_vs_violence",
    captionsPath: "captions/episodes/s01e01.vtt",
    pairedRecordingId: "holo_worlds_i_saved",
    synopsis:
      "The Engineer's third recording, broadcast in full: an invisible " +
      "network of survivors his class never wrote down, the worlds he " +
      "fixed instead of broke, and the question the Potentials must " +
      "answer before the cycle closes — patience or violence.",
  },
] as const;

export type DischordianSagaEpisodeSlug = (typeof DSAGA_EPISODES)[number]["slug"];

/** True when the episode's video has been produced. The
 *  player uses this to decide whether to stream the video
 *  or render the diegetic "signal received, decoding"
 *  fallback overlay. */
export function episodeIsProduced(ep: DischordianSagaEpisode): boolean {
  return ep.durationSec !== null;
}

/** Look up an episode by its pairing with an Engineer
 *  holographic recording. Returns the episode if one is
 *  declared for that recording. */
export function findEpisodeForRecording(
  recordingId: HoloRecordingId,
): DischordianSagaEpisode | null {
  return DSAGA_EPISODES.find((e) => e.pairedRecordingId === recordingId) ?? null;
}

/** Localstorage flag used by the player to suppress
 *  re-playback after the first watch (or skip). */
export function episodeSeenFlag(ep: DischordianSagaEpisode): string {
  return `dsaga_s${String(ep.season).padStart(2, "0")}e${String(ep.episode).padStart(2, "0")}_seen`;
}
