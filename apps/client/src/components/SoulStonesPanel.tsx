/* ═══════════════════════════════════════════════════════
   SOUL STONES PANEL
   Per docs/design/SOUL_STONES_SYSTEM.md §1.3 — render the
   per-state count breakdown (violet / red / gold) and the
   three player-driven actions: corrupt, purify, summon.
   Void Energy compliant: all colors via void-* tokens.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { Gem, Flame, Sparkles, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SOUL_STONE_FACTIONS, soulStoneUrl } from "@shared/aaaArtArchive";

export function SoulStonesPanel() {
  const { data, isLoading, refetch } = trpc.soulStones.getMine.useQuery();

  const corrupt = trpc.soulStones.corrupt.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Stone corrupted. The Hierarchy takes its due.");
    },
    onError: (err) => toast.error(err.message),
  });
  const purify = trpc.soulStones.purify.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Stone purified. The Dreamer's light holds.");
    },
    onError: (err) => toast.error(err.message),
  });
  const summon = trpc.soulStones.summon.useMutation({
    onSuccess: (res) => {
      refetch();
      toast.success(`Summoned: ${res.petPlaceholder} (-${res.redSpent} red).`);
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading || !data) {
    return (
      <div className="border void-border rounded-lg void-bg-canvas p-4">
        <div className="flex items-center gap-2">
          <Gem size={16} className="void-text" />
          <span className="font-mono text-xs tracking-wider void-text">SOUL STONES</span>
        </div>
      </div>
    );
  }

  const hasViolet = data.violetCount > 0;
  const canSummon = data.redCount >= data.summonCost;
  const weeklyRemaining = Math.max(0, data.weeklyCap - data.weeklyCollected);

  return (
    <div className="border void-border rounded-lg void-bg-canvas p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gem size={16} className="void-text-accent" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">SOUL STONES</span>
        </div>
        <span className="font-mono text-[9px] void-text">
          weekly {data.weeklyCollected}/{data.weeklyCap}
        </span>
      </div>

      {/* Count breakdown — three-state economy */}
      <div className="grid grid-cols-3 gap-2">
        <div className="border void-border rounded void-bg-sunk p-2 text-center">
          <Gem size={14} className="void-text-energy mx-auto" />
          <div className="font-display text-base font-bold void-text-energy">{data.violetCount}</div>
          <div className="font-mono text-[8px] uppercase void-text">violet</div>
        </div>
        <div className="border void-border rounded void-bg-sunk p-2 text-center">
          <Flame size={14} className="void-text-error mx-auto" />
          <div className="font-display text-base font-bold void-text-error">{data.redCount}</div>
          <div className="font-mono text-[8px] uppercase void-text">red</div>
        </div>
        <div className="border void-border rounded void-bg-sunk p-2 text-center">
          <Sparkles size={14} className="void-text-accent mx-auto" />
          <div className="font-display text-base font-bold void-text-accent">{data.goldCount}</div>
          <div className="font-mono text-[8px] uppercase void-text">gold</div>
        </div>
      </div>

      {/* Corrupt / purify choice — only enabled with violet stones */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!hasViolet || corrupt.isPending}
          onClick={() => corrupt.mutate()}
          data-action="corrupt"
        >
          <Flame size={12} className="void-text-error" />
          <span className="font-mono text-[10px] ml-1">Corrupt → red</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!hasViolet || purify.isPending}
          onClick={() => purify.mutate()}
          data-action="purify"
        >
          <Sparkles size={12} className="void-text-accent" />
          <span className="font-mono text-[10px] ml-1">Purify → gold</span>
        </Button>
      </div>

      {/* Summon — gated on red-stone budget */}
      <div className="border void-border rounded void-bg-sunk p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skull size={14} className="void-text-error" />
          <div>
            <div className="font-mono text-[10px] void-text">Summon Demon Pet</div>
            <div className="font-mono text-[8px] void-text">cost {data.summonCost} red</div>
          </div>
        </div>
        <Button
          size="sm"
          disabled={!canSummon || summon.isPending}
          onClick={() => summon.mutate()}
          data-action="summon"
        >
          <span className="font-mono text-[10px]">Summon</span>
        </Button>
      </div>

      {weeklyRemaining === 0 && (
        <div className="font-mono text-[9px] void-text text-center">
          Weekly combat-cap reached. Resets in cron tick.
        </div>
      )}

      {/* Faction signature band — May 2026 producer-drop soul-stone art,
          one stone per combat faction. Decorative-only (the gameplay
          counter above tracks tier, not faction); hover reveals the
          faction name for accessibility. */}
      <div className="border void-border rounded void-bg-sunk p-2">
        <div className="font-mono text-[8px] uppercase tracking-[0.2em] void-text mb-2 text-center">
          factional bindings
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {SOUL_STONE_FACTIONS.map((f) => (
            <img
              key={f}
              src={soulStoneUrl(f)}
              alt={f}
              title={f}
              loading="lazy"
              className="w-full aspect-square object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
