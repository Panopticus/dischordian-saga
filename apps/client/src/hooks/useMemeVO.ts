/* useMemeVO — Plays The Meme's voice lines from S3 manifest */
import { useRef, useState, useCallback, useEffect } from "react";
import { claimActiveVo, releaseActiveVo } from "@/lib/voSpeakingState";
import { getVoVolume } from "@/lib/streamerSettings";

let manifest: Record<string, string> | null = null;
let loaded = false;

async function loadManifest() {
  if (loaded) return;
  loaded = true;
  try {
    const mod = await import("@shared/memeVoManifest.json");
    manifest = mod.default || mod;
  } catch {
    manifest = {};
  }
}

export function useMemeVO() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const queueRef = useRef<string[]>([]);

  useEffect(() => { loadManifest(); }, []);

  const speak = useCallback((lineId: string) => {
    if (!manifest || !manifest[lineId]) return;
    queueRef.current = [];
    const audio = new Audio(manifest[lineId]);
    audioRef.current = audio;
    audio.volume = 0.85 * getVoVolume();
    const myStop = () => { audio.pause(); };
    claimActiveVo(myStop);
    audio.onplay = () => setSpeaking(true);
    audio.onended = () => { setSpeaking(false); releaseActiveVo(myStop); };
    audio.onerror = () => { setSpeaking(false); releaseActiveVo(myStop); };
    audio.onpause = () => { if (!audio.ended) { setSpeaking(false); releaseActiveVo(myStop); } };
    audio.play().catch(() => { setSpeaking(false); releaseActiveVo(myStop); });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    queueRef.current = [];
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, hasVO: loaded && manifest !== null && Object.keys(manifest).length > 0 };
}
