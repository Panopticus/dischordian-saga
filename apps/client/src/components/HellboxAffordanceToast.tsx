/**
 * HellboxAffordanceToast — Diegetic First-Touch Prompt
 *
 * Surfaces a small floating affordance the first time the player
 * has the Hellbox discovered AND has not yet completed the first-
 * touch cinematic. Provides a single CTA to /hellbox.
 *
 * Once the player either visits /hellbox or completes the first
 * touch, the toast self-suppresses (the dismiss flag persists).
 *
 * Mounted near the top of the React tree so it's always visible
 * to a player who has triggered Beat B but not Beat C.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  HELLBOX_DISCOVERED_FLAG,
  HELLBOX_FIRST_TOUCH_FLAG,
} from "@shared/matrixSaveFlags";

const TOAST_DISMISSED_FLAG = "hellbox_affordance_toast_dismissed";

export default function HellboxAffordanceToast() {
  const [location] = useLocation();
  const { state, setNarrativeFlag } = useGame();
  const [hidden, setHidden] = useState(false);

  const flags = state.narrativeFlags ?? {};
  const discovered = Boolean(flags[HELLBOX_DISCOVERED_FLAG]);
  const firstTouchDone = Boolean(flags[HELLBOX_FIRST_TOUCH_FLAG]);
  const dismissed = Boolean(flags[TOAST_DISMISSED_FLAG]);
  const onHellbox = location.startsWith("/hellbox") || location.startsWith("/matrix/");

  // Auto-dismiss when the player reaches the Hellbox page or completes Beat C.
  useEffect(() => {
    if ((onHellbox || firstTouchDone) && !dismissed) {
      setNarrativeFlag(TOAST_DISMISSED_FLAG, true);
    }
  }, [onHellbox, firstTouchDone, dismissed, setNarrativeFlag]);

  const visible = discovered && !firstTouchDone && !dismissed && !onHellbox && !hidden;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 z-50 max-w-xs rounded-lg border border-amber-700/40 bg-zinc-950/95 backdrop-blur p-4 shadow-lg"
          data-component="hellbox-affordance-toast"
        >
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-amber-400 mb-1">
                Hellbox detected
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed mb-3">
                Something in the medbay is humming. The Engineer's voice carries
                in it.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="/hellbox"
                  className="text-xs px-3 py-1.5 rounded-md border border-amber-600 bg-amber-900/20 hover:bg-amber-900/40 transition-colors"
                >
                  Touch it
                </Link>
                <button
                  type="button"
                  onClick={() => setHidden(true)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Not yet
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setHidden(true);
                setNarrativeFlag(TOAST_DISMISSED_FLAG, true);
              }}
              className="text-zinc-600 hover:text-zinc-300 shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
