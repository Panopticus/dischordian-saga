/* ═══════════════════════════════════════════════════════
   COHORT PAGE

   The Celebration class your Apprentice is enrolled in.
   Shows leaderboard of 12-40 candidates (player + synthetic
   opponents). Daily eliminations. Only ONE graduates per
   user spec.

   "Only one graduate per class." — Celebration tradition.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Users, Skull, Trophy, Heart } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  generateCohort,
  advanceCohortDay,
  getCohortLeaderboard,
  getPlayerStanding,
  type Cohort,
} from "@shared/pvpCohorts";
import { getRarityTier, type Apprentice } from "@shared/apprentices";

const STORAGE_KEY = "dischordian:cohort";

function loadCohort(): Cohort | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveCohort(c: Cohort | null) {
  try {
    if (c) localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

export default function CohortPage() {
  const { state } = useGame();
  const apprentice = state.apprentice as Apprentice | null;
  const [cohort, setCohort] = useState<Cohort | null>(() => loadCohort());

  // Initialize cohort if apprentice is training and none exists
  useEffect(() => {
    if (!cohort && apprentice && apprentice.stage === "training") {
      const fresh = generateCohort(1, apprentice);
      setCohort(fresh);
      saveCohort(fresh);
    }
  }, [cohort, apprentice]);

  // Sync cohort's currentDay with apprentice's trialDay
  useEffect(() => {
    if (!cohort || !apprentice) return;
    if (cohort.currentDay < apprentice.trialDay && cohort.status === "active") {
      // Advance cohort days to catch up with player's trial progression
      let updated = cohort;
      while (updated.currentDay < apprentice.trialDay && updated.status === "active") {
        updated = advanceCohortDay(updated);
      }
      setCohort(updated);
      saveCohort(updated);
    }
  }, [apprentice?.trialDay, cohort]);

  if (!cohort) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Users size={40} className="mx-auto text-muted-foreground/40 mb-3" />
          <h2 className="font-display text-lg font-bold tracking-wider mb-2">No Active Cohort</h2>
          <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed">
            Send your Apprentice to Celebration to enroll them in a cohort. Only one graduate per class.
          </p>
          <Link
            href="/apprentice"
            className="mt-4 inline-block px-3 py-2 rounded border void-border void-bg-sunk void-text-accent font-mono text-[10px] uppercase tracking-wider void-bg-sunk"
          >
            Go to Apprentice
          </Link>
        </div>
      </div>
    );
  }

  const leaderboard = getCohortLeaderboard(cohort);
  const standing = getPlayerStanding(cohort);
  const aliveCount = cohort.members.filter(m => m.alive).length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/apprentice" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Users size={18} className="void-text-system" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">COHORT #{cohort.number}</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              Celebration Class · Day {cohort.currentDay}/28 · {aliveCount} alive of {cohort.members.length}
            </p>
          </div>
        </div>

        {/* Player standing */}
        {standing && (
          <div className={`mb-4 p-3 rounded border ${standing.alive ? "void-border void-bg-sunk" : "void-border-error void-bg-error"}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider">
                {standing.alive ? (
                  <span className="void-text-accent">Your Rank</span>
                ) : (
                  <span className="void-text-error">Fallen</span>
                )}
              </span>
              <span className="font-display text-base font-bold text-foreground tabular-nums">
                #{standing.rank}
              </span>
            </div>
          </div>
        )}

        {/* Winner if concluded */}
        {cohort.status === "concluded" && cohort.winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 rounded border void-border bg-gradient-to-br from-amber-500/15 to-orange-500/5 text-center"
          >
            <Trophy size={28} className="mx-auto void-text-accent mb-2" />
            <h2 className="font-display text-lg font-bold tracking-wider text-foreground">GRADUATED</h2>
            <p className="font-mono text-[10px] void-text-accent mt-1">
              {cohort.winner.apprenticeName} {cohort.winner.isPlayer ? "(YOU)" : ""}
            </p>
            <p className="font-mono text-[9px] italic text-muted-foreground/70 mt-1">
              {cohort.winner.isPlayer ? "You survived Celebration. Welcome to the crew." : "Better luck next cohort."}
            </p>
          </motion.div>
        )}

        {/* Leaderboard */}
        <div className="space-y-1.5">
          {leaderboard.map((m, i) => {
            const tier = getRarityTier(m.rarity as any);
            return (
              <div
                key={m.apprenticeId}
                className={`flex items-center gap-2 p-2 rounded border transition-all ${
                  m.isPlayer
                    ? "void-border void-bg-sunk"
                    : m.alive
                    ? "border-border/30 bg-card/30"
                    : "void-border-error void-bg-error opacity-50"
                }`}
                data-testid={`cohort-member-${m.apprenticeId}`}
              >
                <span className="font-mono text-[10px] font-bold text-muted-foreground/50 w-6 text-center tabular-nums">
                  {m.alive ? `#${i + 1}` : "—"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {m.alive ? (
                      <Heart size={10} className="void-text-energy shrink-0" />
                    ) : (
                      <Skull size={10} className="void-text-error shrink-0" />
                    )}
                    <span className="font-display text-xs font-bold text-foreground/90 truncate">
                      {m.apprenticeName}
                    </span>
                    <span
                      className="font-mono text-[8px] uppercase tracking-wider px-1 rounded"
                      style={{ color: tier.color, backgroundColor: `${tier.color}15` }}
                    >
                      {tier.name}
                    </span>
                    {m.isPlayer && (
                      <span className="font-mono text-[8px] uppercase tracking-wider px-1 rounded void-bg-sunk void-text-accent">
                        YOU
                      </span>
                    )}
                  </div>
                  {!m.alive && m.causeOfDeath && (
                    <p className="font-mono text-[9px] italic void-text-error mt-0.5 truncate">
                      Day {m.dayFallen}: {m.causeOfDeath}
                    </p>
                  )}
                </div>
                <span className="font-mono text-[9px] text-muted-foreground/50 tabular-nums">
                  R{Math.round(m.riskScore)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Info panel */}
        <div className="mt-4 p-3 rounded border border-border/30 bg-background/30">
          <p className="font-mono text-[9px] italic text-muted-foreground/70 leading-relaxed">
            ▸ Only ONE candidate graduates per cohort. The Mascoteers eliminate others daily.
            Risk scores (R) determine elimination probability — lower is better.
            Your Apprentice's rarity, stats, and whether they're evil all affect risk.
          </p>
        </div>
      </div>
    </div>
  );
}
