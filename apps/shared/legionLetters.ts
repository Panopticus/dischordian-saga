/* ═══════════════════════════════════════════════════════
   LETTERS FROM THE FRONT

   Deployed apprentices send narrative micro-updates from
   their posts. Each letter has:
     • Voice matching the sender's archetype
     • A reference to at least one other roster member (when
       possible) — makes the Legion feel interconnected
     • Occasional binary choice from the player

   Letters surface as unread-count badges in the Decision
   Deck, readable from the GraduateLegionPage.
   ═══════════════════════════════════════════════════════ */

import type { Apprentice, ApprenticeArchetype } from "./apprentices";
import type { GraduateRole } from "./graduateLegion";

export interface LetterTemplate {
  /** From archetype */
  archetype: ApprenticeArchetype;
  /** Role the sender is deployed in */
  role: GraduateRole;
  /** Template with {self}, {other}, {player} placeholders */
  body: string;
  /** Does this letter ask the player a question? */
  hasQuestion: boolean;
  /** If has question, the binary options */
  questionOptions?: [string, string];
}

/* ─── LETTER TEMPLATES ─── */

export const LETTER_TEMPLATES: LetterTemplate[] = [
  // Zealot army leader
  { archetype: "zealot", role: "army_leader",
    body: "Commander — the Yellow Coats took the Circuit Wastes. We lost a squad to a Warden-ambush. I did not flinch. I buried them with the hymn we learned in Celebration. {other} was there. They said you'd be proud. I am trying to be worthy of that. — {self}",
    hasQuestion: false },
  { archetype: "zealot", role: "army_leader",
    body: "There is a city on Veridian Three that refuses to surrender. I can raze it in two days. I can siege it in two weeks. The siege will save lives on BOTH sides. The razing will finish this campaign faster and you need that. Tell me. — {self}",
    hasQuestion: true, questionOptions: ["Raze the city", "Besiege it (slower, fewer deaths)"] },

  // Ghost army leader
  { archetype: "ghost", role: "army_leader",
    body: "I did not write for weeks because there was nothing to report. Today there is. An enemy officer kept a photo of his daughter. I returned it to her. This is the first mercy the Yellow Coats have shown in my command. I do not know what it means. — {self}",
    hasQuestion: false },

  // Heretic trade envoy
  { archetype: "heretic", role: "trade_envoy",
    body: "{player} — New Babylon's trade council is corrupt. I have proof. I can leak it (faction rep drops but prices crash in our favor), or sit on it (quiet profits, slow compromise). They think I'm reasonable. I am not. Your call. — {self}",
    hasQuestion: true, questionOptions: ["Leak the corruption", "Sit on it — play the long game"] },

  // Martyr tower captain
  { archetype: "martyr", role: "tower_captain",
    body: "Commander — the Terminus wave was worse than expected. Two towers fell. The crew lived because I rerouted the last reserve shields to cover them. I took a hit. It's fine. I'm still here. I saw {other}'s report came in first. They worry too much. Please tell them I'm okay. — {self}",
    hasQuestion: false },

  // Scholar trade envoy
  { archetype: "scholar", role: "trade_envoy",
    body: "{player}, I found a pattern in the Architect's trade protocols that I don't think anyone was meant to find. If I share it with The Antiquarian, he'll know who discovered it — which puts me on the Architect's list. If I DON'T share it, it costs you future trade advantages. Your call. — {self}",
    hasQuestion: true, questionOptions: ["Share the pattern with the Antiquarian", "Keep it quiet — protect you, lose the edge"] },

  // Jester tower captain
  { archetype: "jester", role: "tower_captain",
    body: "Commander — the waves keep getting weirder. Today I convinced a Terminus Swarm drone to attack ITS OWN teammates by playing Minnie's old propaganda reel backwards at 0.5 speed. I am either a tactical genius or losing my mind. Possibly both. Miss you. {other} thinks I'm an idiot. They're right. — {self}",
    hasQuestion: false },

  // Sentinel army leader
  { archetype: "sentinel", role: "army_leader",
    body: "All quiet, Commander. The perimeter holds. {other} stopped by yesterday for rations and told me about the Architect's new decree. I don't have an opinion. You asked me to guard this line. I am guarding this line. — {self}",
    hasQuestion: false },

  // Oracle army leader
  { archetype: "oracle", role: "army_leader",
    body: "Commander, I saw something. I can't tell if it's a premonition or a memory. You're standing in the Matrix of Dreams and the Dreamer is crying. {other} is beside you but they're saying words in a language you don't know. I wrote it down. It reads like an apology. — {self}",
    hasQuestion: false },

  // Prodigal army leader
  { archetype: "prodigal", role: "army_leader",
    body: "I want to request a transfer. Not because I'm leaving you. Because {other} is in the same front and they're looking at me like they remember something I don't. I've been gone a long time, {player}. I came back for YOU. I can't fight next to someone who keeps my old debts. Please. — {self}",
    hasQuestion: true, questionOptions: ["Approve the transfer", "Deny — they need to work it out"] },

  // Artisan trade envoy
  { archetype: "artisan", role: "trade_envoy",
    body: "{player} — I built a prototype in my off-hours. A trade-route optimizer. It works. It saves us 12% across all contracts. The engineering council wants to license it from you. Say the word, I send them the schematics. Say another word, I keep it ours. — {self}",
    hasQuestion: true, questionOptions: ["License it (Dream + faction rep)", "Keep it (personal trade advantage)"] },

  // Revenant army leader
  { archetype: "revenant", role: "army_leader",
    body: "Commander — I died again yesterday. Just for a few seconds. The medic said it's the third time this campaign. It doesn't hurt anymore, which is worse. {other} was there when I came back and they looked AT me, not through me. For the first time, someone saw me come back. I want to tell you what I saw. — {self}",
    hasQuestion: false },

  // Wanderer trade envoy
  { archetype: "wanderer", role: "trade_envoy",
    body: "I've opened two new trade routes. One to Violetta (dangerous, Voltari still wary but profitable) and one to the Insurgency fringe (risky, but ideologically interesting). Which do we prioritize? — {self}",
    hasQuestion: true, questionOptions: ["Violetta (high-risk, high-profit)", "Insurgency fringe (political implications)"] },
];

/* ─── GENERATION ─── */

/**
 * Generate a letter for a deployed apprentice. Picks a matching
 * template by archetype + role, then fills in placeholders.
 */
export function generateLetter(
  sender: Apprentice,
  role: GraduateRole,
  otherRosterNames: string[],
  playerName: string = "Commander",
): { body: string; hasQuestion: boolean; questionOptions?: [string, string] } | null {
  const matching = LETTER_TEMPLATES.filter(t => t.archetype === sender.archetype && t.role === role);
  if (matching.length === 0) return null;
  const template = matching[Math.floor(Math.random() * matching.length)];
  const other = otherRosterNames.length > 0
    ? otherRosterNames[Math.floor(Math.random() * otherRosterNames.length)]
    : "a crewmate";
  const body = template.body
    .replace(/\{self\}/g, sender.name)
    .replace(/\{other\}/g, other)
    .replace(/\{player\}/g, playerName);
  return {
    body,
    hasQuestion: template.hasQuestion,
    questionOptions: template.questionOptions,
  };
}

/**
 * Roll to see if a given deployed apprentice sends a letter today.
 * ~20% daily chance, higher for higher-rarity apprentices.
 */
export function rollLetterChance(apprentice: Apprentice): boolean {
  const rarityMod = { common: 0.15, uncommon: 0.20, rare: 0.28, epic: 0.40, mythic: 0.55 }[apprentice.rarity];
  return Math.random() < rarityMod;
}
