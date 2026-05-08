/* ═══════════════════════════════════════════════════════
   BLOOD WEAVE PANEL — Stage 3 attunement display.

   Shows the cumulative hierarchyAlignment value, the
   discrete band (dormant / braiding / woven / bound /
   claimed), the next pending reveal threshold + preview,
   and a list of already-revealed Hierarchy / Game-Master
   loredex entry ids.

   Reads:
     trpc.bloodWeave.getState

   File: apps/client/src/components/resurrection/BloodWeavePanel.tsx
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Eye, Lock } from "lucide-react";

const BAND_COPY: Record<
  string,
  { label: string; tone: string; description: string }
> = {
  dormant: {
    label: "Dormant",
    tone: "muted",
    description:
      "The Blood Weave is quiet. You have not pulled hard enough to be heard.",
  },
  braiding: {
    label: "Braiding",
    tone: "blue",
    description:
      "First strands. The Hellbox hums after use. You start to notice.",
  },
  woven: {
    label: "Woven",
    tone: "violet",
    description:
      "The pattern is around you. The Hierarchy's servants are described in dreams that are not yours.",
  },
  bound: {
    label: "Bound",
    tone: "amber",
    description:
      "The pattern has woven you in. The Game Master's shape becomes visible.",
  },
  claimed: {
    label: "Claimed",
    tone: "crimson",
    description:
      "The Hierarchy considers you among its own. Refusal still possible. Costly.",
  },
};

export default function BloodWeavePanel() {
  const stateQuery = trpc.bloodWeave.getState.useQuery();
  if (stateQuery.isLoading) {
    return (
      <div className="p-4 text-sm opacity-70">Reading the Weave…</div>
    );
  }
  const data = stateQuery.data;
  if (!data) {
    return null;
  }
  const band = BAND_COPY[data.band] ?? BAND_COPY.dormant;
  const nextReveal = data.nextReveal;
  const progressPct = nextReveal
    ? Math.round(
        Math.min(100, (data.alignmentValue / nextReveal.threshold) * 100),
      )
    : 100;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Stage 3 — Blood Weave Attunement
        </h3>
        <p className="text-sm opacity-80 max-w-prose">
          Each resurrection threads you closer to the Hierarchy. Each binding
          reads back. The Game Master watches.
        </p>
      </div>

      <Card data-band={data.band}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Alignment</span>
            <Badge>{band.label}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="opacity-80">{band.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span>Cumulative pull</span>
            <span>
              {data.alignmentValue}
              {nextReveal ? ` / ${nextReveal.threshold}` : ""}
            </span>
          </div>
          <Progress value={progressPct} />
          {nextReveal ? (
            <p className="text-xs opacity-70 flex items-start gap-1">
              <Eye className="w-3 h-3 mt-0.5 shrink-0" />
              <span>
                Next reveal at <strong>{nextReveal.threshold}</strong>:{" "}
                {nextReveal.preview}
              </span>
            </p>
          ) : (
            <p className="text-xs opacity-70 flex items-start gap-1">
              <Lock className="w-3 h-3 mt-0.5 shrink-0" />
              <span>All curated reveals delivered. The pattern is yours to read.</span>
            </p>
          )}
        </CardContent>
      </Card>

      {data.revealedEntryIds.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revealed entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            {data.revealedEntryIds.map((id) => (
              <div
                key={id}
                className="flex items-center gap-2 px-2 py-1 rounded bg-foreground/5"
              >
                <Sparkles className="w-3 h-3 opacity-60" />
                <span>{id}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
