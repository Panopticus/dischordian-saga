/* ═══════════════════════════════════════════════════════
   VERB COIN — LucasArts-style verb selector overlay

   A small ring of three icons (Look / Use / Talk) that floats
   below a hotspot when the player hovers over a room-mystery
   hotspot. Clicking a verb dispatches the corresponding
   VerbResponse via the room mystery registry.

   Verbs the active hotspot doesn't author are rendered dimmed
   and non-clickable so the player learns each hotspot's verb
   shape without trial-and-error.

   The coin is positioned absolutely inside the hotspot rect;
   the parent ArkExplorerPage controls visibility via the
   `visible` prop tied to its hovered-hotspot state.

   ═══════════════════════════════════════════════════════ */

import { Eye, Hand, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import type { Verb } from "@shared/roomMysteries";

interface VerbCoinProps {
  /** Whether the coin is currently visible. Driven by hover state. */
  visible: boolean;
  /** Verbs that have authored responses for this hotspot. Verbs not
   *  in this list render dimmed and don't fire onVerb. */
  availableVerbs: readonly Verb[];
  /** Fires when the player clicks an enabled verb button. */
  onVerb: (verb: Verb) => void;
}

const VERB_ORDER: readonly Verb[] = ["look", "use", "talk"];

const VERB_ICONS = {
  look: Eye,
  use: Hand,
  talk: MessageSquare,
} as const;

const VERB_LABELS = {
  look: "Look",
  use: "Use",
  talk: "Talk",
} as const;

export default function VerbCoin({
  visible,
  availableVerbs,
  onVerb,
}: VerbCoinProps) {
  // Hide entirely when not visible OR when this hotspot has no
  // authored verb responses (so non-mystery hotspots stay clean).
  if (!visible || availableVerbs.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.12 }}
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-30 flex items-center gap-1.5 rounded-full px-2 py-1"
      style={{
        background: "var(--bg-void)",
        border: "1px solid var(--glass-border)",
        boxShadow: "0 0 var(--space-sm) color-mix(in oklch, var(--energy-primary) 30%, transparent)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {VERB_ORDER.map((verb) => {
        const Icon = VERB_ICONS[verb];
        const enabled = availableVerbs.includes(verb);
        return (
          <button
            key={verb}
            type="button"
            disabled={!enabled}
            aria-label={VERB_LABELS[verb]}
            title={VERB_LABELS[verb]}
            onClick={(e) => {
              e.stopPropagation();
              if (enabled) onVerb(verb);
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{
              background: enabled
                ? "color-mix(in oklch, var(--energy-primary) 25%, transparent)"
                : "transparent",
              border: enabled
                ? "1px solid color-mix(in oklch, var(--energy-primary) 60%, transparent)"
                : "1px solid var(--glass-border)",
              color: enabled
                ? "var(--energy-primary)"
                : "color-mix(in oklch, var(--text-primary) 25%, transparent)",
              cursor: enabled ? "pointer" : "default",
            }}
          >
            <Icon size={13} />
          </button>
        );
      })}
    </motion.div>
  );
}
