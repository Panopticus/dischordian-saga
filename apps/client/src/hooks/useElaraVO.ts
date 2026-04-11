/* ═══════════════════════════════════════════════════════
   ELARA VO HOOK — Plays Elara's voice lines
   
   Loads audio from the VO manifest (S3/CDN URLs).
   Manages playback, queueing, and volume.
   
   Usage:
     const { speak, stop, speaking } = useElaraVO();
     speak("feature_unlock_companion_selection");
   ═══════════════════════════════════════════════════════ */
import { useRef, useState, useCallback, useEffect } from "react";

// The manifest maps line IDs to audio URLs
// Populated after running the generation script
let manifest: Record<string, string> | null = null;
let manifestLoading = false;
let manifestLoaded = false;

async function loadManifest() {
  if (manifestLoaded || manifestLoading) return;
  manifestLoading = true;
  try {
    // Try to load from the shared manifest file
    const mod = await import("@shared/elaraVoManifest.json");
    manifest = mod.default || mod;
    manifestLoaded = true;
  } catch {
    // Manifest not generated yet — VO disabled
    manifest = {};
    manifestLoaded = true;
  }
  manifestLoading = false;
}

export function useElaraVO() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const queueRef = useRef<string[]>([]);

  useEffect(() => { loadManifest(); }, []);

  const speak = useCallback((lineId: string) => {
    if (!manifest || !manifest[lineId]) return;

    // If already speaking, queue it
    if (speaking) {
      queueRef.current.push(lineId);
      return;
    }

    const audio = new Audio(manifest[lineId]);
    audioRef.current = audio;
    audio.volume = 0.8;

    audio.onplay = () => setSpeaking(true);
    audio.onended = () => {
      setSpeaking(false);
      // Play next in queue
      const next = queueRef.current.shift();
      if (next) speak(next);
    };
    audio.onerror = () => setSpeaking(false);

    audio.play().catch(() => setSpeaking(false));
  }, [speaking]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    queueRef.current = [];
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, hasVO: manifestLoaded && manifest !== null && Object.keys(manifest).length > 0 };
}
