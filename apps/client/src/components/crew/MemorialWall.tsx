/* ═══════════════════════════════════════════════════════
   MEMORIAL WALL — The names we remember
   ═══════════════════════════════════════════════════════ */

import { Skull } from "lucide-react";
import { FOUNDING_BLOODLINES, type BloodlineId } from "@/game/crewGenetics";
import type { CrewState } from "@shared/crewPersistence";

interface Props {
  state: CrewState;
}

export default function MemorialWall({ state }: Props) {
  const deceased = state.roster.deceased;

  if (deceased.length === 0) {
    return (
      <div className="py-16 text-center">
        <Skull size={40} className="mx-auto text-muted-foreground/30 mb-3" />
        <div className="font-mono text-sm text-muted-foreground">
          The memorial wall is empty. May it stay that way.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[11px] font-mono text-muted-foreground mb-3">
        {deceased.length} name{deceased.length === 1 ? "" : "s"} on the wall · {state.roster.totalLost}{" "}
        total lost · {state.dmcClonesLost} lost to the Circuit
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {deceased.map(m => (
          <div
            key={m.id}
            className="p-3 border border-border/40 rounded bg-background/40"
            style={{
              borderLeftWidth: "3px",
              borderLeftColor:
                FOUNDING_BLOODLINES[m.bloodlineId as BloodlineId]?.color ?? "#666",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-semibold text-sm">{m.name}</span>
              <span className="text-[9px] font-mono text-muted-foreground">
                gen {m.generation}
              </span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mb-1">
              {FOUNDING_BLOODLINES[m.bloodlineId as BloodlineId]?.name ?? m.bloodlineId} ·{" "}
              {m.species} · age {m.age}
            </div>
            {m.deathRecord && (
              <>
                <div className="text-[10px] font-mono text-red-300/80 mb-1">
                  {m.deathRecord.cause}
                </div>
                <div className="text-[10px] font-mono italic text-foreground/60">
                  "{m.deathRecord.lastWords}"
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
