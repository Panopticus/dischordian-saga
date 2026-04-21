/* ═══════════════════════════════════════════════════════
   CHESS TUTORIAL — Celebration Game Master's Academy
   7 gates of real chess pedagogy + a skip-challenge path
   that lets confident players try to beat the Celebration
   Game Master at absolute maximum AI skill.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import ChessMatrixAmbient from "@/components/ChessMatrixAmbient";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {
  ArrowLeft,
  Crown,
  BookOpen,
  Swords,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Lock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { customPieces } from "@/components/ChessPieces";

type TutorialStage = "loading" | "intro" | "lesson" | "outro" | "complete" | "skip_intro";

/** Mood → accent color mapping. Mirrors the portrait accent used in
 *  ElaraDialog so the Celebration Game Master reads as a character,
 *  not a UI string. */
const MOOD_ACCENT: Record<string, string> = {
  warm: "void-border void-text-accent",
  curious: "void-border void-text-energy",
  reflective: "void-border-system void-text-system",
  protective: "void-border-success void-text-energy",
  guarded: "void-border-error void-text-error",
  cryptic: "void-border-system void-text-system",
  default: "border-border/40 text-foreground",
};

const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export default function ChessTutorialPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [stage, setStage] = useState<TutorialStage>("loading");
  const [introCueIdx, setIntroCueIdx] = useState(0);
  const [outroCueIdx, setOutroCueIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [boardFen, setBoardFen] = useState(STARTING_FEN);
  const [lastMoveError, setLastMoveError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const chessRef = useRef(new Chess());

  /* ─── TRPC ─── */
  const progressQ = trpc.chess.getTutorialProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const stepQ = trpc.chess.getTutorialStep.useQuery(
    {
      gateNumber: progressQ.data?.activeGate?.gateNumber ?? 1,
      stepIndex: stepIdx,
    },
    {
      enabled:
        stage === "lesson" && !!progressQ.data?.activeGate,
      staleTime: 30_000,
    },
  );
  const completeStep = trpc.chess.completeTutorialStep.useMutation();
  const completeGate = trpc.chess.completeTutorialGate.useMutation();
  const skipAndChallenge = trpc.chess.skipTutorialAndChallenge.useMutation();

  /* ─── Stage resolver: land on the correct stage when progress loads ─── */
  useEffect(() => {
    if (!progressQ.data) return;
    if (progressQ.data.complete) {
      setStage("complete");
      return;
    }
    setStepIdx(progressQ.data.progress.currentStep);
    // If the student is mid-gate (currentStep > 0), jump into lesson.
    if (progressQ.data.progress.currentStep > 0) {
      setStage("lesson");
    } else {
      setStage("intro");
    }
  }, [progressQ.data]);

  /* ─── Sync the chessboard to the active step's FEN ─── */
  useEffect(() => {
    if (stage !== "lesson" || !stepQ.data) return;
    const fen = stepQ.data.step.boardFen;
    if (fen) {
      setBoardFen(fen);
      try {
        chessRef.current.load(fen);
      } catch {
        // invalid FEN — just keep what we had
      }
    }
    setShowHint(false);
    setLastMoveError(null);
  }, [stepQ.data, stage]);

  /* ─── Auto-advance lecture-only steps ─── */
  useEffect(() => {
    if (stage !== "lesson" || !stepQ.data) return;
    const step = stepQ.data.step;
    const hasAnswerMoves = step.answerMoves && step.answerMoves.length > 0;
    if (!hasAnswerMoves || step.autoAdvance) {
      const t = setTimeout(() => {
        handleStepComplete();
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [stepQ.data, stage]);

  /* ─── Delayed hint for stalled students ─── */
  useEffect(() => {
    if (stage !== "lesson" || !stepQ.data) return;
    const t = setTimeout(() => setShowHint(true), 15_000);
    return () => clearTimeout(t);
  }, [stepQ.data, stage]);

  const activeGate = progressQ.data?.activeGate;
  const totalGates = progressQ.data?.totalGates ?? 7;

  const introCue = useMemo(() => {
    return activeGate?.introScene.cues[introCueIdx];
  }, [activeGate, introCueIdx]);

  const outroCue = useMemo(() => {
    return activeGate?.outroScene.cues[outroCueIdx];
  }, [activeGate, outroCueIdx]);

  const handleIntroAdvance = useCallback(() => {
    if (!activeGate) return;
    if (introCueIdx < activeGate.introScene.cues.length - 1) {
      setIntroCueIdx((i) => i + 1);
    } else {
      // Intro complete — start the lesson.
      setStage("lesson");
      setIntroCueIdx(0);
    }
  }, [activeGate, introCueIdx]);

  const handleOutroAdvance = useCallback(async () => {
    if (!activeGate) return;
    if (outroCueIdx < activeGate.outroScene.cues.length - 1) {
      setOutroCueIdx((i) => i + 1);
    } else {
      // Outro complete — advance to next gate.
      try {
        await completeGate.mutateAsync({ gateNumber: activeGate.gateNumber });
        setOutroCueIdx(0);
        setStepIdx(0);
        await progressQ.refetch();
      } catch (err) {
        setLastMoveError(String(err));
      }
    }
  }, [activeGate, outroCueIdx, completeGate, progressQ]);

  const handleStepComplete = useCallback(async () => {
    if (!activeGate || !stepQ.data) return;
    try {
      const result = await completeStep.mutateAsync({
        gateNumber: activeGate.gateNumber,
        stepIndex: stepIdx,
      });
      if (result.gateComplete) {
        setStage("outro");
      } else if (result.nextStep !== null) {
        setStepIdx(result.nextStep);
      }
    } catch (err) {
      setLastMoveError(String(err));
    }
  }, [activeGate, stepQ.data, stepIdx, completeStep]);

  const handleBoardMove = useCallback(
    (source: string, target: string): boolean => {
      if (!stepQ.data) return false;
      const step = stepQ.data.step;
      const answerMoves = step.answerMoves ?? [];
      if (answerMoves.length === 0) return false;

      const chess = chessRef.current;
      let san: string;
      try {
        const move = chess.move({ from: source, to: target, promotion: "q" });
        if (!move) return false;
        san = move.san;
      } catch {
        return false;
      }

      // Match against any answer variant (with or without +/#).
      const normalized = san.replace(/[+#]/g, "");
      const matches = answerMoves.some(
        (m) => m === san || m.replace(/[+#]/g, "") === normalized,
      );
      if (!matches) {
        // Revert the local board; the move was legal but not the one the
        // Game Master was looking for.
        chess.undo();
        setLastMoveError(
          `Not quite. ${step.hint ?? "Try a different move."}`,
        );
        return false;
      }

      // Advance the step.
      setLastMoveError(null);
      void handleStepComplete();
      return true;
    },
    [stepQ.data, handleStepComplete],
  );

  /* ─── Skip-challenge path ─── */
  const handleSkipChallenge = useCallback(async () => {
    try {
      const result = await skipAndChallenge.mutateAsync();
      // Stash the challenge scene alongside the gameId so ChessPage
      // can pick it up and play the scene before the board loads.
      // sessionStorage is used instead of URL state because the scene
      // payload is too large to encode into a query string.
      if (result.challengeScene) {
        sessionStorage.setItem(
          "chess_skip_challenge",
          JSON.stringify({
            gameId: result.gameId,
            scene: result.challengeScene,
          }),
        );
      }
      setLocation(`/chess?skipChallengeGameId=${result.gameId}`);
    } catch (err) {
      setLastMoveError(String(err));
    }
  }, [skipAndChallenge, setLocation]);

  /* ─── Render ─── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <a
          href={getLoginUrl()}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
        >
          Sign in to begin the Chess Tutorial
        </a>
      </div>
    );
  }

  if (stage === "loading" || progressQ.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (stage === "complete") {
    return (
      <div className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        <Link
          href="/chess"
          className="inline-flex items-center gap-2 p-2 rounded-md bg-secondary/50 hover:bg-secondary"
        >
          <ArrowLeft size={16} /> Back to Chess
        </Link>
        <div className="rounded-lg border void-border void-bg-sunk p-6 space-y-4">
          <Sparkles className="void-text-accent" size={32} />
          <h1 className="font-display text-2xl font-bold tracking-wider">
            The Academy is Closed
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            You have completed all 7 chess tutorial gates. The Celebration
            Teaching Set has been added to your inventory. The Arena version
            of the Game Master is waiting in the far door — challenge him
            when you are ready.
          </p>
          <Link
            href="/chess"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold"
          >
            Enter the Arena <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (!activeGate || !progressQ.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No tutorial gate available.
      </div>
    );
  }

  const moodClass = MOOD_ACCENT[introCue?.mood ?? outroCue?.mood ?? "default"] ?? MOOD_ACCENT.default;

  return (
    <ChessMatrixAmbient gateNumber={activeGate.gateNumber}>
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/chess"
          className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold tracking-wider flex items-center gap-2">
            <BookOpen size={18} className="void-text-accent" />
            THE CELEBRATION ACADEMY — Gate {activeGate.gateNumber} of{" "}
            {totalGates}
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            {activeGate.title} // {activeGate.objective}
          </p>
        </div>
      </div>

      {/* Gate progress strip */}
      <div className="flex gap-1">
        {Array.from({ length: totalGates }).map((_, i) => {
          const gateNum = i + 1;
          const isDone = progressQ.data.progress.completedGates.includes(gateNum);
          const isActive = gateNum === activeGate.gateNumber;
          return (
            <div
              key={gateNum}
              className={`flex-1 h-1.5 rounded-full ${
                isDone
                  ? "void-bg-success"
                  : isActive
                    ? "void-bg-sunk"
                    : "bg-border/30"
              }`}
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* INTRO SCENE */}
        {stage === "intro" && introCue && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`rounded-lg border ${moodClass} bg-card/40 p-6 space-y-4`}
          >
            <div className="flex items-center gap-2">
              <Crown size={16} className="void-text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-wider">
                {introCue.speaker === "narrator"
                  ? "Narrator"
                  : "The Celebration Game Master"}
                {introCue.mood ? ` // ${introCue.mood}` : ""}
              </span>
            </div>
            <p className="font-display text-base sm:text-lg leading-relaxed">
              {introCue.text}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleIntroAdvance}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold text-sm"
              >
                {introCueIdx < activeGate.introScene.cues.length - 1
                  ? "Continue"
                  : "Start the lesson"}
              </button>

              {/* Skip-challenge option only shows on Gate 1 intro */}
              {activeGate.gateNumber === 1 &&
                introCueIdx === activeGate.introScene.cues.length - 1 && (
                  <button
                    onClick={handleSkipChallenge}
                    disabled={skipAndChallenge.isPending}
                    className="px-4 py-2 rounded-md border void-border-error void-text-error font-bold text-sm void-bg-error flex items-center gap-2"
                    title="Challenge the Game Master at full strength. He will play at absolute maximum AI skill."
                  >
                    <Swords size={14} />
                    I already know how to play. Challenge me.
                  </button>
                )}
            </div>
          </motion.div>
        )}

        {/* LESSON — board + step text */}
        {stage === "lesson" && stepQ.data && (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* Board */}
            <div className="rounded-lg border border-border/30 bg-black/40 p-3">
              <Chessboard
                options={{
                  position: boardFen,
                  pieces: customPieces,
                  showNotation: true,
                  onPieceDrop: ({ sourceSquare, targetSquare }: any) => {
                    if (!targetSquare) return false;
                    return handleBoardMove(sourceSquare, targetSquare);
                  },
                  canDragPiece: ({ piece }: any) => {
                    const hasAnswers =
                      (stepQ.data?.step.answerMoves?.length ?? 0) > 0;
                    if (!hasAnswers) return false;
                    // Only allow the student to drag white pieces — the
                    // Game Master's answer moves are all from White's
                    // perspective in the authored positions.
                    return (piece?.pieceType ?? "").startsWith("w");
                  },
                  animationDurationInMs: 200,
                  showAnimations: true,
                }}
              />
              <p className="font-mono text-[10px] text-muted-foreground mt-2">
                Step {stepIdx + 1} / {stepQ.data.totalSteps}
              </p>
            </div>

            {/* Lesson text */}
            <div
              className={`rounded-lg border ${MOOD_ACCENT[stepQ.data.step.mood ?? "default"]} bg-card/40 p-5 space-y-3`}
            >
              <div className="flex items-center gap-2">
                <Crown size={14} className="void-text-accent" />
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  Celebration Game Master // {stepQ.data.step.mood}
                </span>
              </div>
              <p className="font-display text-sm leading-relaxed">
                {stepQ.data.step.text}
              </p>

              {showHint && stepQ.data.step.hint && (
                <p className="font-mono text-[11px] void-text-accent border-l-2 void-border pl-3">
                  Hint: {stepQ.data.step.hint}
                </p>
              )}

              {lastMoveError && (
                <p className="font-mono text-[11px] void-text-error">
                  {lastMoveError}
                </p>
              )}

              {(!stepQ.data.step.answerMoves ||
                stepQ.data.step.answerMoves.length === 0) && (
                <button
                  onClick={handleStepComplete}
                  disabled={completeStep.isPending}
                  className="px-3 py-1.5 rounded-md bg-secondary text-foreground font-bold text-xs"
                >
                  Continue <ChevronRight size={12} className="inline" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* OUTRO SCENE */}
        {stage === "outro" && outroCue && (
          <motion.div
            key="outro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`rounded-lg border ${moodClass} bg-card/40 p-6 space-y-4`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="void-text-energy" />
              <span className="font-mono text-[11px] uppercase tracking-wider">
                Gate {activeGate.gateNumber} Complete //{" "}
                {outroCue.speaker === "narrator"
                  ? "Narrator"
                  : "The Celebration Game Master"}
                {outroCue.mood ? ` // ${outroCue.mood}` : ""}
              </span>
            </div>
            <p className="font-display text-base sm:text-lg leading-relaxed">
              {outroCue.text}
            </p>

            <button
              onClick={handleOutroAdvance}
              disabled={completeGate.isPending}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold text-sm"
            >
              {outroCueIdx < activeGate.outroScene.cues.length - 1
                ? "Continue"
                : activeGate.gateNumber === totalGates
                  ? "Leave the classroom"
                  : `Continue to Gate ${activeGate.gateNumber + 1}`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ChessMatrixAmbient>
  );
}
