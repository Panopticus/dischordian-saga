/* ═══════════════════════════════════════════════════════
   GUILD SIGNATURE ABILITIES

   One signature ability per Mechronis Guild. Only members
   of that Guild can learn it — the core differentiation
   between houses.

   Lock: Player must be sorted into the Guild (dominant skill
   maps to the Guild's Archon) AND reach Bond 50 with that
   Archon's voice (skill level 75+).

   These are the 12 "signature spells" of the Academy. Missing
   your Guild's ability makes you envy its members.
   ═══════════════════════════════════════════════════════ */

export type GuildAbilityId =
  | "chorus_harmonize"
  | "eyes_unseen_passage"
  | "archive_soul_read"
  | "between_phase_step"
  | "influencers_viral_word"
  | "yellow_coats_parade_order"
  | "congress_verbal_contract"
  | "locks_quarantine"
  | "grey_gamers_rule_rewrite"
  | "living_second_breath"
  | "forge_field_repair"
  | "study_investigator_sight";

export interface GuildAbility {
  id: GuildAbilityId;
  guildName: string;
  archonNumber: number;
  name: string;
  /** Poetic description */
  flavor: string;
  /** Mechanical effect */
  mechanics: string;
  /** System(s) it affects */
  affects: Array<"fight" | "dialog" | "exploration" | "puzzle" | "trade" | "all">;
  /** Cooldown in real-time minutes */
  cooldownMinutes: number;
  /** Skill threshold required to unlock (0-100) */
  skillThreshold: number;
  /** Dark Arts variant — more powerful, corrupts */
  darkVariant?: {
    name: string;
    mechanics: string;
    corruptionGain: number;
  };
}

