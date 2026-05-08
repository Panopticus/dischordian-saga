/* ═══════════════════════════════════════════════════════
   SEVEN SEALS RIBBON — sealed | breaking | broken icons

   Strip of seven seal-icons. Each icon's appearance reflects
   the current player's act-progression-derived seal phase:
     - sealed   → unbroken wax dot
     - breaking → cracked wax (act started but not complete)
     - broken   → flame (act complete)

   Hovered icon surfaces the seal's fall summary. Mounts on
   the World Tapestry page above the four-horsemen gauge.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { SEVEN_SEALS } from "@shared/sevenSeals";

type Phase = "sealed" | "breaking" | "broken";

const PHASE_GLYPH: Record<Phase, string> = {
  sealed: "●",
  breaking: "◍",
  broken: "✶",
};

const PHASE_COLOR: Record<Phase, string> = {
  sealed: "#9ca3af",
  breaking: "#fbbf24",
  broken: "#f87171",
};

export default function SevenSealsRibbon() {
  // Witness Card carries the per-seal phase tally for the active player.
  const { data: card } = trpc.playerProfile.witnessCard.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const phaseByActNum: Record<number, Phase> = {};
  for (const p of card?.sealPhases ?? []) {
    phaseByActNum[p.act] = p.phase as Phase;
  }

  return (
    <div
      className="flex items-center gap-3"
      data-testid="seven-seals-ribbon"
    >
      {SEVEN_SEALS.map((seal) => {
        const phase = phaseByActNum[seal.num] ?? "sealed";
        return (
          <div
            key={seal.num}
            className="flex flex-col items-center gap-1"
            title={`Seal ${seal.num} — ${seal.themeTag.replace(/_/g, " ")}\n${seal.fallSummary}`}
            data-seal={seal.num}
            data-phase={phase}
          >
            <span
              className="text-2xl leading-none"
              style={{ color: PHASE_COLOR[phase] }}
              aria-label={`Seal ${seal.num} ${phase}`}
            >
              {PHASE_GLYPH[phase]}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/50">
              {phase === "broken" ? "broken" : phase === "breaking" ? "cracking" : "sealed"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
