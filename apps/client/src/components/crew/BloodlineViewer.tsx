/* ═══════════════════════════════════════════════════════
   BLOODLINE VIEWER — Founded dynasties, powers, drift
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Crown, Users } from "lucide-react";
import {
  FOUNDING_BLOODLINES,
  calculateGeneticDrift,
  calculateDiversityBonus,
  getBloodlinePowerValue,
  type BloodlineId,
  type Bloodline,
} from "@/game/crewGenetics";
import type { CrewState } from "@shared/crewPersistence";

interface Props {
  state: CrewState;
}

export default function BloodlineViewer({ state }: Props) {
  const founded = Object.entries(state.bloodlines) as Array<[BloodlineId, any]>;

  // Annotate with live generation counts from the roster
  const enriched = useMemo(() => {
    return founded.map(([id, bl]) => {
      const membersInLine = state.roster.members.filter(m => m.bloodlineId === id);
      const maxGen = membersInLine.reduce((a, b) => Math.max(a, b.generation), 0);
      return {
        id,
        bloodline: {
          ...bl,
          generationCount: Math.max(bl.generationCount ?? 1, maxGen),
        } as Bloodline,
        liveMembers: membersInLine.length,
      };
    });
  }, [founded, state.roster.members]);

  if (enriched.length === 0) {
    return (
      <div className="py-16 text-center">
        <Crown size={40} className="mx-auto text-muted-foreground/30 mb-3" />
        <div className="font-mono text-sm text-muted-foreground max-w-md mx-auto">
          No dynasty has been founded. Clone your first crew member to raise a House.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {enriched.map(({ id, bloodline, liveMembers }) => {
        const drift = calculateGeneticDrift(bloodline);
        const diversityBonus = calculateDiversityBonus(bloodline);
        const powerValue = getBloodlinePowerValue(bloodline);

        return (
          <div
            key={id}
            className="bg-card/40 border rounded p-4"
            style={{ borderColor: `${bloodline.color}60` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-display text-base font-bold" style={{ color: bloodline.color }}>
                  {bloodline.name}
                </div>
                <div className="text-[10px] font-mono italic text-muted-foreground mt-0.5">
                  "{bloodline.motto}"
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono text-muted-foreground">generation</div>
                <div className="font-display text-lg font-bold" style={{ color: bloodline.color }}>
                  {bloodline.generationCount}
                </div>
              </div>
            </div>

            <div className="mt-3 mb-3 p-2 border border-border/40 rounded bg-background/40">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">
                {bloodline.power.name}
              </div>
              <div className="text-[11px] font-mono">{bloodline.power.description}</div>
              <div className="text-[10px] font-mono mt-1" style={{ color: bloodline.color }}>
                +{powerValue} {bloodline.power.stat}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono w-20 text-muted-foreground">drift</span>
                <Progress value={drift} className="h-1 flex-1" />
                <span className="text-[9px] font-mono w-10 text-right">
                  {Math.round(drift)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono w-20 text-muted-foreground">diversity</span>
                <Progress value={bloodline.diversityIndex ?? 0} className="h-1 flex-1" />
                <span className="text-[9px] font-mono w-10 text-right">
                  +{Math.round(diversityBonus)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users size={10} />
                {liveMembers} living
              </span>
              <span>
                founder: {FOUNDING_BLOODLINES[id]?.founderTemplateId.replace("tpl_", "")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