export const GUILD_ABILITIES: GuildAbility[] = [
  {
    id: "chorus_harmonize", guildName: "The Chorus", archonNumber: 1,
    name: "Harmonize",
    flavor: "Your will aligns with all others briefly. You become a frequency they cannot refuse.",
    mechanics: "All companions sync to your initiative for 3 turns. Party attacks trigger in chord.",
    affects: ["fight"], cooldownMinutes: 30, skillThreshold: 75,
    darkVariant: {
      name: "Dissonance",
      mechanics: "Force an enemy to target their nearest ally for 2 turns. Breaks on damage.",
      corruptionGain: 5,
    },
  },
  {
    id: "eyes_unseen_passage", guildName: "The Eyes", archonNumber: 2,
    name: "Unseen Passage",
    flavor: "You step out of every line of sight at once. The Watcher's first lesson.",
    mechanics: "Become invisible for 10 seconds or until you act. Works on all NPCs, ignores detection.",
    affects: ["exploration", "fight"], cooldownMinutes: 20, skillThreshold: 75,
    darkVariant: {
      name: "Private Confession",
      mechanics: "Invisible AND you hear the target NPC's private thoughts for the duration.",
      corruptionGain: 8,
    },
  },
  {
    id: "archive_soul_read", guildName: "The Archive", archonNumber: 3,
    name: "Soul-Read",
    flavor: "The Collector's gift: you glimpse what this person would trade, and for what.",
    mechanics: "Reveal any NPC's trust level, hidden desires, and one secret. One-time per NPC per epoch.",
    affects: ["dialog"], cooldownMinutes: 60, skillThreshold: 75,
    darkVariant: {
      name: "Soul-Take",
      mechanics: "Steal one point of trust from the NPC permanently. They feel something missing.",
      corruptionGain: 10,
    },
  },
  {
    id: "between_phase_step", guildName: "The Between", archonNumber: 4,
    name: "Phase-Step",
    flavor: "Vernon taught you: reality has more doors than walls. Step through the seam.",
    mechanics: "Teleport through any single wall, obstacle, or locked door once per cooldown.",
    affects: ["exploration", "puzzle"], cooldownMinutes: 45, skillThreshold: 75,
    darkVariant: {
      name: "Dimensional Drift",
      mechanics: "Teleport across any map location. 15% chance you don't arrive where you aimed.",
      corruptionGain: 12,
    },
  },
  {
    id: "influencers_viral_word", guildName: "The Influencers", archonNumber: 5,
    name: "Viral Word",
    flavor: "Whisper once. The room believes. Minnie's signature lesson.",
    mechanics: "One NPC believes one lie you tell them, regardless of their trust or verification.",
    affects: ["dialog"], cooldownMinutes: 40, skillThreshold: 75,
    darkVariant: {
      name: "Thought Carry",
      mechanics: "The lie spreads to the NPC's entire faction. Permanent false belief.",
      corruptionGain: 15,
    },
  },
  {
    id: "yellow_coats_parade_order", guildName: "The Yellow Coats", archonNumber: 6,
    name: "Parade Order",
    flavor: "Wanda's command voice. Enemies hear themselves being organized for slaughter.",
    mechanics: "Force all enemies in view to move to your chosen position. They cannot attack that turn.",
    affects: ["fight"], cooldownMinutes: 30, skillThreshold: 75,
    darkVariant: {
      name: "Acceptable Casualties",
      mechanics: "Enemies move AND one randomly attacks another. Friendly-fire mandate.",
      corruptionGain: 10,
    },
  },
  {
    id: "congress_verbal_contract", guildName: "The Congress", archonNumber: 7,
    name: "Verbal Contract",
    flavor: "Senator Sprout's handshake: the deal binds whether they meant it or not.",
    mechanics: "Convert one enemy to temporary ally for 5 turns. Works on humanoid-intelligence enemies.",
    affects: ["fight", "dialog"], cooldownMinutes: 60, skillThreshold: 75,
    darkVariant: {
      name: "Blood Oath",
      mechanics: "Convert enemy permanently. They recover to full HP. You lose 10 HP forever.",
      corruptionGain: 15,
    },
  },
  {
    id: "locks_quarantine", guildName: "The Locks", archonNumber: 8,
    name: "Quarantine",
    flavor: "Wayne's safe-game: you lock something dangerous into a cage of thought.",
    mechanics: "Target enemy cannot use abilities or move for 2 turns. Single-target only.",
    affects: ["fight"], cooldownMinutes: 20, skillThreshold: 75,
    darkVariant: {
      name: "Thought Virus",
      mechanics:
        "Attach a Thought Virus status to the target. Each turn the infected unit rolls " +
        "against friendlyFireChance (starts 25%, +15% per stack, max 85%) to attack the " +
        "nearest ally instead of its intended target. Lasts 3 turns, extends +1 per stack. " +
        "Implemented via applyVirusStatus/tickVirusStatus in apps/shared/thoughtVirus.ts.",
      corruptionGain: 20,
    },
  },
  {
    id: "grey_gamers_rule_rewrite", guildName: "The Grey Gamers", archonNumber: 9,
    name: "Rule Rewrite",
    flavor: "Gary's ultimate: this wasn't a fair fight. You just made it yours.",
    mechanics: "Change one combat rule this turn (e.g., dodge always succeeds, crits auto-hit).",
    affects: ["fight", "puzzle"], cooldownMinutes: 90, skillThreshold: 75,
    darkVariant: {
      name: "House Rules",
      mechanics: "Change the rule permanently for this encounter. Enemies obey it too.",
      corruptionGain: 18,
    },
  },
  {
    id: "living_second_breath", guildName: "The Living", archonNumber: 10,
    name: "Second Breath",
    flavor: "Thazu's gift: you step past the line and come back carrying something.",
    mechanics: "Revive from fatal blow once per encounter with 25% HP.",
    affects: ["fight"], cooldownMinutes: 120, skillThreshold: 75,
    darkVariant: {
      name: "Borrowed Time",
      mechanics: "Revive with full HP. Cooldown does not reset until you kill someone.",
      corruptionGain: 25,
    },
  },
  {
    id: "forge_field_repair", guildName: "The Forge", archonNumber: 11,
    name: "Field Repair",
    flavor: "The Prince taught you: broken things are in-between things, and you have the tools.",
    mechanics: "Restore one piece of equipment to full durability, or repair a broken companion.",
    affects: ["fight", "exploration"], cooldownMinutes: 30, skillThreshold: 75,
    darkVariant: {
      name: "Salvage Rights",
      mechanics: "Repair AND extract one random trait from the object's previous user.",
      corruptionGain: 10,
    },
  },
  {
    id: "study_investigator_sight", guildName: "The Architect's Study", archonNumber: 12,
    name: "Investigator's Sight",
    flavor: "The Seeker's inheritance: every mystery has been solved once. You see the solution-shape.",
    mechanics: "Reveal the next puzzle solution, next enemy weakness, or next hidden object.",
    affects: ["puzzle", "fight", "exploration"], cooldownMinutes: 45, skillThreshold: 75,
    darkVariant: {
      name: "Architect's Eye",
      mechanics: "See the solution + the reason it exists + who designed it. Reveals plot beats ahead.",
      corruptionGain: 15,
    },
  },
];

/* ─── HELPERS ─── */

export function getAbilityForArchon(archonNumber: number): GuildAbility | undefined {
  return GUILD_ABILITIES.find(a => a.archonNumber === archonNumber);
}

export function getAbility(id: GuildAbilityId): GuildAbility | undefined {
  return GUILD_ABILITIES.find(a => a.id === id);
}

/**
 * Can the player use this ability?
 * Requires: dominant-skill >= threshold AND skill matches Guild's archon.
 */
export function canUseAbility(
  abilityId: GuildAbilityId,
  playerSkillLevelForGuildArchon: number,
): { canUse: boolean; reason?: string } {
  const ability = getAbility(abilityId);
  if (!ability) return { canUse: false, reason: "Unknown ability" };
  if (playerSkillLevelForGuildArchon < ability.skillThreshold) {
    return {
      canUse: false,
      reason: `Requires skill level ${ability.skillThreshold} with ${ability.guildName}'s Archon (currently ${playerSkillLevelForGuildArchon}).`,
    };
  }
  return { canUse: true };
}
