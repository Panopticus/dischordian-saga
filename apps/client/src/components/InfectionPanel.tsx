/* ═══════════════════════════════════════════════════════
   INFECTION PANEL — Renders the player's Thought Virus
   infection state, residue items, and available cures.

   Backed entirely by the thoughtVirus tRPC router:
     • getStatus  — load, stage, summary, available cures
     • getStaticData — residue registry for the "known
                       items" list
     • quarantineResidue / applyCure — mutations

   The panel is meant to live inside the player's cabin or
   medical bay and replace the previously-hardcoded "virus"
   placeholder text.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Biohazard, Shield, Syringe, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Props {
  /** Compact variant (small dashboard tile) vs full (medbay screen). */
  variant?: "compact" | "full";
  onOpenFull?: () => void;
}

export default function InfectionPanel({ variant = "full", onOpenFull }: Props) {
  const statusQuery = trpc.thoughtVirus.getStatus.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const staticQuery = trpc.thoughtVirus.getStaticData.useQuery(undefined, {
    staleTime: 60 * 60 * 1000,
  });
  const utils = trpc.useUtils();

  const quarantineMut = trpc.thoughtVirus.quarantineResidue.useMutation({
    onSuccess: () => {
      utils.thoughtVirus.getStatus.invalidate();
    },
  });
  const cureMut = trpc.thoughtVirus.applyCure.useMutation({
    onSuccess: () => {
      utils.thoughtVirus.getStatus.invalidate();
    },
  });

  const data = statusQuery.data;
  const staticData = staticQuery.data;

  const stageColor = data?.summary.stage.color ?? "#3a7d44";
  const loadPct = data?.summary.loadPct ?? 0;

  const loggedResidue = useMemo(() => {
    if (!data || !staticData) return [];
    return data.state.residueItemsLogged
      .map(id => staticData.residueItems.find(r => r.id === id))
      .filter((r): r is NonNullable<typeof r> => r !== undefined);
  }, [data, staticData]);

  if (statusQuery.isLoading || !data) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-3 font-mono text-[10px] text-muted-foreground">
        INFECTION PANEL — loading…
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={onOpenFull}
        className="w-full text-left border border-border/30 rounded-lg bg-card/40 p-3 hover:border-red-500/40 transition-colors group"
      >
        <div className="flex items-center gap-2 mb-2">
          <Biohazard size={14} style={{ color: stageColor }} />
          <span
            className="font-mono text-[9px] tracking-[0.2em] font-bold"
            style={{ color: stageColor }}
          >
            INFECTION · {data.summary.stage.label}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${loadPct}%`,
              background: `linear-gradient(90deg, ${stageColor} 0%, ${stageColor}80 100%)`,
            }}
          />
        </div>
        <div className="flex items-center justify-between font-mono text-[9px] text-white/40">
          <span>{loadPct}% load</span>
          <span className="flex items-center gap-1 group-hover:text-white/70 transition-colors">
            Details <ChevronRight size={10} />
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/20"
        style={{ borderBottomColor: `${stageColor}40` }}
      >
        <div className="flex items-center gap-2">
          <Biohazard size={16} style={{ color: stageColor }} />
          <span className="font-display text-xs font-bold tracking-[0.2em]">
            THOUGHT VIRUS · INFECTION STATE
          </span>
        </div>
        <span
          className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border"
          style={{
            color: stageColor,
            borderColor: `${stageColor}80`,
            background: `${stageColor}15`,
          }}
        >
          {data.summary.stage.label}
        </span>
      </div>

      <div className="p-3 space-y-4">
        {/* Load bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
              VIRAL LOAD
            </span>
            <span className="font-mono text-[10px]" style={{ color: stageColor }}>
              {loadPct}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadPct}%` }}
              style={{
                background: `linear-gradient(90deg, ${stageColor} 0%, ${stageColor}80 100%)`,
              }}
            />
          </div>
          <p className="font-mono text-[9px] text-white/40 mt-1">
            {data.summary.nextStage
              ? `${data.summary.loadUntilNextStage} until ${data.summary.nextStage.label}`
              : "Terminal stage"}
          </p>
        </div>

        {/* Stage description */}
        <div
          className="rounded p-2.5 border"
          style={{ borderColor: `${stageColor}30`, background: `${stageColor}08` }}
        >
          <p className="font-mono text-[10px] text-white/70 leading-relaxed italic">
            {data.summary.stage.description}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded bg-white/5 border border-white/10 p-2">
            <p className="font-mono text-[8px] tracking-wider text-white/30">RESIDUE LOGGED</p>
            <p className="font-display text-lg font-bold text-white">
              {data.summary.residueLoggedCount}
            </p>
          </div>
          <div className="rounded bg-white/5 border border-white/10 p-2">
            <p className="font-mono text-[8px] tracking-wider text-white/30">QUARANTINED</p>
            <p className="font-display text-lg font-bold text-emerald-400">
              {data.summary.residueQuarantinedCount}
            </p>
          </div>
          <div className="rounded bg-white/5 border border-white/10 p-2">
            <p className="font-mono text-[8px] tracking-wider text-white/30">ROOMS INFECTED</p>
            <p className="font-display text-lg font-bold" style={{ color: stageColor }}>
              {data.summary.contaminatedRoomCount}
            </p>
          </div>
        </div>

        {/* Residue log */}
        {loggedResidue.length > 0 && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">
              LOGGED RESIDUE · {loggedResidue.length}
            </p>
            <ul className="space-y-1.5">
              {loggedResidue.map(item => {
                const quarantined = data.state.residueItemsQuarantined.includes(item.id);
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded border border-white/5 bg-white/[0.02] px-2 py-1.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-white/80 truncate">{item.name}</p>
                      <p className="font-mono text-[8px] text-white/30 truncate">
                        {item.room.replace(/_/g, " ")}
                      </p>
                    </div>
                    {quarantined ? (
                      <span className="font-mono text-[8px] tracking-wider text-emerald-400 flex items-center gap-1">
                        <Shield size={10} /> SEALED
                      </span>
                    ) : (
                      <button
                        disabled={quarantineMut.isPending}
                        onClick={() => quarantineMut.mutate({ itemId: item.id })}
                        className="font-mono text-[8px] tracking-wider text-white/60 hover:text-emerald-300 transition-colors disabled:opacity-40"
                      >
                        QUARANTINE
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Cures */}
        {data.availableCures.length > 0 && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1">
              <Syringe size={10} /> AVAILABLE CURES
            </p>
            <ul className="space-y-1.5">
              {data.availableCures.map(cure => (
                <li
                  key={cure.id}
                  className="rounded border border-white/5 bg-white/[0.02] p-2"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-display text-[11px] font-bold text-white">{cure.name}</p>
                    <button
                      disabled={cureMut.isPending}
                      onClick={() => {
                        if (confirm(`Apply "${cure.name}"?\n\nCost: ${cure.cost}`)) {
                          cureMut.mutate({ cureId: cure.id });
                        }
                      }}
                      className="font-mono text-[8px] tracking-wider text-red-300 hover:text-red-200 transition-colors disabled:opacity-40"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="font-mono text-[9px] text-white/50 leading-snug">
                    {cure.description}
                  </p>
                  <p className="font-mono text-[8px] text-white/30 mt-1">Cost: {cure.cost}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warning footer when at critical+ */}
        {(data.summary.stage.id === "critical" || data.summary.stage.id === "consumed") && (
          <div className="rounded border border-red-500/30 bg-red-950/20 p-2.5 flex items-start gap-2">
            <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="font-mono text-[9px] text-red-300 leading-relaxed">
              At this stage the virus may take control during combat. Cures without companion
              sacrifice are no longer available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
