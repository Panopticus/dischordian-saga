/* ═══════════════════════════════════════════════════════
   REDACTED LOREDEX ENTRY — per-player Shadow Tongue redaction
   wrapper (NPC depth #13 client renderer).

   Wraps any Loredex entry render and consults
   trpc.shadowTongueRedactions.resolve to decide whether the
   player should see the entry in full, partially, redacted,
   or contradictory. Distinct from <CorruptibleBio>: that
   component handles the singleton/global Shadow Tongue editing
   path; this one is the per-player layer the user explicitly
   asked for ("Shadow Tongue should actively be adjusting to
   who you are").

   Usage:
     <RedactedLoredexEntry entryId={entry.id}>
       <FullEntryView entry={entry} />
     </RedactedLoredexEntry>

   Renders fall back gracefully if the procedure fails — visible
   is the safe default.
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";
import type { ReactNode } from "react";

interface Props {
  /** Loredex entry id (from apps/client/src/data/loredex-data.json). */
  entryId: string;
  /** Full entry render shown when state is `visible`. */
  children: ReactNode;
  /**
   * Render shown when state is `partial`. If omitted, falls back
   * to children with a "[partially redacted]" overlay.
   */
  partialView?: ReactNode;
  /**
   * Render shown when state is `redacted`. If omitted, falls back
   * to a "[REDACTED]" placeholder.
   */
  redactedView?: ReactNode;
  /**
   * Render shown when state is `contradictory` — competing readings
   * from multiple sources should display side-by-side. If omitted,
   * falls back to children with a "[CONTESTED]" banner.
   */
  contradictoryView?: ReactNode;
}

export function RedactedLoredexEntry({
  entryId,
  children,
  partialView,
  redactedView,
  contradictoryView,
}: Props) {
  const { data, isLoading } = trpc.shadowTongueRedactions.resolve.useQuery(
    { entryId },
    {
      // Cache for the session — redaction state changes on tick or on
      // explicit reveal-trigger fires; the renderer can opt for
      // refetch via the standard react-query interface when those
      // events fire.
      staleTime: 60_000,
    },
  );

  if (isLoading) return <>{children}</>;

  const state = data?.state ?? "visible";

  if (state === "redacted") {
    if (redactedView) return <>{redactedView}</>;
    // Inline-safe default — uses <span> so the component nests cleanly
    // inside <p>, <h2>, list items, etc. (every existing CorruptibleBio
    // call site wraps inside text elements).
    return (
      <span
        role="note"
        aria-label="redacted entry"
        style={{ fontStyle: "italic", opacity: 0.6 }}
      >
        [REDACTED]
      </span>
    );
  }

  if (state === "partial") {
    if (partialView) return <>{partialView}</>;
    return (
      <>
        <span
          style={{
            fontSize: "0.75em",
            opacity: 0.7,
            marginRight: "0.5em",
          }}
        >
          [partially redacted]
        </span>
        {children}
      </>
    );
  }

  if (state === "contradictory") {
    if (contradictoryView) return <>{contradictoryView}</>;
    return (
      <>
        <span
          style={{
            fontSize: "0.75em",
            opacity: 0.7,
            marginRight: "0.5em",
          }}
        >
          [CONTESTED]
        </span>
        {children}
      </>
    );
  }

  return <>{children}</>;
}
