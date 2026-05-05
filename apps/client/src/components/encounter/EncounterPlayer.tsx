/* ═══════════════════════════════════════════════════════
   ENCOUNTER PLAYER

   Modal cinematic player for the Hierarchy / Malkia / Source-
   Kael encounters. Mirrors RomanceScenePlayer but driven by the
   server's encounter dispatcher: each phase's lines come from
   trpc.encounter.currentLines, branch picks fire
   trpc.encounter.chooseBranch, advancement fires
   trpc.encounter.advancePhase.

   Branch detection: an encounter line's setsFlags array
   contains the branch identifier when the line is a branch
   selector (e.g. rlyeh.res.refuse sets 'rlyeh_resolution_refuse').
   The player picks one branch per resolution phase. We surface
   resolution-phase lines as buttons rather than walking them in
   sequence; the chosen branch's line plays, the others don't.
   ═══════════════════════════════════════════════════════ */

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";
import { splitOnParens } from "@/components/romance/sceneLogic";

export type EncounterId =
  | "master_of_rlyeh"
  | "pale_emissary"
  | "reckoning_daughter"
  | "malkia_revolution"
  | "source_kael";

const ACCENT: Record<string, { border: string; bg: string; name: string; text: string }> = {
  master_of_rlyeh: {
    border: "border-violet-700/60",
    bg: "bg-violet-950/80",
    name: "text-violet-300",
    text: "text-violet-50",
  },
  pale_emissary: {
    border: "border-zinc-500/60",
    bg: "bg-zinc-950/80",
    name: "text-zinc-300",
    text: "text-zinc-50",
  },
  reckoning_daughter: {
    border: "border-emerald-700/60",
    bg: "bg-emerald-950/80",
    name: "text-emerald-300",
    text: "text-emerald-50",
  },
  malkia_revolution: {
    border: "border-orange-600/60",
    bg: "bg-orange-950/70",
    name: "text-orange-300",
    text: "text-orange-50",
  },
  source_kael: {
    border: "border-rose-700/60",
    bg: "bg-rose-950/80",
    name: "text-rose-300",
    text: "text-rose-50",
  },
};

const DISPLAY_NAME: Record<EncounterId, string> = {
  master_of_rlyeh: "Master of R'lyeh",
  pale_emissary: "Pale Emissary",
  reckoning_daughter: "Reckoning Daughter",
  malkia_revolution: "Malkia Ukweli",
  source_kael: "The Source",
};

interface Props {
  encounterId: EncounterId;
  onClose: () => void;
}

interface RawLine {
  lineId: string;
  speaker: string;
  text: string;
  phase: "entry" | "negotiation" | "resolution" | "aftermath";
  setsFlags: ReadonlyArray<string>;
}

