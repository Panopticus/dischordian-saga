/* ═══════════════════════════════════════════════════════
   useNpcVO — Shared internal VO playback engine

   All the thin per-NPC hooks (useHumanVO, useAgentZeroVO,
   useLockeVO, useAntiquarianVO, useSourceVO, useShadowTongueVO)
   share an identical body that only differs by which manifest
   they load. This factor keeps them in sync — including the
   crossOrigin + state-exposed audio plumbing required for
   real-time lip sync via wawa-lipsync.
   ═══════════════════════════════════════════════════════ */
import { useRef, useState, useCallback, useEffect } from "react";
import { getVoVolume } from "@/lib/streamerSettings";
import {
  claimActiveVo,
  releaseActiveVo,
  voPlaybackEnded,
  voPlaybackStarted,
} from "@/lib/voSpeakingState";

type Manifest = Record<string, string>;
type ManifestLoader = () => Promise<Manifest>;

interface ManifestEntry {
  manifest: Manifest | null;
  loaded: boolean;
  loading: boolean;
  /** Callbacks from speak() calls that arrived before the manifest
   *  finished loading. Drained on resolve so the cold-load case still
   *  plays its first VO instead of silently no-op'ing. */
  pending: Array<() => void>;
}

const cache = new Map<string, ManifestEntry>();

function loadOnce(key: string, loader: ManifestLoader) {
  let entry = cache.get(key);
  if (!entry) {
    entry = { manifest: null, loaded: false, loading: false, pending: [] };
    cache.set(key, entry);
  }
  if (entry.loaded || entry.loading) return entry;
  entry.loading = true;
  loader()
    .then((m) => {
      entry!.manifest = m;
      entry!.loaded = true;
      entry!.loading = false;
      const drain = entry!.pending.splice(0);
      for (const cb of drain) cb();
    })
    .catch(() => {
      entry!.manifest = {};
      entry!.loaded = true;
      entry!.loading = false;
      const drain = entry!.pending.splice(0);
      for (const cb of drain) cb();
    });
  return entry;
}

export interface NpcVoApi {
  speak: (lineId: string) => void;
  stop: () => void;
  speaking: boolean;
  audio: HTMLAudioElement | null;
  hasVO: boolean;
}

export function useNpcVO(key: string, loader: ManifestLoader): NpcVoApi {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const queueRef = useRef<string[]>([]);
  // Mirror `speaking` into a ref so `speak`'s closure can see the live
  // value without forcing the callback to re-create on every flip.
  // Stable identity matters because callers include this hook in their
  // effect deps and an unstable `speak` produced stale-closure bugs.
  const speakingRef = useRef(false);
  useEffect(() => { speakingRef.current = speaking; }, [speaking]);

  useEffect(() => { loadOnce(key, loader); }, [key, loader]);

  const speak = useCallback((lineId: string) => {
    const entry = cache.get(key) ?? loadOnce(key, loader);
    // Manifest hasn't resolved yet — queue this request and replay it
    // when loadOnce drains. Without this, the first speak() of a
    // session loses its line to the dynamic import race.
    if (!entry.loaded) {
      entry.pending.push(() => speak(lineId));
      return;
    }
    const url = entry.manifest?.[lineId];
    if (!url) {
      console.warn(`[useNpcVO:${key}] missing manifest entry for "${lineId}"`);
      return;
    }

    // Latest speak() wins — drop anything we had queued so the user's
    // most recent click takes priority over a stale serialization.
    queueRef.current = [];

    const a = new Audio();
    a.crossOrigin = "anonymous";
    a.src = url;
    a.volume = 0.8 * getVoVolume();
    setAudio(a);

    // Balance the global VO-ducking refcount across this play() — see
    // useElaraVO.ts for the same pattern. published flips true on
    // onplay and back to false on the first of {onended, onerror,
    // onpause}, so cancel-during-play paths don't strand the count.
    let published = false;
    const finishPublish = () => {
      if (published) {
        published = false;
        voPlaybackEnded();
      }
    };

    // Become the global active speaker NOW (synchronously). Doing it
    // before play() resolves means call order is the deterministic
    // tiebreaker when two hooks (e.g. Elara + Human) speak in the
    // same tick. claimActiveVo synchronously pauses the previous
    // active hook's audio, which fires its onpause and runs its
    // cleanup — no overlap reaches the speakers.
    const myStop = () => { a.pause(); };
    claimActiveVo(myStop);

    a.onplay = () => {
      speakingRef.current = true;
      setSpeaking(true);
      if (!published) {
        published = true;
        voPlaybackStarted();
      }
    };
    a.onended = () => {
      speakingRef.current = false;
      setSpeaking(false);
      finishPublish();
      releaseActiveVo(myStop);
    };
    a.onerror = () => {
      speakingRef.current = false;
      setSpeaking(false);
      finishPublish();
      releaseActiveVo(myStop);
    };
    a.onpause = () => {
      if (a.ended) return;
      speakingRef.current = false;
      setSpeaking(false);
      finishPublish();
      releaseActiveVo(myStop);
    };

    a.play().catch(() => {
      speakingRef.current = false;
      setSpeaking(false);
      finishPublish();
      releaseActiveVo(myStop);
    });
  }, [key, loader]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    queueRef.current = [];
    speakingRef.current = false;
    setSpeaking(false);
  }, [audio]);

  const entry = cache.get(key);
  const hasVO = !!(entry?.loaded && entry.manifest && Object.keys(entry.manifest).length > 0);

  return { speak, stop, speaking, audio, hasVO };
}
