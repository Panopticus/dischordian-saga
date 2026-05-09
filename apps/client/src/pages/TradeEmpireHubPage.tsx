/* ═══════════════════════════════════════════════════════
   TradeEmpireHubPage — unified Trade Empire hub.

   Three tabs over the existing economic / political /
   convergence layers:

     • Map & Missions  → embeds the existing TradeEmpirePage
                        (mission dispatch, sector reputation,
                        Oracle futures, spy covers, route
                        milestones, contract signing).
     • Court & Politics → embeds the existing TradeCourtPage
                        (sub-house reputation, declarations,
                        agendas, demands, tribute, public-
                        knowledge feed).
     • Convergence    → renders TradeConvergencePanel
                        (Phase D.5 doom clock + saturation
                        HUD + resolution previews).

   The existing /trade-empire and /court routes still resolve;
   this hub becomes the merged surface and is mounted at
   /trade-empire/hub. Players already familiar with the deep
   links keep them; new entry points use the hub.

   This is a thin embed layer — the heavy pages keep all
   their existing internals. No tested behaviour of either
   page changes.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import TradeEmpirePage from "@/game/TradeEmpirePage";
import TradeCourtPage from "@/pages/TradeCourtPage";
import TradeConvergencePanel from "@/components/tradeEmpire/TradeConvergencePanel";

type HubTab = "map" | "court" | "convergence";

function SeasonBanner() {
  const snap = trpc.tradeCourt.courtSnapshot.useQuery();
  const season = snap.data?.season;
  const seasonNumber = season?.seasonNumber ?? 1;
  const phase = season?.phase ?? "running";
  const declaration = season?.declaration ?? null;

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-sm">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
          Season {seasonNumber}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
          phase: {phase}
        </span>
      </div>
      {declaration && (
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-white/40">
            active declaration
          </div>
          <div className="font-medium text-white/85">{declaration.declarationKey}</div>
        </div>
      )}
    </div>
  );
}

export default function TradeEmpireHubPage() {
  const [tab, setTab] = React.useState<HubTab>("map");

  return (
    <div className="mx-auto max-w-screen-2xl space-y-3 p-4">
      <SeasonBanner />
      <Tabs value={tab} onValueChange={v => setTab(v as HubTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">Map & Missions</TabsTrigger>
          <TabsTrigger value="court">Court & Politics</TabsTrigger>
          <TabsTrigger value="convergence">Convergence</TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="mt-3">
          {/* The existing economic surface, unchanged. */}
          <TradeEmpirePage />
        </TabsContent>
        <TabsContent value="court" className="mt-3">
          {/* The existing political surface, unchanged. */}
          <TradeCourtPage />
        </TabsContent>
        <TabsContent value="convergence" className="mt-3">
          <TradeConvergencePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
