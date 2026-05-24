/* ═══════════════════════════════════════════════════════
   ENGINEER VOTE OVERLAY

   Focused, full-screen vote modal that opens immediately
   after a Dischordian Saga episode finishes (or is
   skipped). The episode IS the framing for the vote —
   the player has just watched the in-fiction broadcast,
   and the question arrives on top of the post-credits
   silence. No navigation to the Governance Hub required.

   Reads its content from ENGINEER_GOVERNANCE_VOTES.
   Submits via the same `architectConsole.submitVote`
   mutation the Governance Hub uses, so consequence
   flags and Elara's reactive `cc_gov_*` companion
   comment fire on their own.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ENGINEER_GOVERNANCE_VOTES } from "@shared/engineerGovernanceVotes";
import { trpc } from "@/lib/trpc";
import { useGovernanceStore } from "@/stores/governanceStore";

interface Props {
  voteId: string;
  onClose: () => void;
}

export default function EngineerVoteOverlay({ voteId, onClose }: Props) {
  const vote = useMemo(
    () => ENGINEER_GOVERNANCE_VOTES.find((v) => v.id === voteId) ?? null,
    [voteId],
  );

  const store = useGovernanceStore();
  const submitVoteMutation = trpc.architectConsole.submitVote.useMutation();
  const playerVote = vote ? store.getPlayerVote(vote.id) : null;
  const [submitted, setSubmitted] = useState(!!playerVote);

  const cast = useCallback(
    (optionId: string) => {
      if (!vote || submitted) return;
      store.castVote(vote.id, optionId);
      const optionIndex = vote.options.findIndex((o) => o.id === optionId);
      if (optionIndex >= 0) {
        submitVoteMutation.mutate(
          { voteId: vote.id, optionNumber: optionIndex + 1 },
          {
            onError: (err) =>
              console.warn("[EngineerVoteOverlay] Server vote failed:", err.message),
          },
        );
      }
      setSubmitted(true);
    },
    [vote, submitted, store, submitVoteMutation],
  );

  if (!vote) {
    // Defensive: missing vote → close without UI to avoid
    // trapping the player.
    setTimeout(onClose, 0);
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9001] flex items-center justify-center bg-black/90 backdrop-blur-md px-6"
        role="dialog"
        aria-label={vote.question}
      >
        <div className="relative w-full max-w-3xl flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-400/70">
              ▸ The Potentials Decide
            </p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-wider text-emerald-100">
              {vote.question}
            </h2>
          </div>

          <div className="w-full p-4 rounded border border-amber-400/30 bg-amber-950/15">
            <p className="font-mono text-[9px] uppercase tracking-wider text-amber-300/80 mb-1">
              The Antiquarian writes
            </p>
            <p className="font-serif italic text-[14px] text-amber-100/90 leading-relaxed">
              {vote.antiquarianIntro}
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            {vote.options.map((opt) => {
              const isSelected = playerVote === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => cast(opt.id)}
                  disabled={submitted}
                  className={`text-left p-4 rounded-md border transition-all ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-950/40"
                      : "border-emerald-500/30 bg-emerald-950/15 hover:border-emerald-400/60 hover:bg-emerald-900/30"
                  } ${submitted && !isSelected ? "opacity-40" : ""} ${
                    submitted ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <div className="font-display text-base font-bold tracking-wider text-emerald-100 mb-1">
                    {opt.label}
                    {isSelected && (
                      <span className="ml-2 font-mono text-[10px] text-emerald-300/80">
                        ▸ your vote
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-emerald-200/60 leading-relaxed">
                    {opt.description}
                  </p>
                  {opt.consequences.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {opt.consequences.map((c, i) => (
                        <span
                          key={i}
                          className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300/70 border border-emerald-500/20"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/60 hover:text-emerald-200 transition-colors"
          >
            {submitted ? "▸ continue" : "step away · the question waits"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
