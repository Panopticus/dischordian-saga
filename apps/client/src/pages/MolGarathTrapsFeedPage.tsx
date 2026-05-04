/**
 * MolGarathTrapsFeedPage — the "list of traps still being designed"
 *
 * Mol'Garath's audience exposed three deliverables (per
 * molGarathEndgameLayer.ts §7.5): the Labyrinth annotations on the
 * Engineer recordings, the Conspiracy Board final connection, and
 * the live feed of traps currently being designed across the saga.
 *
 * The first two have UI surfaces (Engineer recording modals; Hamlet
 * Conspiracy Board page). This page renders the third — the
 * referee's reading desk, where the Archivist's record updates as
 * Living Universe pressure shifts.
 *
 * Gated on MOL_GARATH_AUDIENCE_FLAG. Until the audience completes,
 * the page renders a locked placeholder.
 */

import { Link } from "wouter";
import { ChevronLeft, Lock, Activity } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  TRAPS_IN_DESIGN,
  type TrapInDesign,
} from "@shared/molGarathEndgameLayer";
import { livingUniverseEventActiveFlag } from "@/hooks/useLivingShipSensor";
import { MOL_GARATH_AUDIENCE_FLAG } from "@shared/matrixSaveFlags";

const DESIGNER_LABEL: Record<TrapInDesign["designer"], string> = {
  the_warlord: "the Warlord",
  the_architect: "the Architect",
  the_hierarchy: "the Hierarchy",
  the_meme: "the Meme",
  shadow_tongue: "Shadow Tongue",
  the_necromancer: "the Necromancer",
  the_red_death: "the Red Death",
  unattributed: "(redacted in my own record)",
};

export default function MolGarathTrapsFeedPage() {
  const { state } = useGame();
  const flags = state.narrativeFlags ?? {};
  const audienceComplete = Boolean(flags[MOL_GARATH_AUDIENCE_FLAG]);

  return (
    <div
      data-page="mol-garath-traps-feed"
      className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-8"
    >
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/mol-garath-audience"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Audience Chamber</span>
        </Link>
        <div className="text-zinc-500 text-xs uppercase tracking-widest">
          Mol'Garath's Reading Desk
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">
          The List of Traps Still Being Designed
        </h1>
        <p className="text-zinc-400 italic mb-8">
          {audienceComplete
            ? "Updated every hour. The Archivist refreshes the page when the universe coughs."
            : "The Archivist has not yet shown you this list. Complete his audience first."}
        </p>

        {!audienceComplete ? (
          <LockedState />
        ) : (
          <ul className="space-y-4">
            {TRAPS_IN_DESIGN.map((trap) => (
              <TrapEntry key={trap.id} trap={trap} flags={flags} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function LockedState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-zinc-500">
      <Lock size={48} className="opacity-50" />
      <p className="text-center max-w-md">
        Mol'Garath does not surface this archive to those who haven't sat with
        him. Win Tier 3 of the chess climb, accept the audience, then return.
      </p>
    </div>
  );
}

function TrapEntry({
  trap,
  flags,
}: {
  trap: TrapInDesign;
  flags: Record<string, boolean>;
}) {
  const liveFlag = livingUniverseEventActiveFlag(trap.livingUniverseEventId);
  const live = Boolean(flags[liveFlag]);

  return (
    <li
      className={`rounded-lg border p-5 ${
        live ? "border-amber-700/50 bg-amber-950/10" : "border-zinc-800 bg-zinc-900/40"
      }`}
      data-trap={trap.id}
      data-live={live ? "true" : "false"}
    >
      <div className="flex items-start gap-3">
        <Activity
          size={18}
          className={`shrink-0 mt-0.5 ${live ? "text-amber-400" : "text-zinc-600"}`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-medium text-zinc-100">{trap.label}</h3>
            <span
              className={`text-xs uppercase tracking-widest shrink-0 ${
                live ? "text-amber-300" : "text-zinc-600"
              }`}
            >
              {live ? "live" : "watched"}
            </span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-3">
            {trap.description}
          </p>
          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-500">
            <div>
              <span className="uppercase tracking-widest">Designer · </span>
              <span className="italic">{DESIGNER_LABEL[trap.designer]}</span>
            </div>
            <div>
              <span className="uppercase tracking-widest">Counter · </span>
              <span className="italic">{trap.counterSystem.replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
