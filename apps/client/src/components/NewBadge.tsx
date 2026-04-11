/* ═══════════════════════════════════════════════════════
   NEW CONTENT BADGE

   Simple "NEW" indicator for features the player hasn't
   visited yet. Tracks seen state via localStorage.
   Exports helper functions for marking/checking status,
   plus the badge component itself.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── STORAGE KEY ─── */

const STORAGE_KEY = "dischordian_seen_features";

/* ─── HELPERS ─── */

function getSeenMap(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveSeenMap(map: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/**
 * Mark a feature as seen. Call this when the player visits/views a feature.
 * Dispatches a custom event so any mounted NewBadge components can react.
 */
export function markSeen(featureId: string): void {
  const map = getSeenMap();
  map[featureId] = Date.now();
  saveSeenMap(map);
  window.dispatchEvent(
    new CustomEvent("feature-seen", { detail: { featureId } }),
  );
}

/**
 * Check whether a feature is new (not yet seen by the player).
 * Optionally pass a `since` timestamp -- the feature is only "new"
 * if it was updated after the player last saw it.
 */
export function isNew(featureId: string, since?: number): boolean {
  const map = getSeenMap();
  const seenAt = map[featureId];
  if (seenAt === undefined) return true;
  if (since !== undefined) return since > seenAt;
  return false;
}

/**
 * Mark a feature as new again (e.g., when content updates).
 * Removes the seen timestamp for this feature.
 */
export function markUnseen(featureId: string): void {
  const map = getSeenMap();
  delete map[featureId];
  saveSeenMap(map);
  window.dispatchEvent(
    new CustomEvent("feature-unseen", { detail: { featureId } }),
  );
}

/**
 * Reset all seen state. Useful for testing or account reset.
 */
export function resetAllSeen(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/* ─── HOOK ─── */

/**
 * React hook that returns whether a feature is new, and a function to mark it seen.
 * Automatically re-renders when the seen state changes.
 */
export function useNewFeature(featureId: string, since?: number) {
  const [isNewState, setIsNewState] = useState(() => isNew(featureId, since));

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ featureId: string }>).detail;
      if (detail.featureId === featureId) {
        setIsNewState(isNew(featureId, since));
      }
    };
    window.addEventListener("feature-seen", handler);
    window.addEventListener("feature-unseen", handler);
    return () => {
      window.removeEventListener("feature-seen", handler);
      window.removeEventListener("feature-unseen", handler);
    };
  }, [featureId, since]);

  const markAsSeen = useCallback(() => {
    markSeen(featureId);
  }, [featureId]);

  return { isNew: isNewState, markSeen: markAsSeen };
}

/* ─── BADGE VARIANTS ─── */

type BadgeVariant = "dot" | "text" | "pill";

interface Props {
  featureId: string;
  /** Timestamp: feature is only "new" if updated after player last visited */
  since?: number;
  /** Visual variant: "dot" (default red circle), "text" (NEW label), "pill" (red pill badge) */
  variant?: BadgeVariant;
  /** Additional CSS classes */
  className?: string;
  /** Auto-mark as seen when this component unmounts (useful for page-level tracking) */
  autoMarkOnUnmount?: boolean;
}

/* ─── MAIN COMPONENT ─── */

export default function NewBadge({
  featureId,
  since,
  variant = "dot",
  className = "",
  autoMarkOnUnmount = false,
}: Props) {
  const { isNew: showBadge, markSeen: mark } = useNewFeature(featureId, since);

  useEffect(() => {
    return () => {
      if (autoMarkOnUnmount) {
        markSeen(featureId);
      }
    };
     
  }, [autoMarkOnUnmount, featureId]);

  return (
    <AnimatePresence>
      {showBadge && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`inline-flex items-center justify-center ${className}`}
          onClick={(e) => {
            e.stopPropagation();
            mark();
          }}
        >
          {variant === "dot" && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
          )}

          {variant === "text" && (
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-red-400">
              NEW
            </span>
          )}

          {variant === "pill" && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500/90 text-white text-[8px] font-mono font-bold uppercase tracking-wider leading-none">
              NEW
            </span>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ─── SIDEBAR INTEGRATION HELPER ─── */

/**
 * Wrapper component for sidebar nav items. Renders children with an
 * optional NewBadge positioned at the end.
 */
export function NavItemWithBadge({
  featureId,
  since,
  children,
  className = "",
}: {
  featureId: string;
  since?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {children}
      <NewBadge featureId={featureId} since={since} variant="dot" />
    </span>
  );
}
