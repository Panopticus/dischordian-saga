/* ═══════════════════════════════════════════════════════
   KEYWORD INTERACTIONS
   audit/16 PR 21 (finding TCG3 — TCG persona).

   Pre-audit, keyword combinations had no UX surface. A
   player who saw `provoke + ranged` on a card had no way to
   tell whether the ranged unit could still be targeted from
   afar (it can — provoke forces ADJACENT enemies, ranged
   attackers are unaffected) without trial-and-error in
   match. This module exposes per-keyword descriptions +
   notable interactions so the GameCard tooltip can render
   the rule a player needs at the moment they're picking
   between cards.

   Authoring rule: every keyword in the Card.ts `Keyword`
   union should have an entry here. The
   keywordCoverageInvariant test enforces it.
   ═══════════════════════════════════════════════════════ */

import type { Keyword } from "./types/Card";

export interface KeywordInteractionEntry {
  /** The keyword id matching the Keyword type union. */
  keyword: Keyword;
  /** Player-facing display name. */
  label: string;
  /** Short rules-text summary. ≤140 chars; the GameCard
   *  tooltip renders this as the headline. */
  summary: string;
  /** Optional notable interactions with other keywords on the
   *  same unit OR keywords on opposing units. Authored as a
   *  short rules-text bullet list; rendered as a sub-section
   *  in the tooltip. */
  notableInteractions?: readonly { with: Keyword | "any"; note: string }[];
}

/** Per-keyword authoring. Order mirrors Card.ts's Keyword
 *  union for stable diffability. */
