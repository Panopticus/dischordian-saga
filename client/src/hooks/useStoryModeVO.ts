/* ═══════════════════════════════════════════════════════
   STORY MODE VO HOOK — Plays every character's voice lines
   across the Prisoner Story + Collector's Arena campaign.

   Loads audio URLs from shared/storyModeVoManifest.json,
   which is populated by scripts/generate-story-mode-vo.ts
   (ElevenLabs TTS → S3 upload). The manifest maps stable
   line IDs (e.g. "agent_zero_ch1_prefight_00") to MP3 URLs.

   Usage:
     const { speak, stop, speaking, hasVO } = useStoryModeVO();
     speak("agent_zero_ch1_prefight_00");

   Mirrors the pattern established by useElaraVO / useSourceVO.
   Gracefully degrades to a no-op if the manifest is missing
   (e.g. generator never ran, or the file isn't on disk yet).

   Line ID catalog: scripts/story-mode-lines.json
   Audio bucket:    s3://dgrsvoices/Story Mode Voices/
   ═══════════════════════════════════════════════════════ */
import { useRef, useState, useCallback, useEffect } from "react";

// Module-level cache so every useStoryModeVO() call shares one manifest load.
let manifest: Record<string, string> | null = null;
let manifestLoading = false;
let manifestLoaded = false;

async function loadManifest() {
  if (manifestLoaded || manifestLoading) return;
  manifestLoading = true;
  try {
    const mod = await import("@shared/storyModeVoManifest.json");
    manifest = (mod as { default?: Record<string, string> }).default ?? (mod as unknown as Record<string, string>);
    manifestLoaded = true;
  } catch {
    // Manifest not generated yet — VO disabled. This is a deliberate
    // no-op so the UI keeps working even when the file is absent.
    manifest = {};
    manifestLoaded = true;
  }
  manifestLoading = false;
}

export function useStoryModeVO() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const queueRef = useRef<string[]>([]);

  useEffect(() => {
    loadManifest();
  }, []);

  const speak = useCallback(
    (lineId: string) => {
      if (!manifest || !manifest[lineId]) return;

      // If a line is already playing, queue the new one.
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
        // Chain to next queued line, if any.
        const next = queueRef.current.shift();
        if (next) speak(next);
      };
      audio.onerror = () => setSpeaking(false);

      audio.play().catch(() => setSpeaking(false));
    },
    [speaking],
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
    stop,
    speaking,
    hasVO:
      manifestLoaded && manifest !== null && Object.keys(manifest).length > 0,
  };
}
