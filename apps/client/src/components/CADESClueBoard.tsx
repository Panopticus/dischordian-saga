/* ═══════════════════════════════════════════════════════
   CADESClueBoard — renders the CADES-related investigation
   clues, filtered by current discovery state, with their
   linked bounty contracts when known.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { INVESTIGATION_CLUES, BOUNTY_CONTRACTS } from "@/game/investigationSystems";
import { Fingerprint, Clock, Database, Eye, VolumeX } from "lucide-react";

const TYPE_ICON = {
  visual: Eye,
  audio: VolumeX,
  data: Database,
  scent: Fingerprint,
  temporal: Clock,
} as const;

// Clue id prefix "clue_cades_*" or "clue_gm_*" or "clue_iron_lion_*" are ours.
const CADES_CLUE_PREFIXES = ["clue_cades_", "clue_gm_", "clue_iron_lion_"];

function isCadesClue(clueId: string): boolean {
  return CADES_CLUE_PREFIXES.some((p) => clueId.startsWith(p));
}

export function CADESClueBoard() {
  const { isAuthenticated } = useAuth();
  const { state } = useGame();
  const cadesData = trpc.gameState.getCadesData.useQuery(undefined, { enabled: isAuthenticated });

  const discoveryFlags: Record<string, boolean> = {
    cadesDiscovered: (state.narrativeAct ?? 0) >= 5,
    cades_gm_contact_1: (cadesData.data?.gmContactLevel ?? 0) >= 1,
    cades_gm_contact_2: (cadesData.data?.gmContactLevel ?? 0) >= 2,
    cades_gm_contact_3: (cadesData.data?.gmContactLevel ?? 0) >= 3,
    cades_gm_contact_4: (cadesData.data?.gmContactLevel ?? 0) >= 4,
    cades_awareness_3: (cadesData.data?.loopCount ?? 0) >= 3,
  };

  const cadesClues = INVESTIGATION_CLUES.filter((c) => isCadesClue(c.id));
  if (cadesClues.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur p-4">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "#f59e0b" }}>
        CADES INVESTIGATION CLUES
      </p>
      <div className="space-y-3">
        {cadesClues.map((clue) => {
          // Best-effort gating: infer the discovery flag from the bounty's
          // requiresFlag (or match by known keys).
          const bounty = clue.bountyId ? BOUNTY_CONTRACTS.find((b) => b.id === clue.bountyId) : null;
          const requiredFlag = bounty?.requiresFlag ?? "cadesDiscovered";
          const discovered = discoveryFlags[requiredFlag] ?? false;
          const Icon = TYPE_ICON[clue.type] ?? Database;
          return (
            <div
              key={clue.id}
              className="flex gap-3 p-3 rounded-lg"
              style={{
                background: discovered ? "rgba(245, 158, 11, 0.06)" : "rgba(100, 100, 100, 0.04)",
                borderLeft: discovered ? "2px solid #f59e0b" : "2px dashed rgba(148, 163, 184, 0.4)",
                opacity: discovered ? 1 : 0.45,
                filter: discovered ? undefined : "grayscale(0.6)",
              }}
            >
              <Icon size={14} className="mt-0.5 shrink-0" style={{ color: discovered ? "#f59e0b" : "#94a3b8" }} />
              <div className="flex-1">
                <p className="font-mono text-[10px] font-bold tracking-wider mb-1" style={{ color: discovered ? "#fbbf24" : "#94a3b8" }}>
                  {discovered ? clue.description.split(" — ")[0] : "[LOCKED CLUE]"}
                </p>
                {discovered && (
                  <p className="font-mono text-[10px] leading-relaxed" style={{ color: "#e2e8f0" }}>
                    {clue.revelation}
                  </p>
                )}
                {discovered && bounty && (
                  <p className="font-mono text-[8px] tracking-widest mt-2" style={{ color: "#f97316" }}>
                    → BOUNTY: {bounty.name.toUpperCase()}
                  </p>
                )}
                {!discovered && (
                  <p className="font-mono text-[9px] italic" style={{ color: "#64748b" }}>
                    Requires discovery flag: {requiredFlag}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
