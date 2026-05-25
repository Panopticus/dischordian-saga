/* ═══════════════════════════════════════════════════════
   DOCTRINE PICKER — recruitment-time creed selection.

   Five doctrines, doctrine-flavored stat bands, recommended
   highlight when the apprentice's archetype resonates. The
   pick is immutable once submitted (server-side guard).

   File: apps/client/src/components/apprentice/pedagogy/DoctrinePicker.tsx
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BookOpen, Eye, Lock, Scroll, ShieldCheck } from "lucide-react";
import type { ApprenticeArchetype } from "@shared/apprentices";
import type { DoctrineId } from "@shared/apprenticeDoctrines";
import { SignatureSlotSpec } from "@/components/apprentice/SignatureSlotSpec";

interface Props {
  apprenticeId: string;
  archetype: ApprenticeArchetype;
  mentorProfessorId?: string | null;
  mechronisHouseId?: string | null;
  initialArchitectInfluence?: number;
  /** Called after the player commits a doctrine. */
  onPicked?: (doctrineId: string) => void;
}

const STANCE_BADGE: Record<string, { label: string; tone: string }> = {
  favored:       { label: "Mechronis-favored", tone: "bg-amber-900/40 text-amber-200" },
  tolerated:     { label: "Tolerated",          tone: "bg-slate-800 text-slate-200" },
  watched:       { label: "Watched",            tone: "bg-violet-900/40 text-violet-200" },
  criminalized:  { label: "Criminalized",       tone: "bg-rose-900/40 text-rose-200" },
};

export default function DoctrinePicker({
  apprenticeId, archetype, mentorProfessorId, mechronisHouseId,
  initialArchitectInfluence, onPicked,
}: Props) {
  const utils = trpc.useUtils();
  const catalogQuery = trpc.apprenticePedagogy.doctrineCatalog.useQuery();
  const existingQuery = trpc.apprenticePedagogy.doctrineGet.useQuery({ apprenticeId });
  const [pendingId, setPendingId] = useState<string | null>(null);

  const pick = trpc.apprenticePedagogy.doctrinePick.useMutation({
    onSuccess: (res) => {
      utils.apprenticePedagogy.doctrineGet.invalidate({ apprenticeId });
      if (res.created) {
        toast.success("Doctrine bound. The apprentice begins recitation.");
        onPicked?.(pendingId ?? "");
      } else if (res.existingDoctrineId) {
        toast.info(`Already bound to ${res.existingDoctrineId}.`);
      }
      setPendingId(null);
    },
    onError: (e) => {
      toast.error(e.message);
      setPendingId(null);
    },
  });

  const recommendedId = useMemo(() => {
    const cat = catalogQuery.data ?? [];
    const archResonant = cat.find(d => d.resonantArchetypes.includes(archetype));
    return archResonant?.id ?? null;
  }, [catalogQuery.data, archetype]);

  if (catalogQuery.isLoading) {
    return <div className="p-4 text-slate-400 text-sm">Loading doctrines...</div>;
  }

  if (existingQuery.data) {
    const doctrine = catalogQuery.data?.find(d => d.id === existingQuery.data?.doctrineId);
    return (
      <Card className="border-amber-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            Doctrine Bound: {doctrine?.name ?? existingQuery.data.doctrineId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-300">{doctrine?.subtitle}</div>
          <div className="mt-2 text-xs text-slate-400">
            The apprentice has already taken their oath. Rebinding is not permitted.
          </div>
        </CardContent>
      </Card>
    );
  }

  const catalog = catalogQuery.data ?? [];

  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-300 px-1">
        Choose the creed your apprentice will recite. The choice gates their growth math,
        their deployment options, and the Mechronis's interest in them.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {catalog.map(d => {
          const isRecommended = d.id === recommendedId;
          const stanceMeta = STANCE_BADGE[d.mechronisStance] ?? STANCE_BADGE.tolerated;
          const isResonant = d.resonantArchetypes.includes(archetype);
          const isDissonant = d.dissonantArchetypes.includes(archetype);
          return (
            <Card key={d.id} className={isRecommended ? "border-amber-500/50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2 text-base">
                  <span className="flex items-center gap-2">
                    {d.mechronisStance === "criminalized" ? <Lock className="w-4 h-4" /> :
                     d.mechronisStance === "favored"      ? <ShieldCheck className="w-4 h-4" /> :
                     d.mechronisStance === "watched"      ? <Eye className="w-4 h-4" /> :
                                                            <Scroll className="w-4 h-4" />}
                    {d.name}
                  </span>
                  <Badge className={`${stanceMeta.tone} text-xs whitespace-nowrap`}>
                    {stanceMeta.label}
                  </Badge>
                </CardTitle>
                <div className="text-xs text-slate-400">{d.subtitle}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">{d.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {isRecommended && (
                    <Badge className="bg-amber-700/40 text-amber-200 text-xs">
                      Resonant for {archetype}
                    </Badge>
                  )}
                  {isResonant && !isRecommended && (
                    <Badge className="bg-emerald-900/30 text-emerald-200 text-xs">Resonant</Badge>
                  )}
                  {isDissonant && (
                    <Badge className="bg-rose-900/30 text-rose-200 text-xs">Dissonant</Badge>
                  )}
                  <Badge className="bg-slate-800 text-slate-300 text-xs">
                    bond ×{d.bondMultiplier.toFixed(2)}
                  </Badge>
                  <Badge className="bg-slate-800 text-slate-300 text-xs">
                    corrupt ×{d.corruptionMultiplier.toFixed(2)}
                  </Badge>
                  <Badge className="bg-slate-800 text-slate-300 text-xs">
                    architect {d.architectInfluencePerDay > 0 ? "+" : ""}{d.architectInfluencePerDay}/day
                  </Badge>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Roles: {d.permittedRoles.join(", ")}
                </div>
                <details className="mt-3 group">
                  <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Recitation
                  </summary>
                  <div className="mt-2 space-y-1.5 pl-2 border-l border-slate-800">
                    {d.stanzas.map(s => (
                      <div key={s.index} className="text-xs">
                        <span className="text-slate-500">{s.recitedAt}: </span>
                        <span className="italic text-slate-300">"{s.line}"</span>
                      </div>
                    ))}
                  </div>
                </details>
                <details className="mt-2 group">
                  <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Signature card art
                  </summary>
                  <SignatureSlotSpec
                    archetype={archetype}
                    doctrineId={d.id as DoctrineId}
                  />
                </details>
                <Button
                  className="mt-4 w-full"
                  variant={isRecommended ? "default" : "outline"}
                  disabled={pick.isPending}
                  onClick={() => {
                    setPendingId(d.id);
                    pick.mutate({
                      apprenticeId,
                      doctrineId: d.id as Parameters<typeof pick.mutate>[0]["doctrineId"],
                      mentorProfessorId: mentorProfessorId ?? undefined,
                      mechronisHouseId: mechronisHouseId ?? undefined,
                      initialArchitectInfluence,
                    });
                  }}
                >
                  {pendingId === d.id && pick.isPending ? "Binding..." : `Choose ${d.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
