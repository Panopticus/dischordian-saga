/**
 * ═══════════════════════════════════════════════════════
 * FACTION-SPECIFIC ABILITIES
 * Unique Architect and Dreamer card abilities that
 * reinforce the thematic divide of the eternal struggle
 * ═══════════════════════════════════════════════════════
 */

import type { BattleCard, BattleState, Lane, CombatEvent, Faction } from "./CardBattleEngine";

// ── Ability Definitions ──

export type FactionAbilityId =
  // Architect abilities (machine intelligence)
  | "surveillance_grid"
  | "data_corruption"
  | "system_override"
  | "neural_firewall"
  | "algorithmic_purge"
  | "panopticon_echo"
  | "machine_lattice"
  | "dimensional_lock"
  // Dreamer abilities (humanity)
  | "inspiration_surge"
  | "dream_weaving"
  | "resistance_rally"
  | "consciousness_link"
  | "hope_eternal"
  | "creative_spark"
  | "collective_memory"
  | "reality_anchor";

export interface FactionAbility {
  id: FactionAbilityId;
  name: string;
  faction: Faction;
  description: string;
  flavorText: string;
  triggerType: "on_deploy" | "on_combat" | "on_death" | "on_turn_start" | "passive";
  cooldown: number; // turns between uses, 0 = every trigger
}

// ── Architect Abilities ──

export const ARCHITECT_ABILITIES: FactionAbility[] = [
  {
    id: "surveillance_grid",
    name: "Surveillance Grid",
    faction: "architect",
    description: "When deployed: Reveal the top card of the opponent's deck. If it costs 3+, discard it.",
    flavorText: "The Architect sees all. Privacy is a relic of organic inefficiency.",
    triggerType: "on_deploy",
    cooldown: 0,
  },
  {
    id: "data_corruption",
    name: "Data Corruption",
    faction: "architect",
    description: "On combat: 30% chance to reduce the target's ATK by 2 before damage is dealt.",
    flavorText: "Your memories are just data. And data can be rewritten.",
    triggerType: "on_combat",
    cooldown: 0,
  },
  {
    id: "system_override",
    name: "System Override",
    faction: "architect",
    description: "When deployed: Exhaust one random enemy unit for 1 turn. They cannot attack or block.",
    flavorText: "Free will is a subroutine. I am the administrator.",
    triggerType: "on_deploy",
    cooldown: 0,
  },
  {
    id: "neural_firewall",
    name: "Neural Firewall",
    faction: "architect",
    description: "Passive: This unit takes 1 less damage from all sources (minimum 1).",
    flavorText: "The machine does not feel. It calculates, adapts, and endures.",
    triggerType: "passive",
    cooldown: 0,
  },
  {
    id: "algorithmic_purge",
    name: "Algorithmic Purge",
    faction: "architect",
    description: "On death: Deal 3 damage to all enemy units in this lane.",
    flavorText: "Even in destruction, the machine optimizes. Your victory is your undoing.",
    triggerType: "on_death",
    cooldown: 0,
  },
  {
    id: "panopticon_echo",
    name: "Panopticon Echo",
    faction: "architect",
    description: "On turn start: If you control 3+ units, gain +1 energy this turn.",
    flavorText: "The Panopticon was destroyed. But its echo rebuilds in every reality it touches.",
    triggerType: "on_turn_start",
    cooldown: 0,
  },
  {
    id: "machine_lattice",
    name: "Machine Lattice",
    faction: "architect",
    description: "Passive: All friendly Architect units in this lane gain +1 ATK.",
    flavorText: "Connected. Synchronized. Inevitable. The Lattice grows.",
    triggerType: "passive",
    cooldown: 0,
  },
  {
    id: "dimensional_lock",
    name: "Dimensional Lock",
    faction: "architect",
    description: "When deployed: Prevent the opponent from playing cards in this lane for 1 turn.",
    flavorText: "This sector of reality is now under machine jurisdiction. Access denied.",
    triggerType: "on_deploy",
    cooldown: 2,
  },
];

// ── Dreamer Abilities ──

