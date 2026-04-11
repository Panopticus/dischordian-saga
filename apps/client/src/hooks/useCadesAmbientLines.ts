/* ═══════════════════════════════════════════════════════
   useCadesAmbientLines — evaluates the cadesCondition
   strings on CADES_AMBIENT_LINES and GAME_MASTERS_SURVEILLANCE
   against the current GameContext + persisted CADES data,
   returning the subset of lines that should be surfaced to
   the player right now.

   Consumers: any component that wants to show ambient NPC
   chatter (the Ark Explorer sidebar, NPC dialog overlays,
   loading screens).

   Condition grammar supported (each line's cadesCondition
   string is split on "&&" and each clause is matched against
   these patterns):
     discovered
     canonAchieved
     thoughtbornContacted
     loopCount >= N
     scenariosCompleted >= N
     gmContactLevel >= N
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  CADES_AMBIENT_LINES,
  GAME_MASTERS_SURVEILLANCE,
  type GameMastersSurveillanceLine,
} from "@/data/cadesNarrativeIntegration";

export interface CadesAmbientLine {
  id: string;
  npcId: string;
  minTrust: number;
  cadesCondition: string;
  context: string;
  text: string;
  oneTime?: boolean;
}

interface CadesContextSnapshot {
  discovered: boolean;
  canonAchieved: boolean;
  thoughtbornContacted: boolean;
  loopCount: number;
  scenariosCompleted: number;
  gmContactLevel: number;
}

function evalClause(clause: string, ctx: CadesContextSnapshot): boolean {
  const c = clause.trim();
  if (c === "") return true;
  if (c === "discovered") return ctx.discovered;
  if (c === "canonAchieved") return ctx.canonAchieved;
  if (c === "thoughtbornContacted") return ctx.thoughtbornContacted;
  // "field >= N" clauses
  const m = /^(\w+)\s*>=\s*(\d+)$/.exec(c);
  if (m) {
    const field = m[1];
    const threshold = parseInt(m[2], 10);
    switch (field) {
      case "loopCount":            return ctx.loopCount >= threshold;
      case "scenariosCompleted":   return ctx.scenariosCompleted >= threshold;
      case "gmContactLevel":       return ctx.gmContactLevel >= threshold;
      default:                     return false;
    }
  }
  return false;
}

function evalCondition(condition: string, ctx: CadesContextSnapshot): boolean {
  if (!condition || condition.trim() === "") return true;
  return condition.split("&&").every((clause) => evalClause(clause, ctx));
}

export function useCadesAmbientLines(opts?: {
  /** Filter by npcId */
  npcId?: string;
  /** Filter by context (e.g. "room_enter", "shared_silence") */
  context?: string;
  /** Filter surveillance lines by meme reveal flag */
  memeRevealed?: boolean;
}): {
  ambientLines: CadesAmbientLine[];
  surveillanceLines: GameMastersSurveillanceLine[];
  context: CadesContextSnapshot;
} {
  const { isAuthenticated } = useAuth();
  const cadesData = trpc.gameState.getCadesData.useQuery(undefined, { enabled: isAuthenticated });

  const context: CadesContextSnapshot = useMemo(() => {
    const d = cadesData.data;
    return {
      discovered: Boolean(d),
      canonAchieved: Boolean(d?.canonAchieved),
      thoughtbornContacted: Boolean((d as { thoughtbornContacted?: boolean } | undefined)?.thoughtbornContacted),
      loopCount: d?.loopCount ?? 0,
      scenariosCompleted: d?.scenariosCompleted?.length ?? 0,
      gmContactLevel: (d as { gmContactLevel?: number } | undefined)?.gmContactLevel ?? 0,
    };
  }, [cadesData.data]);

  const ambientLines = useMemo(() => {
    return (CADES_AMBIENT_LINES as CadesAmbientLine[]).filter((line) => {
      if (opts?.npcId && line.npcId !== opts.npcId) return false;
      if (opts?.context && line.context !== opts.context) return false;
      return evalCondition(line.cadesCondition, context);
    });
  }, [context, opts?.npcId, opts?.context]);

  const surveillanceLines = useMemo(() => {
    return GAME_MASTERS_SURVEILLANCE.filter((line) => {
      if (line.requiresMemeReveal && !opts?.memeRevealed) return false;
      return context.scenariosCompleted >= line.minScenariosAccessed;
    });
  }, [context, opts?.memeRevealed]);

  return { ambientLines, surveillanceLines, context };
}
