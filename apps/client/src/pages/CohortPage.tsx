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
import { trpc } from "@/lib/trpc";
import { NemesisHUD } from "@/components/NemesisHUD";

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

const NEMESIS_SEEDED_KEY = "dischordian:nemesis_seeded_cohorts";

function loadSeededCohorts(): Set<number> {
  try {
    const raw = localStorage.getItem(NEMESIS_SEEDED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function persistSeededCohorts(set: Set<number>) {
  try {
    localStorage.setItem(NEMESIS_SEEDED_KEY, JSON.stringify([...set]));
  } catch { /* ignore */ }
}

export default function CohortPage() {
  const { state } = useGame();
  const apprentice = state.apprentice as Apprentice | null;
  const [cohort, setCohort] = useState<Cohort | null>(() => loadCohort());
  const [reportedCohorts, setReportedCohorts] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem("dischordian:cohort_reported");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
  });
  const [seededNemesisCohorts, setSeededNemesisCohorts] = useState<Set<number>>(
    () => loadSeededCohorts(),
  );
  const recordCompletion = trpc.apprenticeTrial.recordCompletion.useMutation();
  const spawnNemesis = trpc.nemesis.spawnForCohort.useMutation();

  // Initialize cohort if apprentice is training and none exists
  useEffect(() => {
    if (!cohort && apprentice && apprentice.stage === "training") {
      const fresh = generateCohort(1, apprentice);
      setCohort(fresh);
      saveCohort(fresh);
    }
  }, [cohort, apprentice]);

  // Seed the Nemesis on cohort creation. The apprentice-recruit flow
  // doesn't exist as a discrete surface today; the cohort being
  // materialized for a training apprentice IS the recruit moment in
  // every player path. Server is idempotent on (userId, cohortNumber);
  // the localStorage set is a defensive guard against re-firing the
  // mutation on every render. We pin the apprentice's archetype at
  // spawn time so the eligibility set is stable.
  useEffect(() => {
    if (!cohort || !apprentice) return;
    if (seededNemesisCohorts.has(cohort.number)) return;
    spawnNemesis.mutate(
      {
        cohortNumber: cohort.number,
        apprenticeArchetype: apprentice.archetype,
      },
      {
        onSuccess: () => {
          const next = new Set(seededNemesisCohorts);
          next.add(cohort.number);
          setSeededNemesisCohorts(next);
          persistSeededCohorts(next);
        },
      },
    );
  }, [cohort?.number, apprentice?.archetype]);

  // Tier 7: when a cohort concludes, post the completion to the
  // server so apprentice-trial titles can grant. Idempotent client-
  // side via reportedCohorts set; server is also idempotent on
  // (userId, cohortNumber).
  useEffect(() => {
    if (!cohort || !apprentice) return;
    if (cohort.status !== "concluded") return;
    if (reportedCohorts.has(cohort.number)) return;
    const playerMember = cohort.members.find((m) => m.isPlayer);
    if (!playerMember) return;
    const graduated = !!cohort.winner?.isPlayer;
    const daySurvived = playerMember.alive ? 28 : (playerMember.dayFallen ?? 0);
    recordCompletion.mutate({
      cohortNumber: cohort.number,
      apprenticeName: playerMember.apprenticeName,
      archetype: playerMember.archetype,
      graduated,
      daySurvived,
      cohortSize: cohort.members.length,
    });
    const next = new Set(reportedCohorts);
    next.add(cohort.number);
    setReportedCohorts(next);
    try {
      localStorage.setItem("dischordian:cohort_reported", JSON.stringify([...next]));
    } catch { /* ignore */ }
  }, [cohort?.status, cohort?.number]);

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
  // Tier 7: pull aggregate apprentice trial stats so we can surface the
  // player's earned celebrant progression next to the cohort UI.
  const trialStats = trpc.apprenticeTrial.getMyStats.useQuery();
  const myTitles = trpc.titles.getMyTitles.useQuery();
  const earnedCelebrant = (myTitles.data ?? []).filter((t) => t.titleKey.startsWith("celebrant_"));

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

        {/* Tier 7: celebrant progression — apprentice trial stats + earned titles. */}
        {trialStats.data && (trialStats.data.attended > 0 || trialStats.data.graduated > 0) && (
          <div className="mb-4 p-3 rounded border void-border-subtle void-bg-canvas">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] uppercase tracking-wider void-text-accent">
                Celebrant Record
              </span>
              <span className="font-mono text-[10px] tabular-nums">
                {trialStats.data.graduated} graduated · {trialStats.data.attended} attended
              </span>
            </div>
            {earnedCelebrant.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {earnedCelebrant.map((t) => (
                  <span key={t.titleKey} className="font-mono text-[10px] px-2 py-0.5 rounded-full border void-border void-text-accent void-bg-sunk">
                    {t.definition?.name ?? t.titleKey}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nemesis HUD — surfaces the cohort-rival the chronicle
            paired against this apprentice. Reveal-gated proper name,
            rank, grudge, active plans, encounter ledger. */}
        <div className="mb-4">
          <NemesisHUD cohortNumber={cohort.number} />
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
            className="mb-4 p-4 rounded border void-border void-bg-sunk text-center"
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
