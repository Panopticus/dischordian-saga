/* ═══════════════════════════════════════════════════════
   PAGE LOADER — Physics-aware loading skeleton for pages

   Drop-in wrapper for any page that loads data via tRPC.
   Shows void-skeleton lines while data loads, then fades
   in the content using physics-aware animation.

   Usage:
     <PageLoader loading={query.isLoading}>
       <MyPageContent data={query.data} />
     </PageLoader>

   Or as a standalone full-page skeleton:
     <PageLoader loading={true} lines={8} />
   ═══════════════════════════════════════════════════════ */

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOID } from "@/engine/voidPresets";

interface PageLoaderProps {
  /** When true, shows skeleton. When false, shows children. */
  loading: boolean;
  /** Content to render when loaded */
  children?: ReactNode;
  /** Number of skeleton lines (default 6) */
  lines?: number;
  /** Optional title skeleton */
  showTitle?: boolean;
  /** Custom className for the container */
  className?: string;
}

export default function PageLoader({
  loading,
  children,
  lines = 6,
  showTitle = true,
  className = "",
}: PageLoaderProps) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="skeleton"
          {...VOID.fade()}
          className={`p-4 sm:p-6 space-y-4 ${className}`}
        >
          {/* Title skeleton */}
          {showTitle && (
            <div className="void-skeleton h-8 w-48 mb-6" />
          )}

          {/* Content skeletons */}
          {Array.from({ length: lines }, (_, i) => (
            <div key={i} className="space-y-2">
              <div
                className="void-skeleton void-skeleton-text h-4"
                style={{ width: i === lines - 1 ? "60%" : `${75 + Math.sin(i * 1.5) * 20}%` }}
              />
            </div>
          ))}

          {/* Card skeleton row */}
          <div className="flex gap-3 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="void-skeleton h-24 flex-1 rounded-lg" />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          {...VOID.fadeUp(10)}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Minimal inline skeleton for components (not full pages).
 * Shows a single pulsing block.
 */
export function InlineSkeleton({ className = "", height = "h-4", width = "w-full" }: {
  className?: string;
  height?: string;
  width?: string;
}) {
  return <div className={`void-skeleton ${height} ${width} ${className}`} />;
}
