/* ═══════════════════════════════════════════════════════
   EngineerJournalModal

   Pops once per recovered Engineer journal page (one per
   Distinction grade). When the recovered page closes a
   chapter, also calls out the Signature Technique unlock.

   Voice surface only — no business logic. The shared module
   apps/shared/engineerShadowCurriculum.ts owns the page
   text + signature-technique definitions. The voice is
   journal-style (written, second-person to "the next
   reader," archaic Entry marks); the modal renders the
   handwritten-script aesthetic with serif body + monospace
   metadata.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Wrench } from "lucide-react";
import {
  getSignatureTechnique,
  type JournalPage,
} from "@shared/engineerShadowCurriculum";

export interface EngineerJournalModalProps {
  page: JournalPage | null;
  /** When non-null, this recovery completed this chapter and
   *  the signature technique unlocks. */
  chapterUnlocked: number | null;
  onDismiss: () => void;
}

export function EngineerJournalModal({
  page,
  chapterUnlocked,
  onDismiss,
}: EngineerJournalModalProps) {
  const technique = chapterUnlocked !== null ? getSignatureTechnique(chapterUnlocked) : null;

  return (
    <AnimatePresence>
      {page && (
        <motion.div
          key="engineer-journal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onDismiss}
        >
          <motion.div
            key={page.id}
            initial={{ scale: 0.92, y: 24, rotateZ: -1 }}
            animate={{ scale: 1, y: 0, rotateZ: 0 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-md void-surface p-5"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header — leather-bound notebook framing */}
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={16} className="text-primary" />
              <h3 className="font-display text-sm font-bold tracking-wide">
                JOURNAL OF THE SHADOW CURRICULUM
              </h3>
            </div>
            <div className="flex items-center gap-1.5 mb-4 pl-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-mono text-[10px] text-primary tracking-[0.2em]">
                THE ENGINEER &middot; UNATTRIBUTED
              </span>
              <span className="font-mono text-[10px] opacity-50 ml-auto tracking-[0.15em]">
                CH {page.chapterNumber} &middot; PG {page.pageNumber}/12
              </span>
            </div>

            {/* The page itself — serif body to feel handwritten */}
            <div className="rounded-md border border-primary/20 bg-background/50 p-4 mb-4">
              <div className="font-mono text-[10px] uppercase opacity-60 tracking-[0.2em] mb-2">
                {page.entryMark}
              </div>
              <p className="text-sm leading-relaxed font-serif italic">
                {page.text}
              </p>
            </div>

            {/* Chapter unlock — appears only when this page closes a chapter */}
            {technique && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-md border border-primary/30 bg-primary/5 p-3 mb-4"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Wrench size={12} className="text-primary" />
                  <span className="font-mono text-[10px] text-primary tracking-[0.2em]">
                    CHAPTER {technique.chapterNumber} COMPLETE &middot; SIGNATURE TECHNIQUE
                  </span>
                </div>
                <div className="font-display text-base font-bold tracking-wide mb-1">
                  {technique.name}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {technique.description}
                </p>
                <div className="mt-2 font-mono text-[9px] opacity-60 tracking-[0.15em]">
                  EQUIP IN ACADEMY → SIGNATURE TECHNIQUES
                </div>
              </motion.div>
            )}

            <button
              onClick={onDismiss}
              autoFocus
              className="w-full px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all tracking-wide"
            >
              CLOSE THE PAGE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
