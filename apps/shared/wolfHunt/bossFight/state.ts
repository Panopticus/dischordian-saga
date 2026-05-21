/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Boss fight card module: state shape

   Engaged when the mission reducer enters step=engagement
   on an isBossLieutenant target. Player IS the Wolf
   (attacker); the AI plays the lieutenant's defender deck.

   Inversion vs. the retired pre-pivot card module: in the
   old design the player defended; here the player attacks.

   Match length is bounded: maxTurns prevents stalls. If
   the turn counter expires with the lieutenant alive, the
   lieutenant escapes (mission outcome = escaped).
   ═══════════════════════════════════════════════════════ */

export type BossPhase = "wolf_turn" | "lieutenant_turn" | "ended";

export type WolfCardId =
  | "hunt"
  | "restraint"
  | "mercy"
  | "memory_of_the_medic";

export type DefenderCardId =
  | "lord_rally"
  | "corrupted_guard"
  | "reposition"
  | "counter_strike";

export type BossOutcome = "wolf_wins" | "lieutenant_wins" | "lycos_dies";

export interface BossState {
  /** Mission instance id this boss-fight belongs to. */
  missionId: string;
  /** Boss target id (lieutenant). */
  targetId: string;
  phase: BossPhase;
  /** 1-indexed turn counter. */
  turn: number;
  /** Hard cap; on reach, the lieutenant escapes. */
  maxTurns: number;
  /** Lieutenant HP. Reduced by wolf cards. */
  lieutenantHp: number;
  lieutenantMaxHp: number;
  /** Lycos HP — mirrors mission.lycosHealth at fight start. */
  lycosHp: number;
  lycosMaxHp: number;
  /** Wolf hand + deck (1-card draw per turn start). */
  wolfHand: ReadonlyArray<WolfCardId>;
  wolfDeck: ReadonlyArray<WolfCardId>;
  /** Defender hand + deck. */
  defenderHand: ReadonlyArray<DefenderCardId>;
  defenderDeck: ReadonlyArray<DefenderCardId>;
  /** Append-only beat log for UI ribbon. */
  log: ReadonlyArray<string>;
  outcome?: BossOutcome;
}

export function emptyBossState(
  missionId: string,
  targetId: string,
  lycosHp: number,
): BossState {
  return {
    missionId,
    targetId,
    phase: "wolf_turn",
    turn: 1,
    maxTurns: 12,
    lieutenantHp: 30,
    lieutenantMaxHp: 30,
    lycosHp,
    lycosMaxHp: 100,
    wolfHand: ["hunt", "restraint", "mercy"],
    wolfDeck: ["hunt", "memory_of_the_medic", "hunt", "restraint", "mercy"],
    defenderHand: ["corrupted_guard", "lord_rally"],
    defenderDeck: [
      "counter_strike",
      "corrupted_guard",
      "reposition",
      "corrupted_guard",
      "counter_strike",
    ],
    log: ["The lieutenant turns to face you."],
  };
}
