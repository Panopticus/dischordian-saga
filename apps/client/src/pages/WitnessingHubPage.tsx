/* ═══════════════════════════════════════════════════════
   WITNESSING HUB PAGE

   The player-facing dashboard for the entire Witnessing
   Narrative Proposal. Every shipped data shell has a panel.

   Five tabs:
     1. Journey   — Current act, infiltration path, calendar
     2. Prelude   — Crew intro progress + playable missions
     3. Kael      — Six Fragments F1-F6 with unlock progress
     4. Chronicle — Antiquarian-voice entries for fired milestones
     5. Archive   — Appendix A/B/C shell summaries + registry
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Sparkles,
  Flame,
  Scroll,
  Calendar,
  BookOpen,
  Compass,
  PlayCircle,
  Lock,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  deriveWitnessingHubState,
  type WitnessingHubState,
} from "@shared/witnessingHub";
import { PreludeMissionRunner } from "@/components/PreludeMissionRunner";
import type { PreludeCrewMission } from "@shared/preludeCrewMissions";
import LivingBackground from "@/components/LivingBackground";

type TabId = "journey" | "prelude" | "kael" | "chronicle" | "archive";

const TABS: { id: TabId; label: string; icon: typeof Sparkles }[] = [
  { id: "journey", label: "Journey", icon: Compass },
  { id: "prelude", label: "Prelude", icon: PlayCircle },
  { id: "kael", label: "Kael", icon: Flame },
  { id: "chronicle", label: "Chronicle", icon: Scroll },
  { id: "archive", label: "Archive", icon: BookOpen },
];

export default function WitnessingHubPage() {
  const { state: gameState } = useGame();
  const [activeTab, setActiveTab] = useState<TabId>("journey");
  const [activeMission, setActiveMission] = useState<
    PreludeCrewMission["id"] | null
  >(null);

  const hubState = useMemo<WitnessingHubState>(
    () =>
      deriveWitnessingHubState({
        flags: gameState.narrativeFlags ?? {},
        yearOneMonth: inferYearOneMonth(gameState.narrativeFlags ?? {}),
        act1CardWins: inferAct1CardWins(gameState),
        zephyrDepth: 0,
        moralityScore: gameState.moralityScore ?? 0,
      }),
    [gameState.narrativeFlags, gameState.moralityScore, gameState],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 to-[#0d0a05] relative">
      <LivingBackground
        src="/art/rooms/room-archives.png"
        accent="#f59e0b"
        opacity={0.1}
        particleCount={4}
        scanlines={false}
      />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-amber-900/40 bg-stone-950/60 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/ark"
                  className="text-amber-300/60 hover:text-amber-200 transition-colors"
                  aria-label="Back to Ark"
                >
                  <ChevronLeft size={18} />
                </Link>
                <div>
                  <h1 className="font-display text-lg font-bold tracking-wider text-amber-100 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    THE WITNESSING
                  </h1>
                  <p className="font-mono text-[10px] text-amber-300/60 tracking-wider">
                    {hubState.currentActTitle}
                  </p>
                </div>
              </div>
              <Link
                href="/trophy"
                className="font-mono text-[10px] uppercase tracking-wider text-amber-300/60 hover:text-amber-200 transition-colors"
              >
                Trophy Wall →
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-2">
            <nav className="flex gap-1 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-t-md border-b-2 px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                      active
                        ? "border-amber-400 text-amber-100"
                        : "border-transparent text-amber-300/50 hover:text-amber-200"
                    }`}
                  >
                    <Icon size={12} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Panels */}
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "journey" && <JourneyPanel hubState={hubState} />}
              {activeTab === "prelude" && (
                <PreludePanel
                  hubState={hubState}
                  onStartMission={(id) => setActiveMission(id)}
                />
              )}
              {activeTab === "kael" && <KaelFragmentsPanel hubState={hubState} />}
              {activeTab === "chronicle" && (
                <ChroniclePanel hubState={hubState} />
              )}
              {activeTab === "archive" && <ArchivePanel hubState={hubState} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mission runner overlay */}
      {activeMission && (
        <PreludeMissionRunner
          missionId={activeMission}
          onClose={() => setActiveMission(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PANELS
   ═══════════════════════════════════════════════════════ */

function JourneyPanel({ hubState }: { hubState: WitnessingHubState }) {
  return (
    <div className="space-y-6">
      {/* Current act banner */}
      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/60">
              CURRENT ACT
            </p>
            <h2 className="mt-1 font-display text-xl text-amber-100">
              {hubState.currentActTitle}
            </h2>
          </div>
          <Compass size={32} className="text-amber-400/60" />
        </div>
      </section>

      {/* Year One calendar strip */}
      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          <Calendar size={12} />
          YEAR ONE CALENDAR
        </header>
        <div className="mb-3 rounded border-l-2 border-amber-400 bg-amber-950/20 p-3">
          <p className="font-mono text-[9px] uppercase tracking-wider text-amber-400">
            MONTH {hubState.calendar.current.month} · NOW
          </p>
          <h3 className="mt-1 font-display text-base text-amber-100">
            {hubState.calendar.current.title}
          </h3>
          <p className="mt-1 font-serif text-[13px] leading-snug text-stone-200">
            {hubState.calendar.current.brief}
          </p>
        </div>
        {hubState.calendar.upcoming.length > 0 && (
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-amber-300/50">
              Upcoming
            </p>
            <ul className="space-y-1">
              {hubState.calendar.upcoming.slice(0, 3).map((r) => (
                <li
                  key={r.month}
                  className="flex items-baseline gap-2 font-mono text-[10px] text-amber-200/60"
                >
                  <span className="w-6 shrink-0 text-amber-300/40">
                    M{r.month}
                  </span>
                  <span className="flex-1 truncate">{r.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Infiltration path */}
      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <header className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          <Flame size={12} />
          INFILTRATION PATH
        </header>
        {hubState.infiltrationPath ? (
          <div>
            <h3 className="font-display text-base text-amber-100">
              {hubState.infiltrationPath.label}
            </h3>
            <p className="mt-1 font-serif text-[13px] text-stone-200">
              {hubState.infiltrationPath.pitch}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-amber-300/50">
              Ending: {hubState.infiltrationPath.endingLabel}
            </p>
          </div>
        ) : (
          <p className="font-serif text-[13px] text-amber-300/50">
            No path committed. The three routes await you in Act 3.
          </p>
        )}
      </section>
    </div>
  );
}

function PreludePanel({
  hubState,
  onStartMission,
}: {
  hubState: WitnessingHubState;
  onStartMission: (id: PreludeCrewMission["id"]) => void;
}) {
  const { prelude } = hubState;
  return (
    <div className="space-y-6">
      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          <PlayCircle size={12} />
          CREW
        </header>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["patch", "zephyr_9", "little_one"] as const).map((id) => {
            const onboard = prelude.crewOnboard.includes(id);
            return (
              <div
                key={id}
                className={`rounded border p-3 ${
                  onboard
                    ? "border-emerald-700/60 bg-emerald-950/20"
                    : "border-amber-900/40 bg-stone-900/40"
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-amber-300/80">
                  {id.replace("_", " ")}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px]">
                  {onboard ? (
                    <>
                      <CheckCircle2 size={10} className="text-emerald-400" />
                      <span className="text-emerald-200">Aboard</span>
                    </>
                  ) : (
                    <>
                      <Lock size={10} className="text-amber-300/40" />
                      <span className="text-amber-300/40">Not yet</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {prelude.nextCrewName && (
          <p className="mt-3 font-mono text-[10px] text-amber-300/60">
            Next to board: <span className="text-amber-100">{prelude.nextCrewName}</span>
          </p>
        )}
      </section>

      {/* Available missions */}
      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          <PlayCircle size={12} />
          AVAILABLE MISSIONS
        </header>
        {prelude.availableMissions.length === 0 ? (
          <p className="font-serif text-[13px] text-amber-300/50">
            {prelude.complete
              ? "All Prelude missions complete. The Ark is yours now."
              : "No missions yet. Wake the crew first."}
          </p>
        ) : (
          <ul className="space-y-3">
            {prelude.availableMissions.map((m) => (
              <li
                key={m.id}
                className="rounded border border-amber-900/40 bg-stone-900/40 p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-display text-sm text-amber-100">
                      {m.title}
                    </h3>
                    <p className="mt-0.5 font-serif text-[12px] text-stone-300">
                      {m.briefing}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 font-mono text-[9px] text-amber-300/50">
                    <Clock size={9} />
                    {m.durationMins}m
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onStartMission(m.id)}
                  className="flex items-center gap-2 rounded-sm border border-emerald-700/60 bg-emerald-900/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-100 hover:border-emerald-500/80 hover:bg-emerald-900/40 transition-colors"
                >
                  <PlayCircle size={11} />
                  Begin Mission
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function KaelFragmentsPanel({
  hubState,
}: {
  hubState: WitnessingHubState;
}) {
  const { kaelFragments } = hubState;
  return (
    <div className="space-y-4">
      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <div className="mb-3 flex items-center justify-between">
          <header className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
            <Flame size={12} />
            SIX FRAGMENTS
          </header>
          <p className="font-mono text-[10px] text-amber-300/60">
            {kaelFragments.unlockedCount} / {kaelFragments.totalCount} unlocked
          </p>
        </div>
        <ul className="space-y-3">
          {kaelFragments.entries.map(({ fragment, unlocked, pending }) => (
            <li
              key={fragment.id}
              className={`rounded border p-3 ${
                unlocked
                  ? "border-amber-500/70 bg-amber-950/30"
                  : pending
                  ? "border-violet-500/60 bg-violet-950/20"
                  : "border-amber-900/30 bg-stone-900/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-amber-300/60">
                    FRAGMENT {fragment.id.toUpperCase()}
                  </p>
                  <h3 className="mt-0.5 font-display text-sm text-amber-100">
                    {fragment.title}
                  </h3>
                  {unlocked ? (
                    <p className="mt-1 font-serif text-[12px] text-stone-200">
                      {fragment.whatPlayerLearns}
                    </p>
                  ) : (
                    <p className="mt-1 font-serif text-[12px] text-amber-300/40 italic">
                      {pending
                        ? "Conditions met — awaiting unlock."
                        : fragment.unlockCondition}
                    </p>
                  )}
                </div>
                {unlocked ? (
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                ) : pending ? (
                  <Sparkles size={14} className="text-violet-400 shrink-0" />
                ) : (
                  <Lock size={14} className="text-amber-300/30 shrink-0" />
                )}
              </div>
            </li>
          ))}
        </ul>
        {kaelFragments.questlineComplete && (
          <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-wider text-amber-200">
            THE MAN WHO CAME BACK — QUESTLINE COMPLETE
          </p>
        )}
      </section>
    </div>
  );
}

function ChroniclePanel({ hubState }: { hubState: WitnessingHubState }) {
  const { chronicleFeed } = hubState;
  return (
    <div className="space-y-4">
      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          <Scroll size={12} />
          THE ANTIQUARIAN'S CHRONICLE
        </header>
        {chronicleFeed.length === 0 ? (
          <p className="font-serif text-[13px] text-amber-300/50 italic">
            The Chronicle is waiting. The Antiquarian sharpens his pen. No milestones have fired yet.
          </p>
        ) : (
          <ul className="space-y-5">
            {chronicleFeed.map((item) => (
              <li
                key={item.milestoneId}
                className="border-l-2 border-amber-600/50 pl-4"
              >
                <p className="font-mono text-[9px] uppercase tracking-wider text-amber-300/60">
                  ENTRY {item.order + 1}
                </p>
                <h3 className="mt-0.5 font-display text-base text-amber-100">
                  {item.entry.title}
                </h3>
                <p className="mt-2 font-serif text-[13px] leading-relaxed text-stone-200">
                  {item.entry.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ArchivePanel({ hubState }: { hubState: WitnessingHubState }) {
  return (
    <div className="space-y-4">
      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          <BookOpen size={12} />
          APPENDIX SHELLS
        </header>
        <div className="grid gap-3 sm:grid-cols-3">
          {hubState.appendixSummaries.map((s) => (
            <div
              key={s.appendix}
              className="rounded border border-amber-900/40 bg-stone-900/40 p-3"
            >
              <p className="font-mono text-[9px] uppercase tracking-wider text-amber-300/60">
                APPENDIX {s.appendix}
              </p>
              <p className="mt-1 font-display text-xl text-amber-100">
                {s.progressPct}%
              </p>
              <div className="mt-2 h-0.5 w-full rounded bg-amber-900/30 overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${s.progressPct}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-[9px] text-amber-300/50">
                {s.shipped} / {s.total}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <header className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          <BookOpen size={12} />
          LEGEND
        </header>
        <ul className="space-y-1 font-mono text-[10px] text-amber-300/70">
          <li>
            <span className="text-amber-400">A</span> — Cross-system integration
            notes (Matrix of Dreams substrate, Trade Empire agents, Four New
            Babylon Guilds, pet-crew legacy, Celebration Trial, Mechronis
            Professors, DMC identity chain, Trophy Room wall).
          </li>
          <li>
            <span className="text-amber-400">B</span> — Kael asynchronous
            questline (Six Fragments, tower memorials, Apprentice's Stand,
            three payoff cinematics).
          </li>
          <li>
            <span className="text-amber-400">C</span> — The Palimpsest game
            show (Signal/Noise meter, Darren Fessler, General Alaric, The
            Inventor, 13 episode formats, Host-is-Meme reveal).
          </li>
        </ul>
      </section>
    </div>
  );
}

/* ─── INFERENCE HELPERS ─── */

/**
 * Infer the current Year One month from narrative flags. Each
 * month opens a canonical flag (year_one_month_N_opened); we
 * pick the highest one that's set.
 */
function inferYearOneMonth(flags: Record<string, boolean>): number {
  for (let m = 12; m >= 1; m--) {
    if (flags[`year_one_month_${m}_opened`]) return m;
  }
  return 1;
}

/**
 * Infer the player's Act 1 card wins from game state. The
 * real counter lives elsewhere; the hub is a dashboard, so
 * we tolerate zero if we can't read it.
 */
function inferAct1CardWins(gameState: unknown): number {
  // Tolerant read — GameState doesn't expose a dedicated
  // act1CardWins counter, so we fall back to zero. Future
  // gameplay wiring can plumb this through.
  const maybe = gameState as { act1CardWins?: number };
  return maybe?.act1CardWins ?? 0;
}
