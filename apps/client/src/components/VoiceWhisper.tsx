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
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveVoices, type VoiceUtterance, type VoiceTrigger, type SkillId } from "@/game/innerVoices";
import { VOID } from "@/engine/voidPresets";
import KineticText from "@/components/void/KineticText";
import { X } from "lucide-react";

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
  // Auto-dismiss timer. Paused on hover so slow readers can finish
  // a long whisper without it vanishing mid-sentence.
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismiss = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const scheduleDismiss = useCallback((ms: number) => {
    clearDismiss();
    dismissTimerRef.current = setTimeout(() => setWhisper(null), ms);
  }, [clearDismiss]);

  const handleWhisperEvent = useCallback((e: Event) => {
    const now = Date.now();
    if (now - lastShown < COOLDOWN_MS) return; // cooldown

    const { trigger, skills } = (e as CustomEvent<WhisperEvent>).detail;
    const voices = getActiveVoices(trigger, skills as Record<SkillId, number>, 1);
    if (voices.length === 0) return;

    setWhisper(voices[0]);
    setLastShown(now);
    scheduleDismiss(DISPLAY_MS);
  }, [lastShown, scheduleDismiss]);

  useEffect(() => {
    window.addEventListener("voice-whisper", handleWhisperEvent);
    return () => window.removeEventListener("voice-whisper", handleWhisperEvent);
  }, [handleWhisperEvent]);

  useEffect(() => () => clearDismiss(), [clearDismiss]);

  return (
    <AnimatePresence>
      {whisper && (
        <motion.div
          {...VOID.slideRight(-20)}
          className="fixed top-20 right-4 z-[70] max-w-[240px] pointer-events-auto"
          onMouseEnter={clearDismiss}
          onMouseLeave={() => scheduleDismiss(DISPLAY_MS)}
        >
          <div
            className="relative p-2.5 pr-7 rounded-lg border backdrop-blur-sm cursor-pointer"
            style={{
              background: "color-mix(in oklch, var(--bg-void) 75%, transparent)",
              borderColor: whisper.isFalse
                ? "color-mix(in oklch, var(--energy-error) 15%, transparent)"
                : "var(--void-border-subtle, color-mix(in oklch, var(--text-primary) 6%, transparent))",
            }}
            onClick={() => setWhisper(null)}
          >
            {/* Visible close affordance — previously the whole card was
                click-to-dismiss, but that wasn't signposted. A 16px
                touch-target close button satisfies mobile a11y. */}
            <button
              aria-label="Dismiss inner voice"
              className="absolute top-1 right-1 p-1 rounded text-muted-foreground/60 hover:text-muted-foreground/90 hover:bg-white/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setWhisper(null);
              }}
            >
              <X size={11} />
            </button>
            <p
              className="font-mono text-[7px] tracking-[0.2em] mb-1"
              style={{ color: whisper.isFalse ? "color-mix(in oklch, var(--energy-error) 40%, transparent)" : "var(--void-primary-muted)" }}
            >
              {whisper.isFalse ? "UNRELIABLE INSTINCT" : "INNER VOICE"}
            </p>
            {/* Typewriter reveal. KineticText handles reduce-motion and
                motion-intensity for us; a false/unreliable voice gets a
                slightly faster tick so it feels agitated. */}
            <p
              className="font-mono text-[10px] leading-relaxed italic"
              style={{ color: "var(--void-text-muted, color-mix(in oklch, var(--text-primary) 50%, transparent))" }}
            >
              <span aria-hidden>&ldquo;</span>
              <KineticText
                key={whisper.text}
                text={whisper.text}
                mode="char"
                speed={whisper.isFalse ? 22 : 32}
                showCursor={false}
              />
              <span aria-hidden>&rdquo;</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
