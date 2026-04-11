/* ═══════════════════════════════════════════════════════
   BLOODLINE LEADERBOARD — Cross-player dynasty rankings

   Reads from the native crew_bloodlines / crew_members tables
   that syncCrewStateToTables projects into on every saveState.
   Shows:
     - Longest-running dynasties (by generationCount)
     - Oldest living crew (by age)

   Gracefully empty when the native tables haven't been applied
   yet — the router's try/catch returns [] on query failure.
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";
import { Crown, Hourglass, Trophy } from "lucide-react";
import { FOUNDING_BLOODLINES, type BloodlineId } from "@/game/crewGenetics";

export default function BloodlineLeaderboard() {
  const bloodlines = trpc.crew.getBloodlineLeaderboard.useQuery({ limit: 15 });
  const survivors = trpc.crew.getSurvivalLeaderboard.useQuery({ limit: 15 });

  const isLoading = bloodlines.isLoading || survivors.isLoading;
  const hasBloodlines = (bloodlines.data?.length ?? 0) > 0;
  const hasSurvivors = (survivors.data?.length ?? 0) > 0;

  if (isLoading) {
    return (
      <div className="py-12 text-center text-[11px] font-mono text-muted-foreground">
        loading leaderboards…
      </div>
    );
  }

  if (!hasBloodlines && !hasSurvivors) {
    return (
      <div className="py-16 text-center">
        <Trophy size={40} className="mx-auto text-muted-foreground/30 mb-3" />
        <div className="font-mono text-sm text-muted-foreground max-w-md mx-auto">
          Leaderboards are empty. The cross-player crew tables may not be applied yet — once a
          player's bloodlines are synced, they'll appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Longest bloodlines */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Crown size={14} className="text-yellow-400" />
          <span className="font-display text-sm font-bold">LONGEST BLOODLINES</span>
        </div>
        {hasBloodlines ? (
          <div className="space-y-1">
            {bloodlines.data!.map((row: any, i: number) => {
              const bl = FOUNDING_BLOODLINES[row.bloodlineKey as BloodlineId];
              const name = (row.metadata?.name ?? bl?.name ?? row.bloodlineKey) as string;
              const color = (row.metadata?.color ?? bl?.color ?? "#666") as string;
              return (
                <div
                  key={`${row.userId}-${row.bloodlineKey}`}
                  className="flex items-center gap-2 p-2 border border-border/30 bg-card/40 rounded"
                  style={{ borderLeftWidth: "3px", borderLeftColor: color }}
                >
                  <span className="w-6 text-right font-mono text-[10px] text-muted-foreground">
                    #{i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <div className="font-display text-[12px] truncate" style={{ color }}>
                      {name}
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground truncate">
                      {row.userName ?? `Captain ${row.userId}`} · drift {row.geneticDrift}% ·
                      diversity {row.diversityIndex}%
                    </div>
                  </span>
                  <span
                    className="font-display text-lg font-bold shrink-0"
                    style={{ color }}
                  >
                    gen {row.generationCount}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-muted-foreground italic">
            No dynasties ranked yet.
          </div>
        )}
      </section>

      {/* Oldest living crew */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Hourglass size={14} className="text-cyan-300" />
          <span className="font-display text-sm font-bold">OLDEST LIVING CREW</span>
        </div>
        {hasSurvivors ? (
          <div className="space-y-1">
            {survivors.data!.map((row: any, i: number) => {
              const bl = FOUNDING_BLOODLINES[row.bloodlineKey as BloodlineId];
              return (
                <div
                  key={`${row.userId}-${row.memberKey}`}
                  className="flex items-center gap-2 p-2 border border-border/30 bg-card/40 rounded"
                  style={{
                    borderLeftWidth: "3px",
                    borderLeftColor: bl?.color ?? "#666",
                  }}
                >
                  <span className="w-6 text-right font-mono text-[10px] text-muted-foreground">
                    #{i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <div className="font-display text-[12px] truncate">{row.name}</div>
                    <div className="text-[9px] font-mono text-muted-foreground truncate">
                      {row.userName ?? `Captain ${row.userId}`} · {row.species} · gen{" "}
                      {row.generation}
                    </div>
                  </span>
                  <span className="font-display text-lg font-bold text-cyan-300 shrink-0">
                    {row.age}/{row.maxAge}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-muted-foreground italic">
            No survivors ranked yet.
          </div>
        )}
      </section>
    </div>
  );
}
