/* ═══════════════════════════════════════════════════════
   CREW HOLIDAY FEED — Renders the Christmas in July slice
   of the crew activity feed.

   Uses the existing `generateDailyFeed` helper from
   `game/crewActivityFeed.ts` to produce a deterministic
   daily ticker, seeded off the current UTC date so every
   player sees the same entries within a given 24-hour
   window. Only visible while the event is active.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertTriangle } from "lucide-react";
import { generateDailyFeed } from "@/game/crewActivityFeed";
import { trpc } from "@/lib/trpc";

const SAMPLE_CREW_NAMES = [
  "Voss", "Zhara", "Reyna", "Korith", "Silva", "Tal",
  "Mira", "Dax", "Kae'Rel", "Nyx", "Azarel", "Kett",
];

interface CrewHolidayFeedProps {
  playerName?: string;
  /** Max entries to show. Defaults to 6. */
  limit?: number;
}

export function CrewHolidayFeed({ playerName = "Captain", limit = 6 }: CrewHolidayFeedProps) {
  const activeQuery = trpc.christmasInJuly.isActive.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });

  const entries = useMemo(() => {
    if (!activeQuery.data?.active) return [];
    const now = new Date();
    // Deterministic day seed so all players see the same feed inside the
    // same UTC day.
    const daySeed = Number(
      `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`,
    );
    return generateDailyFeed(
      daySeed,
      SAMPLE_CREW_NAMES,
      SAMPLE_CREW_NAMES.length,
      playerName,
      new Set<string>(),
      [],
      "christmas_in_july",
    ).slice(0, limit);
  }, [activeQuery.data?.active, playerName, limit]);

  if (!activeQuery.data?.active || entries.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-red-950/20 via-green-950/20 to-amber-950/20 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-amber-300" />
        <span className="font-display text-sm text-amber-300">Crew Holiday Chatter</span>
        <span className="ml-auto text-[10px] text-amber-400/50 font-mono uppercase tracking-widest">
          Live
        </span>
      </div>
      <div className="space-y-2 max-h-64 overflow-auto">
        <AnimatePresence initial={false}>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id ?? i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: i * 0.04 }}
              className={`px-3 py-2 rounded-lg border text-xs font-mono leading-relaxed ${
                entry.severity === "alert" || entry.severity === "critical"
                  ? "bg-red-950/30 border-red-500/30 text-red-200"
                  : entry.severity === "warning"
                  ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                  : "bg-gray-900/40 border-gray-700/30 text-gray-300"
              }`}
            >
              <div className="flex items-start gap-2">
                {(entry.severity === "alert" || entry.severity === "critical") && (
                  <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{entry.text}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
