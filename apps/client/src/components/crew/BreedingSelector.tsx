/* ═══════════════════════════════════════════════════════
   BREEDING SELECTOR — Pick two parents, see heritability

   Shows inheritance-chance preview, inbreeding warnings,
   and projected stat ranges before committing.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Heart, Dna, Crown } from "lucide-react";
import { FOUNDING_BLOODLINES, getTrait, calculateInbreedingPenalty, type BloodlineId } from "@/game/crewGenetics";
import { generationsSinceShared } from "@/game/crewBirth";
import type { CrewState } from "@shared/crewPersistence";

interface Props {
  state: CrewState;
  onBreed: (parent1Id: string, parent2Id: string, chosenBloodline?: BloodlineId) => void;
}

export default function BreedingSelector({ state, onBreed }: Props) {
  const eligible = useMemo(
    () => state.roster.members.filter(m => m.status === "active"),
    [state.roster.members],
  );
  const [p1, setP1] = useState<string | null>(null);
  const [p2, setP2] = useState<string | null>(null);
  const [chosenBloodline, setChosenBloodline] = useState<BloodlineId | null>(null);

  const parent1 = eligible.find(m => m.id === p1);
  const parent2 = eligible.find(m => m.id === p2);

  // Reset the bloodline choice whenever the parent selection changes
  useEffect(() => {
    setChosenBloodline(null);
  }, [p1, p2]);

  const gen2Available = state.generation2Reached || state.roster.members.some(m => m.generation >= 2);

  if (!gen2Available && eligible.length < 2) {
    return (
      <div className="py-16 text-center">
        <Heart size={40} className="mx-auto text-muted-foreground/30 mb-3" />
        <div className="font-mono text-sm text-muted-foreground max-w-md mx-auto">
          Breeding unlocks once you have at least two active crew members. The Resurrectionist's
          protocols require living donors.
        </div>
      </div>
    );
  }

  const fullRoster = useMemo(
    () => [...state.roster.members, ...state.roster.deceased],
    [state.roster.members, state.roster.deceased],
  );
  const gensShared =
    parent1 && parent2 ? generationsSinceShared(parent1, parent2, fullRoster) : Infinity;
  const inbreeding =
    parent1 && parent2
      ? calculateInbreedingPenalty(
          parent1.bloodlineId as BloodlineId,
          parent2.bloodlineId as BloodlineId,
          Number.isFinite(gensShared) ? gensShared : 0,
        )
      : 0;

  // Quick preview: shared + unique trait counts
  const sharedTraits =
    parent1 && parent2
      ? parent1.geneticTraits.filter(t => parent2.geneticTraits.includes(t))
      : [];
  const uniqueTraits =
    parent1 && parent2
      ? Array.from(new Set([...parent1.geneticTraits, ...parent2.geneticTraits]))
      : [];

  const avgStats =
    parent1 && parent2
      ? ({
          resilience: Math.round((parent1.stats.resilience + parent2.stats.resilience) / 2),
          intellect: Math.round((parent1.stats.intellect + parent2.stats.intellect) / 2),
          reflexes: Math.round((parent1.stats.reflexes + parent2.stats.reflexes) / 2),
          empathy: Math.round((parent1.stats.empathy + parent2.stats.empathy) / 2),
          immunity: Math.round((parent1.stats.immunity + parent2.stats.immunity) / 2),
          adaptability: Math.round((parent1.stats.adaptability + parent2.stats.adaptability) / 2),
        } as Record<string, number>)
      : null;

  const renderParentPicker = (
    label: string,
    value: string | null,
    setValue: (id: string | null) => void,
    exclude: string | null,
  ) => (
    <div className="space-y-2">
      <div className="text-[10px] font-mono uppercase text-muted-foreground">{label}</div>
      <div className="space-y-1">
        {eligible
          .filter(m => m.id !== exclude)
          .map(m => (
            <button
              key={m.id}
              onClick={() => setValue(m.id)}
              className={`w-full text-left p-2 border rounded text-xs font-mono transition ${
                value === m.id
                  ? "border-primary bg-primary/10"
                  : "border-border/30 hover:border-border"
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
                <span className="text-[9px] text-muted-foreground">gen {m.generation}</span>
              </div>
              <div className="text-[9px] text-muted-foreground mt-0.5">
                {m.species} · {m.geneticTraits.length} traits
              </div>
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {renderParentPicker("Parent A", p1, setP1, p2)}
      {renderParentPicker("Parent B", p2, setP2, p1)}

      {/* Preview panel */}
      <div className="bg-card/30 border border-border/30 rounded p-4">
        <div className="flex items-center gap-2 mb-3">
          <Dna size={14} className="text-primary" />
          <span className="font-display text-sm font-bold">INHERITANCE PREVIEW</span>
        </div>

        {!parent1 || !parent2 ? (
          <div className="text-center text-[11px] font-mono text-muted-foreground py-6">
            Select two parents
          </div>
        ) : (
          <div className="space-y-3">
            {inbreeding > 0 && (
              <div className="p-2 border border-red-500/40 bg-red-500/10 rounded">
                <div className="flex items-center gap-1 text-[10px] font-mono text-red-300 mb-0.5">
                  <AlertTriangle size={10} />
                  INBREEDING PENALTY: -{inbreeding}%
                </div>
                <div className="text-[9px] font-mono text-red-200/70">
                  {Number.isFinite(gensShared)
                    ? gensShared === 0
                      ? "Full siblings or direct ancestry — maximum penalty."
                      : gensShared === 1
                        ? "Half-siblings. Strong penalty."
                        : gensShared === 2
                          ? "First cousins. Moderate penalty."
                          : `${gensShared} generations apart.`
                    : "Same bloodline, distant kinship."}
                  {" "}
                  High risk of clone_degradation mutation if penalty exceeds 20%.
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
                Projected stat floor (before variance)
              </div>
              {avgStats &&
                Object.entries(avgStats).map(([stat, val]) => (
                  <div
                    key={stat}
                    className="flex items-center justify-between text-[10px] font-mono"
                  >
                    <span className="text-muted-foreground">{stat}</span>
                    <span className={inbreeding > 0 ? "text-red-300" : ""}>
                      ≈ {Math.round(val * (1 - inbreeding / 100))}
                    </span>
                  </div>
                ))}
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
                Trait pool ({uniqueTraits.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {uniqueTraits.slice(0, 12).map(tid => {
                  const trait = getTrait(tid);
                  if (!trait) return null;
                  const isShared = sharedTraits.includes(tid);
                  return (
                    <span
                      key={tid}
                      title={`${trait.description}\nInheritance: ${Math.round(
                        trait.inheritanceChance * (isShared ? 1.5 : 1) * 100,
                      )}%`}
                      className={`text-[9px] font-mono px-1.5 py-0.5 border rounded ${
                        isShared ? "border-cyan-500/60 text-cyan-200" : "border-border/40"
                      }`}
                    >
                      {trait.name}
                      {isShared && " ×2"}
                    </span>
                  );
                })}
                {uniqueTraits.length > 12 && (
                  <span className="text-[9px] font-mono text-muted-foreground">
                    +{uniqueTraits.length - 12} more
                  </span>
                )}
              </div>
            </div>

            {parent1.bloodlineId !== parent2.bloodlineId && (
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1 flex items-center gap-1">
                  <Crown size={10} />
                  Child's bloodline
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {[parent1, parent2].map(p => {
                    const bl = FOUNDING_BLOODLINES[p.bloodlineId as BloodlineId];
                    const selected =
                      (chosenBloodline ?? parent1.bloodlineId) === p.bloodlineId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setChosenBloodline(p.bloodlineId as BloodlineId)}
                        className={`text-left p-2 border rounded text-[9px] font-mono transition ${
                          selected ? "border-primary bg-primary/10" : "border-border/30"
                        }`}
                        style={{ borderLeftWidth: "3px", borderLeftColor: bl?.color }}
                      >
                        <div className="font-display text-[10px]" style={{ color: bl?.color }}>
                          {bl?.name ?? p.bloodlineId}
                        </div>
                        <div className="text-muted-foreground mt-0.5">
                          via {p.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="text-[9px] font-mono text-muted-foreground italic border-t border-border/30 pt-2">
              12% chance of spontaneous mutation. Incompatible traits resolve by rarity.
            </div>

            <Button
              className="w-full gap-1"
              size="sm"
              onClick={() => {
                if (parent1 && parent2) {
                  const bl = chosenBloodline ?? (parent1.bloodlineId as BloodlineId);
                  onBreed(parent1.id, parent2.id, bl);
                }
                setP1(null);
                setP2(null);
                setChosenBloodline(null);
              }}
            >
              <Heart size={14} />
              Initiate Breeding
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
