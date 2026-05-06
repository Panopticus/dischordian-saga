/* ═══════════════════════════════════════════════════════
   CompanionAbilitySlot — card-battle UI surface

   Plan §B6. Renders the active companion's unlocked
   abilities as a small horizontal strip the player can click
   to activate. Locked abilities show their bond requirement
   so the player knows what's coming.

   Engine wiring (apps/shared/tcg-core/engine/cardGame.ts
   reading the ability effect on activation) is a deliberate
   follow-up — this component only owns the slot visuals +
   click → onActivate callback. Callers consume the callback
   and dispatch the effect into the engine themselves.
   ═══════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import {
  bondTierFor,
  listCompanionAbilities,
  nextLockedAbility,
  type CompanionAbility,
} from "@shared/companionAbilities";
import type { CompanionRosterId } from "@shared/companionRoomRegistry";
import { useCompanionAbilitySlot } from "@/hooks/useCompanionAbilitySlot";

export interface CompanionAbilitySlotProps {
  companionId: CompanionRosterId;
  bondLevel: number;
  /** Fires when the player activates an unlocked + ready ability.
   *  Caller is responsible for delivering the effect into the
   *  card engine. */
  onActivate: (ability: CompanionAbility) => void;
  /** When true (default), unavailable abilities still render as
   *  greyed/locked tiles with their bond requirement. Set false
   *  for a tighter UI that hides locked tiles entirely. */
  showLocked?: boolean;
}

export default function CompanionAbilitySlot({
  companionId,
  bondLevel,
  onActivate,
  showLocked = true,
}: CompanionAbilitySlotProps) {
  const { isReady, remainingMs, activate } = useCompanionAbilitySlot();
  const unlocked = listCompanionAbilities(companionId, bondLevel);
  const next = nextLockedAbility(companionId, bondLevel);
  const tier = bondTierFor(bondLevel);

  const handleClick = (ability: CompanionAbility) => {
    if (!isReady(ability.id)) return;
    if (activate(ability.id)) onActivate(ability);
  };

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-md border border-border/30 bg-background/60"
      data-testid={`companion-ability-slot-${companionId}`}
    >
      <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase mr-1">
        Bond {bondLevel}
        {tier > 0 && <span className="ml-1 text-primary/60">T{COMPANION_BOND_TIERS_LABEL[tier]}</span>}
      </span>

      {unlocked.map((ability) => {
        const ready = isReady(ability.id);
        const remaining = remainingMs(ability.id);
        return (
          <motion.button
            key={ability.id}
            type="button"
            onClick={() => handleClick(ability)}
            disabled={!ready}
            whileHover={ready ? { scale: 1.05 } : undefined}
            whileTap={ready ? { scale: 0.96 } : undefined}
            className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded border text-[10px] font-mono transition-colors ${
              ready
                ? "border-primary/40 bg-primary/10 text-primary cursor-pointer"
                : "border-border/30 bg-muted/20 text-muted-foreground/50 cursor-not-allowed"
            }`}
            title={ability.description}
            data-testid={`ability-${ability.id}`}
          >
            <span className="flex items-center gap-1">
              <Sparkles size={10} />
              <span className="truncate max-w-[8ch]">{ability.name}</span>
            </span>
            {!ready && (
              <span className="text-[8px] tracking-wider text-muted-foreground/60">
                {Math.ceil(remaining / 1000)}s
              </span>
            )}
          </motion.button>
        );
      })}

      {showLocked && next && (
        <div
          className="flex items-center gap-1 px-2 py-1.5 rounded border border-dashed border-border/30 bg-muted/10 text-[10px] font-mono text-muted-foreground/50"
          title={`${next.name}: unlocks at bond ${next.minBondLevel}`}
          data-testid={`ability-locked-${next.id}`}
        >
          <Lock size={10} />
          <span>Bond {next.minBondLevel}</span>
        </div>
      )}

      {unlocked.length === 0 && !next && (
        <span className="text-[10px] font-mono text-muted-foreground/40">
          No abilities yet — raise your bond.
        </span>
      )}
    </div>
  );
}

const COMPANION_BOND_TIERS_LABEL: Record<number, string> = {
  20: "1",
  40: "2",
  60: "3",
  80: "4",
};
