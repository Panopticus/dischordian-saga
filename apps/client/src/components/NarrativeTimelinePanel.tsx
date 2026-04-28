/* ═══════════════════════════════════════════════════════
   NARRATIVE TIMELINE PANEL — Phase 5

   Visualises the canonical NPC entry timeline grouped by
   canonical phase (pre-Act-1 → Act 1 → post-Act-1 →
   post-DMC-season → Acts-4-plus). Reads NARRATIVE_TIMELINE
   from apps/shared/npcs/narrativeTimeline.ts; resolves each
   entry's gate against the player's current state via
   canEncounterForFirstTime.

   Drives the "When does each NPC enter the saga?" UX —
   shows what's met / unmet / already-encountered for every
   priority-roster character.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import {
  NARRATIVE_TIMELINE,
  entryPointsByPhase,
  canEncounterForFirstTime,
  type EntryPhase,
  type NarrativeEntryPoint,
} from "@shared/npcs/narrativeTimeline";
import { NPC_REGISTRY } from "@shared/npcs/registry";
import { CheckCircle2, Lock, Clock, ChevronRight } from "lucide-react";

const PHASE_ORDER: ReadonlyArray<EntryPhase> = [
  "pre_act_1",
  "act_1",
  "post_act_1",
  "post_dmc_season",
  "acts_4_plus",
];

const PHASE_LABELS: Record<EntryPhase, string> = {
  pre_act_1: "Awakening Protocol",
  act_1: "Act 1 — Chapter Cycle",
  post_act_1: "Post-Act-1 — Trade Empire Unlock",
  post_dmc_season: "Post-DMC-Season — Severance Prize",
  acts_4_plus: "Acts 4+ — Substrate Channels",
};

interface NarrativeTimelinePanelProps {
  /** Player's current canonical public flags. */
  publicFlags: ReadonlySet<string>;
  /** Player's narrative flags. */
  narrativeFlags: ReadonlySet<string>;
  /** Current saga act (1-7). */
  act: number;
  /** Optional set of completed chapter IDs. */
  completedChapters?: ReadonlySet<string>;
  /** Optional Authority Trial outcome. */
  trialOutcome?: "execution" | "delay" | "acquittal";
  /** Optional set of canonical ripple events fired. */
  rippleEventsFired?: ReadonlySet<string>;
  /** Optional set of npcKeys the player has already canonically met. */
  metNpcs?: ReadonlySet<string>;
}

interface EntryStatus {
  status: "met" | "available" | "locked";
  unmet: ReadonlyArray<string>;
}

const EMPTY_SET: ReadonlySet<string> = new Set();

function statusFor(
  entry: NarrativeEntryPoint,
  ctx: NarrativeTimelinePanelProps,
): EntryStatus {
  if (ctx.metNpcs?.has(entry.npcKey)) {
    return { status: "met", unmet: [] };
  }
  const canEncounter = canEncounterForFirstTime(entry, {
    publicFlags: ctx.publicFlags,
    flags: ctx.narrativeFlags,
    act: ctx.act,
    completedChapters: ctx.completedChapters ?? EMPTY_SET,
    trialOutcome: ctx.trialOutcome,
    rippleEventsFired: ctx.rippleEventsFired ?? EMPTY_SET,
  });
  if (canEncounter) {
    return { status: "available", unmet: [] };
  }
  // Compute canonical-readable unmet reasons from the gate.
  const unmet: string[] = [];
  const g = entry.gate;
  if (g.minAct !== undefined && ctx.act < g.minAct) {
    unmet.push(`Reach Act ${g.minAct}`);
  }
  if (g.requiredChapter && !(ctx.completedChapters?.has(g.requiredChapter))) {
    unmet.push(`Complete chapter ${g.requiredChapter}`);
  }
  if (g.requiredTrialOutcome && g.requiredTrialOutcome !== ctx.trialOutcome) {
    unmet.push(`Authority Trial outcome: ${g.requiredTrialOutcome}`);
  }
  if (g.requiredRippleEvent && !(ctx.rippleEventsFired?.has(g.requiredRippleEvent))) {
    unmet.push(`Trigger ${g.requiredRippleEvent}`);
  }
  for (const f of g.publicFlags ?? []) {
    if (!ctx.publicFlags.has(f)) unmet.push(`Public flag: ${f}`);
  }
  for (const f of g.flags ?? []) {
    if (!ctx.narrativeFlags.has(f)) unmet.push(`Narrative flag: ${f}`);
  }
  return { status: "locked", unmet };
}

export function NarrativeTimelinePanel(props: NarrativeTimelinePanelProps) {
  const grouped = useMemo(() => {
    return PHASE_ORDER.map((phase) => {
      const entries = entryPointsByPhase(phase);
      const sorted = [...entries].sort((a, b) =>
        (a.phaseOrder ?? 999) - (b.phaseOrder ?? 999),
      );
      return { phase, entries: sorted };
    });
  }, []);

  return (
    <div className="void-bg-sunk void-border w-full rounded border">
      <div className="void-border void-bg-system border-b p-4">
        <h2 className="void-text-primary text-lg font-semibold">
          Narrative Timeline
        </h2>
        <p className="void-text-muted mt-1 text-xs">
          Canonical entry-points for the priority-roster NPCs. Lines fire at
          their canonical canonical-saga-time per bible canon — earlier
          characters meet you in the Awakening Protocol; later ones unlock as
          the saga's canonical-gates open.
        </p>
      </div>

      <div className="divide-y divide-[var(--void-border-color)]">
        {grouped.map(({ phase, entries }) => (
          <section key={phase} className="p-4">
            <h3 className="void-text-accent mb-3 text-sm font-semibold uppercase tracking-wider">
              {PHASE_LABELS[phase]}
            </h3>
            <ul className="space-y-2">
              {entries.map((entry) => {
                const profile = NPC_REGISTRY[entry.npcKey];
                const { status, unmet } = statusFor(entry, props);
                return (
                  <li
                    key={entry.npcKey}
                    className="void-border void-bg-system flex items-start gap-3 rounded border p-3"
                  >
                    <span className="mt-0.5 flex-shrink-0">
                      {status === "met" && (
                        <CheckCircle2 className="void-text-success h-4 w-4" />
                      )}
                      {status === "available" && (
                        <ChevronRight className="void-text-accent h-4 w-4" />
                      )}
                      {status === "locked" && (
                        <Lock className="void-text-muted h-4 w-4" />
                      )}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="void-text-primary font-medium">
                          {profile?.name ?? entry.npcKey}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider ${
                            status === "met"
                              ? "void-text-success"
                              : status === "available"
                                ? "void-text-accent"
                                : "void-text-muted"
                          }`}
                        >
                          {status === "met"
                            ? "Met"
                            : status === "available"
                              ? "Ready"
                              : "Locked"}
                        </span>
                      </div>
                      <p className="void-text-muted mt-1 text-xs italic">
                        {entry.canonicalRationale}
                      </p>
                      {status === "locked" && unmet.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {unmet.map((reason, i) => (
                            <li
                              key={i}
                              className="void-text-muted flex items-start gap-1 text-[10px]"
                            >
                              <Clock className="mt-0.5 h-3 w-3 flex-shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="void-border void-bg-system border-t p-3">
        <p className="void-text-muted text-[10px] italic">
          {NARRATIVE_TIMELINE.length} canonical entry-points across{" "}
          {PHASE_ORDER.length} canonical phases.
        </p>
      </div>
    </div>
  );
}
