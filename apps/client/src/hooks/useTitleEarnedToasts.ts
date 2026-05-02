/**
 * useTitleEarnedToasts — global hook that polls for newly-earned
 * titles every 60s and surfaces them as toasts. Mounted once at the
 * app shell level.
 *
 * Cursor stored in localStorage so a refresh doesn't re-toast titles
 * the player already saw.
 */
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { showTitleEarnedToasts } from "@/components/TitleToast";

const CURSOR_KEY = "dischordian:title_toast_cursor";

function readCursor(): number {
  try {
    const raw = localStorage.getItem(CURSOR_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

function writeCursor(ts: number): void {
  try {
    localStorage.setItem(CURSOR_KEY, String(ts));
  } catch {
    /* ignore */
  }
}

export function useTitleEarnedToasts(): void {
  const { isAuthenticated } = useAuth();
  const cursor = readCursor();
  // Default to "last 5 minutes" on first run so the player doesn't
  // get a flood of historical titles on first load.
  const sinceTimestamp = cursor || Date.now() - 5 * 60_000;

  const recent = trpc.titles.pollRecentGrants.useQuery(
    { sinceTimestamp },
    {
      enabled: isAuthenticated,
      refetchInterval: 60_000,
      refetchOnWindowFocus: true,
    },
  );

  useEffect(() => {
    if (!recent.data || recent.data.length === 0) return;
    const newKeys: string[] = [];
    let maxTs = cursor;
    for (const row of recent.data) {
      const ts = row.earnedAt ? new Date(row.earnedAt).getTime() : 0;
      if (ts > cursor) {
        newKeys.push(row.titleKey);
        if (ts > maxTs) maxTs = ts;
      }
    }
    if (newKeys.length > 0) {
      showTitleEarnedToasts(newKeys);
      writeCursor(maxTs);
    }
  }, [recent.data, cursor]);
}
