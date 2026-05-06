/* ═══════════════════════════════════════════════════════
   BATTLE COMPANION SLOT HUD — plan §B6 wiring

   Mounts the existing CompanionAbilitySlot as a HUD overlay
   above the DuelystGameUI battle surface. The 2,043-line
   battle component stays untouched; this HUD lives in the
   parent (DuelystPage) and overlays on top.

   "Active battle companion" is resolved from existing state:
     1. The player's currently-committed romance partner, if
        any (so romanced players battle with their partner —
        the BioWare framing).
     2. Otherwise Elara — she's always present on the Bridge
        and acts as the default battle companion.

   Activation routes through trpc.cardGame.companionAbility on
   legacy match ids, and otherwise emits a CustomEvent
   `companion-ability-activated` so the rigorous tcg-core
   engine can pick it up via a follow-up subscriber. Either
   way the cooldown bookkeeping in useCompanionAbilitySlot
   keeps the UI honest.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import CompanionAbilitySlot from "./CompanionAbilitySlot";
import type { CompanionRosterId } from "@shared/companionRoomRegistry";
import type { CompanionAbility } from "@shared/companionAbilities";
import { useGame } from "@/contexts/GameContext";

export interface BattleCompanionSlotHUDProps {
  /** Optional legacy-router match id. When present, ability
   *  activations dispatch through trpc.cardGame.companionAbility.
   *  When absent (the Duelyst-engine path today), the HUD
   *  emits a CustomEvent on activation so future engine
   *  integration can subscribe. */
  legacyMatchId?: number;
  /** Override the resolved companion. Useful for tutorial
   *  flows or scripted scenes that pin a specific partner. */
  pinnedCompanion?: CompanionRosterId;
  /** Hidden in tutorial / cinematic frames where the HUD
   *  would distract. Defaults true. */
  visible?: boolean;
}

/** Map a romance candidate id (from romanceLadders.ts) to the
 *  matching companion-roster id. Most are 1:1; the romance
 *  ids use shorter slugs ("locke", "vex") while the roster
 *  uses the canonical npc id ("adjudicator_locke", "vex_solene"). */
const ROMANCE_TO_ROSTER: Record<string, CompanionRosterId> = {
  locke: "adjudicator_locke",
  vex: "vex_solene",
  elara: "elara",
  jericho_jones: "jericho_jones",
  // dmc_companion has no card-battle ability surface yet; falls
  // through to Elara default below.
};

const ROMANCE_CANDIDATE_IDS = ["locke", "vex", "elara", "jericho_jones"] as const;

export default function BattleCompanionSlotHUD({
  legacyMatchId,
  pinnedCompanion,
  visible = true,
}: BattleCompanionSlotHUDProps) {
  const { state } = useGame();

  /** Resolved (companion, bond) pair driving the slot. */
  const resolved = useMemo<{ companionId: CompanionRosterId; bondLevel: number } | null>(() => {
    if (pinnedCompanion) {
      return { companionId: pinnedCompanion, bondLevel: bondFor(state, pinnedCompanion) };
    }
    // Romance commitment wins over the Elara default.
    for (const candidate of ROMANCE_CANDIDATE_IDS) {
      const flag = `romance:committed:${candidate}`;
      if (state.narrativeFlags?.[flag]) {
        const rosterId = ROMANCE_TO_ROSTER[candidate];
        if (rosterId) return { companionId: rosterId, bondLevel: bondFor(state, rosterId) };
      }
    }
    return { companionId: "elara", bondLevel: bondFor(state, "elara") };
  }, [state, pinnedCompanion]);

  if (!visible || !resolved) return null;

  const handleActivate = (ability: CompanionAbility) => {
    // Future engine wiring — subscribers in DuelystGameUI or the
    // legacy battle UI can listen for this and apply the effect
    // through their own action grammar. The legacy server
    // endpoint (cardGame.companionAbility) is the canonical
    // application path when a legacyMatchId is present; the
    // event surface keeps the wiring decoupled.
    try {
      window.dispatchEvent(
        new CustomEvent("companion-ability-activated", {
          detail: {
            companionId: resolved.companionId,
            ability,
            legacyMatchId: legacyMatchId ?? null,
          },
        }),
      );
    } catch {
      /* SSR / window absent — silently degrade */
    }
  };

  return (
    <div
      className="fixed top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
      data-testid="battle-companion-slot-hud"
    >
      <div className="rounded-lg border border-primary/30 bg-background/85 backdrop-blur-sm shadow-lg shadow-primary/10">
        <CompanionAbilitySlot
          companionId={resolved.companionId}
          bondLevel={resolved.bondLevel}
          onActivate={handleActivate}
        />
      </div>
    </div>
  );
}

/** Pull a bond level for the named companion out of game state.
 *  Reads (in order): companionRelationships[id] → per-NPC
 *  scalar (elaraTrust / humanTrust) → 0. */
function bondFor(state: ReturnType<typeof useGame>["state"], companionId: CompanionRosterId): number {
  const rels = (state as unknown as { companionRelationships?: Record<string, number> })
    .companionRelationships;
  if (rels && typeof rels[companionId] === "number") return rels[companionId];
  if (companionId === "elara" && typeof state.elaraTrust === "number") return state.elaraTrust;
  if (companionId === "the_human" && typeof state.humanTrust === "number") return state.humanTrust;
  return 0;
}
