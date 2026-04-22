/* ═══════════════════════════════════════════════════════
   ACT 4 PRISONER STORY PAGE — §9 Collector's Arena story mode

   The four Prisoner chapters (ACT_4_PRISONER_CHAPTERS in
   apps/shared/actsFourFiveShells.ts) reframe existing
   Collector's Arena bosses as Kael memory extractions. Per
   canon §9 the canonical beats are:

     ch2 / jailer       → "The Cell"
     ch8 / human        → "The Extraction"
     ch7 / warlord      → "The Warlord Rematch"
     ch6 / white-oracle → "The White Oracle Meets"

   The Act 4 completion gate I shipped in PR #139 requires at
   least ONE `act4_prisoner_*_complete` flag. Nothing currently
   writes those flags, so the gate couldn't fire without dev
   tooling. This page closes that loop.

   Format: narrative stance selection, not full combat. Each
   chapter opens on its canonical `openingLine` with 2-3 stance
   choices sourced from the chapter's thematic content. Picking
   any stance resolves the chapter — the ending tone differs,
   but all three paths advance the act (the canon tells the
   player the fight WAS the extraction; the choice is how you
   lay it down). That matches the canonical ch6 line directly:
   "Lay down the fight. The fight was the extraction."

   Progress is dual-tracked:
     - Local: storyProgress.completedChapters (for parity with
       existing Act 1 story-mode UX)
     - Server: setNarrativeFlag(chapter.completedFlag, true)
       (so the Act 4 gate can actually fire)

   Route: /act4-prisoner (added to App.tsx).
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, Ghost, Lock } from "lucide-react";
import { toast } from "sonner";
import { useGame } from "@/contexts/GameContext";
import {
  ACT_4_PRISONER_CHAPTERS,
  type Act4PrisonerChapter,
} from "@shared/actsFourFiveShells";
import {
  DEFAULT_STORY_PROGRESS,
  loadStoryProgress,
  saveStoryProgress,
} from "@/game/storyMode";
import LivingBackground from "@/components/LivingBackground";

type StanceId = "fight" | "listen" | "lay_down";

interface Stance {
  id: StanceId;
  label: string;
  outcome: string;
}

/**
 * Per-chapter stance options. Each ends the chapter (all three
 * satisfy the gate) but with different tonal resolution. The
 * `fight` stance is always present; `listen` and `lay_down` are
 * chapter-specific, pulled from the canonical narrative beats.
 */
const CHAPTER_STANCES: Record<Act4PrisonerChapter["id"], readonly Stance[]> = {
  the_cell: [
    {
      id: "fight",
      label: "Fight the guard.",
      outcome:
        "The guard falls. So does the cover story. Behind the cell door Kael is a child in a cloud-garden, reading the name of a sister he cannot hold. You let yourself remember too.",
    },
    {
      id: "listen",
      label: "Refuse the fight. Read the file instead.",
      outcome:
        "The guard does not attack someone who does not defend. The file opens. Kael's childhood spills across the floor like spilled water. You read every page.",
    },
    {
      id: "lay_down",
      label: "Say the sister's name aloud.",
      outcome:
        "Her name is — you guess it, because Kael cannot. The cell unlocks. He weeps for the first time in seventeen thousand years. The guard was waiting to hear it said.",
    },
  ],
  the_extraction: [
    {
      id: "fight",
      label: "Tear the Meme off his face.",
      outcome:
        "The mask comes off in your hand. The face under it is not Kael's — it is yours, at twenty, before anything. The Meme wanted you to see that.",
    },
    {
      id: "listen",
      label: "Let the mirror-match play out.",
      outcome:
        "You fight your own face to a draw. Neither of you wins. Both of you learn the shape of the offer the virus made. Kael whispers: 'That was the yes. I have not stopped being sorry for it.'",
    },
    {
      id: "lay_down",
      label: "Ask the Meme what it wants.",
      outcome:
        "The Meme, which has never been asked this, pauses. It says: 'I want to be looked at.' You look at it. It recedes a single step. Kael says: 'Thank you. I could not do that part.'",
    },
  ],
  the_warlord_rematch: [
    {
      id: "fight",
      label: "Strike him down. Take the list.",
      outcome:
        "The Warlord falls. In his hand a piece of paper with seventy-three names. You read them aloud one at a time. Each name takes a decade off Kael's face. He is himself again by the time you finish.",
    },
    {
      id: "listen",
      label: "Demand the list before the fight.",
      outcome:
        "The Warlord laughs — and hands it over. He says: 'I was waiting for someone to ask. No one ever did.' You take the list and walk away. The fight never happens. Kael says it is better this way.",
    },
    {
      id: "lay_down",
      label: "Read the names until he surrenders.",
      outcome:
        "You begin reciting names you do not know. Halfway through he stops fighting. By the sixtieth, he is kneeling. He hands you the list. 'Keep reading,' he says. 'The last thirteen are mine.'",
    },
  ],
  the_white_oracle_meets: [
    {
      id: "fight",
      label: "Fight — old habits die hard.",
      outcome:
        "The White Oracle absorbs every strike. He does not counter. When you tire, he says: 'You were not fighting me. You were fighting the version of you who wanted to fight forever. That version is done now.' The fight is over. The man is back.",
    },
    {
      id: "listen",
      label: "Listen for the offer he's making.",
      outcome:
        "'Lay down the fight,' he says. 'The fight was the extraction. The extraction is complete. Go home to the Ark.' You listen. You lay it down.",
    },
    {
      id: "lay_down",
      label: "Lay down the fight.",
      outcome:
        "You drop your guard. He nods once. Kael walks out of the Oracle and into the light. He turns at the door and says: 'Tell Elara I remembered the sandwich. Tell The Human I remembered the investigation. Tell yourself I remembered you.' Then he is gone.",
    },
  ],
};

