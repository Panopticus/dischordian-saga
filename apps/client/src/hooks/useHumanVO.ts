/* useHumanVO — Plays The Human's voice lines from S3 manifest */
import { useRef, useState, useCallback, useEffect } from "react";

let manifest: Record<string, string> | null = null;
let loaded = false;

async function loadManifest() {
  if (loaded) return;
  loaded = true;
  try {
    const mod = await import("@shared/humanVoManifest.json");
    manifest = mod.default || mod;
  } catch {
    manifest = {};
  }
}

export function useHumanVO() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const queueRef = useRef<string[]>([]);

  useEffect(() => { loadManifest(); }, []);

  const speak = useCallback((lineId: string) => {
    if (!manifest || !manifest[lineId]) return;
    if (speaking) { queueRef.current.push(lineId); return; }
    const audio = new Audio(manifest[lineId]);
    audioRef.current = audio;
    audio.volume = 0.8;
    audio.onplay = () => setSpeaking(true);
    audio.onended = () => {
      setSpeaking(false);
      const next = queueRef.current.shift();
      if (next) speak(next);
    };
    audio.onerror = () => setSpeaking(false);
    audio.play().catch(() => setSpeaking(false));
  }, [speaking]);

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    queueRef.current = [];
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, hasVO: loaded && manifest !== null && Object.keys(manifest).length > 0 };
}
