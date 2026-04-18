/* ═══════════════════════════════════════════════════════
   HOUSE CUP — Mechronis Academy Weekly Standings

   All 12 Guilds compete. AI bots fill every Guild so it
   always looks populated. Rubber-banding keeps trailing
   Guilds competitive. Leader fatigue punishes dynasties.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Trophy, TrendingUp, Zap } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  initHouseCompetitionState,
  tickBots,
  maybeWeeklyReset,
  getRankings,
  type HouseCompetitionState,
} from "@shared/houseCompetition";
import { getDominantGuild } from "@/game/archonTrainingVoices";
import type { SkillId } from "@/game/innerVoices";

const STORAGE_KEY = "dischordian:house_competition";

function loadState(): HouseCompetitionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return initHouseCompetitionState();
}

function saveState(state: HouseCompetitionState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export default function HouseCupPage() {
  const { state } = useGame();
  const [houseState, setHouseState] = useState<HouseCompetitionState>(() => loadState());

  const skills = (state.innerVoiceSkills ?? {}) as Record<SkillId, number>;
  const dominantGuild = useMemo(() => getDominantGuild(skills), [skills]);

  // Tick bots + reset check every 30s while page is open
  useEffect(() => {
    const tick = () => {
      setHouseState(prev => {
        let next = maybeWeeklyReset(prev);
        next = tickBots(next);
        saveState(next);
        return next;
      });
    };
    tick(); // Initial tick
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, []);

  const rankings = getRankings(houseState);
  const daysUntilReset = Math.max(0, Math.ceil((houseState.nextResetAt - Date.now()) / (1000 * 60 * 60 * 24)));
  const hoursUntilReset = Math.max(0, Math.ceil((houseState.nextResetAt - Date.now()) / (1000 * 60 * 60))) % 24;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Trophy size={18} className="void-text-accent" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">HOUSE CUP</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              Week {houseState.currentWeek} · resets in {daysUntilReset}d {hoursUntilReset}h
            </p>
          </div>
        </div>

        {/* Player's guild standing banner */}
        {dominantGuild && (
          <div className="mb-4 p-3 rounded border void-border void-bg-sunk">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider void-text-accent">
                Your House: {dominantGuild.guild.name}
              </span>
              <span className="font-display text-sm font-bold text-foreground">
                #{rankings.findIndex(r => r.guildName === dominantGuild.guild.name) + 1}
              </span>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-1.5">
          {rankings.map((r, i) => {
            const isPlayer = dominantGuild?.guild.name === r.guildName;
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
            return (
              <motion.div
                key={r.guildName}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 p-2.5 rounded border transition-colors ${
                  isPlayer
                    ? "void-border void-bg-sunk"
                    : "border-border/30 bg-card/30"
                }`}
              >
                <span className="font-display text-sm font-bold text-foreground/50 w-6 text-center tabular-nums">
                  {medal ?? r.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-foreground truncate">
                      {r.guildName}
                    </span>
                    {r.leadStreak > 0 && (
                      <span className="font-mono text-[8px] void-text-premium" title="Lead streak in weeks">
                        🔥 {r.leadStreak}w
                      </span>
                    )}
                    {isPlayer && (
                      <span className="font-mono text-[8px] uppercase tracking-wider px-1 rounded void-bg-sunk void-text-accent">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/60">
                    {r.botCount} members · {r.playerCount} active
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-display text-base font-bold tabular-nums text-foreground">
                    {r.score.toLocaleString()}
                  </div>
                  <span className="font-mono text-[8px] text-muted-foreground/50">pts</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* System info */}
        <div className="mt-6 p-3 rounded border border-border/30 bg-background/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={12} className="void-text-energy" />
            <span className="font-mono text-[9px] uppercase tracking-wider void-text-energy">
              How It Works
            </span>
          </div>
          <ul className="space-y-1 font-mono text-[9px] text-muted-foreground/70 leading-relaxed">
            <li>▸ Every Guild has bot members who contribute points every few minutes</li>
            <li>▸ Trailing Guilds earn up to 2× points (rubber-banding)</li>
            <li>▸ Leaders fatigue: the longer you lead, the slower you score (<span className="void-text-premium">-5% per streak week</span>)</li>
            <li>▸ Weekly reset crowns a winner and restarts scores with a small random offset</li>
            <li>▸ You contribute points by completing quests, fights, and lore unlocks while in your Guild</li>
          </ul>
        </div>

        {/* Winner history */}
        {houseState.winnerHistory.length > 0 && (
          <div className="mt-4 p-3 rounded border border-border/30 bg-background/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={12} className="void-text-accent" />
              <span className="font-mono text-[9px] uppercase tracking-wider void-text-accent">
                Past Champions
              </span>
            </div>
            <div className="space-y-0.5">
              {houseState.winnerHistory.slice(-5).reverse().map(w => (
                <div key={w.week} className="flex items-center justify-between font-mono text-[9px]">
                  <span className="text-muted-foreground/70">Week {w.week}</span>
                  <span className="text-foreground/80">{w.guildName}</span>
                  <span className="void-text-accent tabular-nums">{w.finalScore.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
