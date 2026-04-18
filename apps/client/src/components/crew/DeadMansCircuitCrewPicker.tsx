/* ═══════════════════════════════════════════════════════
   DEAD MAN'S CIRCUIT CREW PICKER

   A drop-in dialog the DMC page can surface to let players
   send a real crew member as the clone seat for a race.
   Bridges the Ark's living roster with the Nilmorg circuit.
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { X, Skull, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { FOUNDING_BLOODLINES, type BloodlineId } from "@/game/crewGenetics";
import type { CrewState } from "@shared/crewPersistence";

interface Props {
  onClose: () => void;
  onPicked?: (memberId: string, designation: string) => void;
}

export default function DeadMansCircuitCrewPicker({ onClose, onPicked }: Props) {
  const { data: state } = trpc.crew.getState.useQuery();
  const [picked, setPicked] = useState<string | null>(null);

  const sendToDmc = trpc.crew.sendToDeadMansCircuit.useMutation({
    onSuccess: data => {
      toast.success(`${data.designation ?? "Clone"} reporting to the grid`);
      if (data.designation) onPicked?.(picked!, data.designation);
      onClose();
    },
    onError: e => toast.error(e.message),
  });

  const cs = state as CrewState | undefined;
  const eligible = cs?.roster.members.filter(m => m.status === "active") ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-card border void-border-error rounded max-w-md w-full p-5 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Skull size={16} className="void-text-error" />
          <span className="font-display text-base font-bold">CIRCUIT CLONE SEAT</span>
        </div>
        <div className="text-[11px] font-mono italic text-muted-foreground mb-4">
          "Nilmorg doesn't accept proxies. Someone from your crew has to ride. Pick one."
        </div>

        {eligible.length === 0 ? (
          <div className="text-center py-6 text-[11px] font-mono text-muted-foreground">
            No active crew available.
          </div>
        ) : (
          <div className="space-y-1 max-h-64 overflow-y-auto mb-4">
            {eligible.map(m => (
              <button
                key={m.id}
                onClick={() => setPicked(m.id)}
                className={`w-full text-left p-2 border rounded text-xs font-mono ${
                  picked === m.id ? "void-border-error void-bg-error" : "border-border/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        background:
                          FOUNDING_BLOODLINES[m.bloodlineId as BloodlineId]?.color ?? "#666",
                      }}
                    />
                    {m.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    reflex {m.stats.reflexes}
                  </span>
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">
                  gen {m.generation} · {m.species}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-1"
            disabled={!picked}
            onClick={() => picked && sendToDmc.mutate({ memberId: picked })}
          >
            <Rocket size={12} />
            send to circuit
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
