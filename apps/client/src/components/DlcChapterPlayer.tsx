/* ═══════════════════════════════════════════════════════
   DLC CHAPTER PLAYER

   Walks a DlcChapter's steps (narration / choice /
   encounter_ref / cinematic_ref) and on completion calls
   trpc.dlcChapters.markChapterComplete to write the
   canonical dlc_chapter_<id>_complete flag plus any other
   flags the chapter declares.

   Choice steps additionally raise the chosen option's
   `setFlag` (if any) into local game state via
   setNarrativeFlag, so downstream chapters can chain on
   per-choice outcomes (e.g. advocate_sacrum_path_preserve).

   Encounter / cinematic refs surface as placeholder cards
   with a Skip button — full encounter / cinematic playback
   integration ships when those systems wire DLC chapters
   into their resolvers.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import type { DlcChapter, DlcStep } from "@shared/dlc";
import { CINEMATICS } from "@shared/expansionArt/cinematicsManifest";
import { useGame } from "@/contexts/GameContext";
import { SingleVideoCutsceneOverlay } from "@/components/cutscenes/SingleVideoCutsceneOverlay";
import { trpc } from "@/lib/trpc";

export interface DlcChapterPlayerProps {
  readonly chapter: DlcChapter;
  /** Fired after the player's last step resolves and the
   *  markChapterComplete mutation succeeds. */
  readonly onComplete?: () => void;
  /** Fired when the player closes the chapter mid-play. */
  readonly onClose?: () => void;
}

