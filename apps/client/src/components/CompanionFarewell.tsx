/* ═══════════════════════════════════════════════════════
   COMPANION FAREWELL

   Dramatic overlay triggered when morality dissonance
   reaches critical levels and a companion chooses to
   leave. Features fading portrait, farewell dialog
   per companion, and a player choice: let them go
   or attempt a redemption quest.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartCrack, AlertTriangle, Undo2, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SPECTRAL_ART } from "@/data/nanobanna2Assets";
import { COMPANION_TO_SPECTRAL } from "./spectralFormMap";

/* ─── FAREWELL DIALOG ─── */

export const FAREWELL_DIALOG: Record<string, string> = {
  elara:
    "I can't watch what you're becoming. The Senator in me... she would have stopped you.",
  human:
    "Kid, I've seen empires fall for less. You're on a path I can't follow.",
  agent_zero:
    "Probability analysis complete. Continued association: 97.3% chance of mutual destruction. I am... sorry. That word was not in my original vocabulary.",
  kael:
    "I swore my blade to a cause, not to cruelty. The Insurgency may be ruthless, but we have lines. You've crossed them.",
  lyris:
    "The data streams around you have turned dark. I keep trying to find the pattern that makes this okay, but... there isn't one. Goodbye.",
};

/* ─── MEMORIAL ENTRIES ─── */

export interface CompanionMemorial {
  companionId: string;
  companionName: string;
  bondLevelAtDeparture: number;
  departureReason: string;
  timestamp: number;
}

/* ─── FAREWELL EVENT ─── */

export interface FarewellEvent {
  companionId: string;
  companionName: string;
  portraitUrl?: string;
  bondLevel: number;
  dissonanceLevel: number;
  /** Optional explicit spectral art override; otherwise auto-resolved from companionId. */
  spectralArt?: string;
}

/** Dispatch to trigger the farewell overlay. */
export function dispatchCompanionFarewell(event: FarewellEvent) {
  window.dispatchEvent(
    new CustomEvent("companion-farewell", { detail: event }),
  );
}

/* ─── PROPS ─── */

interface Props {
  /** Called when player lets the companion go */
  onLetGo?: (memorial: CompanionMemorial) => void;
  /** Called when player chooses to prove themselves (start redemption quest) */
  onRedemption?: (companionId: string) => void;
}

/* ─── MAIN COMPONENT ─── */

