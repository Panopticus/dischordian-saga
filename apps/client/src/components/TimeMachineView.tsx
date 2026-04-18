/* ═══════════════════════════════════════════════════════
   THE PROGRAMMER'S TIME MACHINE — Architect Console Tab

   Lets the Architect jump to any decision point in the
   Year One calendar, view the full vote, simulate outcomes,
   and observe how the governance store mutates at each
   point in the timeline.

   Void Energy aesthetic — matches the Architect's Console.
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Rewind,
  FastForward,
  RotateCcw,
  Zap,
  Play,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllCoNexusEvents,
  jumpToEvent,
  simulateOutcome,
  resetTimeline,
  getCurrentTimelinePosition,
  preloadTimeline,
} from "@/services/governanceTimeMachine";
import type { CoNexusEvent } from "@/services/governanceTimeMachine";
import { useGovernanceStore } from "@/stores/governanceStore";

/* ═══ VOID ENERGY STYLE HELPERS ═══ */

const voidPanel =
  "bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur";
const voidGlow = "shadow-[0_0_15px_color-mix(in oklch, var(--energy-primary) 15%, transparent)]";
const voidBtn =
  "px-4 py-2 rounded-lg font-mono text-[11px] tracking-wider transition-all";
const voidBtnPrimary = `${voidBtn} void-bg-success border void-border-success void-text-energy void-bg-success hover:shadow-[0_0_20px_color-mix(in oklch, var(--energy-primary) 30%, transparent)]`;
const voidBtnDanger = `${voidBtn} void-bg-error border void-border-error void-text-error void-bg-error`;
const voidLabel =
  "block font-mono text-[10px] text-white/40 tracking-wider mb-1";

/* ═══ ACT COLORS ═══ */

const ACT_COLORS: Record<number, { bg: string; text: string; border: string; dot: string; glow: string }> = {
  1: {
    bg: "void-bg-success",
    text: "void-text-energy",
    border: "void-border-success",
    dot: "void-bg-success",
    glow: "shadow-[0_0_8px_color-mix(in oklch, var(--energy-primary) 40%, transparent)]",
  },
  2: {
    bg: "void-bg-sunk",
    text: "void-text-accent",
    border: "void-border",
    dot: "void-bg-sunk",
    glow: "shadow-[0_0_8px_color-mix(in oklch, var(--energy-accent) 40%, transparent)]",
  },
  3: {
    bg: "void-bg-error",
    text: "void-text-error",
    border: "void-border-error",
    dot: "void-bg-error",
    glow: "shadow-[0_0_8px_color-mix(in oklch, var(--energy-error) 40%, transparent)]",
  },
  4: {
    bg: "void-bg-success",
    text: "void-text-energy",
    border: "void-border-success",
    dot: "void-bg-success",
    glow: "shadow-[0_0_8px_rgba(52,211,153,0.4)]",
  },
};

const ACT_LABELS = ["", "ACT I — AWAKENING", "ACT II — FRACTURE", "ACT III — CONVERGENCE", "ACT IV — RECKONING"];

/* ═══ TYPE BADGE COLORS ═══ */

function typeBadge(type: CoNexusEvent["type"]) {
  switch (type) {
    case "weekly_vote":
      return "void-bg-success void-text-energy void-border-success";
    case "monthly_vote":
      return "void-bg-system void-text-system void-border-system";
    case "seasonal":
      return "void-bg-sunk void-text-accent void-border";
  }
}

function typeLabel(type: CoNexusEvent["type"]) {
  switch (type) {
    case "weekly_vote":
      return "WEEKLY";
    case "monthly_vote":
      return "MONTHLY";
    case "seasonal":
      return "SEASONAL";
  }
}

/* ═══ SUB-COMPONENTS ═══ */

