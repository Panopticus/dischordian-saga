/* ═══════════════════════════════════════════════════════
   STARTER DECK FIRST-TIME REVEAL
   Shows the starter deck reveal naturally when the player
   first visits a card-related page. Triggered by discovering
   the card game system, not forced during awakening.
   Elara frames it narratively as calibrating combat systems.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import StarterDeckViewer, { generateStarterDeck } from "@/components/StarterDeckViewer";
import { useGame } from "@/contexts/GameContext";

const SEEN_KEY = "starter_deck_revealed";

/**
 * Shows the starter deck reveal once, then never again.
 * Renders as a full-page overlay on first visit to any card page.
 * Call from CardBrowserPage, DeckBuilderPage, DuelystPage, etc.
 */
export default function StarterDeckFirstReveal() {
  const { state } = useGame();
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(SEEN_KEY) === "true"; }
    catch { return false; }
  });

  const choices = state.characterChoices;
  const starterDeck = useMemo(() => {
    if (!choices.species) return [];
    return generateStarterDeck({
      species: choices.species || undefined,
      characterClass: choices.characterClass || undefined,
      alignment: choices.alignment || undefined,
      element: choices.element || undefined,
      name: choices.name || undefined,
    });
  }, [choices]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try { localStorage.setItem(SEEN_KEY, "true"); }
    catch { /* ignore */ }
  }, []);

  // Don't show if already seen, or if character hasn't been created yet
  if (dismissed || !choices.species || starterDeck.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Elara's narrative framing */}
          <div className="text-center mb-4 px-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap size={14} className="text-[var(--neon-cyan)]" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--neon-cyan)]/70">COMBAT SYSTEMS ONLINE</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground/80 max-w-lg mx-auto leading-relaxed italic">
              "The Training Arena's neural interface has synced with your profile.
              I've configured a starting deck based on your species, class, and alignment.
              These cards are yours — study them well."
            </p>
            <p className="font-mono text-[10px] text-muted-foreground/40 mt-1">— Elara</p>
          </div>

          <StarterDeckViewer
            cards={starterDeck}
            onClose={handleDismiss}
            onContinue={handleDismiss}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
