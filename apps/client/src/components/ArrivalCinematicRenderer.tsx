/* ═══════════════════════════════════════════════════════
   ARRIVAL CINEMATIC RENDERER — Phase 2.4

   Per the canonical Trade Empire deliverable in the plan §3:
   "Sector-Arrival Cinematics: each sector's existing
   eyesNarrator field gets a corresponding arrivalCinematic —
   first-visit scene with faction NPC greeting + Eyes
   narrator whisper."

   This component canonically fires the first-visit cinematic
   on the player's first entry to a sector. It is distinct
   from EyesNarratorWhisper (which fires post-Act-3
   eyes_shadow ending). The cinematic surfaces the canonical
   Eyes-narrator line + faction-NPC stamp + canonical-sector
   metadata. Dismissal calls markArrivalCinematicWatched so
   the cinematic does not re-fire on revisit.

   The page wires sectorFirstEntered separately on sector
   load; this component reads the result and renders only if
   firstVisit === true.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalacticSector } from "@/game/tradeEmpire";

interface ArrivalCinematicRendererProps {
  sector: GalacticSector;
  /** True iff this is the player's canonical first-visit. */
  isOpen: boolean;
  onClose: () => void;
}

export function ArrivalCinematicRenderer({
  sector,
  isOpen,
  onClose,
}: ArrivalCinematicRendererProps) {
  const markWatchedMutation = trpc.tradeEmpire.markArrivalCinematicWatched.useMutation();

  const handleDismiss = () => {
    markWatchedMutation.mutate({ sectorId: sector.id });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="void-bg-sunk void-border w-full max-w-xl overflow-hidden rounded-lg border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — sector + faction stamp */}
          <div className="void-border void-bg-system flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <MapPin className="void-text-accent h-5 w-5" />
              <div>
                <h2 className="void-text-primary text-lg font-semibold">
                  {sector.name}
                </h2>
                <p className="void-text-muted text-xs uppercase tracking-wider">
                  Controlled by {sector.controlledBy}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="void-text-muted hover:void-text-primary"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sector image (if any) */}
          {sector.image && (
            <div className="void-border border-b">
              <img
                src={sector.image}
                alt={sector.name}
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {/* Lore canon */}
          {sector.lore && (
            <div className="p-4">
              <p className="void-text-muted text-sm italic leading-relaxed">
                {sector.lore}
              </p>
            </div>
          )}

          {/* Eyes narrator whisper — canonical first-visit register */}
          {sector.eyesNarrator && (
            <div
              className="void-border border-t p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(40,10,60,0.6), rgba(10,0,20,0.85))",
              }}
            >
              <div className="mb-2 flex items-center gap-1.5">
                <Eye className="void-text-system h-3 w-3" />
                <p className="void-text-system font-mono text-[8px] tracking-[0.3em]">
                  THE EYES — FIRST-VISIT WHISPER
                </p>
              </div>
              <p className="void-text-system font-mono text-sm italic leading-relaxed">
                &ldquo;{sector.eyesNarrator}&rdquo;
              </p>
            </div>
          )}

          {/* Sector vitals */}
          <div className="void-border void-bg-system border-t px-4 py-3">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="void-text-muted uppercase">Threat</div>
                <div className="void-text-primary font-semibold">
                  {sector.threat}
                </div>
              </div>
              <div>
                <div className="void-text-muted uppercase">Stability</div>
                <div className="void-text-primary font-semibold">
                  {sector.stability}
                </div>
              </div>
              <div>
                <div className="void-text-muted uppercase">Population</div>
                <div className="void-text-primary font-semibold">
                  {sector.population}M
                </div>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="void-border flex justify-end border-t p-4">
            <Button onClick={handleDismiss}>Acknowledge Arrival</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
