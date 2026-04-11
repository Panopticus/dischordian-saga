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
import { Users, AlertTriangle, Gift } from "lucide-react";
import { generateDailyFeed } from "@/game/crewActivityFeed";
import { CREW_GIFT_EXCHANGES } from "@/data/events/christmasInJuly/crewHoliday";
import { CHRISTMAS_EVENT_CONFIG } from "@/data/events/christmasInJuly/eventConfig";
import { trpc } from "@/lib/trpc";

const SAMPLE_CREW_NAMES = [
  "Voss", "Zhara", "Reyna", "Korith", "Silva", "Tal",
  "Mira", "Dax", "Kae'Rel", "Nyx", "Azarel", "Kett",
];

/** Deterministic daily picker that draws N unique crew gift exchange
 *  events from CREW_GIFT_EXCHANGES. Seeded off the UTC date so every
 *  player sees the same exchanges inside the same day.
 *
 *  Uses the `crewGiftExchangeChance` config value to decide how many
 *  exchanges to draw (floor(chance * totalExchanges * 0.5), min 2). */
function pickDailyExchanges(daySeed: number): typeof CREW_GIFT_EXCHANGES {
  const pool = [...CREW_GIFT_EXCHANGES];
  const targetCount = Math.max(
    2,
    Math.min(
      pool.length,
      Math.floor(CHRISTMAS_EVENT_CONFIG.crewIntegration.crewGiftExchangeChance * pool.length * 0.5) + 2,
    ),
  );
  // Fisher–Yates style pick with a seeded LCG so the order is stable
  // within a UTC day.
  let state = daySeed >>> 0;
  const rng = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  const picks: typeof CREW_GIFT_EXCHANGES = [];
  const available = [...pool];
  while (picks.length < targetCount && available.length > 0) {
    const idx = Math.floor(rng() * available.length);
    picks.push(available.splice(idx, 1)[0]);
  }
  return picks;
}

/** Substitute [GIFTER] and [RECIPIENT] placeholders in the feed text
 *  with rotating sample crew names so the feed reads cleanly. */
function resolveExchangeText(
  exchange: (typeof CREW_GIFT_EXCHANGES)[number],
  daySeed: number,
): string {
  const seed = Math.abs(Math.imul(daySeed, 2654435761) >>> 0);
  const gifter = SAMPLE_CREW_NAMES[seed % SAMPLE_CREW_NAMES.length];
  const recipient = SAMPLE_CREW_NAMES[(seed + 3) % SAMPLE_CREW_NAMES.length];
  return exchange.feedText
    .replace("[GIFTER]", gifter)
    .replaceAll("[RECIPIENT]", recipient);
}

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

  const daySeed = useMemo(() => {
    const now = new Date();
    return Number(
      `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`,
    );
  }, []);

  const entries = useMemo(() => {
    if (!activeQuery.data?.active) return [];
    return generateDailyFeed(
      daySeed,
      SAMPLE_CREW_NAMES,
      SAMPLE_CREW_NAMES.length,
      playerName,
      new Set<string>(),
      [],
      "christmas_in_july",
    ).slice(0, limit);
  }, [activeQuery.data?.active, daySeed, playerName, limit]);

  const exchanges = useMemo(() => {
    if (!activeQuery.data?.active) return [];
    return pickDailyExchanges(daySeed);
  }, [activeQuery.data?.active, daySeed]);

  if (!activeQuery.data?.active) return null;
  if (entries.length === 0 && exchanges.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Primary crew activity feed (existing) */}
      {entries.length > 0 && (
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
      )}

      {/* Crew-to-crew gift exchanges — autonomous ticker */}
      {exchanges.length > 0 && (
        <div className="bg-gradient-to-br from-amber-950/20 to-red-950/20 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-amber-300" />
            <span className="font-display text-sm text-amber-300">Crew Gift Exchange</span>
            <span className="ml-auto text-[10px] text-amber-400/50 font-mono uppercase tracking-widest">
              {exchanges.length} today
            </span>
          </div>
          <div className="space-y-2">
            {exchanges.map((exchange, i) => (
              <motion.div
                key={exchange.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="px-3 py-2 rounded-lg border border-amber-500/20 bg-gray-900/40 font-mono text-[11px] leading-relaxed text-amber-100/90"
              >
                <div className="flex items-start gap-2">
                  <Gift className="w-3 h-3 text-amber-400/70 shrink-0 mt-0.5" />
                  <span>{resolveExchangeText(exchange, daySeed + i)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
