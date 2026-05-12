/**
 * Chess cutscene flag producers — chess roster wiring.
 *
 * Canonical producer wire-points for the 25 narrative flags that drive
 * the chess tutorial / ladder / Climb cutscenes shipped in
 * apps/shared/expansionArt/chessCutscenes.data.ts. Every flag has a
 * literal setNarrativeFlag call here so narrativeFlagRegistry.test.ts
 * can detect it. Game-event handlers (chess router, tutorial gate-enter,
 * Climb-tier-accept) call the matching fire*() helper when the in-world
 * event happens.
 *
 * Usage:
 *   import { fireChessLadderTheHumanFirstSeated } from "@shared/flags/chessCutsceneFlagProducers";
 *   fireChessLadderTheHumanFirstSeated(setNarrativeFlag);
 */

type SetNarrativeFlagFn = (key: string, value: boolean) => void;

/* ─── Chess Tutorial ─── */
export function fireChessTutorialG1Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g1_started", true);
}
export function fireChessTutorialG2Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g2_started", true);
}
export function fireChessTutorialG3Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g3_started", true);
}
export function fireChessTutorialG4Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g4_started", true);
}
export function fireChessTutorialG45Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g4_5_started", true);
}
export function fireChessTutorialG5Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g5_started", true);
}
export function fireChessTutorialG55Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g5_5_started", true);
}
export function fireChessTutorialG6Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g6_started", true);
}
export function fireChessTutorialG7Started(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_tutorial_g7_started", true);
}

/* ─── Chess Ladder ─── */
export function fireChessLadderTheHumanFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_human_first_seated", true);
}
export function fireChessLadderTheCollectorFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_collector_first_seated", true);
}
export function fireChessLadderIronLionFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_iron_lion_first_seated", true);
}
export function fireChessLadderTheEnigmaFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_enigma_first_seated", true);
}
export function fireChessLadderTheWarlordFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_warlord_first_seated", true);
}
export function fireChessLadderTheOracleFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_oracle_first_seated", true);
}
export function fireChessLadderTheNecromancerFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_necromancer_first_seated", true);
}
export function fireChessLadderTheProgrammerFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_programmer_first_seated", true);
}
export function fireChessLadderAgentZeroFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_agent_zero_first_seated", true);
}
export function fireChessLadderTheSourceFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_source_first_seated", true);
}
export function fireChessLadderGameMasterFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_game_master_first_seated", true);
}
export function fireChessLadderTheArchitectFirstSeated(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_ladder_the_architect_first_seated", true);
}

/* ─── Chess Climb ─── */
export function fireChessClimbTier0Entered(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_climb_tier_0_entered", true);
}
export function fireChessClimbTier1Entered(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_climb_tier_1_entered", true);
}
export function fireChessClimbTier2Entered(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_climb_tier_2_entered", true);
}
export function fireChessClimbTier3Entered(setNarrativeFlag: SetNarrativeFlagFn): void {
  setNarrativeFlag("chess_climb_tier_3_entered", true);
}
