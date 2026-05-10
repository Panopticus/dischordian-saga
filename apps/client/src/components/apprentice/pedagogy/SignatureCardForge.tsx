/* ═══════════════════════════════════════════════════════
   SIGNATURE CARD FORGE — Day-28 graduation ceremony.

   The "lightsaber moment." Player picks one of 4–6
   doctrine-eligible effect slots. The forge mints a
   CardDefinition with stable id, banded art, and provenance
   recording the bond/corruption/influence at the moment of
   forging.

   File: apps/client/src/components/apprentice/pedagogy/SignatureCardForge.tsx
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Hammer, Scroll, AlertTriangle } from "lucide-react";

type DoctrineId =
  | "compliant_mouth" | "forked_path" | "cold_hand"
  | "heretical_quiet" | "human_remainder";

interface ApprenticeSnapshot {
  id: string;
  name: string;
  archetype: "zealot" | "ghost" | "scholar" | "revenant" | "artisan" | "oracle"
    | "wanderer" | "martyr" | "heretic" | "jester" | "sentinel" | "prodigal";
  rarity: "common" | "uncommon" | "rare" | "epic" | "mythic";
  bond: number;
  corruption: number;
  trialDay: number;
}

interface Props {
  apprentice: ApprenticeSnapshot;
  doctrineId: DoctrineId;
  architectInfluence: number;
  houseId?: string | null;
  onForged?: (cardId: string) => void;
}

export default function SignatureCardForge({
  apprentice, doctrineId, architectInfluence, houseId, onForged,
}: Props) {
  const utils = trpc.useUtils();
  const slotsQuery = trpc.apprenticePedagogy.forgeEligibleSlots.useQuery({ doctrineId });
  const existingQuery = trpc.apprenticePedagogy.forgeList.useQuery();

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const slots = slotsQuery.data ?? [];

  const existing = existingQuery.data?.find(c => c.provenance.apprenticeId === apprentice.id);

  const forge = trpc.apprenticePedagogy.forgeRun.useMutation({
    onSuccess: (res) => {
      utils.apprenticePedagogy.forgeList.invalidate();
      if (res.created) {
        toast.success(`${apprentice.name}'s signature card forged.`);
        onForged?.(res.card.id as string);
      } else {
        toast.info("Signature card already forged.");
      }
    },
    onError: (e) => toast.error(e.message),
  });

  if (existing) {
    return (
      <Card className="border-amber-700/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Scroll className="w-5 h-5 text-amber-300" />
            Signature Card Forged
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-slate-400">
            Card id: <code className="text-slate-300">{existing.cardId}</code>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-300">
            <div>bond at forge: <strong>{existing.provenance.bondAtForge}</strong></div>
            <div>corrupt at forge: <strong>{existing.provenance.corruptionAtForge}</strong></div>
            <div>architect at forge: <strong>{existing.provenance.architectInfluenceAtForge}</strong></div>
          </div>
          {existing.provenance.architectCoopted && (
            <div className="mt-3 flex items-center gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4" />
              Architect-coopted. The card carries an Architect echo.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (apprentice.trialDay < 28) {
    return (
      <Card className="border-slate-800">
        <CardContent className="p-4 text-sm text-slate-400">
          The forge opens on Day 28. {apprentice.name} is on Day {apprentice.trialDay}.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Hammer className="w-5 h-5 text-amber-300" />
          Forge {apprentice.name}'s Signature Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-300 mb-3">
          Pick the effect slot. Eligible slots are gated by doctrine.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {slots.map(s => (
            <button
              key={s.id}
              className={`text-left p-3 rounded border transition-colors ${
                selectedSlot === s.id
                  ? "border-amber-500 bg-amber-950/30"
                  : "border-slate-800 hover:border-slate-600"
              }`}
              onClick={() => setSelectedSlot(s.id)}
            >
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs text-slate-400 mt-1">{s.description}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {s.keywords.map(k => (
                  <Badge key={k} className="bg-slate-800 text-slate-200 text-xs">{k}</Badge>
                ))}
                {s.costDelta !== 0 && (
                  <Badge className="bg-slate-800 text-slate-200 text-xs">cost {s.costDelta > 0 ? "+" : ""}{s.costDelta}</Badge>
                )}
                <Badge className="bg-slate-800 text-slate-200 text-xs">
                  +{s.statBias.power} pwr / +{s.statBias.health} hp
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {architectInfluence >= 60 && (
          <div className="mt-3 p-2 border border-rose-900/40 rounded text-xs text-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
            Architect Influence is {architectInfluence}. The card will be coopted —
            the apprentice's voice on the card will not be entirely their own.
          </div>
        )}

        <Button
          className="w-full mt-4"
          disabled={!selectedSlot || forge.isPending}
          onClick={() => {
            if (!selectedSlot) return;
            forge.mutate({
              apprentice,
              doctrineId,
              pickedSlotId: selectedSlot as Parameters<typeof forge.mutate>[0]["pickedSlotId"],
              bondAtForge: apprentice.bond,
              corruptionAtForge: apprentice.corruption,
              architectInfluenceAtForge: architectInfluence,
              houseId: houseId ?? null,
            });
          }}
        >
          {forge.isPending ? "Forging..." : "Forge"}
        </Button>
      </CardContent>
    </Card>
  );
}
