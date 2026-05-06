/* ═══════════════════════════════════════════════════════
   ACT 2 OPENING — inter-act cutscene (Phase H)

   Plays a short transmission-style overlay between Act 1's
   completion and Act 2's first interactable beat. Built on
   the same TransmissionDisplay surface that EyesTransmission
   (Act 3 opener) uses, so the visual and audio language
   stays consistent — Elara's line lands in cyan, the Human's
   in red-with-corruption, both with VO from the existing
   act2VoManifest.json (already produced).

   Reuses:
     • TransmissionDisplay (typed reveal + VO playback)
     • act2VoManifest.json (lines already on S3)
     • postVictoryCinematics-style imports (timing, atmosphere)

   Mounted as a route (`/act2-opening`); consumers navigate
   on Act 1 completion gate firing.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Sparkles } from "lucide-react";
import TransmissionDisplay, { type TransmissionMessage } from "@/components/TransmissionDisplay";
import act2VoManifest from "@shared/act2VoManifest.json";

interface Props {
  /** Optional player name to weave into Elara's recognition beat. */
  playerName?: string;
  /** Fired when the player dismisses the cutscene (after the final
   *  message types out). The consumer is responsible for navigation
   *  or for marking the act gate. */
  onComplete: () => void;
}

/** Whether the user has reduced motion enabled. Read once at module
 *  evaluation; we accept that a runtime change in the OS preference
 *  won't update mid-cutscene. The reduced-motion fallback skips the
 *  parallax glow and the per-character typewriter — text appears at
 *  once and the player can dismiss with a single click. */
function usesReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export default function Act2Opening({ playerName, onComplete }: Props) {
  const [finished, setFinished] = useState(false);
  const reduced = useMemo(usesReducedMotion, []);

  // Five-beat handoff: Human contextualises the Cryo case closing,
  // Elara recognises that the Engineer's bench has come online, and
  // the two of them frame Act 2 as the work-bench act. Each line is
  // backed by an act2VoManifest.json entry already on S3 — this is
  // why we can ship voiced inter-act cutscenes without re-recording.
  const messages = useMemo<TransmissionMessage[]>(() => {
    const named = (text: string) =>
      playerName ? text.replace("{playerName}", playerName) : text.replace("{playerName}", "Potential");
    return [
      {
        speaker: "human",
        text: named("So that's how the cryo case closes. You did the looking. The room did the rest. Lyra would have approved — she always said the only honest detective work is the kind the room does for you."),
        voUrl: act2VoManifest.human_commentary_1,
        corruptionLevel: 35,
        typingSpeed: 28,
      },
      {
        speaker: "elara",
        text: "I'm registering a power signature down on Deck 3 — the Engineer's Bench. Lyra's bench. It's been dark since the cold-cryo seal. It just came on.",
        voUrl: act2VoManifest.elara_recognition,
        typingSpeed: 24,
      },
      {
        speaker: "human",
        text: named("The bench is the next room. It's where the work gets made. Light craft, dark craft, salvage — the Engineer's bench is the loom this Act weaves on. Bring it your evidence. Bring it your grief. The bench eats both."),
        voUrl: act2VoManifest.human_commentary_2,
        corruptionLevel: 30,
        typingSpeed: 28,
      },
      {
        speaker: "elara",
        text: "First power-on. The bench is reading my signal — it knows we're here. {playerName}, this is the part of the ship Lyra built for the people who survived her. That's us. That's you.".replace("{playerName}", playerName ?? "Potential"),
        voUrl: act2VoManifest["bench-first-power-on"],
        typingSpeed: 22,
      },
      {
        speaker: "system",
        text: "ACT 2 ONLINE — ENGINEER'S BENCH ACCEPTING SUBMISSIONS",
        typingSpeed: 18,
      },
    ];
  }, [playerName]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.1 : 0.6 }}
      className="fixed inset-0 z-[80] bg-black flex flex-col items-center justify-center p-4"
      role="dialog"
      aria-label="Act 2 opening transmission"
    >
      {/* Atmospheric glow — suppressed under reduced-motion. */}
      {!reduced && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-black to-amber-950/15" />
          <motion.div
            animate={{ opacity: [0.18, 0.42, 0.18] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, color-mix(in oklch, var(--energy-primary) 12%, transparent) 0%, transparent 65%)",
            }}
          />
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        <motion.div
          animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
          transition={reduced ? undefined : { duration: 4, repeat: Infinity }}
          className="mb-3"
        >
          <Sparkles size={32} style={{ color: "var(--energy-primary)" }} />
        </motion.div>
        <p
          className="font-display text-xs tracking-[0.4em]"
          style={{ color: "var(--energy-primary)" }}
        >
          ACT 2 — THE ENGINEER&apos;S BENCH
        </p>
        <p className="font-mono text-[9px] text-white/30 mt-1">
          INTER-ACT TRANSMISSION · DECK 3 POWER-ON
        </p>
      </div>

      {/* Transmission */}
      <div className="relative z-10 w-full max-w-2xl">
        <TransmissionDisplay
          messages={messages}
          autoAdvanceMs={1200}
          allowSkip
          showHeaders
          onAllComplete={() => setFinished(true)}
        />
      </div>

      {/* Continue button */}
      <AnimatePresence>
        {finished && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
            className="relative z-10 mt-6 px-6 py-3 rounded-lg font-mono text-xs font-bold tracking-wider"
            style={{
              background: "color-mix(in oklch, var(--energy-primary) 18%, transparent)",
              border: "1px solid color-mix(in oklch, var(--energy-primary) 60%, transparent)",
              color: "var(--energy-primary)",
              boxShadow: "0 0 var(--space-md) color-mix(in oklch, var(--energy-primary) 35%, transparent)",
            }}
          >
            ENTER ACT 2 — APPROACH THE BENCH
          </motion.button>
        )}
      </AnimatePresence>

      <p className="absolute bottom-6 left-0 right-0 text-center font-mono text-[9px] text-white/20">
        <Radio size={9} className="inline mr-1" />
        The Engineer&apos;s Bench is the loom Act 2 weaves on. Light craft, dark craft, salvage — bring it everything.
      </p>
    </motion.div>
  );
}
