/* ═══════════════════════════════════════════════════════
   useUISounds — React hook for synthesized UI micro-sounds

   Integrates with SoundContext for volume/mute state and
   auto-initializes the Web Audio context on first user
   interaction. Returns a `play(soundName)` function.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef } from "react";
import { useSound } from "../contexts/SoundContext";
import {
  UISounds,
  initAudioContext,
  setUIVolume,
  setUIMuted,
  type UISoundName,
} from "../lib/uiSounds";

/**
 * Hook that provides a `play()` function for UI micro-sounds.
 *
 * - Respects the global SFX volume and mute state from SoundContext
 * - Lazily initializes the Web Audio context on first user gesture
 * - Returns a stable `play` callback that won't cause re-renders
 *
 * @example
 * ```tsx
 * const { play } = useUISounds();
 * <button
 *   onMouseEnter={() => play("buttonHover")}
 *   onClick={() => play("buttonClick")}
 * >
 *   Click me
 * </button>
 * ```
 */
export function useUISounds() {
  const { volume, muted, audioReady, initAudio } = useSound();
  const audioInitialized = useRef(false);

  // Sync volume to the UI sound engine whenever it changes
  useEffect(() => {
    setUIVolume(volume);
  }, [volume]);

  // Sync mute state
  useEffect(() => {
    setUIMuted(muted);
  }, [muted]);

  // Auto-initialize audio context on first user interaction
  useEffect(() => {
    if (audioInitialized.current) return;

    const handleInteraction = () => {
      if (audioInitialized.current) return;
      audioInitialized.current = true;

      // Initialize UI sounds audio context
      initAudioContext();

      // Also ensure the main SoundContext is initialized
      if (!audioReady) {
        initAudio().catch(() => {});
      }

      // Sync current settings
      setUIVolume(volume);
      setUIMuted(muted);

      // Remove listeners after first interaction
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction, { once: false });
    window.addEventListener("keydown", handleInteraction, { once: false });
    window.addEventListener("touchstart", handleInteraction, { once: false });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [audioReady, initAudio, volume, muted]);

  /**
   * Play a named UI sound. No-ops if muted or audio not yet initialized.
   */
  const play = useCallback((name: UISoundName): void => {
    if (muted) return;
    const fn = UISounds[name];
    if (typeof fn === "function") {
      fn();
    }
  }, [muted]);

  return { play };
}

export type { UISoundName };
