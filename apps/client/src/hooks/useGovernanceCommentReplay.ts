/* ═══════════════════════════════════════════════════════
   useGovernanceCommentReplay

   Phase 3 of the Governance Hub wiring. Polls the server for
   recently-set governance npc_public_flags belonging to this
   player, and fires a fireCompanionComment for each new flag.

   The toast pipeline (CompanionCommentToast.tsx) already plays
   the matching cc_gov_* line authored in
   apps/shared/companionComments.ts, dedupes per-comment via
   localStorage, and respects timing/maxPlays. This hook only
   has to (a) watch for new flags and (b) fire each at most once
   per session.

   localStorage key: 'governance:lastFlagAckMs' — milliseconds
   since epoch of the most recent flag this client has fired
   for. Each successful fire bumps the watermark; resets on
   logout via `resetGovernanceCommentReplayWatermark`.

   Mount in AppShell alongside CompanionCommentToast. Polls at
   most once per minute.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";

import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "governance:lastFlagAckMs";
const POLL_INTERVAL_MS = 60_000;

function readWatermark(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeWatermark(ms: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(ms));
  } catch {
    /* localStorage may be unavailable; degrade silently */
  }
}

export function resetGovernanceCommentReplayWatermark(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function useGovernanceCommentReplay(): void {
  const watermarkRef = useRef<number>(readWatermark());

  const { data, refetch } = trpc.architectConsole.getRecentGovernanceFlags.useQuery(
    { sinceMs: watermarkRef.current, limit: 20 },
    {
      staleTime: POLL_INTERVAL_MS,
      refetchOnWindowFocus: true,
    },
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      void refetch();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [refetch]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Sort ascending by setAt so multiple stale flags fire in
    // the order they were set, not reverse-chronological.
    const ascending = [...data].sort((a, b) => {
      const at = new Date(a.setAt as unknown as string).getTime();
      const bt = new Date(b.setAt as unknown as string).getTime();
      return at - bt;
    });

    let highestSeen = watermarkRef.current;
    for (const row of ascending) {
      const setAtMs = new Date(row.setAt as unknown as string).getTime();
      if (setAtMs <= watermarkRef.current) continue;
      fireCompanionComment(`flag_set:${row.flag}`);
      if (setAtMs > highestSeen) highestSeen = setAtMs;
    }

    if (highestSeen > watermarkRef.current) {
      watermarkRef.current = highestSeen;
      writeWatermark(highestSeen);
    }
  }, [data]);
}
