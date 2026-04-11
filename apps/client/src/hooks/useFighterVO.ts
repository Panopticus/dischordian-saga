/* ═══════════════════════════════════════════════════════
   useFighterVO — Unified fighter voice-over playback hook

   Single-entry-point replacement for the per-character
   hooks (useAgentZeroVO, useNecromancerVO, useSourceVO).
   Accepts any fighter id registered in
   `@shared/fighterVoRegistry`.

   API (matches the legacy per-character hooks):
     const { speak, speakCategory, stop, speaking, hasVO }
       = useFighterVO("collector");

   - speak(lineId)          play a specific manifest line
   - speakCategory(cat)     pick a random line from a category
                            (e.g. "decisive_victory", "defeat")
   - stop()                 cancel + clear queue
   - speaking               true while audio is playing
   - hasVO                  true if manifest loaded with >=1 entry

   Manifest loads are cached at module level so switching
   fighters never re-fetches the same JSON.
   ═══════════════════════════════════════════════════════ */
import { useRef, useState, useCallback, useEffect } from "react";
import {
  getVoRegistration,
  pickRandomLineByCategory,
  type VoManifest,
} from "@shared/fighterVoRegistry";

// ─── Module-level manifest cache ───────────────────────
// Maps fighterId -> already-loaded manifest. Survives component
// unmount so swapping fighters back-and-forth never re-hits the
// dynamic import.
const MANIFEST_CACHE = new Map<string, VoManifest>();

export interface UseFighterVOResult {
  /** Play a specific line id from this fighter's manifest */
  speak: (lineId: string) => void;
  /** Pick a random line from a category and play it */
  speakCategory: (category: string) => void;
  /** Cancel current audio and clear the queue */
  stop: () => void;
  /** True while audio is actively playing */
  speaking: boolean;
  /** True if the manifest loaded and has at least one line */
  hasVO: boolean;
}

export function useFighterVO(fighterId: string): UseFighterVOResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [manifest, setManifest] = useState<VoManifest>(
    () => MANIFEST_CACHE.get(fighterId) ?? {},
  );
  const [loaded, setLoaded] = useState<boolean>(
    () => MANIFEST_CACHE.has(fighterId),
  );

  // Load the manifest the first time we see a given fighterId
  useEffect(() => {
    let cancelled = false;

    const cached = MANIFEST_CACHE.get(fighterId);
    if (cached) {
      setManifest(cached);
      setLoaded(true);
      return () => {
        cancelled = true;
      };
    }

    const registration = getVoRegistration(fighterId);
    if (!registration) {
      // Unregistered fighter — ship an empty manifest, mark loaded
      MANIFEST_CACHE.set(fighterId, {});
      setManifest({});
      setLoaded(true);
      return () => {
        cancelled = true;
      };
    }

    registration
      .load()
      .then(loadedManifest => {
        MANIFEST_CACHE.set(fighterId, loadedManifest);
        if (!cancelled) {
          setManifest(loadedManifest);
          setLoaded(true);
        }
      })
      .catch(() => {
        MANIFEST_CACHE.set(fighterId, {});
        if (!cancelled) {
          setManifest({});
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fighterId]);

  // Playback — mirrors the legacy useAgentZeroVO body with the
  // queue + error-tolerant audio element pattern.
  const speak = useCallback(
    (lineId: string) => {
      const url = manifest[lineId];
      if (!url) return;
      if (typeof Audio === "undefined") return; // SSR-safe guard

      if (speaking) {
        queueRef.current.push(lineId);
        return;
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.volume = 0.8;

      audio.onplay = () => setSpeaking(true);
      audio.onended = () => {
        setSpeaking(false);
        const next = queueRef.current.shift();
        if (next) {
          // Re-enter via the same handler so the queue drains
          // through the same speaking/queueing machinery.
          // Note: we read `manifest` from closure — because
          // manifests are immutable once loaded, this is safe.
          const nextUrl = manifest[next];
          if (nextUrl) {
            const nextAudio = new Audio(nextUrl);
            audioRef.current = nextAudio;
            nextAudio.volume = 0.8;
            nextAudio.onplay = () => setSpeaking(true);
            nextAudio.onended = audio.onended;
            nextAudio.onerror = audio.onerror;
            nextAudio.play().catch(() => setSpeaking(false));
          }
        }
      };
      audio.onerror = () => setSpeaking(false);
      audio.play().catch(() => setSpeaking(false));
    },
    [manifest, speaking],
  );

  const speakCategory = useCallback(
    (category: string) => {
      const lineId = pickRandomLineByCategory(manifest, fighterId, category);
      if (lineId) speak(lineId);
    },
    [manifest, fighterId, speak],
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    queueRef.current = [];
    setSpeaking(false);
  }, []);

  return {
    speak,
    speakCategory,
    stop,
    speaking,
    hasVO: loaded && Object.keys(manifest).length > 0,
  };
}

/** Exposed for tests — clears the module-level manifest cache.
 *  Production code should never need this. */
export function __resetFighterVOCache(): void {
  MANIFEST_CACHE.clear();
}
