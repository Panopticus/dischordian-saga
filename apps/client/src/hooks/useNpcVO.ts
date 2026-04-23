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

type Manifest = Record<string, string>;
type ManifestLoader = () => Promise<Manifest>;

interface ManifestEntry {
  manifest: Manifest | null;
  loaded: boolean;
  loading: boolean;
}

const cache = new Map<string, ManifestEntry>();

function loadOnce(key: string, loader: ManifestLoader) {
  let entry = cache.get(key);
  if (!entry) {
    entry = { manifest: null, loaded: false, loading: false };
    cache.set(key, entry);
  }
  if (entry.loaded || entry.loading) return entry;
  entry.loading = true;
  loader()
    .then((m) => {
      entry!.manifest = m;
      entry!.loaded = true;
      entry!.loading = false;
    })
    .catch(() => {
      entry!.manifest = {};
      entry!.loaded = true;
      entry!.loading = false;
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

  useEffect(() => { loadOnce(key, loader); }, [key, loader]);

  const speak = useCallback((lineId: string) => {
    const entry = cache.get(key);
    const url = entry?.manifest?.[lineId];
    if (!url) return;

    if (speaking) {
      queueRef.current.push(lineId);
      return;
    }

    const a = new Audio();
    a.crossOrigin = "anonymous";
    a.src = url;
    a.volume = 0.8;
    setAudio(a);

    a.onplay = () => setSpeaking(true);
    a.onended = () => {
      setSpeaking(false);
      const next = queueRef.current.shift();
      if (next) speak(next);
    };
    a.onerror = () => setSpeaking(false);

    a.play().catch(() => setSpeaking(false));
  }, [key, speaking]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    queueRef.current = [];
    setSpeaking(false);
  }, [audio]);

  const entry = cache.get(key);
  const hasVO = !!(entry?.loaded && entry.manifest && Object.keys(entry.manifest).length > 0);

  return { speak, stop, speaking, audio, hasVO };
}
