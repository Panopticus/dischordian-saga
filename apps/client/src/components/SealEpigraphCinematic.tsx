/* ═══════════════════════════════════════════════════════
   SEAL EPIGRAPH CINEMATIC — modal on act-start

   Fires once per act when an `act_<n>_started` flag transitions
   true for the active player. Renders the seal's *fall summary*
   (one-line gameplay tooltip from sevenSeals.ts) plus the theme
   tag — the actual epigraph prose is content authored elsewhere
   and slots in via the writers' content registry.

   Until that registry exists, the cinematic is a clean
   "Seal N breaking" beat — mood, theme tag, fall summary,
   horseman binding. Skipping is allowed; ignoring is allowed.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEVEN_SEALS, type SealNumber } from "@shared/sevenSeals";

interface Props {
  /** Which act is starting. The component finds the matching seal. */
  actStarting: SealNumber | null;
  /** Called when the player dismisses (X / outside-click). */
  onDismiss: () => void;
}

const HORSEMAN_LABEL: Record<string, string> = {
  conquest: "Conquest — the white horse",
  war: "War — the red horse",
  famine: "Famine — the black horse",
  death: "Death — the pale horse",
};

export default function SealEpigraphCinematic({ actStarting, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(actStarting !== null);
  }, [actStarting]);

  const seal = SEVEN_SEALS.find((s) => s.num === actStarting) ?? null;

  return (
    <AnimatePresence>
      {visible && seal ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          data-testid="seal-epigraph-cinematic"
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl px-8 py-10 rounded-md border border-white/10 bg-black/70 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
              Seal {seal.num} of Seven
            </div>
            <div className="text-3xl font-light mb-6">
              {seal.themeTag.replace(/_/g, " ")}
            </div>
            {seal.horseman ? (
              <div className="text-sm text-white/70 mb-6">
                {HORSEMAN_LABEL[seal.horseman]}
              </div>
            ) : null}
            <p className="text-base leading-relaxed text-white/85 mb-6">
              {seal.fallSummary}
            </p>
            <div className="text-xs text-white/40 italic mb-2">
              — read by the prophet Daniel Cross
            </div>
            <button
              type="button"
              className="mt-4 text-sm text-white/60 hover:text-white/90 underline-offset-4 hover:underline"
              onClick={() => {
                setVisible(false);
                onDismiss();
              }}
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
