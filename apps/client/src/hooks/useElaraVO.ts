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

let manifest: Record<string, string> | null = null;
let manifestLoading = false;
let manifestLoaded = false;

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
}

export function useElaraVO() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const queueRef = useRef<string[]>([]);

  useEffect(() => { loadManifest(); }, []);

  const speak = useCallback((lineId: string) => {
    if (!manifest || !manifest[lineId]) return;

    if (speaking) {
      queueRef.current.push(lineId);
      return;
    }

    const a = new Audio();
    a.crossOrigin = "anonymous";
    a.src = manifest[lineId];
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
  }, [speaking]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    queueRef.current = [];
    setSpeaking(false);
  }, [audio]);

  return {
    speak, stop, speaking, audio,
    hasVO: manifestLoaded && manifest !== null && Object.keys(manifest).length > 0,
  };
}