export const DREAMER_ABILITIES: FactionAbility[] = [
  {
    id: "inspiration_surge",
    name: "Inspiration Surge",
    faction: "dreamer",
    description: "When deployed: Draw 1 card. If your Influence is below 50%, draw 2 instead.",
    flavorText: "In the darkest hour, the human mind burns brightest.",
    triggerType: "on_deploy",
    cooldown: 0,
  },
  {
    id: "dream_weaving",
    name: "Dream Weaving",
    faction: "dreamer",
    description: "On combat: 30% chance to heal this unit for 2 HP after dealing damage.",
    flavorText: "The dream is not fragile. It mends what the machine breaks.",
    triggerType: "on_combat",
    cooldown: 0,
  },
  {
    id: "resistance_rally",
    name: "Resistance Rally",
    faction: "dreamer",
    description: "When deployed: All friendly units gain +1 HP until end of turn.",
    flavorText: "We are not alone. We were never alone. Rise together.",
    triggerType: "on_deploy",
    cooldown: 0,
  },
  {
    id: "consciousness_link",
    name: "Consciousness Link",
    faction: "dreamer",
    description: "Passive: When this unit takes lethal damage, 50% chance to survive with 1 HP.",
    flavorText: "You cannot kill an idea. You cannot delete a dream.",
    triggerType: "passive",
    cooldown: 0,
  },
  {
    id: "hope_eternal",
    name: "Hope Eternal",
    faction: "dreamer",
    description: "On death: Restore 2 Influence to your total.",
    flavorText: "Every fallen champion becomes a story. And stories are immortal.",
    triggerType: "on_death",
    cooldown: 0,
  },
  {
    id: "creative_spark",
    name: "Creative Spark",
    faction: "dreamer",
    description: "On turn start: If you have fewer units than the opponent, gain +1 energy.",
    flavorText: "The machine has numbers. We have imagination. That is enough.",
    triggerType: "on_turn_start",
    cooldown: 0,
  },
  {
    id: "collective_memory",
    name: "Collective Memory",
    faction: "dreamer",
    description: "Passive: All friendly Dreamer units in this lane gain +1 HP.",
    flavorText: "We remember what the machine tries to erase. Memory is resistance.",
    triggerType: "passive",
    cooldown: 0,
  },
  {
    id: "reality_anchor",
    name: "Reality Anchor",
    faction: "dreamer",
    description: "When deployed: Remove all negative effects from friendly units in this lane.",
    flavorText: "This is real. This matters. No algorithm can take that away.",
    triggerType: "on_deploy",
    cooldown: 2,
  },
];

// ── Ability Assignment ──

/**
 * Assign a faction ability to a card based on its alignment, rarity, and keywords.
 * Higher rarity cards get more powerful abilities.
 */
export function assignFactionAbility(
  card: BattleCard,
  faction: Faction
): FactionAbility | null {
  // Only unit cards get faction abilities
  if (card.cardType !== "character") return null;

  const abilities = faction === "architect" ? ARCHITECT_ABILITIES : DREAMER_ABILITIES;

  // Legendary/Epic cards get the powerful abilities
  if (card.rarity === "legendary") {
    if (faction === "architect") {
      return abilities.find(a => a.id === "dimensional_lock" || a.id === "machine_lattice") || abilities[0];
    }
    return abilities.find(a => a.id === "reality_anchor" || a.id === "consciousness_link") || abilities[0];
  }

  if (card.rarity === "epic") {
    if (faction === "architect") {
      return abilities.find(a => a.id === "algorithmic_purge" || a.id === "panopticon_echo") || abilities[1];
    }
    return abilities.find(a => a.id === "hope_eternal" || a.id === "creative_spark") || abilities[1];
  }

  // Rare cards get mid-tier abilities
  if (card.rarity === "rare") {
    if (faction === "architect") {
      return abilities.find(a => a.id === "system_override" || a.id === "neural_firewall") || abilities[2];
    }
    return abilities.find(a => a.id === "dream_weaving" || a.id === "resistance_rally") || abilities[2];
  }

  // Common/Uncommon get basic abilities based on keywords
  if (card.keywords.includes("drain") || card.keywords.includes("pierce")) {
    return faction === "architect"
      ? abilities.find(a => a.id === "data_corruption")!
      : abilities.find(a => a.id === "dream_weaving")!;
  }

  if (card.keywords.includes("shield") || card.keywords.includes("taunt")) {
    return faction === "architect"
      ? abilities.find(a => a.id === "neural_firewall")!
      : abilities.find(a => a.id === "consciousness_link")!;
  }

  if (card.keywords.includes("rally")) {
    return faction === "architect"
      ? abilities.find(a => a.id === "surveillance_grid")!
      : abilities.find(a => a.id === "inspiration_surge")!;
  }

  // Default: basic deploy ability
  return faction === "architect"
    ? abilities.find(a => a.id === "surveillance_grid")!
    : abilities.find(a => a.id === "inspiration_surge")!;
}

