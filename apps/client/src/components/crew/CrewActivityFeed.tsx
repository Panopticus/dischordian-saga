/* ═══════════════════════════════════════════════════════
   CREW ACTIVITY FEED — Ambient ticker, mission resolutions
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo } from "react";
import { Radio, AlertTriangle, Info, Skull } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { CrewState, SerializedFeedEntry } from "@shared/crewPersistence";

interface Props {
  state: CrewState;
}

const SEVERITY_ICON = {
  info: Info,
  warning: Radio,
  alert: AlertTriangle,
  critical: Skull,
};

const SEVERITY_COLOR = {
  info: "text-muted-foreground border-border/30",
  warning: "text-yellow-400 border-yellow-500/30",
  alert: "text-orange-400 border-orange-500/30",
  critical: "text-red-400 border-red-500/50",
};

function formatAge(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CrewActivityFeed({ state }: Props) {
  const markRead = trpc.crew.markFeedRead.useMutation();

  useEffect(() => {
    if (state.feedUnreadCount > 0) {
      markRead.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(
    () => [...state.feed].sort((a, b) => b.timestamp - a.timestamp),
    [state.feed],
  );

  if (sorted.length === 0) {
    return (
      <div className="py-16 text-center">
        <Radio size={40} className="mx-auto text-muted-foreground/30 mb-3" />
        <div className="font-mono text-sm text-muted-foreground">
          The Ark is silent. Clone your first crew member to start generating activity.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-[calc(100vh-16rem)] overflow-y-auto">
      {sorted.map((entry: SerializedFeedEntry) => {
        const Icon = SEVERITY_ICON[entry.severity] ?? Info;
        return (
          <div
            key={entry.id}
            className={`flex items-start gap-2 p-2 border-l-2 bg-card/30 rounded-r ${
              SEVERITY_COLOR[entry.severity] ?? SEVERITY_COLOR.info
            }`}
          >
            <Icon size={12} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-mono leading-snug">{entry.text}</div>
              <div className="text-[9px] font-mono text-muted-foreground/60 mt-0.5">
                {entry.roomId} · {formatAge(entry.timestamp)}
                {entry.category && ` · ${entry.category}`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
