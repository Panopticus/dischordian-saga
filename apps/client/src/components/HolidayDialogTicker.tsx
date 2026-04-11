/* ═══════════════════════════════════════════════════════
   HOLIDAY DIALOG TICKER — Rotates NPC holiday flavor lines
   from the Christmas in July data pack while the event
   window is active. Consumed by NPCInboxPage and
   CompanionHubPage so non-casino surfaces also feel the
   seasonal shift.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift } from "lucide-react";
import { NPC_HOLIDAY_DIALOG } from "@/data/events/christmasInJuly/npcHolidayDialog";
import { CHRISTMAS_EVENT_CONFIG } from "@/data/events/christmasInJuly/eventConfig";

export function isChristmasInJulyActive(now = Date.now()): boolean {
  const start = new Date(CHRISTMAS_EVENT_CONFIG.startDate).getTime();
  const end = new Date(CHRISTMAS_EVENT_CONFIG.endDate).getTime();
  return now >= start && now <= end;
}

interface HolidayTickerProps {
  /** Optional — restrict the lines to a single NPC. */
  npcId?: keyof typeof NPC_HOLIDAY_DIALOG;
  className?: string;
}

export function HolidayDialogTicker({ npcId, className }: HolidayTickerProps) {
  const active = isChristmasInJulyActive();
  const lines = useMemo(() => {
    if (!active) return [];
    const npcs = npcId ? [npcId] : (Object.keys(NPC_HOLIDAY_DIALOG) as (keyof typeof NPC_HOLIDAY_DIALOG)[]);
    return npcs.map((id) => ({ id, line: NPC_HOLIDAY_DIALOG[id].welcome }));
  }, [active, npcId]);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (lines.length <= 1) return;
    const timer = setInterval(() => setIdx((n) => (n + 1) % lines.length), 12_000);
    return () => clearInterval(timer);
  }, [lines.length]);

  if (!active || lines.length === 0) return null;
  const current = lines[idx];
  return (
    <div className={`rounded-xl border border-amber-500/30 bg-gradient-to-r from-red-950/30 via-amber-950/20 to-green-950/30 p-3 ${className ?? ""}`}>
      <div className="flex items-center gap-2 mb-1">
        <Gift className="w-3 h-3 text-amber-300" />
        <span className="font-display text-[10px] uppercase tracking-widest text-amber-300">
          Christmas in July — {String(current.id).replace(/_/g, " ")}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={String(current.id) + idx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[11px] text-amber-200/80 leading-relaxed italic"
        >
          "{current.line}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
