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
  ChevronRight,
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
import { deriveYearOneMonth } from "@shared/yearOneMonth";
import { deriveAct2CompletionStatus } from "@shared/act2CompletionGate";
import {
  RECRUITMENT_THRESHOLDS,
  getRecruitmentMissionCount,
} from "@shared/armyRecruitment";
import { PreludeMissionRunner } from "@/components/PreludeMissionRunner";
import type { PreludeCrewMission } from "@shared/preludeCrewMissions";
import LivingBackground from "@/components/LivingBackground";
import { PreludeTutorCard } from "@/components/prelude/PreludeTutorCard";

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
        yearOneMonth: deriveYearOneMonth({
          yearOneMonth: gameState.yearOneMonth,
          flags: gameState.narrativeFlags,
        }),
        act1CardWins: inferAct1CardWins(gameState),
        zephyrDepth: 0,
        moralityScore: gameState.moralityScore ?? 0,
      }),
    [gameState.narrativeFlags, gameState.moralityScore, gameState],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-void)] to-[var(--bg-void)] relative">
      <LivingBackground
        src="/art/rooms/room-archives.png"
        accent="var(--energy-accent)"
        opacity={0.1}
        particleCount={4}
        scanlines={false}
      />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b void-border-subtle void-bg-canvas backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/ark"
                  className="void-text-dim void-text-accent transition-colors"
                  aria-label="Back to Ark"
                >
                  <ChevronLeft size={18} />
                </Link>
                <div>
                  <h1 className="font-display text-lg font-bold tracking-wider void-text-accent flex items-center gap-2">
                    <Sparkles size={16} className="void-text-accent" />
                    THE WITNESSING
                  </h1>
                  <p className="font-mono text-[10px] void-text-dim tracking-wider">
                    {hubState.currentActTitle}
                  </p>
                </div>
              </div>
              <Link
                href="/trophy"
                className="font-mono text-[10px] uppercase tracking-wider void-text-dim void-text-accent transition-colors"
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
                        ? "void-border void-text-accent"
                        : "border-transparent void-text-dim void-text-accent"
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
              {activeTab === "journey" && (
                <JourneyPanel
                  hubState={hubState}
                  flags={gameState.narrativeFlags ?? {}}
                />
              )}
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