export default function CompanionFarewell({ onLetGo, onRedemption }: Props) {
  const [event, setEvent] = useState<FarewellEvent | null>(null);
  const [phase, setPhase] = useState<"dialog" | "departed" | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<FarewellEvent>).detail;
      setEvent(detail);
      setPhase("dialog");
      window.dispatchEvent(
        new CustomEvent("play-sfx", { detail: { type: "companion_farewell" } }),
      );
    };
    window.addEventListener("companion-farewell", handler);
    return () => window.removeEventListener("companion-farewell", handler);
  }, []);

  const handleLetGo = useCallback(() => {
    if (!event) return;

    const memorial: CompanionMemorial = {
      companionId: event.companionId,
      companionName: event.companionName,
      bondLevelAtDeparture: event.bondLevel,
      departureReason: "morality_dissonance",
      timestamp: Date.now(),
    };

    // Store memorial in localStorage
    const memorials: CompanionMemorial[] = JSON.parse(
      localStorage.getItem("companion_memorials") ?? "[]",
    );
    memorials.push(memorial);
    localStorage.setItem("companion_memorials", JSON.stringify(memorials));

    setPhase("departed");
    onLetGo?.(memorial);

    // Auto-dismiss after showing the departed state
    setTimeout(() => {
      setEvent(null);
      setPhase(null);
    }, 4000);
  }, [event, onLetGo]);

  const handleRedemption = useCallback(() => {
    if (!event) return;
    onRedemption?.(event.companionId);
    setEvent(null);
    setPhase(null);
  }, [event, onRedemption]);

  const dismiss = useCallback(() => {
    setEvent(null);
    setPhase(null);
  }, []);

  if (!event || !phase) return null;

  const dialog =
    FAREWELL_DIALOG[event.companionId] ??
    "Our paths diverge here. I hope you find what you're looking for.";

  const spectralKey = COMPANION_TO_SPECTRAL[event.companionId];
  const spectralSrc = event.spectralArt
    ?? (spectralKey ? SPECTRAL_ART[spectralKey] : undefined);

  return (
    <AnimatePresence mode="wait">
      {/* Overlay */}
      <motion.div
        key={`farewell-${event.companionId}-${phase}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        {/* Background dim */}
        <motion.div
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* Vignette effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, color-mix(in oklch, var(--bg-void) 60%, transparent) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-md w-full mx-4 text-center">
          {phase === "dialog" && (
            <>
              {/* Warning badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <AlertTriangle size={14} className="void-text-error" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-error">
                  Morality Dissonance Critical
                </span>
                <AlertTriangle size={14} className="void-text-error" />
              </motion.div>

              {/* Fading portrait */}
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: [1, 0.8, 1, 0.7],
                  scale: [1, 0.98, 1, 0.99],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto mb-6"
              >
                <div
                  className="w-28 h-28 mx-auto rounded-full border-2 void-border-error bg-card/40 flex items-center justify-center overflow-hidden"
                  style={{
                    boxShadow:
                      "0 0 var(--space-md) color-mix(in oklch, var(--energy-error) 20%, transparent), 0 0 var(--space-2xl) color-mix(in oklch, var(--energy-error) 10%, transparent)",
                  }}
                >
                  {event.portraitUrl ? (
                    <img
                      src={event.portraitUrl}
                      alt={event.companionName}
                      className="w-full h-full object-cover opacity-70"
                    />
                  ) : (
                    <span className="text-3xl font-display font-bold text-white/40">
                      {event.companionName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Companion name */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-display text-xl font-bold text-white/80 mb-1"
              >
                {event.companionName}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <HeartCrack size={14} className="void-text-error" />
                <span className="font-mono text-[10px] uppercase tracking-wider void-text-error">
                  Preparing to leave
                </span>
              </motion.div>

              {/* Farewell dialog */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="relative bg-card/30 border void-border-error rounded-lg p-5 mb-6"
              >
                <div className="absolute -top-3 left-4 px-2 bg-black/60 rounded text-[9px] font-mono uppercase tracking-wider void-text-error">
                  Farewell
                </div>
                <p className="text-sm leading-relaxed text-white/85 italic">
                  &ldquo;{dialog}&rdquo;
                </p>
              </motion.div>

              {/* Choices */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <Button
                  onClick={handleLetGo}
                  variant="outline"
                  className="gap-2 void-border-error void-text-error void-bg-error"
                >
                  <DoorOpen size={14} />
                  Let Them Go
                </Button>
                <Button
                  onClick={handleRedemption}
                  className="gap-2 void-bg-system void-bg-system"
                >
                  <Undo2 size={14} />
                  Prove Yourself
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-3 text-[10px] text-muted-foreground/50 italic"
              >
                &ldquo;Prove Yourself&rdquo; begins a redemption quest chain
              </motion.p>
            </>
          )}

          {phase === "departed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="space-y-6"
            >
              {/* Spectral form — the ghost that remains */}
              <div className="mx-auto w-28 h-28 rounded-full border border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                {spectralSrc ? (
                  <motion.img
                    src={spectralSrc}
                    alt={`${event.companionName} — spectral form`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.55, 0.4, 0.55] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <HeartCrack size={28} className="text-white/10" />
                )}
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-white/40 mb-2">
                  {event.companionName} has departed
                </h2>
                <p className="text-xs text-muted-foreground/50 italic">
                  A memorial entry has been added to your journal.
                </p>
              </div>

              <Button
                onClick={dismiss}
                variant="ghost"
                className="text-muted-foreground/50"
                size="sm"
              >
                Continue alone
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