type Modal =
  | { kind: "none" }
  | { kind: "prefight"; chapter: Act4PrisonerChapter }
  | { kind: "resolution"; chapter: Act4PrisonerChapter; stance: Stance };

export default function Act4PrisonerStoryPage() {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const [progress, setProgress] = useState(DEFAULT_STORY_PROGRESS);
  const [modal, setModal] = useState<Modal>({ kind: "none" });

  // Hydrate local story progress on mount so unlock gates read
  // from the same source Act 1's story mode uses.
  useEffect(() => {
    setProgress(loadStoryProgress());
  }, []);

  /** Chapter completion state. A chapter is "done" if either
   *  the server flag is set (canonical source) OR the local
   *  storyProgress.completedChapters includes its tag (for
   *  offline / pre-sync play). */
  const isDone = useCallback(
    (chapter: Act4PrisonerChapter) =>
      Boolean(flags[chapter.completedFlag]) ||
      progress.completedChapters.includes(chapter.storyModeChapterTag),
    [flags, progress.completedChapters],
  );

  /** Sequential unlock matches the Act 1 story-mode pattern:
   *  the first chapter is always available; each subsequent
   *  chapter unlocks when the previous one is done. */
  const isUnlocked = useCallback(
    (chapterOrder: number): boolean => {
      if (chapterOrder === 1) return true;
      const prior = ACT_4_PRISONER_CHAPTERS.find(
        (c) => c.order === chapterOrder - 1,
      );
      return prior ? isDone(prior) : false;
    },
    [isDone],
  );

  const completedCount = useMemo(
    () => ACT_4_PRISONER_CHAPTERS.filter((c) => isDone(c)).length,
    [isDone],
  );

  const resolveChapter = useCallback(
    (chapter: Act4PrisonerChapter, stance: Stance) => {
      // Persist BOTH local story progress + server-synced narrative flag.
      // The Act 4 completion gate in useNarrativeIntegration.ts reads the
      // narrativeFlag; the local storyProgress is for UX parity with
      // Act 1's story mode and offline play.
      if (!progress.completedChapters.includes(chapter.storyModeChapterTag)) {
        const nextCompleted = [
          ...progress.completedChapters,
          chapter.storyModeChapterTag,
        ];
        const next = { ...progress, completedChapters: nextCompleted };
        setProgress(next);
        saveStoryProgress(next);
      }
      if (!flags[chapter.completedFlag]) {
        setNarrativeFlag(chapter.completedFlag, true);
        toast.success(`Act 4 · ${chapter.title}`, {
          description:
            "The memory is yours now. Another door in the Prisoner's cell quietly unlocks.",
          duration: 8000,
        });
      }
      setModal({ kind: "resolution", chapter, stance });
    },
    [flags, progress, setNarrativeFlag],
  );

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src="/art/rooms/room-panopticon-cell.png"
        accent="rgba(139, 92, 246, 0.32)"
        opacity={0.1}
        particleCount={3}
        scanlines
      />

      <header className="relative z-10 flex items-center justify-between border-b border-violet-500/30 bg-stone-950/85 px-4 py-3 backdrop-blur">
        <Link
          to="/witnessing"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-violet-300/80 hover:text-violet-100"
        >
          <ChevronLeft size={14} />
          Witnessing Hub
        </Link>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-300/70">
            §9 · The Prisoner
          </p>
          <p className="mt-1 font-serif text-lg italic text-violet-50">
            Four memories. Four extractions.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-violet-300/80">
          {completedCount}/{ACT_4_PRISONER_CHAPTERS.length}
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <section className="mb-6 rounded-md border border-violet-500/30 bg-violet-950/10 p-5">
          <p className="font-serif italic leading-relaxed text-[14px] text-violet-100/90">
            The Arena is the interrogation room. Each fight is a door into a
            memory the Warlord took from Kael. You do not need to win all four.
            Any one of them will close the act. The canon says the fight WAS
            the extraction — how you lay it down is yours to choose.
          </p>
        </section>

        <ul className="space-y-3">
          {ACT_4_PRISONER_CHAPTERS.map((chapter) => {
            const done = isDone(chapter);
            const unlocked = isUnlocked(chapter.order);
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => setModal({ kind: "prefight", chapter })}
                  data-testid={`prisoner-chapter-${chapter.id}`}
                  className={[
                    "w-full rounded-md border px-5 py-4 text-left transition-colors",
                    done
                      ? "border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/30"
                      : unlocked
                        ? "border-violet-500/40 bg-stone-950/60 hover:bg-violet-950/20"
                        : "border-stone-700/60 bg-stone-950/40 opacity-50 cursor-not-allowed",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {done ? (
                      <CheckCircle2
                        size={16}
                        className="mt-1 shrink-0 text-emerald-300"
                      />
                    ) : unlocked ? (
                      <Ghost
                        size={16}
                        className="mt-1 shrink-0 text-violet-200/80"
                      />
                    ) : (
                      <Lock
                        size={16}
                        className="mt-1 shrink-0 text-stone-500"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-serif text-[15px] italic text-violet-50">
                          {chapter.order}. {chapter.title}
                        </p>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-violet-300/60">
                          vs {chapter.fighterId}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-violet-300/50">
                        Memory extracted
                      </p>
                      <p className="mt-1 font-serif italic text-[13px] leading-relaxed text-violet-100/75">
                        {chapter.memoryExtracted}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </main>

      <AnimatePresence>
        {modal.kind === "prefight" && (
          <PreFightOverlay
            chapter={modal.chapter}
            onChooseStance={(stance) => resolveChapter(modal.chapter, stance)}
            onClose={() => setModal({ kind: "none" })}
          />
        )}
        {modal.kind === "resolution" && (
          <ResolutionOverlay
            chapter={modal.chapter}
            stance={modal.stance}
            onClose={() => setModal({ kind: "none" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PreFightOverlay({
  chapter,
  onChooseStance,
  onClose,
}: {
  chapter: Act4PrisonerChapter;
  onChooseStance: (stance: Stance) => void;
  onClose: () => void;
}) {
  const stances = CHAPTER_STANCES[chapter.id];
  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/88 backdrop-blur-sm px-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="my-10 w-full max-w-xl rounded border border-violet-400/40 bg-stone-950/95 p-6 shadow-[0_0_60px_rgba(139,92,246,0.25)]"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-300/80">
          {chapter.title}
        </p>
        <blockquote className="mt-4 border-l-2 border-violet-400/50 pl-4 font-serif italic leading-relaxed text-[15px] text-violet-50">
          {chapter.openingLine}
        </blockquote>
        <ul className="mt-6 space-y-2">
          {stances.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onChooseStance(s)}
                data-testid={`prisoner-stance-${chapter.id}-${s.id}`}
                className="w-full rounded border border-violet-500/30 bg-violet-950/20 px-4 py-3 text-left font-serif italic text-[14px] text-violet-100 hover:bg-violet-900/40"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-wider text-violet-300/60 hover:text-violet-100"
          >
            Walk away
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ResolutionOverlay({
  chapter,
  stance,
  onClose,
}: {
  chapter: Act4PrisonerChapter;
  stance: Stance;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/90 backdrop-blur-sm px-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="my-10 w-full max-w-xl rounded border border-emerald-400/40 bg-stone-950/95 p-6 shadow-[0_0_60px_rgba(16,185,129,0.22)]"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/80">
          {chapter.title} · resolved
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-emerald-300/60">
          {stance.label}
        </p>
        <p className="mt-4 font-serif italic leading-relaxed text-[14px] text-emerald-50">
          {stance.outcome}
        </p>
        <div className="mt-5 rounded border border-violet-500/30 bg-violet-950/15 p-3">
          <p className="font-mono text-[9px] uppercase tracking-wider text-violet-300/70">
            Memory extracted
          </p>
          <p className="mt-1 font-serif italic text-[13px] text-violet-100/90">
            {chapter.memoryExtracted}
          </p>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-emerald-400/40 bg-emerald-950/30 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-100 hover:bg-emerald-900/50"
          >
            Return to the Prisoner
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
