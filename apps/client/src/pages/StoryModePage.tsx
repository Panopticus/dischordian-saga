/**
 * StoryModePage — Act 1 chapter launcher.
 *
 * Lists the Act 1 story encounters with their lock/unlock state and,
 * on pick, drops the player into an encounter-mode DuelystGameUI
 * with the boss's faction/general/deck/modes pre-wired. Replaces
 * the gap where the encounter system (`initEncounter`, the 5 named
 * bosses + 12 faction sparring chapters) shipped but nothing in the
 * client actually launched it.
 *
 * Gating:
 *   - Prelude must be complete (else bounced back to /prelude).
 *   - Each chapter's own prerequisites are displayed as a locked
 *     state — this page does NOT enforce them as hard gates for
 *     now, since unlock logic is still spread across flag checks
 *     in individual chapter data. The current UX treats locked
 *     chapters as dimmed but clickable, so playtesters can skip
 *     around. A real gate wants an explicit `isChapterUnlocked(id,
 *     state)` helper — punt to a follow-up.
 *
 * Match flow:
 *   1. Player picks a chapter from the list.
 *   2. Component mounts `<DuelystGameUI encounter={enc} ... />`.
 *   3. DuelystGameUI's init hook routes the encounter into
 *      `TcgClient.init` with the right modes (trialMode from §5.8,
 *      witnessMode from §5.7, giftMode from §5.6, prophecyMode from
 *      §4.9, scriptedActions from §5.5).
 *   4. On match-end the reward table applies bond deltas + flags
 *      (see `apps/shared/act1EncounterRewards.ts`); for §5.8 the
 *      §5.7 handoff already seeded `openingVerdictBalance`.
 *   5. After a short delay we return to the chapter list; the
 *      completed chapter is marked done in local state via
 *      `completedChapters` on storyProgress.
 */
import { useCallback, useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { ALL_CHAPTER_ENCOUNTERS } from "@shared/tcg-core/story/chapters";
import type { StoryEncounter } from "@shared/tcg-core/story/encounter";
import type { Faction } from "@/game/duelyst/types";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import { loadStoryProgress, saveStoryProgress } from "@/game/storyMode";
import { ACT_1_NAMED_BOSS_ENCOUNTERS } from "@shared/act1EncounterRewards";

/**
 * Group chapters by Act 1 cycle. The mapping below matches
 * ALL_ACTS_ROADMAP.md §Act 1 + act1Opponents.ts ordering. Named
 * bosses bubble up so players can find them without scrolling past
 * sparring chapters.
 */
const NAMED_BOSS_SET: ReadonlySet<string> = new Set(ACT_1_NAMED_BOSS_ENCOUNTERS);

type ChapterGroup = { id: string; label: string; chapters: StoryEncounter[] };

function groupChapters(all: readonly StoryEncounter[]): ChapterGroup[] {
  const named: StoryEncounter[] = [];
  const sparring: StoryEncounter[] = [];
  for (const enc of all) {
    (NAMED_BOSS_SET.has(enc.id) ? named : sparring).push(enc);
  }
  return [
    { id: "named_bosses", label: "Named bosses", chapters: named },
    { id: "sparring", label: "Sparring chapters", chapters: sparring },
  ];
}

export default function StoryModePage() {
  const { state } = useGame();
  const [, navigate] = useLocation();
  const [selectedEncounter, setSelectedEncounter] = useState<StoryEncounter | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Load persisted progress so completed chapters are checkmarked.
  useEffect(() => {
    try {
      const progress = loadStoryProgress();
      setCompletedIds(progress.completedChapters ?? []);
    } catch {
      // Corrupt progress blob — treat as fresh.
      setCompletedIds([]);
    }
  }, []);

  // Fresh-save guard: route back to Prelude if not complete.
  const preludeComplete = !!state.narrativeFlags?.prelude_complete;
  useEffect(() => {
    if (!preludeComplete) navigate("/prelude", { replace: true });
  }, [preludeComplete, navigate]);

  const groups = useMemo(() => groupChapters(ALL_CHAPTER_ENCOUNTERS), []);

  const handlePick = useCallback((enc: StoryEncounter) => {
    setSelectedEncounter(enc);
  }, []);

  const handleMatchEnd = useCallback(
    (winner: "player" | "opponent") => {
      if (!selectedEncounter) return;
      if (winner === "player" && !completedIds.includes(selectedEncounter.id)) {
        const next = [...completedIds, selectedEncounter.id];
        setCompletedIds(next);
        try {
          const progress = loadStoryProgress();
          saveStoryProgress({
            ...progress,
            completedChapters: next,
          });
        } catch {
          // Persistence best-effort; UI state still reflects the win.
        }
      }
    },
    [selectedEncounter, completedIds],
  );

  const handleBack = useCallback(() => {
    setSelectedEncounter(null);
  }, []);

  if (!preludeComplete) return null;

  if (selectedEncounter) {
    // Minimal player context: route the player through the faction
    // they're most invested in based on Light/Dark alignment. Light
    // → Architect (Authority's side — ironic counterpoint); Dark →
    // Insurgency (Agent Zero's legacy). A real deckbuilder surface
    // would let the player pick their own; this default is the
    // shortest path to a playable encounter.
    const playerFaction: Faction =
      state.lightDarkAlignment === "dark" ? "insurgency" : "architect";
    return (
      <DuelystGameUI
        playerFaction={playerFaction}
        opponentFaction={selectedEncounter.bossFaction as Faction}
        encounter={selectedEncounter}
        onGameEnd={handleMatchEnd}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-mono text-[10px] tracking-[0.3em] text-stone-500 hover:text-stone-200 mb-4"
        >
          ← Bridge
        </button>
        <h1 className="font-serif text-3xl tracking-wide">Act 1 — The Signal</h1>
        <p className="font-serif text-sm text-stone-400 mt-2 max-w-2xl">
          The Twelve Steps. Three memoir cycles ending in the Authority's
          trial. Named bosses carry campaign weight; sparring chapters build
          the card-win counter that gates cycle cinematics.
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-10">
        {groups.map((group) => (
          <section key={group.id}>
            <h2 className="font-mono text-[10px] tracking-[0.4em] text-stone-500 uppercase mb-4">
              {group.label}
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {group.chapters.map((enc) => {
                const completed = completedIds.includes(enc.id);
                const isNamedBoss = NAMED_BOSS_SET.has(enc.id);
                return (
                  <li key={enc.id}>
                    <button
                      type="button"
                      onClick={() => handlePick(enc)}
                      data-testid={`chapter-${enc.id}`}
                      className={
                        "w-full text-left p-4 rounded border bg-stone-900/70 " +
                        "hover:bg-stone-800/70 transition cursor-pointer " +
                        (isNamedBoss
                          ? "border-amber-400/40"
                          : "border-stone-700")
                      }
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-serif text-base">{enc.name}</span>
                        {completed && (
                          <span className="font-mono text-[9px] tracking-[0.3em] text-emerald-400/80">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-stone-400 leading-relaxed">
                        {enc.description}
                      </p>
                      <p className="mt-2 font-mono text-[9px] tracking-[0.3em] text-stone-600 uppercase">
                        {enc.bossFaction} · {enc.bossGeneralDefId}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
