/* ═══════════════════════════════════════════════════════
   OFFSPRING REVIEW MODAL — Post-breeding reveal

   Shows the genetic result of a breeding before the player
   commits it to an incubator pod. The player can either
   cancel (dismiss) or commit (place in a pod).
   ═══════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Dna, AlertTriangle, Sparkles } from "lucide-react";
import { getTrait, GENETIC_TEMPLATES } from "@/game/crewGenetics";
import type { PendingOffspring } from "@shared/crewPersistence";

interface Props {
  pending: PendingOffspring;
  onClose: () => void;
  onDismiss: () => void;
  onIncubate: (templateId: string) => void;
}

export default function OffspringReviewModal({ pending, onClose, onDismiss, onIncubate }: Props) {
  const [templateId, setTemplateId] = useState(GENETIC_TEMPLATES[0].id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        className="bg-card border border-primary/40 rounded max-w-2xl w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Dna size={16} className="text-primary" />
          <span className="font-display text-base font-bold">OFFSPRING GENERATED</span>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground mb-4">
          {pending.parent1Name} × {pending.parent2Name} → generation {pending.generation}
        </div>

        {pending.inbreedingPenalty > 0 && (
          <div className="mb-3 p-2 border border-red-500/40 bg-red-500/10 rounded flex items-start gap-2">
            <AlertTriangle size={12} className="text-red-400 mt-0.5" />
            <div className="text-[10px] font-mono text-red-300">
              Inbreeding penalty: -{pending.inbreedingPenalty}% to all stats.
              {pending.inbreedingPenalty > 20 && " Clone degradation has manifested."}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4">
          <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
            Stats (fitness: {pending.geneticFitness}%)
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(pending.stats).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground w-20">{k}</span>
                <Progress value={v as number} className="h-1 flex-1" />
                <span className="text-[10px] font-mono w-8 text-right">{v as number}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inherited traits */}
        <div className="mb-3">
          <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
            Inherited Traits ({pending.inheritedTraits.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {pending.inheritedTraits.map(tid => {
              const trait = getTrait(tid);
              if (!trait) return null;
              return (
                <span
                  key={tid}
                  title={trait.description}
                  className="text-[9px] font-mono px-1.5 py-0.5 border border-border/40 rounded"
                >
                  {trait.name}
                </span>
              );
            })}
            {pending.inheritedTraits.length === 0 && (
              <span className="text-[9px] font-mono text-muted-foreground italic">
                none inherited
              </span>
            )}
          </div>
        </div>

        {/* Mutations */}
        {pending.newMutations.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] font-mono uppercase text-purple-300 mb-1 flex items-center gap-1">
              <Sparkles size={10} />
              Mutations
            </div>
            <div className="flex flex-wrap gap-1">
              {pending.newMutations.map(tid => {
                const trait = getTrait(tid);
                if (!trait) return null;
                return (
                  <span
                    key={tid}
                    title={trait.description}
                    className="text-[9px] font-mono px-1.5 py-0.5 border border-purple-500/60 text-purple-200 rounded"
                  >
                    {trait.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Template picker */}
        <div className="mb-4">
          <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
            Body template
          </div>
          <select
            value={templateId}
            onChange={e => setTemplateId(e.target.value)}
            className="w-full bg-background border border-border/40 rounded px-2 py-1 text-[11px] font-mono"
          >
            {GENETIC_TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.rarity})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onDismiss}>
            Discard
          </Button>
          <Button className="flex-1" onClick={() => onIncubate(templateId)}>
            Place in Pod
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
