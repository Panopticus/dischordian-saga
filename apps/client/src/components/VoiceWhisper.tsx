/* ═══════════════════════════════════════════════════════
   VOICE WHISPER — Global inner voice commentary

   Displays skill-based inner voice whispers across ALL
   game contexts (not just NPC dialog). Listens for
   "voice-whisper" custom events and shows a small
   floating panel in the top-right corner.

   Game contexts that can trigger whispers:
   - room_enter: Entering a new Ark room
   - combat_start: Beginning a fight
   - combat_low_hp: Health drops below 25%
   - puzzle_attempt: Starting a puzzle
   - item_inspect: Examining an item
   - choice_presented: Dialog choices appear
   - trade_offered: Trade opportunity

   Usage from any component:
     import { dispatchVoiceWhisper } from "@/components/VoiceWhisper";
     dispatchVoiceWhisper({ type: "combat_start" }, skills);
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveVoices, type VoiceUtterance, type VoiceTrigger, type SkillId } from "@/game/innerVoices";
import { VOID } from "@/engine/voidPresets";

interface WhisperEvent {
  trigger: VoiceTrigger;
  skills: Record<string, number>;
}

/**
 * Dispatch a voice whisper event from any game context.
 * The VoiceWhisper component (mounted in AppShell) will pick it up.
 */
export function dispatchVoiceWhisper(trigger: VoiceTrigger, skills: Record<string, number>) {
  window.dispatchEvent(new CustomEvent("voice-whisper", {
    detail: { trigger, skills } as WhisperEvent,
  }));
}

const DISPLAY_MS = 8000;
const COOLDOWN_MS = 15000; // Don't show whispers more often than every 15s

/**
 * Mount once in AppShell. Listens for voice-whisper events and
 * displays inner voice commentary as a floating panel.
 */
export default function VoiceWhisper() {
  const [whisper, setWhisper] = useState<VoiceUtterance | null>(null);
  const [lastShown, setLastShown] = useState(0);

  const handleWhisperEvent = useCallback((e: Event) => {
    const now = Date.now();
    if (now - lastShown < COOLDOWN_MS) return; // cooldown

    const { trigger, skills } = (e as CustomEvent<WhisperEvent>).detail;
    const voices = getActiveVoices(trigger, skills as Record<SkillId, number>, 1);
    if (voices.length === 0) return;

    setWhisper(voices[0]);
    setLastShown(now);

    // Auto-dismiss
    setTimeout(() => setWhisper(null), DISPLAY_MS);
  }, [lastShown]);

  useEffect(() => {
    window.addEventListener("voice-whisper", handleWhisperEvent);
    return () => window.removeEventListener("voice-whisper", handleWhisperEvent);
  }, [handleWhisperEvent]);

  return (
    <AnimatePresence>
      {whisper && (
        <motion.div
          {...VOID.slideRight(-20)}
          className="fixed top-20 right-4 z-[70] max-w-[240px] pointer-events-auto"
        >
          <div
            className="p-2.5 rounded-lg border backdrop-blur-sm cursor-pointer"
            style={{
              background: "rgba(0,0,0,0.75)",
              borderColor: whisper.isFalse
                ? "rgba(239,68,68,0.15)"
                : "var(--void-border-subtle, rgba(255,255,255,0.06))",
            }}
            onClick={() => setWhisper(null)}
          >
            <p
              className="font-mono text-[7px] tracking-[0.2em] mb-1"
              style={{ color: whisper.isFalse ? "rgba(239,68,68,0.4)" : "var(--void-primary-muted)" }}
            >
              {whisper.isFalse ? "UNRELIABLE INSTINCT" : "INNER VOICE"}
            </p>
            <p
              className="font-mono text-[10px] leading-relaxed italic"
              style={{ color: "var(--void-text-muted, rgba(255,255,255,0.5))" }}
            >
              &ldquo;{whisper.text}&rdquo;
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
