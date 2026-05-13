import { trpc } from "@/lib/trpc";
import { Skull } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   NEMESIS TICKER — Phase K3

   Single-line strip showing the highest-grudge active
   Nemesis operating in this surface, plus their faction
   alignment and any active plan targeting this surface.
   Mountable on /trade-empire, /casino, /hub.

   Reads `trpc.nemesis.getActiveNemeses` (Mordor-Saga
   accumulate model) + `trpc.nemesis.listActivePlans` and
   filters to plans whose targetSurface matches this
   surface. Renders nothing if the player has no active
   Nemeses operating here — fail-quiet by design.
   ═══════════════════════════════════════════════════════ */

interface NemesisTickerProps {
  /** Which surface this ticker is on. Matches the
   *  Nemesis-plan `targetSurface` strings. */
  surface: "trade-empire" | "casino" | "hub" | "apprentice";
}

const SURFACE_LABEL: Record<NemesisTickerProps["surface"], string> = {
  "trade-empire": "Trade Empire",
  "casino": "Casino",
  "hub": "Governance Hub",
  "apprentice": "Apprentice Trial",
};

const FACTION_LABEL: Record<string, string> = {
  hierarchy: "the Hierarchy",
  insurgency: "the Insurgency",
  new_babylon: "New Babylon",
  architect_remnants: "the Architect Remnants",
  dreamers_children: "the Dreamer's Children",
};

export function NemesisTicker({ surface }: NemesisTickerProps) {
  const nemeses = trpc.nemesis.getActiveNemeses.useQuery();
  const plans = trpc.nemesis.listActivePlans.useQuery();

  if (nemeses.isLoading || plans.isLoading) return null;
  if (!nemeses.data || nemeses.data.length === 0) return null;

  // Filter plans to ones operating on this surface
  const surfacePlans = (plans.data ?? []).filter(
    (p) => p.targetSurface === surface,
  );
  if (surfacePlans.length === 0) {
    // No active plan on this surface — render a low-key
    // "they're aware of you here" line for the highest-grudge
    // Nemesis whose preferredSurface matches.
    const watchful = nemeses.data
      .filter((n) => n.preferredSurface === surface)
      .sort((a, b) => b.grudgeTier - a.grudgeTier)[0];
    if (!watchful) return null;
    const factionLabel = FACTION_LABEL[watchful.alignedFaction ?? "hierarchy"];
    return (
      <div className="rounded border border-amber-900/30 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400 flex items-center gap-2">
        <Skull className="size-3.5 text-amber-500/80" />
        <span>
          <span className="text-amber-300/90 font-medium">
            {watchful.identity.nameRevealed
              ? watchful.identity.properName
              : `The ${watchful.identity.archetypeTitle}`}
          </span>
          {" — operating from here for "}
          <span className="text-amber-300/90">{factionLabel}</span>
          {". They have not yet acted, but they are watching."}
        </span>
      </div>
    );
  }

  // Active plan(s) — surface the most-imminent one
  const sorted = [...surfacePlans].sort(
    (a, b) => new Date(a.ticksAt).getTime() - new Date(b.ticksAt).getTime(),
  );
  const plan = sorted[0];
  const planNemesis = nemeses.data.find((n) => n.id === plan.nemesisId);
  if (!planNemesis) return null;
  const factionLabel = FACTION_LABEL[planNemesis.alignedFaction ?? "hierarchy"];
  const ticksAtFmt = new Date(plan.ticksAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className="rounded border border-amber-700/50 bg-amber-950/20 px-3 py-2 text-xs text-amber-200 flex items-center gap-2">
      <Skull className="size-3.5 text-amber-400" />
      <span>
        <span className="font-medium">
          {planNemesis.identity.nameRevealed
            ? planNemesis.identity.properName
            : `The ${planNemesis.identity.archetypeTitle}`}
        </span>
        {" is acting in "}
        <span>{SURFACE_LABEL[surface]}</span>
        {" for "}
        <span>{factionLabel}</span>
        {": "}
        <span className="italic text-amber-100">{plan.loreTitle}</span>
        {" "}
        <span className="text-amber-400/80">(ticks {ticksAtFmt})</span>
      </span>
    </div>
  );
}
