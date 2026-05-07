/* ═══════════════════════════════════════════════════════
   ELARA VO HOOK — Plays Elara's voice lines

   Loads audio from the VO manifest (S3/CDN URLs).
   Manages playback, queueing, and volume.

   The currently-playing HTMLAudioElement is exposed via
   the `audio` field so consumers (lipsync) can connect a
   Web Audio analyser to it. `crossOrigin = "anonymous"`
   is required for AnalyserNode to read samples cross-origin.

   Usage:
     const { speak, stop, speaking, audio } = useElaraVO();
     speak("feature_unlock_companion_selection");
   ═══════════════════════════════════════════════════════ */
import { useRef, useState, useCallback, useEffect } from "react";
import {
  claimActiveVo,
  releaseActiveVo,
  voPlaybackEnded,
  voPlaybackStarted,
} from "@/lib/voSpeakingState";

let manifest: Record<string, string> | null = null;
let manifestLoading = false;
let manifestLoaded = false;
/** Callbacks from speak() invocations that arrived before the dynamic
 *  import resolved. Drained on load so the very first VO of a session
 *  isn't lost to the cold-load race. */
const pendingSpeak: Array<() => void> = [];

async function loadManifest() {
  if (manifestLoaded || manifestLoading) return;
  manifestLoading = true;
  try {
    const mod = await import("@shared/elaraVoManifest.json");
    manifest = mod.default || mod;
    manifestLoaded = true;
  } catch {
    manifest = {};
    manifestLoaded = true;
  }
  manifestLoading = false;
  const drain = pendingSpeak.splice(0);
  for (const cb of drain) cb();
}

export function useElaraVO() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const queueRef = useRef<string[]>([]);
  // Mirror `speaking` into a ref so `speak` keeps a stable identity
  // across renders. Callers that include the hook in effect deps
  // otherwise risk capturing a stale `speak` closure where `speaking`
  // disagrees with reality.
  const speakingRef = useRef(false);
  useEffect(() => { speakingRef.current = speaking; }, [speaking]);

  useEffect(() => { loadManifest(); }, []);

  const speak = useCallback((lineId: string) => {
    // Manifest still loading — queue and replay once the import
    // resolves. Without this, the first speak() of a session is a
    // silent no-op.
    if (!manifestLoaded) {
      pendingSpeak.push(() => speak(lineId));
      return;
    }
    if (!manifest || !manifest[lineId]) {
      console.warn(`[useElaraVO] missing manifest entry for "${lineId}"`);
      return;
    }

    // Latest speak() wins — drop anything we had queued so the user's
    // most recent click takes priority over a stale serialization.
    queueRef.current = [];

    const a = new Audio();
    a.crossOrigin = "anonymous";
    a.src = manifest[lineId];
    a.volume = 0.8;
    setAudio(a);

    // Each play() owns exactly one published-start / published-end pair so
    // the global ducking refcount stays balanced even if onerror fires
    // after onended (or vice versa).
    let published = false;
    const finishPublish = () => {
      if (published) {
        published = false;
        voPlaybackEnded();
      }
    };

    // Become the global active speaker NOW (synchronously), not in
    // onplay — the play promise resolves a frame later, which would
    // let two parallel speak() calls (e.g. Elara + Human in the same
    // tick) both reach `play()` before either stops the other. Doing
    // it here makes call order the deterministic tiebreaker.
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
      // .pause() in stop() (or claimActiveVo cancelling us) flips
      // speaking false but doesn't fire onended; mirror the
      // published-end here so a cancel-during-play doesn't strand
      // the duck refcount or leave us holding the active slot.
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
  }, []);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    queueRef.current = [];
    speakingRef.current = false;
    setSpeaking(false);
  }, [audio]);

  return {
    speak, stop, speaking, audio,
    hasVO: manifestLoaded && manifest !== null && Object.keys(manifest).length > 0,
  };
}
