/* ═══════════════════════════════════════════════════════
   TRUST SCALARS — per-NPC trust readout

   Surfaces the per-(user, npc) trust scalars the engine has
   accumulated across the player's investigation history. Each
   chip shows the NPC's reading of the player today (0-100 with
   a five-band label: Hostile / Wary / Witnessed / Present /
   Inheriting — the canonical Wraith-bible band names per
   apps/shared/npcs/bibles/wraith_calder.md, generalised here
   for the engine).

   When an arc finalises a scalar (via mysteryService.finalizeTrustScalar
   on the final-episode choice), the chip flips to its
   "finalised" appearance — locked-in, persistent across years
   per docs §14c.8. Until then, the scalar is "in motion" and
   the player can still move it through interrogation.
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lock } from "lucide-react";

/** Five-band trust labels — generalised from the Wraith bible's
 *  pre-rite trust bands (Hostile / Wary / Witnessed / Present /
 *  Inheriting). The bands map onto 0-100 in equal twentieths. */
function trustBand(scalar: number): { label: string; fg: string } {
  if (scalar < 20)  return { label: "HOSTILE",     fg: "var(--energy-error)" };
  if (scalar < 40)  return { label: "WARY",        fg: "var(--energy-warning)" };
  if (scalar < 60)  return { label: "WITNESSED",   fg: "rgba(226, 232, 240, 0.7)" };
  if (scalar < 80)  return { label: "PRESENT",     fg: "var(--energy-accent)" };
  return                { label: "INHERITING", fg: "var(--energy-success)" };
}

/** Display label for an npcId. Falls back to the raw id when
 *  not authored — the engine's authored npcId values are
 *  snake_case strings, the labels are Title Case. */
const NPC_LABELS: Record<string, string> = {
  wraith_calder:  "Wraith Calder",
  jericho_jones:  "Jericho Jones",
  the_seer:       "The Seer",
  vex_solene:     "Vex Solène",
  game_master:    "The Game Master",
  the_degen:      "The Degen",
};

function npcLabel(npcId: string): string {
  return NPC_LABELS[npcId] ?? npcId;
}

/** Inline SVG sparkline of a trust trajectory. The trajectory is
 *  always non-empty (seeded with 50 at the start) so the path is
 *  guaranteed to render. */
function TrustSparkline({ trajectory }: { trajectory: number[] }) {
  if (trajectory.length < 2) return null;
  const W = 56;
  const H = 14;
  const stepX = W / (trajectory.length - 1);
  const points = trajectory.map((s, i) => {
    const x = i * stepX;
    const y = H - (s / 100) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="shrink-0"
      style={{ color: "rgba(226, 232, 240, 0.55)" }}
      aria-hidden
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrustScalars() {
  const { isAuthenticated } = useAuth();
  const scalars = trpc.mysteries.getMyTrustScalars.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const history = trpc.mysteries.getMyTrustHistory.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (scalars.isLoading) return null;
  if (!scalars.data || scalars.data.length === 0) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--energy-accent)" }}>
        TRUST SCALARS
      </p>
      <div className="space-y-2">
        {scalars.data.map((row) => {
          const band = trustBand(row.scalar);
          const isFinalised = !!row.finalizedFromArc;
          return (
            <div
              key={row.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: isFinalised
                  ? "1px solid color-mix(in oklch, var(--energy-primary) 40%, transparent)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <span className="font-mono text-[11px] font-bold flex-1" style={{ color: "#e2e8f0" }}>
                {npcLabel(row.npcId)}
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
                <div
                  className="h-full"
                  style={{
                    width: `${row.scalar}%`,
                    background: band.fg,
                    transition: "width 200ms ease-out",
                  }}
                />
              </div>
              <span
                className="font-mono text-[9px] tracking-[0.25em] shrink-0"
                style={{ color: band.fg, minWidth: "5.5rem", textAlign: "right" }}
              >
                {band.label}
              </span>
              <TrustSparkline
                trajectory={
                  history.data?.find((h) => h.npcId === row.npcId)?.trajectory ?? []
                }
              />
              <span
                className="font-mono text-[10px] shrink-0 tabular-nums"
                style={{ color: "rgba(226, 232, 240, 0.55)", minWidth: "2.5rem", textAlign: "right" }}
              >
                {row.scalar}
              </span>
              {isFinalised && (
                <Lock
                  size={11}
                  className="shrink-0"
                  style={{ color: "var(--energy-primary)" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="font-mono text-[9px] mt-3" style={{ color: "rgba(226, 232, 240, 0.4)" }}>
        Scalars in motion can still be moved through interrogation. Locked scalars are arc-finalised — they persist across years.
      </p>
    </div>
  );
}
