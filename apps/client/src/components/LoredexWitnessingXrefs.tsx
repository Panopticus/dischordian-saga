/* ═══════════════════════════════════════════════════════
   LOREDEX WITNESSING CROSS-REFERENCES

   Mounted on EntityPage. Given the entity's Loredex id,
   looks up any Mascoteer / Mechronis Professor xrefs and
   surfaces them as a "See also" panel. Falls back to the
   active Appendix A notes when the entry matches a
   canonical cross-system concept.

   Pure presentation — consumes the helpers in
   apps/shared/witnessingCanonXref.ts and
   apps/shared/witnessingIntegrations.ts.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  getMascoteerReferences,
  getMechronisProfessorReferences,
  type WitnessingXref,
} from "@shared/witnessingCanonXref";
import { listActiveAppendixAXrefs } from "@shared/witnessingIntegrations";

export interface LoredexWitnessingXrefsProps {
  /** The Loredex entry id (matches entry.id in loredex-data.json). */
  entryId: string;
  /** Optional — the entry name, for a friendlier heading. */
  entryName?: string;
}

const KIND_LABEL: Record<WitnessingXref["kind"], string> = {
  slideshow: "Slideshow",
  milestone: "Milestone",
  dialog_line: "Dialog line",
  memorable_moment: "Memorable moment",
  forcing_flag: "Forcing flag",
};

export function LoredexWitnessingXrefs({
  entryId,
  entryName,
}: LoredexWitnessingXrefsProps) {
  const { state: gameState } = useGame();

  const directXrefs = useMemo<readonly WitnessingXref[]>(() => {
    // Try the entity id as both a Mascoteer id and a
    // Professor id. Both helpers return [] for unknown ids,
    // so the union is safe.
    const mascoteer = getMascoteerReferences(entryId);
    const professor = getMechronisProfessorReferences(entryId);
    return [...mascoteer, ...professor];
  }, [entryId]);

  const activeNotes = useMemo(
    () => listActiveAppendixAXrefs(gameState.narrativeFlags ?? {}),
    [gameState.narrativeFlags],
  );

  if (directXrefs.length === 0 && activeNotes.length === 0) return null;

  return (
    <section
      aria-label="Witnessing cross-references"
      className="mt-6 rounded-md border border-amber-900/40 bg-stone-950/60 p-4"
    >
      <header className="mb-3 flex items-center gap-2 font-mono text-[11px] text-amber-200 tracking-[0.2em]">
        <Sparkles size={14} />
        <span>WITNESSING CROSS-REFERENCES</span>
        {entryName && (
          <span className="ml-auto text-amber-300/50">{entryName}</span>
        )}
      </header>

      {directXrefs.length > 0 && (
        <ul className="space-y-1.5">
          {directXrefs.map((ref, i) => (
            <li
              key={`${ref.refId}_${i}`}
              className="flex items-baseline gap-2 border-l border-amber-900/30 pl-3 font-mono text-[11px] text-amber-100/85"
            >
              <span className="w-20 shrink-0 text-[10px] uppercase text-amber-400/70">
                {KIND_LABEL[ref.kind]}
              </span>
              <span className="flex-1">{ref.context}</span>
              <span className="shrink-0 text-[10px] text-amber-300/50">
                {ref.refId}
              </span>
            </li>
          ))}
        </ul>
      )}

      {activeNotes.length > 0 && (
        <div className="mt-3 border-t border-amber-900/20 pt-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-amber-400/70">
            Active integrations
          </p>
          <ul className="space-y-1">
            {activeNotes.map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-2 font-mono text-[11px] text-amber-100/80"
              >
                <ExternalLink
                  size={10}
                  className="mt-0.5 shrink-0 text-amber-400/60"
                />
                <span>{n.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
