/* ═══════════════════════════════════════════════════════
   INFILTRATION PATH SELECTOR — §7 Act 3 path commitment

   Modal that fires the first time the player enters the
   Trade Empire in Act 3 without having committed to one of
   the three infiltration paths. Commits the chosen path by
   setting the canonical `act3_{pathId}_committed` flag from
   act3EyesBiography.INFILTRATION_PATHS.

   Gate condition (checked by the caller):
     - trade_empire_unlocked is true
     - narrativeAct >= 3
     - No path is already committed (deriveInfiltrationProgress
       returns zero committed paths)
     - act_3_complete is NOT yet set (post-completion visits
       shouldn't re-show the modal)

   The commit is irreversible in the narrative; the UI frames
   this explicitly so players understand the weight of the
   choice. Declining is not an option — the canon says Act 3
   requires a commitment before the faction arcs unlock.
   ═══════════════════════════════════════════════════════ */
import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swords } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  INFILTRATION_PATHS,
  type FactionInfiltrationPath,
  type InfiltrationPathDef,
} from "@shared/act3EyesBiography";
import { deriveInfiltrationProgress } from "@shared/witnessingRuntime";

interface Props {
  /** Whether the modal should render. The parent computes this so the
   *  gate logic lives next to the Trade Empire page's state. */
  open: boolean;
  /** Callback the parent fires after a commit to refresh its view. */
  onCommit?: (pathId: FactionInfiltrationPath) => void;
}

export default function InfiltrationPathSelector({ open, onCommit }: Props) {
  const { setNarrativeFlag } = useGame();

  const commit = useCallback(
    (path: InfiltrationPathDef) => {
      setNarrativeFlag(path.commitFlag, true);
      onCommit?.(path.id);
    },
    [setNarrativeFlag, onCommit],
  );

  const paths = Object.values(INFILTRATION_PATHS);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/88 backdrop-blur-sm px-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative my-10 w-full max-w-3xl rounded border border-amber-500/30 bg-stone-950/95 p-6 shadow-[0_0_60px_rgba(245,158,11,0.18)]"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <header className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                Act 3 · §7 The Offer
              </p>
              <h2 className="mt-1 font-serif text-2xl italic text-amber-50">
                Pick your infiltration
              </h2>
              <p className="mt-2 font-serif italic text-[13px] leading-relaxed text-amber-100/80">
                The Human asked which back door you want to walk through. One
                path only. The factions will not forget which side of their
                threshold you stepped into. Choose deliberately.
              </p>
            </header>

            <ul className="space-y-4">
              {paths.map((path) => (
                <li key={path.id}>
                  <button
                    type="button"
                    onClick={() => commit(path)}
                    className={lensClasses(path.id)}
                    data-testid={`infiltration-path-option-${path.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Swords
                        size={16}
                        className="mt-1 shrink-0 text-amber-200/80"
                      />
                      <div className="flex-1 text-left">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-serif text-[15px] italic text-amber-50">
                            {path.label}
                          </p>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-amber-300/60">
                            {path.endingLabel}
                          </span>
                        </div>
                        <p className="mt-1 font-serif italic text-[13px] leading-relaxed text-amber-100/80">
                          {path.pitch}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-5 font-mono text-[10px] text-stone-500">
              Once committed, the other two paths will close. The Antiquarian
              will record which door you chose.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Pick a lens-tinted button class per faction.
 *  insurgency → indigo (rebel); empire → amber (imperial);
 *  hierarchy → violet (arcane Dreamer). */
function lensClasses(id: FactionInfiltrationPath): string {
  const base =
    "w-full rounded border px-4 py-3 bg-stone-950/60 hover:bg-stone-900/70 transition-colors";
  switch (id) {
    case "insurgency":
      return `${base} border-indigo-500/40 hover:border-indigo-400/70`;
    case "empire":
      return `${base} border-amber-500/40 hover:border-amber-400/70`;
    case "hierarchy":
      return `${base} border-violet-500/40 hover:border-violet-400/70`;
  }
}

/** Helper the parent uses to decide whether to open the modal.
 *  Exported so the Trade Empire page + any other future caller
 *  share one rule. */
export function shouldShowInfiltrationSelector(
  flags: Record<string, unknown> | undefined,
  narrativeAct: number | undefined,
): boolean {
  if (!flags) return false;
  if (Boolean(flags.act_3_complete)) return false;
  if (!flags.trade_empire_unlocked) return false;
  if ((narrativeAct ?? 0) < 3) return false;
  const progress = deriveInfiltrationProgress(flags);
  return progress.every((p) => !p.committed);
}
