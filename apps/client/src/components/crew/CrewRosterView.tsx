/* ═══════════════════════════════════════════════════════
   CREW ROSTER VIEW — Active members grid with role assign
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Shield, Brain, Zap, Droplet, Wind, Users, Crown, Sparkles } from "lucide-react";
import { CREW_ROLES, type CrewRoleId } from "@/game/crewManagement";
import { FOUNDING_BLOODLINES, getTrait, type BloodlineId } from "@/game/crewGenetics";
import type { CrewState, SerializedCrewMember } from "@shared/crewPersistence";
import CrewPortrait from "./CrewPortrait";
import {
  BLOODLINE_HOLIDAY_BONUSES,
  ROLE_HOLIDAY_BONUSES,
} from "@/data/events/christmasInJuly/crewHoliday";
import { trpc } from "@/lib/trpc";

interface Props {
  state: CrewState;
  onAssignRole: (memberId: string, role: CrewRoleId | null) => void;
}

/** Returns a short bonus label for a crew member during the Christmas
 *  in July event, or null if neither their bloodline nor their role
 *  has a holiday bonus. Display-only. */
function holidayBonusLabelFor(member: SerializedCrewMember): string | null {
  if (member.status !== "active") return null;
  const fragments: string[] = [];
  const bloodline = BLOODLINE_HOLIDAY_BONUSES.find(b => b.bloodlineId === member.bloodlineId);
  if (bloodline) fragments.push(bloodline.bonusName);
  const role = member.role
    ? ROLE_HOLIDAY_BONUSES.find(r => r.roleId === member.role)
    : null;
  if (role) fragments.push(role.bonusDescription.split(".")[0]);
  return fragments.length > 0 ? fragments.join(" · ") : null;
}

const STAT_ICON = {
  resilience: Shield,
  intellect: Brain,
  reflexes: Zap,
  empathy: Heart,
  immunity: Droplet,
  adaptability: Wind,
};

function StatusBadge({ status }: { status: SerializedCrewMember["status"] }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    injured: "destructive",
    sick: "destructive",
    missing: "outline",
    dead: "outline",
    incubating: "secondary",
    on_mission: "secondary",
  };
  return (
    <Badge variant={variants[status] ?? "outline"} className="text-[9px] uppercase">
      {status.replace("_", " ")}
    </Badge>
  );
}

