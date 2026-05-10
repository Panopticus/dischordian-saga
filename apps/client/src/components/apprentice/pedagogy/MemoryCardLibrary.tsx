/* ═══════════════════════════════════════════════════════
   MEMORY CARD LIBRARY — fallen apprentices' inheritance.

   Lists Memory Cards minted at apprentice death. The player
   can consume one at recruitment time (via the consume
   action) to grant the next apprentice a signature gift,
   inherited dialogue line, bond floor, and breaking-point
   echo.

   File: apps/client/src/components/apprentice/pedagogy/MemoryCardLibrary.tsx
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skull, Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Props {
  /** Optional: when the player is mid-recruit, this lets them consume
   *  a Memory Card and apply the inheritance to the new apprentice. */
  newApprenticeId?: string;
  onConsumed?: (trait: { fromMemoryCardId: string; bondFloor: number }) => void;
}

export default function MemoryCardLibrary({ newApprenticeId, onConsumed }: Props) {
  const utils = trpc.useUtils();
  const cardsQuery = trpc.apprenticePedagogy.memoryListInheritable.useQuery();
  const [pending, setPending] = useState<string | null>(null);

  const consume = trpc.apprenticePedagogy.memoryConsume.useMutation({
    onSuccess: (res) => {
      utils.apprenticePedagogy.memoryListInheritable.invalidate();
      toast.success(`Memory inherited. Bond floor +${res.trait.bondFloor}.`);
      onConsumed?.({
        fromMemoryCardId: res.trait.fromMemoryCardId,
        bondFloor: res.trait.bondFloor,
      });
      setPending(null);
    },
    onError: (e) => {
      toast.error(e.message);
      setPending(null);
    },
  });

  const cards = cardsQuery.data ?? [];

  if (cardsQuery.isLoading) {
    return <div className="p-4 text-slate-400 text-sm">Loading Memory Cards...</div>;
  }

  if (cards.length === 0) {
    return (
      <Card className="border-slate-800">
        <CardContent className="p-4 text-sm text-slate-500 italic">
          No Memory Cards yet. Cards mint when an apprentice falls.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-300 px-1 flex items-center gap-2">
        <Skull className="w-4 h-4" />
        Memory Cards — fallen apprentices' inheritance.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map(card => (
          <Card key={card.id} className="border-violet-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Skull className="w-4 h-4 text-violet-300" />
                {card.deceasedName}
              </CardTitle>
              <div className="text-xs text-slate-400">
                {card.archetype} · day {card.daysSurvived} · {card.cause}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 mb-3">
                <div>final bond: <strong>{card.finalBond}</strong></div>
                <div>final corrupt: <strong>{card.finalCorruption}</strong></div>
                <div>arch echo: <strong>{card.finalArchitectInfluence}</strong></div>
              </div>
              {card.doctrineId && (
                <Badge className="bg-slate-800 text-slate-200 text-xs mb-3">
                  doctrine: {card.doctrineId.replace("_", " ")}
                </Badge>
              )}
              {newApprenticeId && (
                <Button
                  className="w-full"
                  variant="outline"
                  disabled={consume.isPending}
                  onClick={() => {
                    setPending(card.id);
                    consume.mutate({
                      memoryCardId: card.id,
                      byApprenticeId: newApprenticeId,
                    });
                  }}
                >
                  {pending === card.id && consume.isPending
                    ? "Inheriting..."
                    : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Inherit
                        </span>
                      )}
                </Button>
              )}
              {!newApprenticeId && (
                <div className="text-xs text-slate-500 italic flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  Available at next recruitment.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
