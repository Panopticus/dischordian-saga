/* ═══════════════════════════════════════════════════════
   WITNESSING WALL PANEL — Appendix A.10

   Mounted inside the Trophy Room. Shows every witnessing
   artifact the player has accumulated: Kael Fragments,
   memorable moments, DMC identity chain, dismissed
   companion lines, and authored Dischordia cards.

   Pure presentation — consumes buildWitnessingWall() from
   shared and renders a flat list. The caller (Trophy Room)
   owns the heading and placement.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { Link } from "wouter";
import { Scroll, ExternalLink } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useMemorableMomentsStore } from "@/stores/memorableMomentsStore";
import {
  buildWitnessingWall,
  type WitnessingWallEntry,
} from "@shared/witnessingIntegrations";
import { KAEL_FRAGMENTS } from "@shared/appendixBKaelQuestline";

/**
 * Icon per wall entry kind. Single glyph so we can stay in
 * the Trophy Room's existing visual vocabulary.
 */
const KIND_GLYPH: Record<WitnessingWallEntry["kind"], string> = {
  authored_card: "◆",
  dead_pet: "†",
  dismissed_line: "—",
  dmc_identity: "§",
  kael_fragment: "◇",
  memorable_moment: "•",
};

export function WitnessingWallPanel() {
  const { state: gameState } = useGame();
  const moments = useMemorableMomentsStore((s) => s.moments);

  const entries = useMemo<WitnessingWallEntry[]>(() => {
    const flags = gameState.narrativeFlags ?? {};

    // Which Kael fragments has the player unlocked?
    const unlockedFragmentIds = KAEL_FRAGMENTS.filter((f) => flags[f.flag]).map(
      (f) => f.id,
    );

    // Pull any authored DMC identity names off the flag set.
    // The runtime DMC system stores the chosen name in a
    // parallel flag (e.g. `dmc_student_name`). We tolerate
    // strings or undefined.
    const chain = {
      student:
        typeof flags.dmc_student_name === "string"
          ? flags.dmc_student_name
          : undefined,
      seeker:
        typeof flags.dmc_seeker_name === "string"
          ? flags.dmc_seeker_name
          : undefined,
      detective:
        typeof flags.dmc_detective_name === "string"
          ? flags.dmc_detective_name
          : undefined,
      last:
        typeof flags.dmc_last_name === "string"
          ? flags.dmc_last_name
          : undefined,
    };

    // Top memorable moments (up to 10, most recent first).
    const topMemorableMoments = [...moments]
      .sort((a, b) => b.capturedAt - a.capturedAt)
      .slice(0, 10)
      .map((m) => ({
        title: m.subtitle,
        timestamp: m.capturedAt,
      }));

    // The store inputs for authoredCards / deadPets /
    // dismissedLines aren't centralized yet — pass empty
    // arrays so the wall surfaces what IS available today.
    // The helper deduplicates and tolerates sparse input.
    return buildWitnessingWall({
      authoredCards: [],
      deadPets: [],
      dismissedLines: [],
      dmcIdentityChain: chain,
      unlockedFragmentIds,
      topMemorableMoments,
    });
  }, [gameState.narrativeFlags, moments]);

  const hubLink = (
    <Link
      href="/witnessing"
      className="mt-3 flex items-center justify-center gap-1.5 rounded-sm border void-border void-bg-sunk px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider void-text-accent void-border void-bg-sunk transition-colors"
    >
      Open the Witnessing Hub
      <ExternalLink size={11} />
    </Link>
  );

  if (entries.length === 0) {
    return (
      <div className="rounded-md border void-border void-bg-canvas p-4 font-mono text-[11px] void-text-accent">
        <div className="mb-2 flex items-center gap-2 void-text-accent">
          <Scroll size={14} />
          <span className="tracking-[0.2em]">THE WITNESSING WALL</span>
        </div>
        <p className="void-text-accent">
          The wall is blank. It is waiting for something to happen.
        </p>
        {hubLink}
      </div>
    );
  }

  return (
    <div className="rounded-md border void-border void-bg-canvas p-4">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] void-text-accent tracking-[0.2em]">
        <Scroll size={14} />
        <span>THE WITNESSING WALL</span>
        <span className="ml-auto void-text-accent">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <ul className="space-y-1.5">
        {entries.map((e, i) => (
          <li
            key={`${e.kind}_${i}`}
            className="flex items-baseline gap-2 border-l void-border pl-3 font-mono text-[11px] void-text-accent"
          >
            <span
              aria-hidden
              className="w-3 shrink-0 text-center void-text-accent"
            >
              {KIND_GLYPH[e.kind]}
            </span>
            <span className="flex-1 truncate">{e.title}</span>
            {e.subtitle && (
              <span className="truncate text-[10px] void-text-accent">
                {e.subtitle}
              </span>
            )}
          </li>
        ))}
      </ul>
      {hubLink}
    </div>
  );
}