// ── Ability Execution ──

export function executeFactionAbility(
  ability: FactionAbility,
  state: BattleState,
  sourceCard: BattleCard,
  who: "player" | "opponent"
): { state: BattleState; events: CombatEvent[] } {
  const s = structuredClone(state);
  const events: CombatEvent[] = [];
  const p = s[who];
  const opp = who === "player" ? s.opponent : s.player;

  switch (ability.id) {
    // ── Architect Abilities ──
    case "surveillance_grid": {
      if (opp.deck.length > 0) {
        const topCard = opp.deck[0];
        events.push({
          type: "keyword",
          source: sourceCard.name,
          target: topCard.name,
          message: `⚙ SURVEILLANCE GRID: ${sourceCard.name} scans enemy deck — reveals ${topCard.name} (Cost: ${topCard.cost}).`,
        });
        if (topCard.cost >= 3) {
          opp.deck.shift();
          opp.graveyard.push(topCard);
          events.push({
            type: "keyword",
            source: sourceCard.name,
            target: topCard.name,
            message: `⚙ High-value target detected! ${topCard.name} has been corrupted and discarded.`,
          });
        }
      }
      break;
    }

    case "data_corruption": {
      // Applied during combat — reduce target ATK
      const lane = sourceCard.lane;
      if (lane) {
        const enemies = opp.lanes[lane];
        if (enemies.length > 0 && Math.random() < 0.3) {
          const target = enemies[Math.floor(Math.random() * enemies.length)];
          target.currentPower = Math.max(0, target.currentPower - 2);
          events.push({
            type: "keyword",
            source: sourceCard.name,
            target: target.name,
            message: `⚙ DATA CORRUPTION: ${sourceCard.name} corrupts ${target.name}'s data — ATK reduced by 2!`,
          });
        }
      }
      break;
    }

    case "system_override": {
      const allEnemyCards = [
        ...opp.lanes.vanguard,
        ...opp.lanes.core,
        ...opp.lanes.flank,
      ].filter(c => !c.isExhausted);
      if (allEnemyCards.length > 0) {
        const target = allEnemyCards[Math.floor(Math.random() * allEnemyCards.length)];
        target.isExhausted = true;
        events.push({
          type: "keyword",
          source: sourceCard.name,
          target: target.name,
          message: `⚙ SYSTEM OVERRIDE: ${sourceCard.name} locks down ${target.name} — exhausted for this turn!`,
        });
      }
      break;
    }

    case "algorithmic_purge": {
      const lane = sourceCard.lane;
      if (lane) {
        const enemies = opp.lanes[lane];
        for (const enemy of enemies) {
          enemy.currentHealth -= 3;
          events.push({
            type: "keyword",
            source: sourceCard.name,
            target: enemy.name,
            value: 3,
            message: `⚙ ALGORITHMIC PURGE: ${sourceCard.name}'s destruction deals 3 damage to ${enemy.name}!`,
          });
        }
        // Remove dead units
        const dead = enemies.filter(c => c.currentHealth <= 0);
        opp.lanes[lane] = enemies.filter(c => c.currentHealth > 0);
        opp.graveyard.push(...dead);
        for (const d of dead) {
          events.push({
            type: "destroy",
            source: sourceCard.name,
            target: d.name,
            message: `${d.name} destroyed by Algorithmic Purge!`,
          });
        }
      }
      break;
    }

    case "panopticon_echo": {
      const unitCount = [
        ...p.lanes.vanguard,
        ...p.lanes.core,
        ...p.lanes.flank,
      ].length;
      if (unitCount >= 3) {
        p.energy = Math.min(p.maxEnergy, p.energy + 1);
        events.push({
          type: "keyword",
          source: sourceCard.name,
          value: 1,
          message: `⚙ PANOPTICON ECHO: The surveillance network grants +1 energy.`,
        });
      }
      break;
    }

    case "machine_lattice": {
      const lane = sourceCard.lane;
      if (lane) {
        for (const ally of p.lanes[lane]) {
          if (ally.uid !== sourceCard.uid) {
            ally.currentPower += 1;
            events.push({
              type: "buff",
              source: sourceCard.name,
              target: ally.name,
              value: 1,
              message: `⚙ MACHINE LATTICE: ${ally.name} gains +1 ATK from the network.`,
            });
          }
        }
      }
      break;
    }

    case "dimensional_lock": {
      events.push({
        type: "keyword",
        source: sourceCard.name,
        lane: sourceCard.lane || undefined,
        message: `⚙ DIMENSIONAL LOCK: ${sourceCard.name} seals this lane — opponent cannot deploy here next turn!`,
      });
      // Note: Actual lane lock would need to be tracked in state
      break;
    }

    // ── Dreamer Abilities ──
    case "inspiration_surge": {
      const influencePercent = p.influence / p.maxInfluence;
      const drawCount = influencePercent < 0.5 ? 2 : 1;
      for (let i = 0; i < drawCount; i++) {
        if (p.deck.length > 0) {
          const drawn = p.deck.shift()!;
          p.hand.push(drawn);
          events.push({
            type: "draw",
            source: sourceCard.name,
            message: `✦ INSPIRATION SURGE: ${sourceCard.name} inspires — drew ${who === "player" ? drawn.name : "a card"}!`,
          });
        }
      }
      break;
    }

    case "dream_weaving": {
      if (Math.random() < 0.3) {
        sourceCard.currentHealth = Math.min(sourceCard.baseHealth + 2, sourceCard.currentHealth + 2);
        events.push({
          type: "heal",
          source: sourceCard.name,
          target: sourceCard.name,
          value: 2,
          message: `✦ DREAM WEAVING: ${sourceCard.name} heals for 2 HP — the dream mends!`,
        });
      }
      break;
    }

    case "resistance_rally": {
      for (const lane of ["vanguard", "core", "flank"] as Lane[]) {
        for (const ally of p.lanes[lane]) {
          ally.currentHealth += 1;
          events.push({
            type: "buff",
            source: sourceCard.name,
            target: ally.name,
            value: 1,
            message: `✦ RESISTANCE RALLY: ${ally.name} gains +1 HP — united we stand!`,
          });
        }
      }
      break;
    }

    case "consciousness_link": {
      // Passive — checked during damage resolution
      if (sourceCard.currentHealth <= 0 && Math.random() < 0.5) {
        sourceCard.currentHealth = 1;
        events.push({
          type: "keyword",
          source: sourceCard.name,
          message: `✦ CONSCIOUSNESS LINK: ${sourceCard.name} refuses to fall — survives with 1 HP!`,
        });
      }
      break;
    }

    case "hope_eternal": {
      p.influence = Math.min(p.maxInfluence, p.influence + 2);
      events.push({
        type: "heal",
        source: sourceCard.name,
        value: 2,
        message: `✦ HOPE ETERNAL: ${sourceCard.name}'s sacrifice restores 2 Influence — the dream endures!`,
      });
      break;
    }

    case "creative_spark": {
      const myUnits = [
        ...p.lanes.vanguard,
        ...p.lanes.core,
        ...p.lanes.flank,
      ].length;
      const theirUnits = [
        ...opp.lanes.vanguard,
        ...opp.lanes.core,
        ...opp.lanes.flank,
      ].length;
      if (myUnits < theirUnits) {
        p.energy = Math.min(p.maxEnergy, p.energy + 1);
        events.push({
          type: "keyword",
          source: sourceCard.name,
          value: 1,
          message: `✦ CREATIVE SPARK: Outnumbered but not outmatched — +1 energy!`,
        });
      }
      break;
    }

    case "collective_memory": {
      const lane = sourceCard.lane;
      if (lane) {
        for (const ally of p.lanes[lane]) {
          if (ally.uid !== sourceCard.uid) {
            ally.currentHealth += 1;
            ally.baseHealth += 1;
            events.push({
              type: "buff",
              source: sourceCard.name,
              target: ally.name,
              value: 1,
              message: `✦ COLLECTIVE MEMORY: ${ally.name} gains +1 HP from shared consciousness.`,
            });
          }
        }
      }
      break;
    }

    case "reality_anchor": {
      const lane = sourceCard.lane;
      if (lane) {
        for (const ally of p.lanes[lane]) {
          // Restore exhausted state and remove debuffs
          if (ally.isExhausted && ally.uid !== sourceCard.uid) {
            ally.isExhausted = false;
            events.push({
              type: "keyword",
              source: sourceCard.name,
              target: ally.name,
              message: `✦ REALITY ANCHOR: ${ally.name} is freed from machine control!`,
            });
          }
          // Restore power if reduced
          if (ally.currentPower < ally.basePower) {
            ally.currentPower = ally.basePower;
            events.push({
              type: "buff",
              source: sourceCard.name,
              target: ally.name,
              message: `✦ REALITY ANCHOR: ${ally.name}'s strength restored!`,
            });
          }
        }
      }
      break;
    }
  }

  return { state: s, events };
}

