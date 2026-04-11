/* ═══════════════════════════════════════════════════════
   CREW AMBIENT TICKER — Drop-in app-shell widget

   A compact, subscribable ticker that surfaces the
   latest crew-activity entries anywhere in the UI.
   Designed to be mounted near the player bar or in
   the Ark explorer. Self-contained: polls the crew
   state and displays the most recent entry.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Radio } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { CrewState, SerializedFeedEntry } from "@shared/crewPersistence";

const ROTATE_MS = 6000;

export default function CrewAmbientTicker() {
  const { data } = trpc.crew.getState.useQuery(undefined, {
    refetchInterval: 60_000,
    retry: false,
  });
  const state = data as CrewState | undefined;

  const recent = useMemo(() => {
    if (!state) return [] as SerializedFeedEntry[];
    return [...state.feed]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);
  }, [state]);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (recent.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % recent.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [recent.length]);

  if (!state || !state.crewSystemUnlocked || recent.length === 0) return null;

  const entry = recent[idx % recent.length];
  return (
    <Link
      href="/crew"
      className="inline-flex items-center gap-2 px-3 py-1 bg-card/60 border border-border/30 rounded-full text-[10px] font-mono max-w-xl hover:border-border transition"
      title="Crew Activity Feed"
    >
      <Radio size={10} className="text-primary animate-pulse shrink-0" />
      <span className="truncate text-muted-foreground">{entry.text}</span>
      {state.feedUnreadCount > 0 && (
        <span className="text-[9px] bg-primary/20 text-primary px-1 rounded">
          {state.feedUnreadCount}
        </span>
      )}
    </Link>
  );
}
