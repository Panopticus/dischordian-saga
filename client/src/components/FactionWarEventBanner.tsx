/* ═══════════════════════════════════════════════════════
   FACTION WAR EVENT BANNER
   Shows the current active event on the War Map page
   with countdown timer, special rules, and rewards.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock, Trophy, ChevronDown, ChevronUp, Shield, Swords, Star } from "lucide-react";
import { getCurrentEvent, getEventTimeRemaining, type FactionWarEvent } from "@/data/factionWarEvents";

export default function FactionWarEventBanner() {
  const [event, setEvent] = useState<FactionWarEvent | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number } | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setEvent(getCurrentEvent());
    setTimeRemaining(getEventTimeRemaining());
    const interval = setInterval(() => {
      setEvent(getCurrentEvent());
      setTimeRemaining(getEventTimeRemaining());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!event || !timeRemaining) return null;

  const sideIcon = event.favoredSide === "machine" ? Shield : event.favoredSide === "humanity" ? Swords : Star;
  const SideIcon = sideIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg overflow-hidden mb-4"
      style={{
        background: `linear-gradient(135deg, ${event.color}15, ${event.color}05)`,
        border: `1px solid ${event.color}40`,
        boxShadow: `0 0 20px ${event.color}10`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${event.color}20`, border: `1px solid ${event.color}50` }}
        >
          <Zap size={14} style={{ color: event.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-bold tracking-[0.15em]" style={{ color: event.color }}>
              ACTIVE EVENT
            </span>
            <span className="font-mono text-[9px] text-muted-foreground/50">
              {event.favoredSide !== "neutral" && (
                <span className="flex items-center gap-1">
                  <SideIcon size={10} />
                  {event.favoredSide.toUpperCase()} FAVORED
                </span>
              )}
            </span>
          </div>
          <p className="font-display text-sm font-bold text-foreground truncate">{event.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/50">
            <Clock size={10} className="text-muted-foreground/60" />
            <span className="font-mono text-[10px] text-muted-foreground">
              {timeRemaining.hours}h {timeRemaining.minutes}m
            </span>
          </div>
          {expanded ? <ChevronUp size={14} className="text-muted-foreground/50" /> : <ChevronDown size={14} className="text-muted-foreground/50" />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Description */}
              <p className="font-mono text-xs text-muted-foreground/80 leading-relaxed">
                {event.description}
              </p>

              {/* Lore text */}
              <div className="rounded-md p-3 bg-background/30 border border-border/20">
                <p className="font-mono text-[10px] text-muted-foreground/60 italic leading-relaxed">
                  "{event.loreText}"
                </p>
              </div>

              {/* Special rules */}
              <div>
                <p className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] mb-1.5">SPECIAL RULES</p>
                <div className="space-y-1">
                  {event.specialRules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Zap size={10} className="shrink-0 mt-0.5" style={{ color: event.color }} />
                      <span className="font-mono text-[10px] text-foreground/80">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md p-2.5 bg-background/30 border border-border/20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Trophy size={10} style={{ color: event.color }} />
                    <span className="font-mono text-[9px] tracking-[0.15em]" style={{ color: event.color }}>WINNER</span>
                  </div>
                  <p className="font-mono text-[10px] text-foreground/80">
                    {event.winnerRewards.dreamTokens} DT, {event.winnerRewards.xp} XP
                  </p>
                  {event.winnerRewards.title && (
                    <p className="font-mono text-[9px] text-muted-foreground/60 mt-0.5">
                      Title: "{event.winnerRewards.title}"
                    </p>
                  )}
                  {event.winnerRewards.cardBonus && (
                    <p className="font-mono text-[9px] text-muted-foreground/60 mt-0.5">
                      + {event.winnerRewards.cardBonus}
                    </p>
                  )}
                </div>
                <div className="rounded-md p-2.5 bg-background/30 border border-border/20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Shield size={10} className="text-muted-foreground/50" />
                    <span className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.15em]">CONSOLATION</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground/70">
                    {event.loserRewards.dreamTokens} DT, {event.loserRewards.xp} XP
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
