/* useNecromancerVO — Plays Necromancer's voice lines */
import { useRef, useState, useCallback, useEffect } from "react";
import { claimActiveVo, releaseActiveVo } from "@/lib/voSpeakingState";
import { getVoVolume } from "@/lib/streamerSettings";
let manifest: Record<string, string> | null = null;
let loaded = false;
async function loadManifest() {
  if (loaded) return; loaded = true;
  try { const m = await import("@shared/necromancerVoManifest.json"); manifest = m.default || m; }
  catch { manifest = {}; }
}
export function useNecromancerVO() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const queueRef = useRef<string[]>([]);
  useEffect(() => { loadManifest(); }, []);
  const speak = useCallback((lineId: string) => {
    if (!manifest || !manifest[lineId]) return;
    queueRef.current = [];
    const audio = new Audio(manifest[lineId]);
    audioRef.current = audio; audio.volume = 0.8 * getVoVolume();
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
    queueRef.current = []; setSpeaking(false);
  }, []);
  return { speak, stop, speaking, hasVO: loaded && manifest !== null && Object.keys(manifest).length > 0 };
}