/** Horizontal timeline visualization */
function TimelineBar({
  events,
  currentEventId,
  onJump,
}: {
  events: CoNexusEvent[];
  currentEventId: string | null;
  onJump: (id: string) => void;
}) {
  const maxWeek = Math.max(52, ...events.map((e) => e.week));

  return (
    <div className={`${voidPanel} p-4`}>
      <h3 className="font-mono text-[10px] tracking-[0.2em] text-white/40 mb-3">
        YEAR ONE TIMELINE
      </h3>

      {/* Act sections */}
      <div className="flex gap-0.5 mb-2 h-2 rounded-full overflow-hidden">
        <div className="flex-[13] void-bg-success rounded-l-full" />
        <div className="flex-[13] void-bg-sunk" />
        <div className="flex-[13] void-bg-error" />
        <div className="flex-[13] void-bg-success rounded-r-full" />
      </div>

      {/* Act labels */}
      <div className="flex mb-3">
        {[1, 2, 3, 4].map((act) => (
          <div key={act} className="flex-1 text-center">
            <span className={`font-mono text-[8px] tracking-wider ${ACT_COLORS[act].text} opacity-60`}>
              ACT {act === 1 ? "I" : act === 2 ? "II" : act === 3 ? "III" : "IV"}
            </span>
          </div>
        ))}
      </div>

      {/* Event dots */}
      <div className="relative h-8">
        <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-white/10" />
        {events.map((evt) => {
          const left = `${(evt.week / maxWeek) * 100}%`;
          const isCurrent = evt.id === currentEventId;
          const colors = ACT_COLORS[evt.act] ?? ACT_COLORS[1];

          return (
            <motion.button
              key={evt.id}
              onClick={() => onJump(evt.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 group"
              style={{ left }}
              whileHover={{ scale: 1.5 }}
              title={`W${evt.week}: ${evt.title}`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${colors.dot} ${
                  isCurrent ? `ring-2 ring-white ${colors.glow} scale-150` : "opacity-60 hover:opacity-100"
                } transition-all`}
              />
              {isCurrent && (
                <motion.div
                  className={`absolute -inset-1 rounded-full ${colors.dot} opacity-30`}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/** Current position display with pulsing indicator */
function PositionDisplay({ position }: { position: { week: number; month: number; act: number } | null }) {
  return (
    <div className={`${voidPanel} p-4 flex items-center gap-3`}>
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${position ? "void-bg-sunk" : "bg-white/20"}`} />
        {position && (
          <motion.div
            className="absolute -inset-0.5 rounded-full void-bg-sunk opacity-40"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      <div>
        <span className={voidLabel}>TIMELINE POSITION</span>
        {position ? (
          <p className="font-mono text-sm text-white">
            <span className={ACT_COLORS[position.act]?.text ?? "text-white"}>
              Act {position.act === 1 ? "I" : position.act === 2 ? "II" : position.act === 3 ? "III" : "IV"}
            </span>
            <span className="text-white/30 mx-2">/</span>
            <span className="text-white/70">Month {position.month}</span>
            <span className="text-white/30 mx-2">/</span>
            <span className="text-white/70">Week {position.week}</span>
          </p>
        ) : (
          <p className="font-mono text-sm text-white/30">NOT SET</p>
        )}
      </div>
    </div>
  );
}

/** Active event detail panel with simulate buttons */
function ActiveEventDetail({
  event,
  onSimulate,
  isSimulating,
}: {
  event: CoNexusEvent | null;
  onSimulate: (voteId: string, optionId: string) => void;
  isSimulating: boolean;
}) {
  const activeVote = useGovernanceStore((s) => s.activeVote);
  const voteTally = useGovernanceStore((s) => s.voteTally);

  if (!event || !activeVote) {
    return (
      <div className={`${voidPanel} p-6 text-center`}>
        <Rewind size={24} className="text-white/10 mx-auto mb-2" />
        <p className="font-mono text-[10px] text-white/20">
          Jump to an event to see its details
        </p>
      </div>
    );
  }

  const totalVotes = Object.values(voteTally).reduce((s, n) => s + n, 0) || 1;

  return (
    <motion.div
      className={`${voidPanel} ${voidGlow} p-4 space-y-4`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} className="void-text-energy" />
          <span
            className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${typeBadge(event.type)}`}
          >
            {typeLabel(event.type)}
          </span>
          <span className="font-mono text-[9px] text-white/30">
            W{event.week} / M{event.month}
          </span>
        </div>
        <h3 className="font-mono text-sm text-white font-bold mb-1">
          {activeVote.question}
        </h3>
        <p className="font-mono text-[10px] text-white/40 leading-relaxed">
          {activeVote.antiquarianIntro}
        </p>
      </div>

      <div className="space-y-2">
        <span className={voidLabel}>
          OPTIONS — CLICK TO SIMULATE WINNER
        </span>
        {activeVote.options.map((opt) => {
          const count = voteTally[opt.id] || 0;
          const pct = ((count / totalVotes) * 100).toFixed(1);

          return (
            <motion.button
              key={opt.id}
              onClick={() => onSimulate(activeVote.id, opt.id)}
              disabled={isSimulating}
              className="w-full text-left p-3 rounded-lg bg-white/[0.03] border border-white/5 void-border-success hover:bg-white/[0.05] transition-all group"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-white/80 group-hover:text-white">
                  {opt.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/30">
                    {count} votes ({pct}%)
                  </span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded void-bg-success void-text-energy border void-border-success opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={8} className="inline mr-1" />
                    SIMULATE WIN
                  </span>
                </div>
              </div>
              <p className="font-mono text-[10px] text-white/30 mb-1.5">
                {opt.description}
              </p>
              {/* Vote bar */}
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full void-bg-success rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
              {opt.consequences.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {opt.consequences.map((c, i) => (
                    <span
                      key={i}
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/20"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {activeVote.affectedSystems.length > 0 && (
        <div>
          <span className={voidLabel}>AFFECTED SYSTEMS</span>
          <div className="flex flex-wrap gap-1">
            {activeVote.affectedSystems.map((sys) => (
              <span
                key={sys}
                className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/30 border border-white/5"
              >
                {sys}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ═══ MAIN COMPONENT ═══ */

export default function TimeMachineView() {
  const [events, setEvents] = useState<CoNexusEvent[]>([]);
  const [position, setPosition] = useState(getCurrentTimelinePosition());
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CoNexusEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Preload Year One data
  useEffect(() => {
    preloadTimeline().then((loaded) => {
      setDataLoaded(loaded);
      if (loaded) {
        setEvents(getAllCoNexusEvents());
      }
    });
  }, []);

  // Group events by act
  const eventsByAct = useMemo(() => {
    const grouped: Record<number, CoNexusEvent[]> = { 1: [], 2: [], 3: [], 4: [] };
    for (const evt of events) {
      (grouped[evt.act] ??= []).push(evt);
    }
    return grouped;
  }, [events]);

  const handleJump = useCallback(
    async (eventId: string) => {
      setIsLoading(true);
      try {
        await jumpToEvent(eventId);
        const pos = getCurrentTimelinePosition();
        setPosition(pos);
        setCurrentEventId(eventId);
        const evt = events.find((e) => e.id === eventId) ?? null;
        setSelectedEvent(evt);
        toast.success(
          `Jumped to Week ${pos?.week ?? "?"}, Act ${pos?.act ?? "?"}`,
          { description: evt?.title },
        );
      } catch (err: any) {
        toast.error("Jump failed", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    },
    [events],
  );

  const handleSimulate = useCallback(
    async (voteId: string, optionId: string) => {
      setIsSimulating(true);
      try {
        await simulateOutcome(voteId, optionId);
        toast.success("Outcome simulated", {
          description: "Chronicle entry added. Tally updated.",
        });
      } catch (err: any) {
        toast.error("Simulation failed", { description: err.message });
      } finally {
        setIsSimulating(false);
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    resetTimeline();
    setPosition(null);
    setCurrentEventId(null);
    setSelectedEvent(null);
    toast("Timeline reset", { description: "All state cleared." });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="void-text-energy" />
            <h2 className="font-mono text-sm tracking-[0.2em] text-white">
              THE PROGRAMMER&apos;S TIME MACHINE
            </h2>
          </div>
          <p className="font-mono text-[10px] text-white/20 ml-6">
            Every moment is accessible. Every path testable. Time is merely a
            variable.
          </p>
        </div>
        <button onClick={handleReset} className={voidBtnDanger}>
          <RotateCcw size={12} className="inline mr-1.5" />
          RESET TIMELINE
        </button>
      </div>

      {/* Position Display */}
      <PositionDisplay position={position} />

      {/* Timeline Visualization */}
      {events.length > 0 && (
        <TimelineBar
          events={events}
          currentEventId={currentEventId}
          onJump={handleJump}
        />
      )}

      {/* Main content: Event List + Active Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CoNexus Event List */}
        <div className={`${voidPanel} p-4 max-h-[600px] overflow-y-auto`}>
          <h3 className="font-mono text-[10px] tracking-[0.2em] text-white/40 mb-3 sticky top-0 bg-[var(--bg-void)]/90 pb-2">
            <FastForward size={12} className="inline mr-1.5 void-text-energy" />
            CONEXUS DECISION POINTS
            <span className="text-white/20 ml-2">({events.length})</span>
          </h3>

          {!dataLoaded && events.length === 0 && (
            <p className="font-mono text-[10px] text-white/20 text-center py-8">
              Year One event data not yet available.
              <br />
              Build yearOneEvents.ts to populate the timeline.
            </p>
          )}

          {[1, 2, 3, 4].map((act) => {
            const actEvents = eventsByAct[act] ?? [];
            if (actEvents.length === 0) return null;
            const colors = ACT_COLORS[act];

            return (
              <div key={act} className="mb-4">
                <div
                  className={`font-mono text-[9px] tracking-[0.15em] ${colors.text} mb-2 px-2 py-1 rounded ${colors.bg} border ${colors.border}`}
                >
                  {ACT_LABELS[act]}
                  <span className="text-white/20 ml-2">
                    ({actEvents.length})
                  </span>
                </div>

                <div className="space-y-1">
                  {actEvents.map((evt) => {
                    const isCurrent = evt.id === currentEventId;

                    return (
                      <motion.div
                        key={evt.id}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isCurrent
                            ? `${colors.bg} ${colors.border} ${colors.glow}`
                            : "bg-white/[0.01] border-white/5 hover:border-white/15 hover:bg-white/[0.03]"
                        }`}
                        onClick={() => !isCurrent && handleJump(evt.id)}
                        whileHover={!isCurrent ? { x: 2 } : undefined}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-white/30">
                              W{evt.week}
                            </span>
                            <span className="font-mono text-[10px] text-white/80 truncate max-w-[200px]">
                              {evt.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full border ${typeBadge(evt.type)}`}
                            >
                              {typeLabel(evt.type)}
                            </span>
                            {isCurrent ? (
                              <span className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/20">
                                CURRENT
                              </span>
                            ) : (
                              <ChevronRight
                                size={12}
                                className="text-white/10"
                              />
                            )}
                          </div>
                        </div>
                        <p className="font-mono text-[9px] text-white/20 truncate">
                          {evt.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Event Detail */}
        <div>
          <ActiveEventDetail
            event={selectedEvent}
            onSimulate={handleSimulate}
            isSimulating={isSimulating}
          />
        </div>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`${voidPanel} ${voidGlow} p-6 text-center`}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Clock size={24} className="void-text-energy mx-auto" />
              </motion.div>
              <p className="font-mono text-[10px] void-text-energy mt-2 tracking-wider">
                WARPING TIMELINE...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
