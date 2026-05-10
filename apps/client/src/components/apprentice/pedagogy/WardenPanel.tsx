/* ═══════════════════════════════════════════════════════
   WARDEN PANEL — rival recruitment + purge notice UI.

   Two surfaces:
     • Offerings — Warden-trained candidates at the recruit
       screen (cycle-rotating).
     • Purge notice — Day-14 forced dialogue when apprentice
       holds the Heretical Quiet doctrine.

   File: apps/client/src/components/apprentice/pedagogy/WardenPanel.tsx
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { KeyRound, AlertTriangle, FileWarning } from "lucide-react";

type DoctrineId =
  | "compliant_mouth" | "forked_path" | "cold_hand"
  | "heretical_quiet" | "human_remainder";

interface OfferingsProps {
  cycle: number;
  onAccept?: (candidateId: string, forcedDoctrine: DoctrineId) => void;
}

export function WardenOfferings({ cycle, onAccept }: OfferingsProps) {
  const offeringsQuery = trpc.apprenticePedagogy.wardenOfferings.useQuery({ cycle });
  const offerings = offeringsQuery.data ?? [];

  if (offeringsQuery.isLoading) {
    return <div className="p-4 text-slate-400 text-sm">Inspector Veil-7 is consulting their notes...</div>;
  }

  if (offerings.length === 0) {
    return (
      <Card className="border-slate-800">
        <CardContent className="p-4 text-sm text-slate-500 italic">
          The Warden has nothing for you this cycle.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-300 px-1 flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-slate-400" />
        Inspector Veil-7's offerings — cycle {cycle}.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {offerings.map(c => (
          <Card key={c.id} className="border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span>{c.name}</span>
                <Badge className="bg-slate-800 text-slate-300 text-xs">{c.archetype}</Badge>
              </CardTitle>
              <div className="text-xs text-slate-500">forced doctrine: {c.forcedDoctrineId.replace("_", " ")}</div>
            </CardHeader>
            <CardContent>
              <div className="text-sm italic text-slate-300 mb-2">"{c.pitch}"</div>
              <div className="text-xs text-rose-300 mb-3 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>Cost: {c.cost}</span>
              </div>
              <div className="text-xs text-slate-500 mb-3">
                Stat floor: <strong className="text-slate-300">{c.statFloor}</strong>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => onAccept?.(c.id, c.forcedDoctrineId as DoctrineId)}
              >
                Accept the Warden's offer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface PurgeNoticeProps {
  apprenticeName: string;
  onResolve?: (optionId: "accept_exit" | "refuse_exit" | "negotiate", deltas: {
    bondDelta: number; corruptionDelta: number; architectInfluenceDelta: number;
  }) => void;
}

export function WardenPurgeNotice({ apprenticeName, onResolve }: PurgeNoticeProps) {
  const noticeQuery = trpc.apprenticePedagogy.wardenPurgeNotice.useQuery({ apprenticeName });
  const [resolved, setResolved] = useState(false);

  if (noticeQuery.isLoading || !noticeQuery.data) {
    return null;
  }

  const notice = noticeQuery.data;

  if (resolved) {
    return (
      <Card className="border-slate-800">
        <CardContent className="p-4 text-sm text-slate-400 italic">
          The Warden has left the dock. The next conversation will not be the kind one.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-rose-900/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileWarning className="w-5 h-5 text-rose-300" />
          Warden Purge Notice — Day 14
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm italic text-slate-300 whitespace-pre-wrap">{notice.prompt}</div>
        <div className="text-sm text-slate-200 whitespace-pre-wrap">{notice.exitOffer}</div>
        <div className="space-y-2">
          {notice.options.map(opt => (
            <button
              key={opt.id}
              className="w-full text-left p-3 rounded border border-slate-800 hover:border-rose-500 transition-colors"
              onClick={() => {
                onResolve?.(opt.id, {
                  bondDelta: opt.bondDelta,
                  corruptionDelta: opt.corruptionDelta,
                  architectInfluenceDelta: opt.architectInfluenceDelta,
                });
                setResolved(true);
                toast.info(`The Warden ${opt.id === "refuse_exit" ? "writes a single line." : "writes nothing down."}`);
              }}
            >
              <div className="text-sm font-medium">{opt.label}</div>
              <div className="mt-1 text-xs italic text-slate-500 whitespace-pre-wrap">{opt.outcomeFlavor}</div>
              <div className="mt-2 flex flex-wrap gap-1 text-xs">
                <Badge className="bg-slate-800 text-slate-300">
                  bond {opt.bondDelta >= 0 ? "+" : ""}{opt.bondDelta}
                </Badge>
                <Badge className="bg-slate-800 text-slate-300">
                  corrupt {opt.corruptionDelta >= 0 ? "+" : ""}{opt.corruptionDelta}
                </Badge>
                <Badge className="bg-slate-800 text-slate-300">
                  arch {opt.architectInfluenceDelta >= 0 ? "+" : ""}{opt.architectInfluenceDelta}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
