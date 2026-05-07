/**
 * List-virtualization helper.
 *
 * Thin wrapper around `@tanstack/react-virtual` for the three
 * highest-volume lists in the client: card browser (~1200 cards),
 * leaderboard (variable, can grow to 10k+), Loredex (~380 entries).
 *
 * Why virtualization: rendering 1000+ DOM nodes blows out frame
 * budget on mid-tier mobile (Pixel 6a target). The plan §E3
 * baseline is "lists declared in `.virtualization-adopted` use this
 * hook"; the parity check enforces opt-in growth.
 *
 * Usage:
 *
 *   const parentRef = useRef<HTMLDivElement | null>(null);
 *   const virtualizer = useListVirtualizer({
 *     count: items.length,
 *     parentRef,
 *     estimateSize: 96, // px per row
 *   });
 *   return (
 *     <div ref={parentRef} style={{ height: 600, overflow: "auto" }}>
 *       <div style={{ height: virtualizer.getTotalSize() }}>
 *         {virtualizer.getVirtualItems().map(v => (
 *           <div key={items[v.index].id} style={{ position: "absolute", top: v.start, height: v.size }}>
 *             {renderItem(items[v.index])}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 */
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
import type { RefObject } from "react";

export interface UseListVirtualizerOptions {
  /** Total item count. */
  count: number;
  /** Ref to the scroll container element. */
  parentRef: RefObject<HTMLElement | null>;
  /** Estimated size of each row in px. The virtualizer adapts as
   *  rows render but a good estimate cuts initial layout cost. */
  estimateSize: number;
  /** Default 5; rows kept rendered above/below the viewport. */
  overscan?: number;
}

export function useListVirtualizer(
  opts: UseListVirtualizerOptions,
): Virtualizer<HTMLElement, Element> {
  return useVirtualizer({
    count: opts.count,
    getScrollElement: () => opts.parentRef.current,
    estimateSize: () => opts.estimateSize,
    overscan: opts.overscan ?? 5,
  });
}
