/* ═══════════════════════════════════════════════════════
   RECRUIT IMPRINT PANEL
   Surfaces the five recruitable NPCs (Vex Solène, Wraith
   Calder, Locke, Jericho Jones, Akai Shi). Reads:
     trpc.npcRecruit.getRecruitableRoster
   Mutates:
     trpc.npcRecruit.recruit({ npcKey })
   On success, the recruited NPC is on the unified crew
   roster (productionPath="recruited", linkedNpcKey set).

   Akai Shi is gated behind the global Necromancer-event
   completion narrative flag — the panel surfaces the gate
   copy regardless; the server enforces.

   File: apps/client/src/components/imprints/RecruitImprintPanel.tsx
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, ShieldCheck, Lock } from "lucide-react";

type NpcKey =
  | "vex_solene"
  | "wraith_calder"
  | "locke"
  | "jericho_jones"
  | "akai_shi";

const ARCHETYPE_BLURB: Record<string, string> = {
  artisan: "Builder. Hands trust hands. Keeps a notch for the next maker.",
  revenant: "Came back. Names on a list. The list keeps growing.",
  sentinel: "Stands the post. The watch outlives the watcher.",
  zealot: "The Cause is the team in the room. Smaller theology, bigger fight.",
  ghost: "Not in the manifest. Already in the room.",
};

export default function RecruitImprintPanel() {
  const utils = trpc.useUtils();
  const rosterQuery = trpc.npcRecruit.getRecruitableRoster.useQuery();
  const crewQuery = trpc.crew.getState.useQuery();
  const recruit = trpc.npcRecruit.recruit.useMutation({
    onSuccess: (res, vars) => {
      utils.crew.getState.invalidate();
      utils.npcRecruit.getRecruitableRoster.invalidate();
      if (res.alreadyRecruited) {
        toast.info(
          `${humanize(vars.npcKey)} is already on the crew roster.`,
        );
      } else {
        toast.success(
          `${humanize(vars.npcKey)} joined the crew. The Human nodded once.`,
          { duration: 9000 },
        );
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const recruitedKeys = useMemo(() => {
    const set = new Set<string>();
    const members = crewQuery.data?.roster?.members ?? [];
    for (const m of members) {
      if (m.linkedNpcKey) set.add(m.linkedNpcKey);
    }
    return set;
  }, [crewQuery.data]);

  if (rosterQuery.isLoading) {
    return <div className="p-4 text-sm opacity-70">Loading recruitment roster…</div>;
  }
  const roster = rosterQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Recruit a Named Crew Member
        </h2>
        <p className="text-sm opacity-80 mt-1 max-w-prose">
          Five named characters can join the crew of the inception ark. They are
          full unified-roster members — they fight, bond, can die. If they die
          in battle, the world they belonged to closes around them; reopening
          it requires the Resurrection Protocols quest.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roster.map((npc) => {
          const already = recruitedKeys.has(npc.npcKey);
          const blurb = npc.archetype
            ? ARCHETYPE_BLURB[npc.archetype] ?? ""
            : "";
          return (
            <Card key={npc.npcKey} data-recruited={already || undefined}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{npc.displayName}</span>
                  {already ? (
                    <Badge>
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      On Crew
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {npc.archetype ?? "—"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {blurb ? <p className="opacity-80">{blurb}</p> : null}
                <p className="text-xs opacity-70 flex items-start gap-1">
                  <Lock className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{npc.gateDescription}</span>
                </p>
                <div className="grid grid-cols-3 gap-1 text-xs pt-1">
                  <Stat label="RES" v={npc.stats.resilience} />
                  <Stat label="INT" v={npc.stats.intellect} />
                  <Stat label="REF" v={npc.stats.reflexes} />
                  <Stat label="EMP" v={npc.stats.empathy} />
                  <Stat label="IMM" v={npc.stats.immunity} />
                  <Stat label="ADP" v={npc.stats.adaptability} />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => recruit.mutate({ npcKey: npc.npcKey as NpcKey })}
                    disabled={already || recruit.isPending}
                    size="sm"
                    className="w-full"
                  >
                    {already ? "Already on crew" : "Recruit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between rounded px-2 py-0.5 bg-foreground/5">
      <span className="opacity-70">{label}</span>
      <span>{v}</span>
    </div>
  );
}

function humanize(key: string): string {
  return key.split("_").map((s) => s[0]?.toUpperCase() + s.slice(1)).join(" ");
}