export default function CrewRosterView({ state, onAssignRole }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Christmas in July: when the event window is open, each member's
  // card gets a small bonus chip summarising their holiday contribution.
  const holidayStatus = trpc.christmasInJuly.isActive.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });
  const holidayActive = Boolean(holidayStatus.data?.active);

  const members = useMemo(
    () => state.roster.members.filter(m => m.status !== "dead"),
    [state.roster.members],
  );
  const selected = members.find(m => m.id === selectedId) ?? null;

  const unfilledRoles = useMemo(() => {
    const filled = new Set(
      members.filter(m => m.role && m.status === "active").map(m => m.role!),
    );
    return (Object.keys(CREW_ROLES) as CrewRoleId[]).filter(r => !filled.has(r));
  }, [members]);

  if (members.length === 0) {
    return (
      <div className="py-16 text-center">
        <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
        <div className="font-mono text-sm text-muted-foreground">
          The Ark is empty. Clone your first crew member from the archive.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Member list */}
      <div className="lg:col-span-2 space-y-2">
        {members.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedId(m.id)}
            className={`w-full text-left bg-card/50 border rounded p-3 transition flex gap-3 ${
              selectedId === m.id ? "border-primary" : "border-border/30 hover:border-border"
            }`}
          >
            <CrewPortrait member={m} size={44} className="shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {m.isFounder && (
                    <Crown size={11} className="text-yellow-400 shrink-0" aria-label="founder" />
                  )}
                  <span className="font-display font-semibold truncate">{m.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                    gen {m.generation}
                  </span>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="truncate">
                  {m.role ? CREW_ROLES[m.role].name : "unassigned"} · {m.species} · age{" "}
                  {m.age}/{m.maxAge}
                </span>
                <span className="flex gap-2 shrink-0">
                  <span>♥ {m.health}</span>
                  <span>☼ {m.morale}</span>
                </span>
              </div>
              {holidayActive && (() => {
                const label = holidayBonusLabelFor(m);
                if (!label) return null;
                return (
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-amber-300/90 truncate">
                    <Sparkles className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{label}</span>
                  </div>
                );
              })()}
            </div>
          </button>
        ))}

        {unfilledRoles.length > 0 && (
          <div className="mt-4 p-3 border border-yellow-500/30 bg-yellow-500/5 rounded">
            <div className="text-[11px] font-mono text-yellow-300 mb-1">
              UNFILLED ROLES ({unfilledRoles.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {unfilledRoles.map(r => (
                <Badge key={r} variant="outline" className="text-[9px]">
                  {CREW_ROLES[r].name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected detail */}
      <div className="bg-card/30 border border-border/30 rounded p-4 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
        {selected ? (
          <>
            <div className="mb-3 flex items-start gap-3">
              <CrewPortrait member={selected} size={72} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg font-bold flex items-center gap-2">
                  {selected.isFounder && <Crown size={14} className="text-yellow-400" />}
                  {selected.name}
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  {FOUNDING_BLOODLINES[selected.bloodlineId as BloodlineId]?.name ??
                    selected.bloodlineId}{" "}
                  · gen {selected.generation} · {selected.species}
                  {selected.isFounder && " · founder"}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-1.5 mb-4">
              {(Object.keys(STAT_ICON) as Array<keyof typeof STAT_ICON>).map(stat => {
                const Icon = STAT_ICON[stat];
                return (
                  <div key={stat} className="flex items-center gap-2">
                    <Icon size={11} className="text-muted-foreground shrink-0" />
                    <span className="text-[10px] font-mono text-muted-foreground w-20">
                      {stat}
                    </span>
                    <Progress value={selected.stats[stat]} className="h-1 flex-1" />
                    <span className="text-[10px] font-mono w-8 text-right">
                      {selected.stats[stat]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Traits */}
            {selected.geneticTraits.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
                  Traits
                </div>
                <div className="flex flex-wrap gap-1">
                  {selected.geneticTraits.map(tid => {
                    const trait = getTrait(tid);
                    if (!trait) return null;
                    const rarityColor = {
                      common: "border-gray-500/40",
                      uncommon: "border-green-500/40",
                      rare: "border-blue-500/40",
                      mythic: "border-purple-500/40 text-purple-300",
                    };
                    return (
                      <span
                        key={tid}
                        title={trait.description}
                        className={`text-[9px] font-mono px-1.5 py-0.5 border rounded ${
                          rarityColor[trait.rarity]
                        }`}
                      >
                        {trait.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Relationships */}
            {Object.keys(selected.relationships).length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
                  Bonds
                </div>
                <div className="space-y-0.5 max-h-32 overflow-y-auto">
                  {Object.entries(selected.relationships)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([otherId, score]) => {
                      const other = state.roster.members.find(m => m.id === otherId)
                        ?? state.roster.deceased.find(m => m.id === otherId);
                      if (!other) return null;
                      const isDead = other.status === "dead";
                      const color =
                        score >= 40
                          ? "text-green-300"
                          : score >= 10
                            ? "text-cyan-300"
                            : score <= -40
                              ? "text-red-300"
                              : "text-muted-foreground";
                      return (
                        <div
                          key={otherId}
                          className="flex items-center justify-between text-[10px] font-mono"
                        >
                          <span className={isDead ? "line-through text-muted-foreground/50" : ""}>
                            {other.name}
                          </span>
                          <span className={color}>{score > 0 ? `+${score}` : score}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Role assignment */}
            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
                Role
              </div>
              <div className="space-y-1">
                <Button
                  variant={selected.role === null ? "default" : "outline"}
                  size="sm"
                  className="w-full text-[10px] h-7"
                  onClick={() => onAssignRole(selected.id, null)}
                  disabled={selected.status !== "active"}
                >
                  — none —
                </Button>
                {(Object.keys(CREW_ROLES) as CrewRoleId[]).map(rid => (
                  <Button
                    key={rid}
                    variant={selected.role === rid ? "default" : "outline"}
                    size="sm"
                    className="w-full text-[10px] h-7 justify-start"
                    onClick={() => onAssignRole(selected.id, rid)}
                    disabled={selected.status !== "active"}
                  >
                    {CREW_ROLES[rid].name}
                  </Button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground text-xs font-mono py-16">
            Select a crew member
          </div>
        )}
      </div>
    </div>
  );
}
