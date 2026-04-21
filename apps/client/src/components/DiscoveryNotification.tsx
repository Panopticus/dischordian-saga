/* ═══════════════════════════════════════════════════════
   DISCOVERY NOTIFICATION — Toast-style notification when
   a new feature is unlocked through Ark exploration.
   Suppressed while dialogs are active. Items queue and
   show after the dialog closes.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Unlock, ChevronRight, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { isDialogActive } from "@/lib/dialogState";
import { useGame } from "@/contexts/GameContext";

interface DiscoveryEvent {
  featureKey: string;
  featureLabel: string;
  roomName: string;
  path?: string;
}

// Global event bus for discovery notifications
type DiscoveryCallback = (event: DiscoveryEvent) => void;
const discoveryListeners = new Set<DiscoveryCallback>();

export function emitDiscoveryNotification(event: DiscoveryEvent) {
  discoveryListeners.forEach(fn => fn(event));
}

export default function DiscoveryNotification() {
  const { state } = useGame();
  // F4 — hold the entire queue until the player has cleared the opening
  // arc. Events are still captured during the prelude (so the player's
  // first actions after prelude_complete can drain them).
  const preludeComplete = Boolean(state.narrativeFlags?.prelude_complete);
  const [queue, setQueue] = useState<DiscoveryEvent[]>([]);
  const [current, setCurrent] = useState<DiscoveryEvent | null>(null);
  const [dialogSuppressed, setDialogSuppressed] = useState(() => isDialogActive());
  const [, setLocation] = useLocation();

  const handleDiscovery = useCallback((event: DiscoveryEvent) => {
    setQueue(prev => [...prev, event]);
  }, []);

  useEffect(() => {
    discoveryListeners.add(handleDiscovery);
    return () => { discoveryListeners.delete(handleDiscovery); };
  }, [handleDiscovery]);

  // Listen for dialog state changes
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.active) {
        setDialogSuppressed(true);
        // If currently showing a notification, hide it and re-queue
        if (current) {
          setQueue(prev => [current, ...prev]);
          setCurrent(null);
        }
      } else {
        setDialogSuppressed(false);
      }
    };
    window.addEventListener("dialog-state-change", handler);
    return () => window.removeEventListener("dialog-state-change", handler);
  }, [current]);

  // Process queue — only when no dialog is active AND prelude is past.
  useEffect(() => {
    if (!preludeComplete) return; // F4
    if (!current && queue.length > 0 && !dialogSuppressed) {
      setCurrent(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [current, queue, dialogSuppressed, preludeComplete]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setCurrent(null), 5000);
    return () => clearTimeout(timer);
  }, [current]);

  const handleClick = () => {
    if (current?.path) {
      setLocation(current.path);
    }
    setCurrent(null);
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] cursor-pointer"
          onClick={handleClick}
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl max-w-sm"
            style={{
              background: "linear-gradient(135deg, color-mix(in oklch, var(--energy-primary) 15%, transparent) 0%, var(--glass-border) 100%)",
              border: "1px solid color-mix(in oklch, var(--energy-primary) 35%, transparent)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 30px color-mix(in oklch, var(--energy-primary) 15%, transparent), 0 8px 32px color-mix(in oklch, var(--bg-void) 40%, transparent)",
            }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 relative"
              style={{
                background: "color-mix(in oklch, var(--energy-primary) 10%, transparent)",
                border: "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)",
              }}
            >
              <Unlock size={18} className="text-[var(--neon-cyan)]" />
              <Sparkles size={10} className="text-[var(--neon-cyan)] absolute -top-1 -right-1 animate-pulse" />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-[var(--neon-cyan)]/70 tracking-[0.2em] mb-0.5">
                SYSTEM UNLOCKED
              </p>
              <p className="font-display text-sm font-bold text-white tracking-wider truncate">
                {current.featureLabel}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/60 truncate">
                Discovered in {current.roomName}
              </p>
            </div>

            {/* Arrow */}
            {current.path && (
              <ChevronRight size={16} className="text-[var(--neon-cyan)]/50 shrink-0" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