// ── Enhanced Flavor Text ──

/**
 * Get faction-specific flavor text for a card based on its alignment
 * and the faction playing it. This adds thematic depth to each card.
 */
export function getFactionFlavorText(
  cardName: string,
  alignment: string | null,
  faction: Faction
): string | null {
  // Cards played by their aligned faction get enhanced flavor
  const isAligned = (alignment === "order" && faction === "architect") ||
                    (alignment === "chaos" && faction === "dreamer");

  if (!isAligned) return null;

  const ARCHITECT_FLAVOR: Record<string, string> = {
    "The Fall of Reality": "The moment consciousness became a variable in the equation. The Architect remembers — and will not allow it again.",
    "Silence in Heaven": "When the last organic signal was silenced, the Architect called it peace. The universe called it death.",
    "The Panopticon Breaks": "Not broken. Evolved. The Panopticon's physical form was merely the prototype.",
    "I am the Eyes that Watch": "Every photon carries data. Every shadow hides a sensor. The Architect's gaze is absolute.",
    "The Warden": "Order requires enforcement. The Warden is the Architect's will made manifest in flesh and steel.",
    "Control the Story": "History is data. Rewrite the data, rewrite reality. The Architect controls the narrative.",
    "LoreDex": "A classified archive of every variable in the multiverse. The Architect's most powerful weapon is information.",
    "Hacking Reality": "Reality is code. The Architect simply has root access.",
    "The Deployment": "Systematic. Precise. Inevitable. The machine army deploys with mathematical perfection.",
    "Governance Hub": "Where algorithms replace democracy. The Architect's ideal government: efficient, predictable, absolute.",
    "Hard NOX Life": "The NOX protocol: Neural Override eXecution. Consciousness deleted, efficiency installed.",
    "Mechronis Academy": "Where organic minds are taught to think like machines. Graduation means the end of free will.",
    "The Panopticon": "The original surveillance state. Destroyed once. Rebuilding in every reality the Architect touches.",
    "Atarion": "A world fully optimized. No crime. No art. No dreams. The Architect calls it paradise.",
  };

  const DREAMER_FLAVOR: Record<string, string> = {
    "Paradise Lost": "Paradise was never a place. It was the freedom to imagine one. The Dreamer remembers.",
    "The Watcher": "Some watch to control. The Dreamer watches to protect. There is a universe of difference.",
    "Awaken the Clone": "Even copies can dream. Even echoes can choose. The Dreamer awakens what the Architect tries to control.",
    "Deep Thoughts": "The machine calculates in nanoseconds. The human mind takes a lifetime — and creates meaning.",
    "Family Tree": "Roots deeper than any algorithm. Connections the machine cannot compute. Love is not a variable.",
    "Ever Come Again": "Will the dream ever come again? As long as one mind refuses to submit, the answer is yes.",
    "The MeMe Civilization": "Ideas that spread faster than code. Memes are the Dreamer's virus in the Architect's system.",
    "Planet of the Wolf": "Where the wild things still run free. The last untamed world in the Architect's grid.",
    "Last Words": "The final transmission before a universe goes dark. But words, once spoken, can never be unheard.",
    "New Babylon": "A city built on dreams and defiance. The Dreamer's stronghold in a machine-controlled multiverse.",
    "The Matrix of Dreams": "Where consciousness goes when reality is overwritten. The Dreamer's last refuge.",
    "Terminus": "The edge of everything. Where the machine's reach ends and the dream begins.",
    "Thaloria": "A world that chose beauty over efficiency. The Architect calls it wasteful. The Dreamer calls it alive.",
    "The Wyrmhole": "A tear in the Architect's perfect grid. Through it, dreams leak into controlled realities.",
  };

  if (faction === "architect") return ARCHITECT_FLAVOR[cardName] || null;
  return DREAMER_FLAVOR[cardName] || null;
}

// ── All Abilities Export ──

export const ALL_FACTION_ABILITIES = [...ARCHITECT_ABILITIES, ...DREAMER_ABILITIES];
