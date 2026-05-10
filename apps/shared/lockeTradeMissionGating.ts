/* ═══════════════════════════════════════════════════════
   LOCKE TRADE-MISSION GATING — diegetic lore over the
   existing trust bands

   The full Trade Empire mission loop is unbuilt. The plan
   names this not "missing" but "Locke needs trust before
   sending real missions." This module surfaces that promise
   as discrete trust-band gates with in-fiction copy. The
   server can read these to gate which mission types Locke
   currently offers; the UI can render the unlock progression
   as a roadmap on the Casino / Bounty Board pages.

   Trust bands come from apps/shared/lockeConfidentialLedger.ts
   (Prospect → Client → Partner → Insider → Adjudicated). This
   module overlays mission-system unlocks onto those bands
   without adding new state.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

import type { LockeTrustBand } from "./lockeConfidentialLedger";

export interface TradeMissionGate {
  /** What system is unlocked at this band. */
  systemId:
    | "intake_placeholder"
    | "casino"
    | "kelvara_wreck_run"
    | "bounty_board"
    | "outer_dusk_expedition"
    | "real_mission_loop";
  /** Trust band required to unlock. */
  requires: LockeTrustBand;
  /** Display label rendered on the unlock card. */
  label: string;
  /** In-fiction copy explaining why this gate exists. */
  rationale: string;
  /** Whether the underlying runtime exists today. When false,
   *  the UI surfaces a "Locke is preparing this" placeholder. */
  shipped: boolean;
}

export const TRADE_MISSION_GATES: ReadonlyArray<TradeMissionGate> = [
  {
    systemId: "intake_placeholder",
    requires: "Prospect",
    label: "Beat D — three slates (intake)",
    rationale:
      "I post three jobs on the cargo-bay board. They have been there since before any of your parents were born. Reading them all is a courtesy I am asking you to extend.",
    shipped: true,
  },
  {
    systemId: "casino",
    requires: "Client",
    label: "Casino — the Degen's house",
    rationale:
      "I have a friend at the Casino. He is older than he should be. His eyes are the wrong color. Tell him Locke sent you and he will let you in for free. He also sets the door price for entrance to certain underground events the Hierarchy does not advertise.",
    shipped: true,
  },
  {
    systemId: "kelvara_wreck_run",
    requires: "Partner",
    label: "Kelvara wreck — first real run",
    rationale:
      "The lane is finally safe — the Hierarchy patrol left it on Tuesday. The wreck is real. The salvage is real. The bond will be mine to hold. That is not a rebuke, it is the structure. Trust between us has reached the structure that lets me hold a bond on your behalf.",
    shipped: false,
  },
  {
    systemId: "bounty_board",
    requires: "Partner",
    label: "Bounty Board — Witcher contracts",
    rationale:
      "I have been sitting on contracts. Some pay well. Some pay differently. The Bounty Board is mine to publish. It opens to you when you have shown me you can read what I write twice and not behave as if you read it once.",
    shipped: true,
  },
  {
    systemId: "outer_dusk_expedition",
    requires: "Insider",
    label: "Outer Dusk Expedition — long route",
    rationale:
      "Outer Dusk is far. Maps lie about it. The lane is real. So is the patrol on it. The expedition is a multi-leg run with three checkpoints. I will brief each leg as you reach it. I do not brief in advance because the lane changes between legs.",
    shipped: false,
  },
  {
    systemId: "real_mission_loop",
    requires: "Adjudicated",
    label: "Trade Empire mission loop — full",
    rationale:
      "Adjudicated. The bond is mutual now. You hold one of mine, I hold one of yours, and the work is the work. The full mission loop opens here — every lane, every contract, every cover. The version of you who signed at Prospect would not recognise the version signing at Adjudicated. That is correct. The work is the difference.",
    shipped: false,
  },
];

export function getGatesForBand(
  held: LockeTrustBand,
): TradeMissionGate[] {
  const order: LockeTrustBand[] = [
    "Prospect",
    "Client",
    "Partner",
    "Insider",
    "Adjudicated",
  ];
  const heldIdx = order.indexOf(held);
  return TRADE_MISSION_GATES.filter(
    (g) => order.indexOf(g.requires) <= heldIdx,
  );
}

export function getNextGate(
  held: LockeTrustBand,
): TradeMissionGate | undefined {
  const order: LockeTrustBand[] = [
    "Prospect",
    "Client",
    "Partner",
    "Insider",
    "Adjudicated",
  ];
  const heldIdx = order.indexOf(held);
  return TRADE_MISSION_GATES.find(
    (g) => order.indexOf(g.requires) > heldIdx,
  );
}
