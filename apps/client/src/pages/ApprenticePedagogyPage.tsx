/* ═══════════════════════════════════════════════════════
   APPRENTICE PEDAGOGY PAGE

   Wraps the PedagogyHub with the player's current
   apprentice context (read from useApprenticeStore) and the
   doctrine state (server-side trpc query).

   File: apps/client/src/pages/ApprenticePedagogyPage.tsx
   ═══════════════════════════════════════════════════════ */

import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useApprenticeStore } from "@/stores/apprenticeStore";
import { trpc } from "@/lib/trpc";
import PedagogyHub from "@/components/apprentice/pedagogy/PedagogyHub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApprenticePedagogyPage() {
  const current = useApprenticeStore(s => s.current);
  const apprenticeId = current?.id ?? "";
  const doctrineQuery = trpc.apprenticePedagogy.doctrineGet.useQuery(
    { apprenticeId },
    { enabled: !!apprenticeId },
  );

  if (!current) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <BackLink />
        <Card>
          <CardContent className="p-6 text-slate-300">
            No active apprentice. Recruit one from the
            {" "}<Link href="/apprentice" className="underline">apprentice page</Link>.
          </CardContent>
        </Card>
      </div>
    );
  }

  const doctrineId = doctrineQuery.data?.doctrineId as
    | "compliant_mouth" | "forked_path" | "cold_hand"
    | "heretical_quiet" | "human_remainder" | undefined;

  const architectInfluence = current.architectInfluence ?? 0;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <BackLink />
      <Card className="mb-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <span className="text-lg">{current.name}</span>
            <span className="text-xs text-slate-400">
              {current.archetype} · {current.rarity} · day {current.trialDay}
            </span>
          </CardTitle>
          <div className="flex flex-wrap gap-3 text-xs text-slate-300 mt-1">
            <span>bond <strong>{current.bond}</strong></span>
            <span>corruption <strong>{current.corruption}</strong></span>
            <span>architect-influence <strong>{architectInfluence}</strong></span>
          </div>
        </CardHeader>
      </Card>

      <PedagogyHub
        apprentice={{
          id: current.id,
          name: current.name,
          archetype: current.archetype,
          rarity: current.rarity,
          bond: current.bond,
          corruption: current.corruption,
          trialDay: current.trialDay,
        }}
        doctrineId={doctrineId}
        architectInfluence={architectInfluence}
        mentorProfessorId={current.mentorProfessorId}
        mechronisHouseId={current.mechronisHouseId}
        graduated={current.stage === "graduated" || current.stage === "companion"}
      />
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/apprentice" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 mb-3">
      <ChevronLeft className="w-4 h-4" />
      back to apprentice
    </Link>
  );
}
