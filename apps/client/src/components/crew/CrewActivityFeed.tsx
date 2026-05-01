/* ═══════════════════════════════════════════════════════
   CREW ACTIVITY FEED — Ambient ticker, mission resolutions
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { Radio, AlertTriangle, Info, Skull, X, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { CrewState, SerializedFeedEntry } from "@shared/crewPersistence";

interface Props {
  state: CrewState;
}

/** Hand-authored lore blurbs that fire when the player clicks an
 *  actionable feed entry. Keyed by the entry's `foreshadows` slug. */
const FORESHADOW_DETAILS: Record<string, { title: string; body: string }> = {
  pod_47b_mystery: {
    title: "POD 47-B — UNREGISTERED NEURAL PATTERNS",
    body: "The Collector's archive has no match for the DNA in this pod. The pod is running, but nobody remembers starting it. Elara has flagged it as 'ARCHIVIST CONCERN — DO NOT DEFROST.' The Resurrectionist disagrees.",
  },
  deck_4_sealed: {
    title: "DECK 4 — POWER ANOMALY",
    body: "The sealed section of Deck 4 has been drawing 340% of expected standby power for 11 seconds a day. Schematics show nothing there. Elara recommends a hardware inspection. The Antiquarian recommends forgetting you saw this.",
  },
  archive_intruder: {
    title: "ARCHIVES — PHANTOM ACCESS",
    body: "At 0300 hours, a terminal in the Archives accessed restricted files. No crew were logged in. Fingerprint analysis returned a match — a crew member who has been dead for 12 cycles. The Source says nothing.",
  },
  terminus_pull: {
    title: "NAVIGATION — UNAUTHORIZED COURSE",
    body: "The nav computer briefly plotted a course to Terminus. No one requested it. The system was offline for 0.4 seconds before correcting. Something wants you closer to the wound.",
  },
  signal_interference: {
    title: "COMMS — SUBSTRATE WHISPER",
    body: "A 0.3-second burst on all channels. Not decoded yet. The Human's substrate housing drew a spike at the same moment. Elara suggests it was static. Elara suggests it was static.",
  },
  shared_dreams: {
    title: "MEDICAL — SHARED REM PATTERNS",
    body: "Three crew in different departments reported identical dreams: a purple ocean, a voice they didn't understand, a single word: wait. Medical has flagged a possible neural-cluster formation.",
  },
  cryo_anomaly: {
    title: "CRYO BAY — GHOST ACTIVATION",
    body: "An empty pod — pod 11, never used — activated for 7 seconds. Diagnostics are clean. The Resurrectionist wants to watch it overnight. 'Just in case.'",
  },
  antiquarian_warning: {
    title: "THE ANTIQUARIAN — NOT YET",
    body: "The Archives terminal displayed two words in the Antiquarian's hand: NOT YET. It cleared before anyone could save the screen. He has not offered an explanation, and he will not.",
  },
  human_activity: {
    title: "THE HUMAN — SUBSTRATE BURST",
    body: "The substrate housing that contains what remains of The Human drew 340% normal power for 11 seconds, then quieted. Elara reports he has been 'thinking about something.' That's all she will say.",
  },
  approaching_threat: {
    title: "BRIDGE — SENSOR GHOST",
    body: "A contact appeared at extreme sensor range, then vanished before triangulation. The return signature didn't match any catalogued vessel. The navigator has flagged the bearing.",
  },
  ghost_in_machine: {
    title: "ENGINEERING — THERMAL DROP",
    body: "The sealed lab on Deck 4 dropped four degrees in an hour. All sensors report nominal. The engineer can't explain it and has asked to be reassigned from that section.",
  },
  external_contact: {
    title: "OBSERVATION DECK — UNCATALOGUED LIGHT",
    body: "A crew member saw a point of light outside the viewport that moved against the stars. It lasted 2 seconds. Security sweeps found nothing. Elara is reviewing the footage.",
  },
  thought_virus_proximity: {
    title: "MEDICAL — PROXIMITY HEADACHE",
    body: "A crew member reported sustained headaches only while near the Comms Array. Bloodwork is clean. Neural scans show a faint pattern near the limbic system. Medical is monitoring.",
  },
  player_anomaly: {
    title: "MEDICAL — CAPTAIN'S BLOODWORK",
    body: "The Captain's latest routine scan showed a pattern Medical has never seen before. The Source has asked for a sample. Medical has not yet decided whether to send one.",
  },
};

const SEVERITY_ICON = {
  info: Info,
  warning: Radio,
  alert: AlertTriangle,
  critical: Skull,
};

const SEVERITY_COLOR = {
  info: "text-muted-foreground border-border/30",
  warning: "void-text-premium void-border",
  alert: "void-text-premium void-border",
  critical: "void-text-error void-border-error",
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
  const [detail, setDetail] = useState<SerializedFeedEntry | null>(null);

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
    <>
      <div className="space-y-1 max-h-[calc(100dvh-16rem)] overflow-y-auto">
        {sorted.map((entry: SerializedFeedEntry) => {
          const Icon = SEVERITY_ICON[entry.severity] ?? Info;
          const hasDetail = !!(entry.actionable && entry.foreshadows && FORESHADOW_DETAILS[entry.foreshadows]);
          const Wrapper: any = hasDetail ? "button" : "div";
          return (
            <Wrapper
              key={entry.id}
              onClick={hasDetail ? () => setDetail(entry) : undefined}
              className={`flex items-start gap-2 p-2 border-l-2 bg-card/30 rounded-r w-full text-left ${
                SEVERITY_COLOR[entry.severity] ?? SEVERITY_COLOR.info
              } ${hasDetail ? "hover:bg-card/60 cursor-pointer" : ""}`}
            >
              <Icon size={12} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-mono leading-snug">{entry.text}</div>
                <div className="text-[9px] font-mono text-muted-foreground/60 mt-0.5">
                  {entry.roomId} · {formatAge(entry.timestamp)}
                  {entry.category && ` · ${entry.category}`}
                </div>
              </div>
              {hasDetail && <ChevronRight size={12} className="mt-0.5 shrink-0 opacity-60" />}
            </Wrapper>
          );
        })}
      </div>
      {detail && detail.foreshadows && FORESHADOW_DETAILS[detail.foreshadows] && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-card border border-primary/40 rounded max-w-md w-full p-5 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setDetail(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
            <div className="font-display text-sm font-bold tracking-wide mb-2">
              {FORESHADOW_DETAILS[detail.foreshadows].title}
            </div>
            <div className="text-[11px] font-mono text-foreground/80 leading-relaxed mb-3">
              {FORESHADOW_DETAILS[detail.foreshadows].body}
            </div>
            <div className="text-[9px] font-mono text-muted-foreground italic">
              Original report: "{detail.text}"
            </div>
          </div>
        </div>
      )}
    </>
  );
}
