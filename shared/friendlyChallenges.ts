/**
 * FRIENDLY CHALLENGES
 * ══════════════════════════════════════════════════════════
 * Unranked matches with custom rules, daily challenge of the day.
 */

export type ChallengeGameType = "chess" | "card_battle" | "fighting" | "tower_defense";
export type ChallengeStatus = "pending" | "accepted" | "in_progress" | "completed" | "expired" | "declined";

export interface ChallengeRule {
  key: string;
  name: string;
  description: string;
  gameType: ChallengeGameType;
  icon: string;
}

export const CHALLENGE_RULES: ChallengeRule[] = [
  { key: "no_specials", name: "No Special Moves", description: "Special abilities are disabled", gameType: "fighting", icon: "Ban" },
  { key: "speed_chess", name: "Speed Chess", description: "30 second time limit per move", gameType: "chess", icon: "Timer" },
  { key: "draft_mode", name: "Draft Mode", description: "Players draft cards alternately", gameType: "card_battle", icon: "Layers" },
  { key: "mirror_match", name: "Mirror Match", description: "Both players use the same character", gameType: "fighting", icon: "Copy" },
  { key: "no_towers", name: "No Towers", description: "Raid-only challenge", gameType: "tower_defense", icon: "Ban" },
  { key: "random_deck", name: "Random Deck", description: "Play with a randomly generated deck", gameType: "card_battle", icon: "Shuffle" },
  { key: "one_hp", name: "One HP Mode", description: "All units have 1 HP", gameType: "tower_defense", icon: "Heart" },
  { key: "blindfold", name: "Blindfold Chess", description: "Board is hidden after 5 moves", gameType: "chess", icon: "EyeOff" },
];

export interface DailyChallenge {
  dayKey: string; // YYYY-MM-DD
  gameType: ChallengeGameType;
  rules: string[];
  title: string;
  description: string;
  reward: { type: "xp" | "dream" | "token"; amount: number };
}

/** Generate daily challenge from date seed */
export function getDailyChallenge(dateStr: string): DailyChallenge {
  const seed = dateStr.split("-").reduce((a, b) => a + parseInt(b), 0);
  const gameTypes: ChallengeGameType[] = ["chess", "card_battle", "fighting", "tower_defense"];
  const gameType = gameTypes[seed % gameTypes.length];
  const availableRules = CHALLENGE_RULES.filter(r => r.gameType === gameType);
  const rule = availableRules[seed % availableRules.length];

  const titles: Record<ChallengeGameType, string[]> = {
    chess: ["Grandmaster's Gambit", "The King's Trial", "Checkmate Challenge"],
    card_battle: ["Deck Builder's Duel", "Card Shark Showdown", "The Draw"],
    fighting: ["Arena Champion", "The Gauntlet", "Warrior's Trial"],
    tower_defense: ["Siege Breaker", "The Last Stand", "Fortress Challenge"],
  };

  return {
    dayKey: dateStr,
    gameType,
    rules: rule ? [rule.key] : [],
    title: titles[gameType][seed % titles[gameType].length],
    description: `Today's challenge: ${gameType.replace("_", " ")} with ${rule?.name || "standard"} rules`,
    reward: { type: "dream", amount: 25 + (seed % 25) },
  };
}

export const GAME_TYPE_LABELS: Record<ChallengeGameType, string> = {
  chess: "Chess",
  card_battle: "Card Battle",
  fighting: "Fighting",
  tower_defense: "Tower Defense",
};
