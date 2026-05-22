/* ═══════════════════════════════════════════════════════
   WitnessLedgerPanel

   Renders Daniel Cross's Antiquarian Witness Ledger — the
   server-side aggregate of every companion-quest narrative
   flag the player has accrued. Each `potential.*` flag the
   trpc procedure returns represents one "potential collapsed
   into fact" — the in-world embodiment of the canonical
   maxim "all potentials shape the universe."

   Surfaces three views:
     • Totals — count of potentials collapsed.
     • By Anchor — per-NPC card-flavor fragments grouped by
       the character who witnessed them.
     • Season Arcs — chapter progress for the five chained
       narrative arcs whose finales gate card unlocks.

   Voice surface only — apps/shared/tradeEmpire/witnessLedger.ts
   owns the aggregation.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { ScrollText, BookOpen, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface LedgerEntry {
  flag: string;
  questId: string;
  questTitle: string;
  cardId: string;
  fragment: string;
}

const ANCHOR_LABELS: Record<string, string> = {
  elara: "Elara",
  the_human: "The Human",
  the_antiquarian: "Daniel Cross",
  the_seer: "The Seer",
  the_necromancer: "The Necromancer",
  engineer_zero: "Engineer Zero",
  iron_lion_prefall: "Iron Lion (Pre-Fall)",
  drael_mon: "Drael'Mon",
  the_architect: "The Architect",
  the_dreamer: "The Dreamer",
  the_source: "The Source",
  the_degen: "The Degen",
  the_game_master: "The Game Master",
  the_resurrectionist: "The Resurrectionist",
  vex_solene: "Vex Solène",
  adjudicator_locke: "Adjudicator Locke",
  nilmorg: "Nilmorg",
  wraith_calder: "Wraith Calder",
  the_oracle: "The Oracle",
  jericho_jones: "Jericho Jones",
  the_meme: "The Meme",
  your_eidolon: "Your Eidolon",
};

function labelForAnchor(key: string): string {
  return ANCHOR_LABELS[key] ?? key;
}

export function WitnessLedgerPanel() {
  const query = trpc.npcDialogues.getWitnessLedger.useQuery(undefined, {
    staleTime: 30_000,
  });

  if (query.isLoading) {
    return (
      <div className="p-6 text-amber-100/60 italic text-center">
        The Archive turns its page.
      </div>
    );
  }
  if (query.isError || !query.data) {
    return (
      <div className="p-6 text-rose-300/80 italic text-center">
        The Archive declines to recognise you today.
      </div>
    );
  }

  const ledger = query.data;
  const anchorEntries = Object.entries(ledger.byAnchor).sort(
    ([, a], [, b]) => (b as LedgerEntry[]).length - (a as LedgerEntry[]).length,
  );

  return (
    <div className="space-y-6 p-4 bg-stone-900/40 border border-amber-900/30 rounded-md">
      {/* Header */}
      <header className="flex items-start gap-3 border-b border-amber-900/30 pb-3">
        <ScrollText className="w-5 h-5 mt-1 text-amber-300" />
        <div>
          <h2 className="text-lg font-serif text-amber-100">
            Witness Ledger
          </h2>
          <p className="text-xs text-amber-100/60 italic mt-1">
            Daniel Cross writes the margin note before you finish reading. Every
            completed errand is a potential collapsed into fact —{" "}
            <span className="text-amber-200">
              {ledger.totalPotentials}
            </span>{" "}
            on file.
          </p>
        </div>
      </header>

      {/* Season Arc Progress */}
      <section>
        <h3 className="text-sm font-semibold text-amber-200 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Season Arcs
        </h3>
        <ul className="space-y-1">
          {ledger.arcProgress.map((arc) => {
            const pct = Math.round((arc.closed / arc.total) * 100);
            const full = arc.closed >= arc.total;
            return (
              <li
                key={arc.arcId}
                className="flex items-center justify-between text-sm py-1"
              >
                <span
                  className={full ? "text-emerald-300" : "text-amber-100/80"}
                >
                  {arc.title}
                </span>
                <span className="text-xs font-mono text-amber-100/60">
                  {arc.closed}/{arc.total} · {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* By Anchor */}
      <section>
        <h3 className="text-sm font-semibold text-amber-200 mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Witnesses
        </h3>
        {anchorEntries.length === 0 ? (
          <p className="text-xs text-amber-100/50 italic">
            The shelves are empty. Walk a sector. Speak with a witness.
          </p>
        ) : (
          <div className="space-y-3">
            {anchorEntries.map(([anchor, entries]) => (
              <div
                key={anchor}
                className="border-l-2 border-amber-700/40 pl-3"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-amber-200">
                    {labelForAnchor(anchor)}
                  </span>
                  <span className="text-xs font-mono text-amber-100/40">
                    {(entries as LedgerEntry[]).length} note
                    {(entries as LedgerEntry[]).length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className="mt-1 space-y-1">
                  {(entries as LedgerEntry[]).slice(0, 3).map((e) => (
                    <li key={e.flag} className="text-xs">
                      <span className="text-amber-100/90">{e.questTitle}</span>
                      <span className="text-amber-100/50 italic ml-2">
                        "{e.fragment}"
                      </span>
                    </li>
                  ))}
                  {(entries as LedgerEntry[]).length > 3 ? (
                    <li className="text-xs text-amber-100/40 italic">
                      … and {(entries as LedgerEntry[]).length - 3} more
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
