/* ═══════════════════════════════════════════════════════
   CLONE FROM TEMPLATE MODAL — First-generation crew from the Archive
   ═══════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import { useState } from "react";
import { X, Dna, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GENETIC_TEMPLATES,
  FOUNDING_BLOODLINES,
  type BloodlineId,
} from "@/game/crewGenetics";

interface Props {
  onClose: () => void;
  onClone: (templateId: string, bloodlineId: BloodlineId) => void;
  founded: string[];
}

const RARITY_COLOR = {
  common: "border-gray-500/40",
  uncommon: "border-green-500/40",
  rare: "border-blue-500/40",
  exotic: "border-purple-500/40 text-purple-300",
};

export default function CloneFromTemplateModal({ onClose, onClone, founded }: Props) {
  const [templateId, setTemplateId] = useState(GENETIC_TEMPLATES[0].id);
  const [bloodlineId, setBloodlineId] = useState<BloodlineId>("void_resonance");

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
        className="bg-card border border-primary/40 rounded max-w-3xl w-full p-6 relative max-h-[85vh] overflow-y-auto"
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
          <span className="font-display text-base font-bold">COLLECTOR'S ARCHIVE</span>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground mb-4 italic">
          "Choose a template. Every one is a civilization waiting to walk again."
        </div>

        {/* Templates */}
        <div className="mb-4">
          <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">
            Genetic Template
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {GENETIC_TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`text-left p-2 border rounded transition ${
                  templateId === t.id
                    ? "border-primary bg-primary/5"
                    : `${RARITY_COLOR[t.rarity]} hover:border-border`
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-display text-[11px] font-semibold">{t.name}</span>
                  <span className="text-[9px] font-mono uppercase text-muted-foreground">
                    {t.rarity}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-muted-foreground line-clamp-2">
                  {t.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bloodlines */}
        <div className="mb-4">
          <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2 flex items-center gap-1">
            <Crown size={10} />
            House / Bloodline
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {(Object.entries(FOUNDING_BLOODLINES) as Array<[BloodlineId, any]>).map(([id, bl]) => (
              <button
                key={id}
                onClick={() => setBloodlineId(id)}
                className={`text-left p-2 border rounded transition ${
                  bloodlineId === id ? "border-primary bg-primary/5" : "border-border/30"
                }`}
                style={{ borderLeftWidth: "3px", borderLeftColor: bl.color }}
              >
                <div className="font-display text-[11px] font-semibold" style={{ color: bl.color }}>
                  {bl.name}
                  {founded.includes(id) && (
                    <span className="text-[8px] text-muted-foreground ml-1">(founded)</span>
                  )}
                </div>
                <div className="text-[9px] font-mono italic text-muted-foreground">
                  "{bl.motto}"
                </div>
                <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                  {bl.power.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => onClone(templateId, bloodlineId)}>
            Begin Incubation
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
