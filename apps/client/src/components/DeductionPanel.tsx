/* ═══════════════════════════════════════════════════════
   DEDUCTION PANEL — Sherlock-style 2-clue submission

   Reads the player's evidence + the active episode's
   authored deduction graph, lets them pair two clues,
   previews the grade live (no DB write), and submits to
   commit (which advances the case if the deduction unlocks
   an episode).

   See docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §4
   (Deduction Engine) and §10.
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface DeductionPanelProps {
  /** Branded mystery + episode id of the case currently in
   *  view. Pass from CasesPage's active-case query. */
  mysteryId: string;
  episodeId: string;
}

const RESULT_COLORS: Record<string, { fg: string; label: string }> = {
  correct:          { fg: "var(--energy-success)",  label: "DEDUCTION CORRECT" },
  partial:          { fg: "var(--energy-accent)",   label: "PARTIAL CONNECTION" },
  false_lead_named: { fg: "var(--energy-warning)",  label: "FALSE LEAD" },
  nonsense:         { fg: "rgba(226, 232, 240, 0.5)", label: "NO CONNECTION" },
};

export function DeductionPanel({ mysteryId, episodeId }: DeductionPanelProps) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  // Player's found clues for this mystery
  const evidenceBoard = trpc.mysteries.getEvidenceBoard.useQuery(
    { mysteryId },
    { enabled: isAuthenticated },
  );

  // Pull the authored episode definition (clue titles for
  // the picker) — separate query so the picker doesn't wait
  // on the entire evidence-board.
  const episode = trpc.mysteries.getEpisode.useQuery(
    { mysteryId, episodeId },
    { enabled: isAuthenticated },
  );

  const [clueAId, setClueAId] = useState<string | null>(null);
  const [clueBId, setClueBId] = useState<string | null>(null);

  // Live grade preview — fires whenever a fresh distinct pair
  // is selected. No DB write; pure server-side grading.
  const preview = trpc.mysteries.previewDeduction.useQuery(
    {
      mysteryId,
      episodeId,
      clueAId: clueAId ?? "",
      clueBId: clueBId ?? "",
    },
    {
      enabled: isAuthenticated && Boolean(clueAId && clueBId && clueAId !== clueBId),
    },
  );

  const submit = trpc.mysteries.submitDeduction.useMutation({
    onSuccess: () => {
      utils.mysteries.getActiveCase.invalidate();
      utils.mysteries.getEvidenceBoard.invalidate();
      utils.mysteries.getRecap.invalidate();
      // Reset the picker so the next deduction starts clean
      setClueAId(null);
      setClueBId(null);
    },
  });

  // Build a clueId → title map from the episode's authored
  // clue list. Falls back to the raw id when an evidence row
  // exists for a clue the episode doesn't list (shouldn't
  // happen in practice).
  const clueTitleById = new Map<string, string>();
  for (const c of episode.data?.clues ?? []) {
    clueTitleById.set(c.id, c.title);
  }

  // Surface only the clues the player has actually found.
  const foundClueIds = (evidenceBoard.data?.evidence ?? []).map((e) => e.clueId);

  if (!episode.data) {
    return (
      <p className="font-mono text-[10px] py-4" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
        Episode data unavailable.
      </p>
    );
  }

  if (foundClueIds.length < 2) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono text-[9px] tracking-[0.3em] mb-2" style={{ color: "var(--energy-accent)" }}>
          DEDUCTION PANEL
        </p>
        <p className="font-mono text-[10px] italic" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
          {foundClueIds.length === 0
            ? "Find at least two clues to start pairing."
            : "Find one more clue before pairing."}
        </p>
      </div>
    );
  }

  const previewResult = preview.data?.result;
  const canSubmit = clueAId && clueBId && clueAId !== clueBId && !submit.isPending;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--energy-accent)" }}>
        DEDUCTION PANEL
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <ClueSelect
          label="Clue A"
          value={clueAId}
          onChange={setClueAId}
          clueIds={foundClueIds}
          excludeId={clueBId}
          titleFor={(id) => clueTitleById.get(id) ?? id}
        />
        <ClueSelect
          label="Clue B"
          value={clueBId}
          onChange={setClueBId}
          clueIds={foundClueIds}
          excludeId={clueAId}
          titleFor={(id) => clueTitleById.get(id) ?? id}
        />
      </div>

      {previewResult && (
        <p
          className="font-mono text-[10px] tracking-[0.25em] mb-3"
          style={{ color: RESULT_COLORS[previewResult]?.fg ?? "#e2e8f0" }}
        >
          PREVIEW · {RESULT_COLORS[previewResult]?.label ?? previewResult.toUpperCase()}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => {
            if (!clueAId || !clueBId) return;
            submit.mutate({ mysteryId, episodeId, clueAId, clueBId });
          }}
          className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-md transition-colors"
          style={{
            background: canSubmit
              ? "color-mix(in oklch, var(--energy-primary) 22%, transparent)"
              : "rgba(255, 255, 255, 0.04)",
            border: canSubmit
              ? "1px solid color-mix(in oklch, var(--energy-primary) 60%, transparent)"
              : "1px solid rgba(255, 255, 255, 0.08)",
            color: canSubmit ? "var(--energy-primary)" : "rgba(226, 232, 240, 0.4)",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          {submit.isPending ? "COMMITTING…" : "COMMIT DEDUCTION"}
        </button>

        {submit.data && (
          <p
            className="font-mono text-[10px] tracking-[0.2em]"
            style={{ color: RESULT_COLORS[submit.data.result]?.fg ?? "#e2e8f0" }}
          >
            {RESULT_COLORS[submit.data.result]?.label ?? submit.data.result.toUpperCase()}
            {submit.data.advancedTo && " · CASE ADVANCED"}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── helpers ─── */

interface ClueSelectProps {
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
  clueIds: string[];
  excludeId: string | null;
  titleFor: (id: string) => string;
}

function ClueSelect({ label, value, onChange, clueIds, excludeId, titleFor }: ClueSelectProps) {
  return (
    <label className="block">
      <span className="block font-mono text-[9px] tracking-[0.3em] mb-1" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
        {label.toUpperCase()}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full font-mono text-[10px] px-2 py-1.5 rounded-md"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          color: "#e2e8f0",
        }}
      >
        <option value="">— select clue —</option>
        {clueIds
          .filter((id) => id !== excludeId)
          .map((id) => (
            <option key={id} value={id}>{titleFor(id)}</option>
          ))}
      </select>
    </label>
  );
}
