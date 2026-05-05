/* ═══════════════════════════════════════════════════════
   THE ANTIQUARIAN'S JOURNAL

   Shows the Antiquarian's private annotations for each
   transmission the player has watched. Each entry is his
   adaptation of the broadcast, with his side-notes revealing
   what the broadcast omitted or got wrong.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, BookOpen, Eye, AlertCircle } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getUnlockedJournalEntries, type JournalEntry } from "@shared/antiquariansJournal";

export default function AntiquariansJournalPage() {
  const { state } = useGame();
  const [expanded, setExpanded] = useState<string | null>(null);

  const entries = useMemo(
    () => getUnlockedJournalEntries(state.transmissionsWatched ?? []),
    [state.transmissionsWatched],
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Aged-paper feel */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <BookOpen size={18} className="void-text-accent" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">THE ANTIQUARIAN'S JOURNAL</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider italic">
              Private counter-record · {entries.length} entries
            </p>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 border border-dashed void-border rounded-lg">
            <BookOpen size={32} className="mx-auto void-text-accent mb-2" />
            <p className="font-mono text-[10px] text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
              The Antiquarian has not written anything for you yet. Watch a transmission, and his pen will move.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <JournalEntryCard
                key={entry.transmissionId}
                entry={entry}
                expanded={expanded === entry.transmissionId}
                onToggle={() => setExpanded(expanded === entry.transmissionId ? null : entry.transmissionId)}
                index={i}
              />
            ))}
          </div>
        )}

        <p className="mt-8 text-center font-mono text-[9px] italic void-text-accent">
          "I remain the Eternal Observer." — The Antiquarian
        </p>
      </div>
    </div>
  );
}

function JournalEntryCard({ entry, expanded, onToggle, index }: {
  entry: JournalEntry;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border void-border void-bg-sunk rounded-lg overflow-hidden"
      data-testid={`journal-${entry.transmissionId}`}
    >
      <button onClick={onToggle} className="w-full text-left p-4 void-bg-sunk transition-colors">
        <h2 className="font-display text-base font-bold tracking-wider void-text-accent mb-2">{entry.title}</h2>
        <p className="font-mono text-[11px] text-foreground/85 leading-relaxed italic">{entry.body}</p>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t void-border void-bg-sunk"
          >
            {entry.annotation && (
              <div className="p-4 border-b void-border">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertCircle size={10} className="void-text-error" />
                  <span className="font-mono text-[9px] uppercase tracking-wider void-text-error">
                    His Private Annotation
                  </span>
                </div>
                <p className="font-mono text-[10px] italic void-text-error leading-relaxed">
                  {entry.annotation}
                </p>
              </div>
            )}
            {entry.crossReferences && entry.crossReferences.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye size={10} className="void-text-accent" />
                  <span className="font-mono text-[9px] uppercase tracking-wider void-text-accent">
                    Cross-References
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {entry.crossReferences.map(ref => (
                    <span key={ref} className="font-mono text-[9px] px-2 py-0.5 rounded border void-border void-text-accent">
                      ↗ {ref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
