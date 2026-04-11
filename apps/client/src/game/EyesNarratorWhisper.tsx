/* ═══════════════════════════════════════════════════════
   EYES NARRATOR WHISPER
   §8.1 #10 of WITNESSING_NARRATIVE_PROPOSAL.md.

   A small floating panel that whispers Eyes' commentary
   when the player scans a Trade Empire sector, but only
   after they've reached the Eyes' Shadow ending of Act 3
   (3+ infiltration paths resolved).

   This is a standalone, local-to-Trade-Empire narrator —
   distinct from the global VoiceWhisper (skill-based
   inner voice) since Eyes' voice is unique to her.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import { GALACTIC_MAP, type Act3State } from "./tradeEmpire";

interface Props {
  /** Currently selected sector id. Whisper triggers when this changes. */
  selectedSectorId: string | null;
  /** Player's narrative flags (for the unlock gate). */
  narrativeFlags: Record<string, boolean>;
  /** Act 3 state — used to confirm eyes_shadow ending. */
  act3State: Act3State | undefined;
}

/** How long the whisper stays on screen before auto-dismissing (ms). */
const DISPLAY_MS = 9000;
/** Don't fire the same sector line more often than every 30s. */
const PER_SECTOR_COOLDOWN_MS = 30000;

export function isEyesNarratorUnlocked(
  narrativeFlags: Record<string, boolean>,
  act3: Act3State | undefined,
): boolean {
  if (!act3) return false;
  // The flag is set by the Eyes' Shadow ending reveal.
  if (!narrativeFlags.eyes_narrator_unlocked) return false;
  if (act3.act3Ending !== "eyes_shadow") return false;
  return true;
}

export default function EyesNarratorWhisper({ selectedSectorId, narrativeFlags, act3State }: Props) {
  const [visibleLine, setVisibleLine] = useState<{ sectorId: string; line: string } | null>(null);
  const [lastShownPerSector, setLastShownPerSector] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!selectedSectorId) return;
    if (!isEyesNarratorUnlocked(narrativeFlags, act3State)) return;

    const sector = GALACTIC_MAP.find(s => s.id === selectedSectorId);
    if (!sector?.eyesNarrator) return;

    const now = Date.now();
    const lastShown = lastShownPerSector[selectedSectorId] ?? 0;
    if (now - lastShown < PER_SECTOR_COOLDOWN_MS) return;

    setVisibleLine({ sectorId: selectedSectorId, line: sector.eyesNarrator });
    setLastShownPerSector(prev => ({ ...prev, [selectedSectorId]: now }));

    const timer = setTimeout(() => {
      setVisibleLine(prev => (prev?.sectorId === selectedSectorId ? null : prev));
    }, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [selectedSectorId, narrativeFlags, act3State, lastShownPerSector]);

  return (
    <AnimatePresence>
      {visibleLine && (
        <motion.div
          key={visibleLine.sectorId}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5 }}
          className="fixed top-24 right-4 z-[70] max-w-[280px] pointer-events-auto"
        >
          <div
            className="p-3 rounded-lg border backdrop-blur-sm cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(40,10,60,0.9), rgba(10,0,20,0.95))",
              borderColor: "rgba(168,85,247,0.35)",
              boxShadow: "0 0 24px rgba(168,85,247,0.15)",
            }}
            onClick={() => setVisibleLine(null)}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Eye size={9} className="text-purple-400" />
              <p className="font-mono text-[7px] tracking-[0.3em] text-purple-400/70">THE EYES</p>
            </div>
            <p className="font-mono text-[10px] leading-relaxed italic text-purple-100/70">
              &ldquo;{visibleLine.line}&rdquo;
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