export function EncounterPlayer({ encounterId, onClose }: Props) {
  const accent = ACCENT[encounterId] ?? ACCENT.master_of_rlyeh;

  const status = trpc.encounter.getStatus.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const linesQuery = trpc.encounter.currentLines.useQuery(
    { encounterId },
    { refetchOnWindowFocus: false },
  );
  const advanceMutation = trpc.encounter.advancePhase.useMutation();
  const chooseBranchMutation = trpc.encounter.chooseBranch.useMutation();

  const lines = (linesQuery.data ?? []) as readonly RawLine[];
  const currentEncounter = (status.data ?? []).find((s) => s.encounterId === encounterId);
  const phase = currentEncounter?.phase ?? "entry";

  // For resolution phase, identify branch options. Branch lines
  // are those whose setsFlags include a branch token (one of
  // 'purchase', 'refuse', 'wake', 'sign', 'counteroffer',
  // 'accept', etc.). For other phases we walk lines sequentially.
  const isResolutionChoice = phase === "resolution" && lines.length > 1;

  const [beatIdx, setBeatIdx] = useState(0);

  // Reset beat index whenever the line bundle changes.
  useEffect(() => {
    setBeatIdx(0);
  }, [lines]);

  const advance = useCallback(async () => {
    if (beatIdx + 1 >= lines.length) {
      // End of phase — advance.
      await advanceMutation.mutateAsync({ encounterId });
      void status.refetch();
      void linesQuery.refetch();
      return;
    }
    setBeatIdx((i) => i + 1);
  }, [beatIdx, lines.length, advanceMutation, encounterId, status, linesQuery]);

  const pickBranch = useCallback(
    async (line: RawLine) => {
      // The branch flag is the line's primary setsFlags entry that
      // names the resolution outcome (e.g. 'rlyeh_resolution_purchase').
      // Fall back to first setsFlags entry if no obvious match.
      const branchFlag = (line.setsFlags ?? []).find((f) =>
        f.includes("resolution_") || f.includes("_signed") ||
        f.includes("_refused") || f.includes("_counteroffer") ||
        f.includes("_accepted") || f.includes("_wake"),
      ) ?? line.setsFlags[0];
      if (!branchFlag) return;
      await chooseBranchMutation.mutateAsync({ encounterId, branchFlag });
      // Advance to aftermath.
      await advanceMutation.mutateAsync({ encounterId });
      void status.refetch();
      void linesQuery.refetch();
    },
    [chooseBranchMutation, advanceMutation, encounterId, status, linesQuery],
  );

  // Keyboard: Enter / Space advance, Esc close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isResolutionChoice) return; // wait for click
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void advance();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, onClose, isResolutionChoice]);

  if (linesQuery.isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
        <div className="text-zinc-400">Loading encounter…</div>
      </div>
    );
  }

  if (currentEncounter?.completed) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
        <div className={`max-w-2xl rounded-lg border ${accent.border} ${accent.bg} p-6 shadow-2xl`}>
          <div className={`mb-3 text-sm font-semibold uppercase tracking-wider ${accent.name}`}>
            {DISPLAY_NAME[encounterId]} — Encounter complete
          </div>
          <p className={`text-base ${accent.text}`}>
            The encounter has resolved. Branch on record:{" "}
            <span className="font-mono text-sm">
              {currentEncounter.branchChosen ?? "(none)"}
            </span>
            .
          </p>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className={`rounded-md border ${accent.border} px-3 py-1.5 ${accent.text} transition hover:bg-white/5`}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
        role="dialog"
        aria-modal="true"
      >
        <div className={`rounded-lg border ${accent.border} ${accent.bg} p-6 text-center`}>
          <div className={`mb-3 text-sm font-semibold uppercase tracking-wider ${accent.name}`}>
            {DISPLAY_NAME[encounterId]}
          </div>
          <p className={`mb-6 ${accent.text}`}>
            No content available for the current phase. Either the encounter prerequisites
            haven't fired yet, or this combination of flags has no authored line.
          </p>
          <button
            type="button"
            className={`rounded-md border ${accent.border} px-3 py-1.5 ${accent.text} transition hover:bg-white/5`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (isResolutionChoice) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
        <div className={`w-full max-w-2xl rounded-lg border ${accent.border} ${accent.bg} p-6 shadow-2xl`}>
          <div className="mb-3 flex items-center justify-between">
            <div className={`text-sm font-semibold uppercase tracking-wider ${accent.name}`}>
              {DISPLAY_NAME[encounterId]} — Resolution
            </div>
            <button
              type="button"
              className="text-sm text-zinc-400 hover:text-zinc-200"
              onClick={onClose}
              aria-label="Close encounter"
            >
              ✕
            </button>
          </div>
          <p className={`mb-4 text-sm ${accent.text}`}>
            The encounter waits on your decision.
          </p>
          <div className="flex flex-col gap-3">
            {lines.map((line) => (
              <button
                key={line.lineId}
                type="button"
                className={`rounded-md border ${accent.border} px-4 py-3 text-left ${accent.bg} ${accent.text} transition hover:bg-white/5`}
                onClick={() => pickBranch(line)}
              >
                <SceneText text={line.text} accent={accent.text} />
                <div className={`mt-2 text-xs uppercase tracking-wider ${accent.name}`}>
                  Choose this branch
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const current = lines[beatIdx];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.lineId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className={`relative w-full max-w-2xl rounded-lg border ${accent.border} ${accent.bg} p-6 shadow-2xl`}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className={`text-sm font-semibold uppercase tracking-wider ${accent.name}`}>
              {DISPLAY_NAME[encounterId]} · {phase}
              {currentEncounter?.step ? ` · step ${currentEncounter.step}/6` : ""}
            </div>
            <button
              type="button"
              className="text-sm text-zinc-400 hover:text-zinc-200"
              onClick={onClose}
              aria-label="Close encounter"
            >
              ✕
            </button>
          </div>

          <div className={`mb-1 text-xs uppercase tracking-wider ${accent.name}`}>
            {speakerLabel(current.speaker)}
          </div>
          <SceneText text={current.text} accent={accent.text} />

          <div className="mt-6 flex items-center justify-between text-xs text-zinc-400">
            <span>
              {beatIdx + 1} / {lines.length}
            </span>
            <button
              type="button"
              className={`rounded-md border ${accent.border} px-3 py-1.5 ${accent.text} transition hover:bg-white/5`}
              onClick={() => void advance()}
            >
              {beatIdx + 1 >= lines.length ? "Advance phase" : "Continue"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SceneText({ text, accent }: { text: string; accent: string }) {
  const parts = splitOnParens(text);
  return (
    <p className={`whitespace-pre-wrap text-base leading-relaxed ${accent}`}>
      {parts.map((part, i) =>
        part.kind === "stage" ? (
          <span key={i} className="italic text-zinc-400">
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  );
}

function speakerLabel(speaker: string): string {
  if (speaker.startsWith("hierarchy:")) {
    const id = speaker.slice("hierarchy:".length);
    return id.split("_").map(capitalize).join(" ");
  }
  switch (speaker) {
    case "elara": return "Elara";
    case "the_human": return "The Human";
    case "antiquarian": return "The Antiquarian";
    case "source": return "The Source";
    case "kael_trace": return "Kael (echo)";
    case "malkia_ukweli": return "Malkia Ukweli";
    default:
      return speaker.split("_").map(capitalize).join(" ");
  }
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