function JourneyPanel({
  hubState,
  flags,
}: {
  hubState: WitnessingHubState;
  flags: Record<string, unknown>;
}) {
  const { state: gameState } = useGame();
  return (
    <div className="space-y-6">
      {/* The Seer's first-time tutor intro for Witnessing */}
      <PreludeTutorCard systemId="witnessing" />

      {/* Act 1 Ladder entry — always visible, highlighted when
          the player is in Act 1 or has pending ladder progress. */}
      <Link
        href="/act1-ladder"
        className="block rounded-md border void-border void-bg-sunk p-4 void-border void-bg-sunk transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-energy">
              PLAY · DISCHORDIA LADDER
            </p>
            <h3 className="mt-0.5 font-display text-base void-text-energy">
              The Twelve Steps
            </h3>
            <p className="mt-1 font-serif text-[12px] void-text">
              Fight every canonical Act 1 opponent in order — from Little Meme to The Authority.
            </p>
          </div>
          <ChevronRight size={20} className="void-text-energy shrink-0" />
        </div>
      </Link>

      {/* Act 2 Whisper interlude — unlocks at Act 2+. Non-combat
          activation of the dual-channel protocol + the Human's
          first commentary. */}
      {gameState.narrativeAct >= 2 && (
        <Link
          href="/act2-interlude"
          className="block rounded-md border border-indigo-500/40 bg-indigo-950/20 p-4 transition-colors hover:bg-indigo-950/30"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-300/80">
                INTERLUDE · ACT 2 · THE WHISPER
              </p>
              <h3 className="mt-0.5 font-display text-base text-indigo-200">
                The Second Voice
              </h3>
              <p className="mt-1 font-serif text-[12px] void-text">
                Activate the dual-signal protocol. The Human's first commentary lands; Elara's recognition follows.
              </p>
            </div>
            <ChevronRight size={20} className="text-indigo-300/80 shrink-0" />
          </div>
        </Link>
      )}

      {/* Act 3 Substrate Gates — unlocks at Act 3+. The Human
          frames the descent; three substrate echoes guard the
          door to Kael's logs. */}
      {gameState.narrativeAct >= 3 && (
        <Link
          href="/act3-ladder"
          className="block rounded-md border border-purple-500/40 bg-purple-950/20 p-4 transition-colors hover:bg-purple-950/30"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-purple-300/80">
                PLAY · ACT 3 · SUBSTRATE GATES
              </p>
              <h3 className="mt-0.5 font-display text-base text-purple-200">
                Three Gates, One Door
              </h3>
              <p className="mt-1 font-serif text-[12px] void-text">
                Walk past the Substrate Echo, the Kael Archivist, and the Substrate Warden. Kael's logs open behind the third.
              </p>
            </div>
            <ChevronRight size={20} className="text-purple-300/80 shrink-0" />
          </div>
        </Link>
      )}

      {/* Act 4 Revelation — one match, path-resolved to A/B/C at
          runtime. Unlocks at Act 4+ but needs a Path flag set. */}
      {gameState.narrativeAct >= 4 && (
        <Link
          href="/act4-match"
          className="block rounded-md border border-cyan-500/40 bg-cyan-950/20 p-4 transition-colors hover:bg-cyan-950/30"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">
                PLAY · ACT 4 · THE REVELATION
              </p>
              <h3 className="mt-0.5 font-display text-base text-cyan-200">
                One Match, One Path
              </h3>
              <p className="mt-1 font-serif text-[12px] void-text">
                Whichever version of this conversation you built, that is the one you play. The Bridge, Learning, or Betrayed — the flags decide.
              </p>
            </div>
            <ChevronRight size={20} className="text-cyan-300/80 shrink-0" />
          </div>
        </Link>
      )}

      {/* Act 5 Map interlude — unlocks at Act 5+. Non-combat:
          Kael's master log preamble + five-sector reveal +
          star_map system tutor (Kael's archival voice). */}
      {gameState.narrativeAct >= 5 && (
        <Link
          href="/act5-interlude"
          className="block rounded-md border border-amber-500/40 bg-amber-950/15 p-4 transition-colors hover:bg-amber-950/25"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/80">
                INTERLUDE · ACT 5 · THE MAP
              </p>
              <h3 className="mt-0.5 font-display text-base text-amber-200">
                Five Sectors, Twenty Worlds
              </h3>
              <p className="mt-1 font-serif text-[12px] void-text">
                Open Kael's master log. Read the five sectors. Hear the map in his own voice.
              </p>
            </div>
            <ChevronRight size={20} className="text-amber-300/80 shrink-0" />
          </div>
        </Link>
      )}

      {/* Act 6 Confession Mirrors — two matches: The Woman She Was,
          then The Detective in the Wall. Unlocks at Act 6+. */}
      {gameState.narrativeAct >= 6 && (
        <Link
          href="/act6-ladder"
          className="block rounded-md border border-amber-500/40 bg-amber-950/20 p-4 transition-colors hover:bg-amber-950/30"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/80">
                PLAY · ACT 6 · CONFESSION MIRRORS
              </p>
              <h3 className="mt-0.5 font-display text-base text-amber-200">
                The Woman, The Man
              </h3>
              <p className="mt-1 font-serif text-[12px] void-text">
                Two confessions, two reconstructed hands. Elara plays the woman she was. The Human plays the man behind the role.
              </p>
            </div>
            <ChevronRight size={20} className="text-amber-300/80 shrink-0" />
          </div>
        </Link>
      )}

      {/* Cross-game threads browser — surfaces from Act 5 onward,
          when the first transmedia beats start landing. */}
      {gameState.narrativeAct >= 5 && (
        <Link
          href="/cross-game-threads"
          className="block rounded-md border border-stone-500/40 bg-stone-900/40 p-4 transition-colors hover:bg-stone-900/60"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-300/80">
                BROWSE · TRANSMEDIA THREADS
              </p>
              <h3 className="mt-0.5 font-display text-base text-stone-200">
                What the other games are reading
              </h3>
              <p className="mt-1 font-serif text-[12px] void-text">
                Cross-game beat status — what's fired, what's waiting on Cades FPS or Dead Man's Circuit.
              </p>
            </div>
            <ChevronRight size={20} className="text-stone-300/80 shrink-0" />
          </div>
        </Link>
      )}

      {/* Act 7 Convergence — four finale matches. Unlocks at Act 7. */}
      {gameState.narrativeAct >= 7 && (
        <Link
          href="/act7-ladder"
          className="block rounded-md border border-stone-400/40 bg-stone-800/30 p-4 transition-colors hover:bg-stone-800/50"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-300/80">
                PLAY · ACT 7 · THE CONVERGENCE
              </p>
              <h3 className="mt-0.5 font-display text-base text-stone-200">
                The Seat Awaits
              </h3>
              <p className="mt-1 font-serif text-[12px] void-text">
                The Visible War. The Watcher's Shadow. Patient Zero, reborn. And the Convergence Seat — three absences, one of you.
              </p>
            </div>
            <ChevronRight size={20} className="text-stone-300/80 shrink-0" />
          </div>
        </Link>
      )}

      {/* Vortex Incursion entry — §11.5 community endgame. */}
      <Link
        href="/vortex-incursion"
        className="block rounded-md border void-border-system void-bg-system p-4   transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-system">
              PLAY · §11.5 COMMUNITY ENDGAME
            </p>
            <h3 className="mt-0.5 font-display text-base void-text-system">
              The Vortex Incursion
            </h3>
            <p className="mt-1 font-serif text-[12px] void-text">
              Ten rooms between you and the Vortex itself. Hold the line long enough for the next Ark to take the watch.
            </p>
          </div>
          <ChevronRight size={20} className="void-text-system shrink-0" />
        </div>
      </Link>

      {/* Current act banner */}
      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-dim">
              CURRENT ACT
            </p>
            <h2 className="mt-1 font-display text-xl void-text-accent">
              {hubState.currentActTitle}
            </h2>
          </div>
          <Compass size={32} className="void-text-dim" />
        </div>
      </section>

      {/* Act 2 progression panel — renders only when the player has
          reached the Engineer's Bench era. Surfaces the four completion
          sub-flags and portals to /engineers-bench, /chess/climb, and
          /game-masters-arena. */}
      {(hubState.currentAct === "act_2" ||
        Boolean(flags.act_2_started) ||
        Boolean(flags.act_2_complete)) && <Act2Panel flags={flags} />}

      {/* Acts 4 / 4.5 / 5 / 6 / 7 progression panels — each renders once
          the player enters that act's era, using the shared
          SpineActPanel below. Panels are additive: reaching Act 5 shows
          both Act 4 (now complete) and Act 5 (in-progress). */}
      {(Boolean(flags.act_4_started) || Boolean(flags.act_4_complete)) && (
        <SpineActPanel config={SPINE_ACT_PANELS.act_4} flags={flags} />
      )}
      {(Boolean(flags.act_4_5_started) || Boolean(flags.act_4_5_complete)) && (
        <SpineActPanel config={SPINE_ACT_PANELS.act_4_5} flags={flags} />
      )}
      {(Boolean(flags.act_5_started) || Boolean(flags.act_5_complete)) && (
        <SpineActPanel
          config={SPINE_ACT_PANELS.act_5}
          flags={flags}
          recruitmentCount={getRecruitmentMissionCount({
            armyRecruitmentMissionsCompleted:
              gameState.armyRecruitmentMissionsCompleted ?? undefined,
          })}
        />
      )}
      {(Boolean(flags.act_6_started) || Boolean(flags.act_6_complete)) && (
        <SpineActPanel config={SPINE_ACT_PANELS.act_6} flags={flags} />
      )}
      {(Boolean(flags.act_7_started) || Boolean(flags.act_7_complete)) && (
        <SpineActPanel config={SPINE_ACT_PANELS.act_7} flags={flags} />
      )}

      {/* Year One calendar strip */}
      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          <Calendar size={12} />
          YEAR ONE CALENDAR
        </header>
        <div className="mb-3 rounded border-l-2 void-border void-bg-sunk p-3">
          <p className="font-mono text-[9px] uppercase tracking-wider void-text-accent">
            MONTH {hubState.calendar.current.month} · NOW
          </p>
          <h3 className="mt-1 font-display text-base void-text-accent">
            {hubState.calendar.current.title}
          </h3>
          <p className="mt-1 font-serif text-[13px] leading-snug void-text">
            {hubState.calendar.current.brief}
          </p>
        </div>
        {hubState.calendar.upcoming.length > 0 && (
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-wider void-text-dim">
              Upcoming
            </p>
            <ul className="space-y-1">
              {hubState.calendar.upcoming.slice(0, 3).map((r) => (
                <li
                  key={r.month}
                  className="flex items-baseline gap-2 font-mono text-[10px] void-text-dim"
                >
                  <span className="w-6 shrink-0 void-text-dim">
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
      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <header className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          <Flame size={12} />
          INFILTRATION PATH
        </header>
        {hubState.infiltrationPath ? (
          <div>
            <h3 className="font-display text-base void-text-accent">
              {hubState.infiltrationPath.label}
            </h3>
            <p className="mt-1 font-serif text-[13px] void-text">
              {hubState.infiltrationPath.pitch}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider void-text-dim">
              Ending: {hubState.infiltrationPath.endingLabel}
            </p>
          </div>
        ) : (
          <p className="font-serif text-[13px] void-text-dim">
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
      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
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
                    ? "void-border void-bg-sunk"
                    : "void-border-subtle void-bg-canvas"
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-wider void-text-dim">
                  {id.replace("_", " ")}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px]">
                  {onboard ? (
                    <>
                      <CheckCircle2 size={10} className="void-text-energy" />
                      <span className="void-text-energy">Aboard</span>
                    </>
                  ) : (
                    <>
                      <Lock size={10} className="void-text-dim" />
                      <span className="void-text-dim">Not yet</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {prelude.nextCrewName && (
          <p className="mt-3 font-mono text-[10px] void-text-dim">
            Next to board: <span className="void-text-accent">{prelude.nextCrewName}</span>
          </p>
        )}
      </section>

      {/* Available missions */}
      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          <PlayCircle size={12} />
          AVAILABLE MISSIONS
        </header>
        {prelude.availableMissions.length === 0 ? (
          <p className="font-serif text-[13px] void-text-dim">
            {prelude.complete
              ? "All Prelude missions complete. The Ark is yours now."
              : "No missions yet. Wake the crew first."}
          </p>
        ) : (
          <ul className="space-y-3">
            {prelude.availableMissions.map((m) => (
              <li
                key={m.id}
                className="rounded border void-border-subtle void-bg-canvas p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-display text-sm void-text-accent">
                      {m.title}
                    </h3>
                    <p className="mt-0.5 font-serif text-[12px] void-text">
                      {m.briefing}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 font-mono text-[9px] void-text-dim">
                    <Clock size={9} />
                    {m.durationMins}m
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onStartMission(m.id)}
                  className="flex items-center gap-2 rounded-sm border void-border void-bg-sunk px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider void-text-energy void-border void-bg-sunk transition-colors"
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
      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <div className="mb-3 flex items-center justify-between">
          <header className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
            <Flame size={12} />
            SIX FRAGMENTS
          </header>
          <p className="font-mono text-[10px] void-text-dim">
            {kaelFragments.unlockedCount} / {kaelFragments.totalCount} unlocked
          </p>
        </div>
        <ul className="space-y-3">
          {kaelFragments.entries.map(({ fragment, unlocked, pending }) => (
            <li
              key={fragment.id}
              className={`rounded border p-3 ${
                unlocked
                  ? "void-border-subtle void-bg-sunk"
                  : pending
                  ? "void-border-system void-bg-system"
                  : "void-border-subtle void-bg-canvas"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-wider void-text-dim">
                    FRAGMENT {fragment.id.toUpperCase()}
                  </p>
                  <h3 className="mt-0.5 font-display text-sm void-text-accent">
                    {fragment.title}
                  </h3>
                  {unlocked ? (
                    <p className="mt-1 font-serif text-[12px] void-text">
                      {fragment.whatPlayerLearns}
                    </p>
                  ) : (
                    <p className="mt-1 font-serif text-[12px] void-text-dim italic">
                      {pending
                        ? "Conditions met — awaiting unlock."
                        : fragment.unlockCondition}
                    </p>
                  )}
                </div>
                {unlocked ? (
                  <CheckCircle2 size={14} className="void-text-accent shrink-0" />
                ) : pending ? (
                  <Sparkles size={14} className="void-text-system shrink-0" />
                ) : (
                  <Lock size={14} className="void-text-dim shrink-0" />
                )}
              </div>
            </li>
          ))}
        </ul>
        {kaelFragments.questlineComplete && (
          <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-wider void-text-accent">
            THE MAN WHO CAME BACK — QUESTLINE COMPLETE
          </p>
        )}
      </section>
    </div>
  );
}

function ChroniclePanel({ hubState }: { hubState: WitnessingHubState }) {
  const { chronicleFeed, beatChronicleEntries } = hubState;
  // Interleave milestone + beat entries into one chronological
  // timeline. Milestone entries use their canonical order;
  // beat entries use their declared order field.
  const merged = useMemo(
    () =>
      [
        ...chronicleFeed.map((f) => ({
          key: `milestone_${f.milestoneId}`,
          order: f.order,
          title: f.entry.title,
          body: f.entry.body,
          kind: "milestone" as const,
        })),
        ...beatChronicleEntries.map((e) => ({
          key: `beat_${e.flag}`,
          order: e.order,
          title: e.title,
          body: e.body,
          kind: "beat" as const,
        })),
      ].sort((a, b) => a.order - b.order),
    [chronicleFeed, beatChronicleEntries],
  );
  return (
    <div className="space-y-4">
      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          <Scroll size={12} />
          THE ANTIQUARIAN'S CHRONICLE
        </header>
        {merged.length === 0 ? (
          <p className="font-serif text-[13px] void-text-dim italic">
            The Chronicle is waiting. The Antiquarian sharpens his pen. No milestones have fired yet.
          </p>
        ) : (
          <ul className="space-y-5">
            {merged.map((item, i) => (
              <li
                key={item.key}
                className={`pl-4 ${
                  item.kind === "milestone"
                    ? "border-l-2 void-border-subtle"
                    : "border-l-2 void-border-system"
                }`}
              >
                <p className="font-mono text-[9px] uppercase tracking-wider void-text-dim">
                  {item.kind === "milestone" ? "MILESTONE" : "BEAT"} · ENTRY {i + 1}
                </p>
                <h3 className="mt-0.5 font-display text-base void-text-accent">
                  {item.title}
                </h3>
                <p className="mt-2 font-serif text-[13px] leading-relaxed void-text">
                  {item.body}
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
      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          <BookOpen size={12} />
          APPENDIX SHELLS
        </header>
        <div className="grid gap-3 sm:grid-cols-3">
          {hubState.appendixSummaries.map((s) => (
            <div
              key={s.appendix}
              className="rounded border void-border-subtle void-bg-canvas p-3"
            >
              <p className="font-mono text-[9px] uppercase tracking-wider void-text-dim">
                APPENDIX {s.appendix}
              </p>
              <p className="mt-1 font-display text-xl void-text-accent">
                {s.progressPct}%
              </p>
              <div className="mt-2 h-0.5 w-full rounded void-bg-sunk overflow-hidden">
                <div
                  className="h-full void-bg-sunk"
                  style={{ width: `${s.progressPct}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-[9px] void-text-dim">
                {s.shipped} / {s.total}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <header className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          <BookOpen size={12} />
          LEGEND
        </header>
        <ul className="space-y-1 font-mono text-[10px] void-text-dim">
          <li>
            <span className="void-text-accent">A</span> — Cross-system integration
            notes (Matrix of Dreams substrate, Trade Empire agents, Four New
            Babylon Guilds, pet-crew legacy, Celebration Trial, Mechronis
            Professors, DMC identity chain, Trophy Room wall).
          </li>
          <li>
            <span className="void-text-accent">B</span> — Kael asynchronous
            questline (Six Fragments, tower memorials, Apprentice's Stand,
            three payoff cinematics).
          </li>
          <li>
            <span className="void-text-accent">C</span> — The Palimpsest game
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

/* ═══════════════════════════════════════════════════════
   ACT 2 PANEL — "The Engineer's Bench"
   Four completion-gate checkboxes (crafting / chess / thaloria /
   game_master_loss) + three CTA portals (Bench / Climb / Arena).
   Only renders when the player has entered Act 2 per the
   witnessingHub detection (narrativeAct >= 2 or act_2_started).
   ═══════════════════════════════════════════════════════ */
function Act2Panel({
  flags,
}: {
  flags: Record<string, unknown>;
}) {
  const checks: { flag: string; label: string }[] = [
    { flag: "crafting_mastered", label: "Crafted 3+ cards" },
    { flag: "chess_mastered", label: "Won 5+ chess matches" },
    { flag: "thaloria_cinematic_seen", label: "Thaloria cinematic seen" },
    { flag: "game_master_loss", label: "Lost to a Game Master" },
  ];
  const gate = deriveAct2CompletionStatus({
    narrativeAct: undefined,
    flags,
  });
  const done = gate.subFlagsMet;
  const complete = gate.alreadyComplete;
  return (
    <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          <Compass size={12} />
          ACT 2 · THE ENGINEER'S BENCH
        </div>
        <span className="font-mono text-[10px] void-text-dim">
          {complete ? "COMPLETE" : `${done}/4`}
        </span>
      </header>
      <ul className="mb-4 grid gap-1.5 sm:grid-cols-2">
        {checks.map((c) => {
          const met = Boolean(flags[c.flag]);
          return (
            <li
              key={c.flag}
              className="flex items-center gap-2 font-mono text-[10px] void-text-dim"
            >
              {met ? (
                <CheckCircle2 size={10} className="void-text-energy" />
              ) : (
                <Lock size={10} className="void-text-dim" />
              )}
              <span className={met ? "void-text-accent" : "void-text-dim"}>
                {c.label}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="grid gap-2 sm:grid-cols-3">
        <Link
          href="/engineers-bench"
          className="rounded border void-border-subtle void-bg-sunk px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider void-text-accent hover:void-bg-canvas"
        >
          Engineer's Bench
        </Link>
        <Link
          href="/chess/climb"
          className="rounded border void-border-subtle void-bg-sunk px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider void-text-accent hover:void-bg-canvas"
        >
          Chess Climb
        </Link>
        <Link
          href="/game-masters-arena"
          className="rounded border void-border-subtle void-bg-sunk px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider void-text-accent hover:void-bg-canvas"
        >
          Game Masters Arena
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SPINE ACT PANELS — Acts 4 / 4.5 / 5 / 6 / 7
   Shared panel component driven by a per-act config table.
   Each config lists the act's required flags + per-flag labels
   + CTA links + (optionally) a recruitment-count display for
   Act 5. The panel renders the same checkbox grid the Act 2
   panel uses so the Hub's visual language stays consistent
   across the whole spine.
   ═══════════════════════════════════════════════════════ */

interface SpineActFlagCheck {
  flag: string;
  label: string;
}
interface SpineActCta {
  href: string;
  label: string;
}
interface SpineActPanelConfig {
  title: string;
  completeFlag: string;
  checks: SpineActFlagCheck[];
  ctas: SpineActCta[];
  /** Optional recruitment threshold display (Act 5 only today). */
  recruitmentLabel?: string;
  recruitmentThreshold?: number;
}

const SPINE_ACT_PANELS: Record<
  "act_4" | "act_4_5" | "act_5" | "act_6" | "act_7",
  SpineActPanelConfig
> = {
  act_4: {
    title: "ACT 4 · THE REVELATION",
    completeFlag: "act_4_complete",
    checks: [
      { flag: "slideshow_act_4_revelation_intro_complete", label: "Opener seen" },
      { flag: "act1_path_A", label: "Willing path (any §3.1 commit)" },
      { flag: "act4_prisoner_cell_complete", label: "Prisoner chapter cleared" },
    ],
    ctas: [
      { href: "/act4-prisoner", label: "Prisoner Chapters" },
      { href: "/act4-match", label: "The Prisoner Match" },
      { href: "/witnessing", label: "Hub" },
    ],
  },
  act_4_5: {
    title: "ACT 4.5 · DEAD MAN'S CIRCUIT",
    completeFlag: "act_4_5_complete",
    checks: [
      { flag: "slideshow_act_4_5_intro_complete", label: "Opener seen" },
      { flag: "act_4_5_circuit_complete", label: "Circuit run completed" },
      { flag: "act_4_5_casino_complete", label: "Degen Casino completed" },
    ],
    ctas: [
      { href: "/dead-mans-circuit", label: "Dead Man's Circuit" },
      { href: "/casino", label: "The Degen Casino" },
    ],
  },
  act_5: {
    title: "ACT 5 · THE RECKONING",
    completeFlag: "act_5_complete",
    checks: [
      { flag: "slideshow_act_5_map_intro_complete", label: "Map opened" },
      { flag: "act_5_map_revealed", label: "Kael's map revealed" },
      { flag: "cades_m1_complete", label: "Cades M1 complete" },
      { flag: "cades_m7_complete", label: "Iron Lion's Last Stand" },
    ],
    ctas: [
      { href: "/act5-interlude", label: "Map / Interlude" },
      { href: "/fight", label: "Cades FPS" },
      { href: "/witnessing", label: "Hub" },
    ],
    recruitmentLabel: "Army recruits",
    recruitmentThreshold: RECRUITMENT_THRESHOLDS.act6,
  },
  act_6: {
    title: "ACT 6 · THE CONFESSION",
    completeFlag: "act_6_complete",
    checks: [
      { flag: "slideshow_act_6_confession_intro_complete", label: "Opener seen" },
      { flag: "act6_elara_confession_heard", label: "Elara's confession heard" },
      { flag: "act6_human_confession_heard", label: "Human's confession heard" },
      { flag: "act6_confession_close", label: "Stance taken" },
    ],
    ctas: [
      { href: "/act6-ladder", label: "Confession Ladder" },
      { href: "/witnessing", label: "Hub" },
    ],
  },
  act_7: {
    title: "ACT 7 · THE CONVERGENCE",
    completeFlag: "act_7_complete",
    checks: [
      { flag: "slideshow_act_7_convergence_intro_complete", label: "Opener seen" },
      { flag: "act7_visible_war_won", label: "Visible war won" },
      { flag: "act7_convergence_landing", label: "Convergence landed" },
      { flag: "act7_arc_closes", label: "Arc closes" },
    ],
    ctas: [
      { href: "/act7-ladder", label: "Convergence Ladder" },
      { href: "/witnessing", label: "Hub" },
    ],
  },
};

function SpineActPanel({
  config,
  flags,
  recruitmentCount,
}: {
  config: SpineActPanelConfig;
  flags: Record<string, unknown>;
  recruitmentCount?: number;
}) {
  const done = config.checks.filter((c) => Boolean(flags[c.flag])).length;
  const total = config.checks.length;
  const complete = Boolean(flags[config.completeFlag]);
  return (
    <section className="rounded-md border void-border-subtle void-bg-canvas p-5">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          <Compass size={12} />
          {config.title}
        </div>
        <span className="font-mono text-[10px] void-text-dim">
          {complete ? "COMPLETE" : `${done}/${total}`}
        </span>
      </header>
      <ul className="mb-4 grid gap-1.5 sm:grid-cols-2">
        {config.checks.map((c) => {
          const met = Boolean(flags[c.flag]);
          return (
            <li
              key={c.flag}
              className="flex items-center gap-2 font-mono text-[10px] void-text-dim"
            >
              {met ? (
                <CheckCircle2 size={10} className="void-text-energy" />
              ) : (
                <Lock size={10} className="void-text-dim" />
              )}
              <span className={met ? "void-text-accent" : "void-text-dim"}>
                {c.label}
              </span>
            </li>
          );
        })}
      </ul>
      {typeof recruitmentCount === "number" &&
        typeof config.recruitmentThreshold === "number" && (
          <div className="mb-4 flex items-center justify-between rounded border void-border-subtle void-bg-sunk px-3 py-2 font-mono text-[10px] void-text-dim">
            <span className="uppercase tracking-wider">
              {config.recruitmentLabel ?? "Recruitment"}
            </span>
            <span
              className={
                recruitmentCount >= config.recruitmentThreshold
                  ? "void-text-energy"
                  : "void-text-accent"
              }
            >
              {recruitmentCount} / {config.recruitmentThreshold}
            </span>
          </div>
        )}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${config.ctas.length}, minmax(0, 1fr))` }}
      >
        {config.ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            className="rounded border void-border-subtle void-bg-sunk px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider void-text-accent hover:void-bg-canvas"
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
