/* ═══════════════════════════════════════════════════════
   MEMORY ENERGY BADGE — Act 2 HUD chip

   Small inline badge that shows current Memory Energy and cap.
   Appears in the Engineer's Bench header and any Act 2+ crafting
   surface. The tooltip explains earn sources so players who hit
   the §6.2 "out of memory energy" pinch know what to do next.

   Shape + styling mirrors ForgePage.tsx's Dream Token chip so
   it slots into the same HUD row without feeling bolted on.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Zap } from "lucide-react";

interface MemoryEnergyBadgeProps {
  current: number;
  cap: number;
  /** Optional pending cost (preview — shown as ghosted subtraction). */
  previewCost?: number;
  /** Compact mode uses smaller type; default is HUD-sized. */
  compact?: boolean;
}

export default function MemoryEnergyBadge({
  current,
  cap,
  previewCost,
  compact = false,
}: MemoryEnergyBadgeProps) {
  const pct = useMemo(
    () => (cap > 0 ? Math.min(100, Math.max(0, (current / cap) * 100)) : 0),
    [current, cap],
  );
  const lowEnergy = current <= Math.max(3, cap * 0.1);
  const previewInsufficient =
    typeof previewCost === "number" && previewCost > 0 && previewCost > current;

  const barColor = previewInsufficient
    ? "#ef4444"
    : lowEnergy
      ? "#f59e0b"
      : "#60a5fa";

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-md border bg-stone-950/70 backdrop-blur",
        compact ? "px-2 py-1" : "px-3 py-1.5",
        previewInsufficient
          ? "border-red-500/40"
          : lowEnergy
            ? "border-amber-500/40"
            : "border-indigo-500/30",
      ].join(" ")}
      title={
        "Memory Energy — the fuel the bench burns. Earn by winning card battles, chess, and arena matches, or by discovering Engineer recordings. Trade Empire lifts the cap."
      }
      data-testid="memory-energy-badge"
    >
      <Zap
        size={compact ? 10 : 12}
        className={
          previewInsufficient
            ? "text-red-300"
            : lowEnergy
              ? "text-amber-300"
              : "text-indigo-300"
        }
      />
      <div className="flex items-center gap-1.5">
        <span
          className={[
            "font-mono tabular-nums",
            compact ? "text-[10px]" : "text-[11px]",
            previewInsufficient
              ? "text-red-200"
              : lowEnergy
                ? "text-amber-200"
                : "text-indigo-100",
          ].join(" ")}
        >
          {current}
          {typeof previewCost === "number" && previewCost > 0 && (
            <span
              className={[
                "ml-1 opacity-60",
                previewInsufficient ? "text-red-300" : "text-stone-400",
              ].join(" ")}
            >
              (−{previewCost})
            </span>
          )}
          <span className="text-stone-500">/{cap}</span>
        </span>
      </div>
      <div
        className={[
          "h-1 w-10 overflow-hidden rounded-full bg-stone-800",
          compact ? "hidden" : "",
        ].join(" ")}
      >
        <div
          className="h-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
