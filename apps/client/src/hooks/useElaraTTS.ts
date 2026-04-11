/* ═══════════════════════════════════════════════════════
   ELARA TTS — Web Speech API Text-to-Speech for Elara
   Horror sci-fi female AI voice with pitch/rate tuning.
   Integrates with SoundContext for mute/volume sync.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";

interface ElaraTTSOptions {
  /** Whether TTS is globally enabled */
  enabled: boolean;
  /** Master volume 0-1 (synced from SoundContext) */
  volume: number;
  /** Whether sound is muted */
  muted: boolean;
}

interface ElaraTTSReturn {
  /** Speak a line of dialog as Elara */
  speak: (text: string, options?: { rate?: number; pitch?: number; onEnd?: () => void }) => void;
  /** Stop current speech */
  stop: () => void;
  /** Whether Elara is currently speaking */
  isSpeaking: boolean;
  /** Whether TTS is supported in this browser */
  isSupported: boolean;
  /** Toggle TTS on/off */
  ttsEnabled: boolean;
  setTtsEnabled: (v: boolean) => void;
  /** Available voices loaded */
  voiceReady: boolean;
}

/**
 * Selects the best female voice for Elara's horror sci-fi AI persona.
 * Prefers: Microsoft Zira, Google UK English Female, Samantha, or any female-sounding voice.
 */
function selectElaraVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // Priority list of preferred voice names (partial match)
  const preferred = [
    "microsoft zira",
    "google uk english female",
    "samantha",
    "karen",
    "moira",
    "tessa",
    "fiona",
    "victoria",
    "alex", // macOS
    "google us english", // fallback
  ];

  // Try preferred voices first
  for (const pref of preferred) {
    const match = voices.find(v => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }

  // Try any English female voice
  const englishFemale = voices.find(v =>
    v.lang.startsWith("en") &&
    (v.name.toLowerCase().includes("female") ||
     v.name.toLowerCase().includes("woman") ||
     v.name.toLowerCase().includes("zira") ||
     v.name.toLowerCase().includes("hazel"))
  );
  if (englishFemale) return englishFemale;

  // Try any English voice
  const english = voices.find(v => v.lang.startsWith("en"));
  if (english) return english;

  // Last resort: first available
  return voices[0];
}

export function useElaraTTS({ enabled, volume, muted }: ElaraTTSOptions): ElaraTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    try {
      return localStorage.getItem("loredex_tts_enabled") !== "false";
    } catch {
      return true;
    }
  });
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceRef.current = selectElaraVoice(voices);
        setVoiceReady(true);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [isSupported]);

  // Persist TTS toggle
  useEffect(() => {
    try {
      localStorage.setItem("loredex_tts_enabled", String(ttsEnabled));
    } catch {}
  }, [ttsEnabled]);

  // Stop speech when muted or disabled
  useEffect(() => {
    if (muted || !enabled || !ttsEnabled) {
      speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [muted, enabled, ttsEnabled]);

  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number; onEnd?: () => void }) => {
    if (!isSupported || !enabled || !ttsEnabled || muted) {
      options?.onEnd?.();
      return;
    }

    // Cancel any current speech
    speechSynthesis.cancel();

    // Clean text for speech (remove markdown, special chars)
    const cleanText = text
      .replace(/[*_~`#]/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/[<>]/g, "")
      .replace(/\.{3,}/g, "...")
      .trim();

    if (!cleanText) {
      options?.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Elara's voice profile: slightly low pitch, measured pace, eerie tone
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }
    utterance.rate = options?.rate ?? 0.85; // Slightly slow — deliberate, AI-like
    utterance.pitch = options?.pitch ?? 0.8; // Lower pitch — eerie female AI
    utterance.volume = Math.min(volume * 1.5, 1); // Boost slightly relative to ambient

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      options?.onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      options?.onEnd?.();
    };

    speechSynthesis.speak(utterance);
  }, [isSupported, enabled, ttsEnabled, muted, volume]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    ttsEnabled,
    setTtsEnabled,
    voiceReady,
  };
}
