/**
 * Chess — The Prince's Game (Gate 4.5).
 *
 * Discoverable side gate. Walks the player through the canonical
 * game Donald Byrne vs. Bobby Fischer 1956 — the only chess game
 * the Game Master ever lost, fictionally to the Engineer.
 *
 * This page is a STEP-BY-STEP walkthrough: each step shows the
 * board position at that ply, the GM's commentary, and an
 * "advance" button. Scripted moves are auto-played by the page.
 * On completion we call `chessSideGate.completeSideGate` to
 * record the clear.
 */
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  CHESS_TUTORIAL_GATE_4_5,
  type DialogCue,
} from "@shared/tcg-core";
import ChessBoard from "@/components/ChessBoard";

type Stage = "intro" | "steps" | "outro" | "complete";

export default function ChessPrincesGamePage() {
  const { isAuthenticated } = useAuth();
  const completeMut = trpc.chessSideGate.completeSideGate.useMutation();

  const [stage, setStage] = useState<Stage>("intro");
  const [introIdx, setIntroIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [outroIdx, setOutroIdx] = useState(0);

  const gate = CHESS_TUTORIAL_GATE_4_5;
  const introCues: readonly DialogCue[] = gate.introScene.cues;
  const outroCues: readonly DialogCue[] = gate.outroScene.cues;
  const steps = gate.steps;

  const currentStep = steps[stepIdx];
  const currentBoardFen = useMemo(() => {
    if (stage !== "steps") return undefined;
    return currentStep?.boardFen ?? undefined;
  }, [stage, currentStep]);

  // Auto-call completion once we land on the complete stage.
  useEffect(() => {
    if (stage === "complete" && !completeMut.isPending && !completeMut.data) {
      completeMut.mutate({ sideGateId: "chess_tut_g4_5" });
    }
  }, [stage, completeMut]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <a href={getLoginUrl()} className="text-void-text-accent underline">
          Sign in to play the Prince's Game.
        </a>
      </div>
    );
  }

  function advance() {
    if (stage === "intro") {
      if (introIdx + 1 < introCues.length) {
        setIntroIdx(introIdx + 1);
      } else {
        setStage("steps");
      }
      return;
    }
    if (stage === "steps") {
      if (stepIdx + 1 < steps.length) {
        setStepIdx(stepIdx + 1);
      } else {
        setStage("outro");
      }
      return;
    }
    if (stage === "outro") {
      if (outroIdx + 1 < outroCues.length) {
        setOutroIdx(outroIdx + 1);
      } else {
        setStage("complete");
      }
    }
  }

  const headerText = {
    intro: `${gate.title} — Intro`,
    steps: `${gate.title} — Move ${stepIdx + 1} of ${steps.length}`,
    outro: `${gate.title} — Resignation`,
    complete: `${gate.title} — Complete`,
  }[stage];

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto text-void-text">
      <header className="mb-6">
        <h1 className="text-2xl tracking-wide">{headerText}</h1>
        <p className="text-sm text-void-text-muted italic mt-1">
          The canonical game: Donald Byrne vs. Bobby Fischer, NY 1956. The
          only game the Game Master ever lost.
        </p>
      </header>

      {stage === "intro" && (
        <section className="space-y-3 max-w-2xl">
          <p className="text-sm text-void-text italic whitespace-pre-line">
            {introCues[introIdx]?.text}
          </p>
          <button
            onClick={advance}
            className="mt-3 px-4 py-2 border border-void-text-accent/60 text-void-text-accent rounded text-sm"
          >
            Continue
          </button>
        </section>
      )}

      {stage === "steps" && currentStep && (
        <section className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <ChessBoard
              fen={currentBoardFen ?? "start"}
              orientation="black"
              viewOnly={true}
              movable={false}
            />
          </div>
          <aside className="col-span-2 space-y-3">
            <p className="text-sm text-void-text italic whitespace-pre-line">
              {currentStep.text}
            </p>
            {currentStep.answerMoves && currentStep.answerMoves.length > 0 && (
              <p className="font-mono text-xs text-void-text-accent">
                Prince's move: {currentStep.answerMoves[0]}
              </p>
            )}
            <button
              onClick={advance}
              className="mt-3 px-4 py-2 border border-void-text-accent/60 text-void-text-accent rounded text-sm"
            >
              {stepIdx + 1 < steps.length ? "Play next move" : "Conclude"}
            </button>
          </aside>
        </section>
      )}

      {stage === "outro" && (
        <section className="space-y-3 max-w-2xl">
          <p className="text-sm text-void-text italic whitespace-pre-line">
            {outroCues[outroIdx]?.text}
          </p>
          <button
            onClick={advance}
            className="mt-3 px-4 py-2 border border-void-text-accent/60 text-void-text-accent rounded text-sm"
          >
            {outroIdx + 1 < outroCues.length ? "Continue" : "Finish"}
          </button>
        </section>
      )}

      {stage === "complete" && (
        <section className="max-w-2xl">
          <p className="text-sm text-void-text italic">
            The Game Master tips his king. The chair opposite him remains
            occupied by nothing the way a resurrected grave remains empty.
          </p>
          <p className="text-xs text-void-text-muted mt-4">
            {completeMut.isPending
              ? "Recording..."
              : completeMut.data?.alreadyCompleted
                ? "Already on your record."
                : "Recorded. Tier 3 of the Climb is now available to you."}
          </p>
        </section>
      )}
    </div>
  );
}
