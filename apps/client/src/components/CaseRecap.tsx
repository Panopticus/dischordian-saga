/* ═══════════════════════════════════════════════════════
   CASE RECAP — Telltale-style cold-open

   Reads `mysteries.getRecap` and renders the player's
   chronological history of evidence finds, submitted
   deductions, and committed choices for the active case.

   Drives the late-joiner densified-recap rendering (per
   docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §11
   verification probe 6) and the "previously, on…" cold-open
   pattern that opens every Telltale episode.

   The recap is read-only — the player can review but not
   edit history. Choices are surfaced as "X will remember that"
   chips reading the weight tag.
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Eye, Lightbulb, ScrollText } from "lucide-react";

interface CaseRecapProps {
  /** Branded mystery id of the case being recapped. Pass from
   *  CasesPage's active-case query. */
  mysteryId: string;
}

const RESULT_COLORS: Record<string, { fg: string; label: string }> = {
  correct:          { fg: "var(--energy-success)",     label: "DEDUCTION CORRECT" },
  partial:          { fg: "var(--energy-accent)",      label: "PARTIAL CONNECTION" },
  false_lead_named: { fg: "var(--energy-warning)",     label: "FALSE LEAD" },
  nonsense:         { fg: "rgba(226, 232, 240, 0.5)",  label: "NO CONNECTION" },
};

export function CaseRecap({ mysteryId }: CaseRecapProps) {
  const { isAuthenticated } = useAuth();
  const recap = trpc.mysteries.getRecap.useQuery(
    { mysteryId },
    { enabled: isAuthenticated },
  );

  if (recap.isLoading) {
    return (
      <p className="font-mono text-[10px] py-4" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
        Loading recap…
      </p>
    );
  }

  if (!recap.data?.mystery) {
    return null;
  }

  const { evidence, deductions, choices, mystery } = recap.data;

  // Build a clueId → title map from every authored episode in
  // this mystery so the recap can show clue titles, not raw ids.
  const clueTitleById = new Map<string, string>();
  for (const e of mystery.episodes) {
    for (const c of e.clues) clueTitleById.set(c.id, c.title);
  }

  const choiceLabelById = new Map<string, string>();
  for (const e of mystery.episodes) {
    for (const c of e.choices) choiceLabelById.set(c.id, c.label);
  }

  const isEmpty =
    evidence.length === 0 && deductions.length === 0 && choices.length === 0;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--energy-accent)" }}>
        PREVIOUSLY ON THIS CASE
      </p>

      {isEmpty && (
        <p className="font-mono text-[10px] italic" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
          No history yet. Find a clue, submit a deduction, or commit a choice.
        </p>
      )}

      {evidence.length > 0 && (
        <section className="mb-4">
          <p className="font-mono text-[9px] tracking-[0.25em] mb-2 flex items-center gap-2" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
            <Eye size={10} />
            EVIDENCE FOUND ({evidence.length})
          </p>
          <ul className="space-y-1.5">
            {evidence.map((ev) => (
              <li
                key={ev.clueId}
                className="font-mono text-[10px] flex items-start gap-2 leading-relaxed"
                style={{ color: "#e2e8f0" }}
              >
                <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ background: "var(--energy-accent)" }} />
                <span className="flex-1">
                  {clueTitleById.get(ev.clueId) ?? ev.clueId}
                  <span className="ml-2" style={{ color: "rgba(226, 232, 240, 0.4)" }}>
                    · {ev.foundInRoom} · {ev.foundViaVerb}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {deductions.length > 0 && (
        <section className="mb-4">
          <p className="font-mono text-[9px] tracking-[0.25em] mb-2 flex items-center gap-2" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
            <Lightbulb size={10} />
            DEDUCTIONS SUBMITTED ({deductions.length})
          </p>
          <ul className="space-y-1.5">
            {deductions.map((d) => {
              const tone = RESULT_COLORS[d.result];
              return (
                <li
                  key={d.id}
                  className="font-mono text-[10px] flex items-start gap-2 leading-relaxed"
                  style={{ color: "#e2e8f0" }}
                >
                  <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ background: tone?.fg ?? "rgba(226, 232, 240, 0.5)" }} />
                  <span className="flex-1">
                    <span style={{ color: tone?.fg ?? "#e2e8f0" }}>
                      {tone?.label ?? d.result.toUpperCase()}
                    </span>
                    <span className="ml-2" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
                      {clueTitleById.get(d.clueAId) ?? d.clueAId}
                      {" + "}
                      {clueTitleById.get(d.clueBId) ?? d.clueBId}
                      {d.clueCId && ` + ${clueTitleById.get(d.clueCId) ?? d.clueCId}`}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {choices.length > 0 && (
        <section>
          <p className="font-mono text-[9px] tracking-[0.25em] mb-2 flex items-center gap-2" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
            <ScrollText size={10} />
            CHOICES COMMITTED ({choices.length})
          </p>
          <ul className="space-y-1.5">
            {choices.map((c) => (
              <li
                key={c.id}
                className="font-mono text-[10px] flex items-start gap-2 leading-relaxed"
                style={{ color: "#e2e8f0" }}
              >
                <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ background: "var(--energy-primary)" }} />
                <span className="flex-1">
                  <span style={{ color: "#e2e8f0" }}>
                    {choiceLabelById.get(c.choiceId) ?? c.choiceId}
                  </span>
                  <span
                    className="ml-2 font-mono text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      color: "rgba(226, 232, 240, 0.55)",
                    }}
                  >
                    {c.weight}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="font-mono text-[9px] mt-4" style={{ color: "rgba(226, 232, 240, 0.4)" }}>
        The saga remembers. Choices and deductions persist across episodes.
      </p>
    </div>
  );
}