export const KEYWORD_INTERACTIONS: Readonly<Record<Keyword, KeywordInteractionEntry>> = {
  rush: {
    keyword: "rush",
    label: "Rush",
    summary: "May act the turn it's summoned (skip the usual summoning-sickness wait).",
    notableInteractions: [
      { with: "celerity", note: "Combines: a Rush + Celerity unit can attack twice on the deploy turn." },
      { with: "structure", note: "Structure overrides Rush — structures can't act regardless." },
    ],
  },
  ranged: {
    keyword: "ranged",
    label: "Ranged",
    summary: "May attack any tile, takes no counterattack.",
    notableInteractions: [
      { with: "provoke", note: "Provoke forces ADJACENT enemies to target the provoker. Ranged attackers ignore provoke and can still target what they want." },
      { with: "untargetable", note: "Ranged still can't target an Untargetable unit." },
    ],
  },
  flying: {
    keyword: "flying",
    label: "Flying",
    summary: "May move to any empty tile (ignores movement-range limits).",
  },
  provoke: {
    keyword: "provoke",
    label: "Provoke",
    summary: "Adjacent enemies must target this unit on their attacks.",
    notableInteractions: [
      { with: "ranged", note: "Ranged attackers ignore provoke; they can target whatever they want." },
      { with: "flying", note: "Flying enemies can fly past adjacency, breaking the provoke lock." },
    ],
  },
  celerity: {
    keyword: "celerity",
    label: "Celerity",
    summary: "Two actions per turn (move + attack OR attack twice).",
  },
  blast: {
    keyword: "blast",
    label: "Blast",
    summary: "Attack hits all enemies in a straight line behind the target.",
    notableInteractions: [
      { with: "ranged", note: "Combines beautifully — ranged + blast hits a column without exposing the attacker." },
    ],
  },
  frenzy: {
    keyword: "frenzy",
    label: "Frenzy",
    summary: "Attacks hit all enemies adjacent to the primary target.",
    notableInteractions: [
      { with: "fury", note: "Stacks: each Fury extra-attack also Frenzy-splashes." },
    ],
  },
  rebirth: {
    keyword: "rebirth",
    label: "Rebirth",
    summary: "On death, leaves a 0/1 egg that hatches into a copy next turn.",
  },
  forcefield: {
    keyword: "forcefield",
    label: "Forcefield",
    summary: "Absorbs the first damage instance taken this turn.",
    notableInteractions: [
      { with: "pierce", note: "Pierce ignores armor but does NOT bypass Forcefield." },
      { with: "ignore_armor_3", note: "Same — armor-piercing doesn't break Forcefield." },
    ],
  },
  airdrop: {
    keyword: "airdrop",
    label: "Airdrop",
    summary: "May be summoned on any empty tile (no near-friendly-general restriction).",
  },
  deathwatch: {
    keyword: "deathwatch",
    label: "Deathwatch",
    summary: "Triggers an effect when ANY unit dies (friendly or enemy, anywhere).",
  },
  infiltrate: {
    keyword: "infiltrate",
    label: "Infiltrate",
    summary: "Bonus effect while on the enemy's side of the board.",
  },
  grow: {
    keyword: "grow",
    label: "Grow",
    summary: "Gains permanent stats at the start of its owner's turn.",
  },
  backstab: {
    keyword: "backstab",
    label: "Backstab",
    summary: "Bonus damage when attacking a target from behind.",
  },
  zeal: {
    keyword: "zeal",
    label: "Zeal",
    summary: "+1 power while adjacent to its friendly general.",
  },
  dispel: {
    keyword: "dispel",
    label: "Dispel",
    summary: "Strips ongoing effects from the target on hit.",
  },
  stun: {
    keyword: "stun",
    label: "Stun",
    summary: "Cannot act on its next turn.",
  },
  structure: {
    keyword: "structure",
    label: "Structure",
    summary: "Cannot move or attack — defensive board presence only.",
    notableInteractions: [
      { with: "rush", note: "Structure overrides Rush — structures can't act regardless of how they were summoned." },
    ],
  },
  ephemeral: {
    keyword: "ephemeral",
    label: "Ephemeral",
    summary: "Dies at end of its owner's turn.",
    notableInteractions: [
      { with: "rebirth", note: "Ephemeral fires before Rebirth's resolution — the ephemeral death still leaves an egg." },
    ],
  },
  untargetable: {
    keyword: "untargetable",
    label: "Untargetable",
    summary: "Cannot be chosen as a single target by spells or attacks.",
  },
  ignore_armor_3: {
    keyword: "ignore_armor_3",
    label: "Ignore Armor 3",
    summary: "Pierces 3 flat armor on the target.",
  },
  can_attack_this_turn: {
    keyword: "can_attack_this_turn",
    label: "Can Attack This Turn",
    summary: "Internal runtime flag granted by Rush on deploy. Not authored on cards directly.",
  },
  taunt: {
    keyword: "taunt",
    label: "Taunt",
    summary: "Alias for Provoke. Folded into provoke at card-load time.",
  },
  drain: {
    keyword: "drain",
    label: "Drain",
    summary: "Heals the owner's general for a percentage of damage this unit deals.",
  },
  pierce: {
    keyword: "pierce",
    label: "Pierce",
    summary: "Ignores a portion of enemy armor.",
  },
  overcharge: {
    keyword: "overcharge",
    label: "Overcharge",
    summary: "Bonus damage on first attack, then self-damages.",
  },
  fury: {
    keyword: "fury",
    label: "Fury",
    summary: "Attacks hit twice (multi-attack).",
    notableInteractions: [
      { with: "frenzy", note: "Each Fury attack also Frenzy-splashes — devastating against clusters." },
    ],
  },
  pack: {
    keyword: "pack",
    label: "Pack",
    summary: "+1 power per other ally with the same card definition.",
  },
  rally_buff: {
    keyword: "rally_buff",
    label: "Rally Buff",
    summary: "On deploy, buffs adjacent friendly units.",
  },
  resurrect: {
    keyword: "resurrect",
    label: "Resurrect",
    summary: "Returns once at full health on first death.",
    notableInteractions: [
      { with: "ephemeral", note: "Ephemeral kills before Resurrect can trigger; the resurrect charge IS spent on the ephemeral death though." },
    ],
  },
  flanking: {
    keyword: "flanking",
    label: "Flanking",
    summary: "+N power when attacking a target the unit's ally is also adjacent to.",
  },
};

/** Look up a keyword's interaction entry. Returns null when
 *  the keyword isn't in the registry — UI consumers can fall
 *  back to a "rule pending" placeholder. */
export function getKeywordInteraction(
  keyword: string,
): KeywordInteractionEntry | null {
  return (KEYWORD_INTERACTIONS as Readonly<Record<string, KeywordInteractionEntry>>)[keyword] ?? null;
}

/** Returns the notable interactions FOR `keyword` filtered
 *  to those whose `with` is also present in `otherKeywords`.
 *  Lets the GameCard tooltip surface "the interactions that
 *  are live on THIS card." */
export function getActiveInteractions(
  keyword: string,
  otherKeywords: readonly string[],
): readonly { with: string; note: string }[] {
  const entry = getKeywordInteraction(keyword);
  if (!entry?.notableInteractions) return [];
  const otherSet = new Set(otherKeywords.filter((k) => k !== keyword));
  return entry.notableInteractions.filter(
    (i) => i.with === "any" || otherSet.has(i.with),
  );
}