export default function DlcChapterPlayer({
  chapter,
  onComplete,
  onClose,
}: DlcChapterPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [committed, setCommitted] = useState(false);
  const { setNarrativeFlag } = useGame();
  const markComplete = trpc.dlcChapters.markChapterComplete.useMutation();

  const step: DlcStep | undefined = chapter.steps[stepIndex];
  const isLastStep = stepIndex === chapter.steps.length - 1;

  const finishChapter = useCallback(async () => {
    if (committed) return;
    setCommitted(true);
    try {
      await markComplete.mutateAsync({ chapterId: chapter.id });
    } catch {
      // Network failure — the local flags already reflect any choice
      // setFlags raised; the canonical completion flag remains
      // unwritten. Surface via onClose so the player can retry.
      setCommitted(false);
      onClose?.();
      return;
    }
    onComplete?.();
  }, [chapter.id, committed, markComplete, onClose, onComplete]);

  const advance = useCallback(() => {
    if (isLastStep) {
      void finishChapter();
      return;
    }
    setStepIndex((i) => i + 1);
  }, [finishChapter, isLastStep]);

  const handleChoice = useCallback(
    (optionId: string) => {
      if (step?.kind !== "choice") return;
      const opt = step.options.find((o) => o.id === optionId);
      if (opt?.setFlag) setNarrativeFlag(opt.setFlag, true);
      advance();
    },
    [step, setNarrativeFlag, advance],
  );

  if (!step) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/95 backdrop-blur-md"
      role="dialog"
      aria-label={`Playing chapter: ${chapter.title}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full border border-border/40 bg-background/60 p-2 hover:bg-background/80"
        aria-label="Close chapter"
      >
        <X size={16} />
      </button>

      <div className="absolute top-4 left-4 right-16 z-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
          DLC · {chapter.title}
        </div>
        <div className="mt-1 h-0.5 w-full bg-border/20 rounded">
          <motion.div
            className="h-full bg-primary/60 rounded"
            initial={{ width: 0 }}
            animate={{
              width: `${((stepIndex + 1) / chapter.steps.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${chapter.id}-${stepIndex}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-2xl px-6"
        >
          <DlcStepView step={step} onAdvance={advance} onChoice={handleChoice} />
        </motion.div>
      </AnimatePresence>

      {committed && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground/70">
          recording chapter completion…
        </div>
      )}
    </motion.div>
  );
}

function DlcStepView({
  step,
  onAdvance,
  onChoice,
}: {
  readonly step: DlcStep;
  readonly onAdvance: () => void;
  readonly onChoice: (optionId: string) => void;
}) {
  switch (step.kind) {
    case "narration":
      return <NarrationView step={step} onAdvance={onAdvance} />;
    case "choice":
      return <ChoiceView step={step} onChoice={onChoice} />;
    case "encounter_ref":
      return <RefView label="ENCOUNTER" id={step.encounterId} onSkip={onAdvance} />;
    case "cinematic_ref":
      return <CinematicView cinematicId={step.cinematicId} onAdvance={onAdvance} />;
  }
}

/** Resolves a cinematic id against the cinematics manifest and
 *  plays the producer-delivered MP4 inline. Falls back to the
 *  RefView placeholder if the id doesn't resolve (e.g. an
 *  authored cinematic that hasn't shipped yet). */
function CinematicView({
  cinematicId,
  onAdvance,
}: {
  readonly cinematicId: string;
  readonly onAdvance: () => void;
}) {
  // Lazy import-by-string to avoid a hard type dep on CinematicId
  // here — chapter authors can reference any cinematic by id, and
  // unknown ids degrade to the placeholder.
  const def = CINEMATICS.find((c) => c.id === cinematicId);
  if (!def) {
    return <RefView label="CINEMATIC" id={cinematicId} onSkip={onAdvance} />;
  }
  return (
    <SingleVideoCutsceneOverlay
      cutsceneId={def.id}
      videoRelPath={def.videoRelPath}
      primaryLabel="Cinematic"
      secondaryLabel={def.name}
      onComplete={onAdvance}
    />
  );
}

function NarrationView({
  step,
  onAdvance,
}: {
  readonly step: Extract<DlcStep, { kind: "narration" }>;
  readonly onAdvance: () => void;
}) {
  return (
    <div className="rounded-lg border border-border/30 bg-secondary/20 p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
        {speakerLabel(step.speaker)}
      </div>
      <p className="mt-3 font-display text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
        {step.text}
      </p>
      {step.subtitle && (
        <p className="mt-3 font-mono text-xs italic text-muted-foreground/70">
          {step.subtitle}
        </p>
      )}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onAdvance}
          className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-mono font-bold border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function ChoiceView({
  step,
  onChoice,
}: {
  readonly step: Extract<DlcStep, { kind: "choice" }>;
  readonly onChoice: (optionId: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border/30 bg-secondary/20 p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
        {speakerLabel(step.speaker)}
      </div>
      <p className="mt-3 font-display text-base sm:text-lg leading-relaxed text-foreground/90">
        {step.prompt}
      </p>
      <div className="mt-5 flex flex-col gap-2">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChoice(opt.id)}
            className="text-left px-4 py-3 rounded-md border border-border/30 bg-background/40 hover:bg-background/70 hover:border-primary/40 transition-colors text-sm"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function RefView({
  label,
  id,
  onSkip,
}: {
  readonly label: string;
  readonly id: string;
  readonly onSkip: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border/40 bg-secondary/10 p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
        {label} REFERENCE
      </div>
      <p className="mt-3 font-mono text-sm text-foreground/80">{id}</p>
      <p className="mt-2 font-mono text-xs italic text-muted-foreground/60">
        Encounter / cinematic playback for DLC chapters lands in a follow-up.
        Skip for now to advance.
      </p>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onSkip}
          className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-mono font-bold border border-border/40 text-muted-foreground hover:bg-secondary/30 transition-colors"
        >
          Skip <Check size={14} />
        </button>
      </div>
    </div>
  );
}

function speakerLabel(speaker: string): string {
  if (speaker === "antiquarian") return "The Antiquarian";
  if (speaker === "storyteller") return "The Storyteller";
  if (speaker === "advocate") return "The Advocate";
  if (speaker === "narrator") return "Narrator";
  return speaker;
}
