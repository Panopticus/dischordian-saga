/* ═══════════════════════════════════════════════════════
   BOSS ENCOUNTERS - Loredex-based bosses tied to Ark rooms
   Each boss uses lore-accurate abilities, dialog, and card decks.
   ═══════════════════════════════════════════════════════ */
import type { StarterCard } from "@/components/StarterDeckViewer";

export interface BossPassiveAbility {
  name: string;
  description: string;
  triggerEveryNTurns: number;
}

export interface BossEncounter {
  id: string;
  name: string;
  entityId: string;
  image: string;
  description: string;
  taunt: string;
  defeatLine: string;
  victoryLine: string;
  roomId: string;
  difficulty: "easy" | "normal" | "hard" | "legendary";
  hp: number;
  deck: Omit<StarterCard, "id">[];
  passiveAbility: BossPassiveAbility;
  rewards: {
    xp: number;
    dreamTokens: number;
    cardReward: Omit<StarterCard, "id">;
  };
}

export const BOSS_ENCOUNTERS: BossEncounter[] = [
  {
    id: "boss-watcher",
    name: "The Watcher",
    entityId: "entity_4",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/the_watcher_portrait-YSS689tnGNySPvPUAfgEZr.webp",
    description: "The Watcher observes all from the shadows of the Medical Bay monitoring systems.",
    taunt: "I have watched you since you awoke. Every stumble. Every doubt. You cannot hide from what sees all.",
    defeatLine: "You closed my eyes. But I have already seen how this ends.",
    victoryLine: "You looked away. That is all it takes.",
    roomId: "medical-bay",
    difficulty: "easy",
    hp: 20,
    passiveAbility: { name: "All-Seeing Eye", description: "Reveals a random card from your hand each turn.", triggerEveryNTurns: 2 },
    deck: [
      { name: "Surveillance Drone", type: "unit", rarity: "common", attack: 1, defense: 3, cost: 1, ability: "Reveal: Shows a random card from opponent's hand.", lore: "It watches. It records. It never forgets.", imageUrl: "" },
      { name: "Surveillance Drone", type: "unit", rarity: "common", attack: 1, defense: 3, cost: 1, ability: "Reveal.", lore: "It watches.", imageUrl: "" },
      { name: "Eye Swarm", type: "unit", rarity: "common", attack: 2, defense: 2, cost: 1, ability: "Scout: Look at top card of opponent's deck.", lore: "A thousand eyes.", imageUrl: "" },
      { name: "Eye Swarm", type: "unit", rarity: "common", attack: 2, defense: 2, cost: 1, ability: "Scout.", lore: "Watching.", imageUrl: "" },
      { name: "Panoptic Scan", type: "spell", rarity: "common", attack: 2, defense: 0, cost: 1, ability: "Deal 2 damage.", lore: "Nothing is hidden.", imageUrl: "" },
      { name: "Blinding Flash", type: "spell", rarity: "common", attack: 3, defense: 0, cost: 2, ability: "Deal 3 damage to a unit.", lore: "Too much light blinds.", imageUrl: "" },
      { name: "Watchful Guardian", type: "unit", rarity: "uncommon", attack: 3, defense: 4, cost: 2, ability: "Taunt. Gains +1 defense when opponent plays a card.", lore: "Vigilant.", imageUrl: "" },
      { name: "Omniscient Lens", type: "artifact", rarity: "rare", attack: 1, defense: 1, cost: 2, ability: "All friendly units gain +1/+1.", lore: "Through this lens, all truths are visible.", imageUrl: "" },
      { name: "Third Eye Protocol", type: "spell", rarity: "rare", attack: 5, defense: 0, cost: 3, ability: "Deal 5 damage. Draw a card.", lore: "The third eye opens.", imageUrl: "" },
      { name: "The Last Broadcast", type: "unit", rarity: "legendary", attack: 5, defense: 6, cost: 4, ability: "When deployed, reveal all cards in opponent's hand.", lore: "The final transmission.", imageUrl: "" },
    ],
    rewards: { xp: 100, dreamTokens: 50, cardReward: { name: "Eye of the Watcher", type: "artifact", rarity: "legendary", attack: 2, defense: 2, cost: 3, ability: "All units gain +2/+2. Reveal opponent's hand.", lore: "Taken from the Watcher's core.", imageUrl: "" } },
  },
  {
    id: "boss-game-master",
    name: "The Game Master",
    entityId: "entity_17",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/017_the_game_master_e5ceb4cc.png",
    description: "The Game Master controls the Bridge holographic systems, turning reality into a game board.",
    taunt: "Welcome to my game. The rules are simple: I always win.",
    defeatLine: "Impressive. You broke my rules. No one has ever done that before.",
    victoryLine: "Checkmate. The game was rigged from the start.",
    roomId: "bridge",
    difficulty: "normal",
    hp: 25,
    passiveAbility: { name: "Rule Changer", description: "Every 3 turns, a random card has its attack and defense swapped.", triggerEveryNTurns: 3 },
    deck: [
      { name: "Pawn Unit", type: "unit", rarity: "common", attack: 2, defense: 2, cost: 1, ability: "Promote: Gains +2/+2 if it survives 3 turns.", lore: "Every pawn dreams of becoming a queen.", imageUrl: "" },
      { name: "Pawn Unit", type: "unit", rarity: "common", attack: 2, defense: 2, cost: 1, ability: "Promote.", lore: "Pawn.", imageUrl: "" },
      { name: "Trick Card", type: "spell", rarity: "common", attack: 0, defense: 0, cost: 1, ability: "Swap attack and defense of target unit.", lore: "Surprise.", imageUrl: "" },
      { name: "Loaded Dice", type: "spell", rarity: "common", attack: 3, defense: 0, cost: 1, ability: "Deal 1-5 random damage.", lore: "Chance favors the prepared.", imageUrl: "" },
      { name: "Knight's Gambit", type: "unit", rarity: "uncommon", attack: 4, defense: 3, cost: 2, ability: "Can attack any unit regardless of taunt.", lore: "Unpredictable.", imageUrl: "" },
      { name: "Rigged Outcome", type: "spell", rarity: "uncommon", attack: 4, defense: 0, cost: 2, ability: "Deal 4 damage.", lore: "The Game Master profits.", imageUrl: "" },
      { name: "Queen's Guard", type: "unit", rarity: "rare", attack: 5, defense: 5, cost: 3, ability: "Taunt. Adjacent units gain +1 attack.", lore: "Protector.", imageUrl: "" },
      { name: "Board Reset", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 3, ability: "Return all units to their owner's hands.", lore: "Start over.", imageUrl: "" },
      { name: "Grandmaster's Decree", type: "spell", rarity: "rare", attack: 6, defense: 0, cost: 4, ability: "Destroy target unit. Its owner draws a card.", lore: "Giveth and taketh.", imageUrl: "" },
      { name: "The Final Move", type: "unit", rarity: "legendary", attack: 7, defense: 7, cost: 5, ability: "When deployed, all enemy units lose 2 attack.", lore: "Checkmate.", imageUrl: "" },
    ],
    rewards: { xp: 200, dreamTokens: 100, cardReward: { name: "Game Master's Crown", type: "artifact", rarity: "legendary", attack: 0, defense: 3, cost: 3, ability: "All units gain +0/+3. Swap a random enemy unit's stats each turn.", lore: "The crown of the one who controls the game.", imageUrl: "" } },
  },
  {
    id: "boss-meme",
    name: "The Meme",
    entityId: "entity_5",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/005_the_meme_3b3bda74.png",
    description: "The Meme lurks in the Archives, a shape-shifting entity that copies and corrupts information.",
    taunt: "Do you know what a meme truly is? Not a joke. It is an idea that infects minds. And I am the most contagious idea in existence.",
    defeatLine: "You can destroy this form, but you cannot kill an idea. I am already in your head.",
    victoryLine: "See? You are already becoming me. That doubt in your eyes? That is me.",
    roomId: "archives",
    difficulty: "normal",
    hp: 22,
    passiveAbility: { name: "Shapeshifter", description: "Copies the stats of a random unit on your field every 2 turns.", triggerEveryNTurns: 2 },
    deck: [
      { name: "Mirror Image", type: "unit", rarity: "common", attack: 1, defense: 1, cost: 1, ability: "Deploy: Copies the stats of a random enemy unit.", lore: "It looks like you.", imageUrl: "" },
      { name: "Mirror Image", type: "unit", rarity: "common", attack: 1, defense: 1, cost: 1, ability: "Deploy: Copies stats.", lore: "Copy.", imageUrl: "" },
      { name: "Viral Thought", type: "spell", rarity: "common", attack: 2, defense: 0, cost: 1, ability: "Deal 2 damage.", lore: "One thought becomes a pandemic.", imageUrl: "" },
      { name: "Identity Crisis", type: "spell", rarity: "common", attack: 0, defense: 0, cost: 1, ability: "Swap the attack values of two random units.", lore: "Who are you?", imageUrl: "" },
      { name: "Doppelganger", type: "unit", rarity: "uncommon", attack: 3, defense: 3, cost: 2, ability: "Gains the ability of the last unit destroyed.", lore: "It wears the faces of the dead.", imageUrl: "" },
      { name: "Memetic Cascade", type: "spell", rarity: "uncommon", attack: 2, defense: 0, cost: 2, ability: "Deal 2 damage to all units.", lore: "The idea spreads.", imageUrl: "" },
      { name: "False Prophet", type: "unit", rarity: "rare", attack: 4, defense: 5, cost: 3, ability: "Taunt. Enemy spells cost 1 more.", lore: "It preaches lies that sound like truth.", imageUrl: "" },
      { name: "Ego Death", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 3, ability: "Destroy target unit. Summon a 2/2 copy for the Meme.", lore: "The self dissolves.", imageUrl: "" },
      { name: "White Oracle Mask", type: "artifact", rarity: "rare", attack: 2, defense: 0, cost: 2, ability: "All friendly units gain +2 attack.", lore: "The Meme's favorite disguise.", imageUrl: "" },
      { name: "The Living Meme", type: "unit", rarity: "legendary", attack: 6, defense: 6, cost: 5, ability: "Deploy: Become a copy of the strongest unit on the field.", lore: "I am every idea that ever existed.", imageUrl: "" },
    ],
    rewards: { xp: 200, dreamTokens: 100, cardReward: { name: "Mask of the Meme", type: "artifact", rarity: "legendary", attack: 3, defense: 0, cost: 2, ability: "All units gain +3 attack. Copy enemy abilities.", lore: "Wear the mask, become the Meme.", imageUrl: "" } },
  },
  {
    id: "boss-collector",
    name: "The Collector",
    entityId: "entity_6",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/the_collector_portrait-LmPdTXHDjBTaVNhZoS6Li3.webp",
    description: "The Collector intercepts all communications, hoarding secrets and artifacts.",
    taunt: "Everything has value. Everything can be collected. And you are the rarest specimen I have encountered.",
    defeatLine: "You have destroyed my collection but I have already catalogued you.",
    victoryLine: "Another specimen for my collection.",
    roomId: "comms-array",
    difficulty: "hard",
    hp: 30,
    passiveAbility: { name: "Hoarder", description: "Steals a random card from your graveyard every 3 turns.", triggerEveryNTurns: 3 },
    deck: [
      { name: "Artifact Hunter", type: "unit", rarity: "common", attack: 3, defense: 2, cost: 1, ability: "On kill: Draw a card.", lore: "It seeks. It finds. It takes.", imageUrl: "" },
      { name: "Artifact Hunter", type: "unit", rarity: "common", attack: 3, defense: 2, cost: 1, ability: "On kill: Draw.", lore: "Seeker.", imageUrl: "" },
      { name: "Acquisition Beam", type: "spell", rarity: "common", attack: 3, defense: 0, cost: 1, ability: "Deal 3 damage.", lore: "What is yours is mine.", imageUrl: "" },
      { name: "Preservation Field", type: "spell", rarity: "common", attack: 0, defense: 4, cost: 1, ability: "Shield a unit for 4.", lore: "Preserved in stasis.", imageUrl: "" },
      { name: "Trophy Display", type: "unit", rarity: "uncommon", attack: 2, defense: 5, cost: 2, ability: "Gains +1/+1 for each unit in any graveyard.", lore: "Each trophy tells a story.", imageUrl: "" },
      { name: "Confiscate", type: "spell", rarity: "uncommon", attack: 0, defense: 0, cost: 2, ability: "Take control of target unit with 2 or less attack.", lore: "The Collector always gets what it wants.", imageUrl: "" },
      { name: "Vault Guardian", type: "unit", rarity: "rare", attack: 4, defense: 6, cost: 3, ability: "Taunt. Cannot be targeted by spells.", lore: "It guards the prized possessions.", imageUrl: "" },
      { name: "Grand Acquisition", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 4, ability: "Take control of target unit permanently.", lore: "The ultimate act of collection.", imageUrl: "" },
      { name: "Relic Overload", type: "spell", rarity: "rare", attack: 7, defense: 0, cost: 4, ability: "Deal 7 damage. Discard 2 cards.", lore: "Too many relics.", imageUrl: "" },
      { name: "The Mask", type: "unit", rarity: "legendary", attack: 7, defense: 8, cost: 6, ability: "Deploy: Steal the strongest unit from opponent's field.", lore: "Behind the Mask, the Collector's true face.", imageUrl: "" },
    ],
    rewards: { xp: 350, dreamTokens: 200, cardReward: { name: "Collector's Vault Key", type: "artifact", rarity: "legendary", attack: 1, defense: 3, cost: 3, ability: "All units gain +1/+3. Draw an extra card each turn.", lore: "The key to the Collector's vault.", imageUrl: "" } },
  },
  {
    id: "boss-necromancer",
    name: "The Necromancer",
    entityId: "entity_20",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/018_the_necromancer_d6de1da3.png",
    description: "The Necromancer haunts the Observation Deck, raising the dead crew as an undead army.",
    taunt: "Death is not an ending. It is a promotion. Every soul I claim becomes part of my eternal army.",
    defeatLine: "I have died a thousand times and returned a thousand more. I will be back.",
    victoryLine: "Rise. Rise and serve. Welcome to eternity.",
    roomId: "observation-deck",
    difficulty: "hard",
    hp: 30,
    passiveAbility: { name: "Undying Legion", description: "Resurrects a random unit from the graveyard with 1 HP every 3 turns.", triggerEveryNTurns: 3 },
    deck: [
      { name: "Risen Crewman", type: "unit", rarity: "common", attack: 2, defense: 1, cost: 1, ability: "Undying: Returns to hand when destroyed (once).", lore: "They were crew once.", imageUrl: "" },
      { name: "Risen Crewman", type: "unit", rarity: "common", attack: 2, defense: 1, cost: 1, ability: "Undying.", lore: "Risen.", imageUrl: "" },
      { name: "Soul Drain", type: "spell", rarity: "common", attack: 2, defense: 0, cost: 1, ability: "Deal 2 damage. Heal the Necromancer for 2.", lore: "Your life force feeds the darkness.", imageUrl: "" },
      { name: "Bone Wall", type: "unit", rarity: "common", attack: 0, defense: 5, cost: 1, ability: "Taunt. Cannot attack.", lore: "A wall of bones.", imageUrl: "" },
      { name: "Death Knight", type: "unit", rarity: "uncommon", attack: 4, defense: 3, cost: 2, ability: "Gains +1 attack for each unit in any graveyard.", lore: "Once a noble warrior.", imageUrl: "" },
      { name: "Corpse Explosion", type: "spell", rarity: "uncommon", attack: 0, defense: 0, cost: 2, ability: "Destroy a friendly unit. Deal its attack as damage to all enemies.", lore: "In death, they serve.", imageUrl: "" },
      { name: "Lich Commander", type: "unit", rarity: "rare", attack: 5, defense: 5, cost: 3, ability: "When a friendly unit dies, gain +1/+1.", lore: "It grows stronger with every death.", imageUrl: "" },
      { name: "Mass Resurrection", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 4, ability: "Resurrect all units from your graveyard with 1 HP.", lore: "The dead do not rest.", imageUrl: "" },
      { name: "Plague of Ages", type: "spell", rarity: "rare", attack: 3, defense: 0, cost: 3, ability: "Deal 3 damage to all enemy units.", lore: "A plague from the Age of Revelation.", imageUrl: "" },
      { name: "The Necromancer's Phylactery", type: "unit", rarity: "legendary", attack: 8, defense: 8, cost: 6, ability: "Cannot be destroyed while other friendly units exist.", lore: "The vessel of the Necromancer's soul.", imageUrl: "" },
    ],
    rewards: { xp: 350, dreamTokens: 200, cardReward: { name: "Necromancer's Grimoire", type: "spell", rarity: "legendary", attack: 0, defense: 0, cost: 4, ability: "Resurrect all units from your graveyard with full HP.", lore: "The book of the dead.", imageUrl: "" } },
  },
  {
    id: "boss-warlord",
    name: "The Warlord",
    entityId: "entity_10",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/008_the_warlord_bd4d90ba.png",
    description: "The Warlord has fortified Engineering into a war zone.",
    taunt: "War is the only truth. Peace is the lie weak minds tell themselves.",
    defeatLine: "A worthy opponent. But this war is far from over.",
    victoryLine: "Kneel. Your strength now belongs to my army.",
    roomId: "engineering",
    difficulty: "hard",
    hp: 35,
    passiveAbility: { name: "War Machine", description: "All friendly units gain +1 attack every 2nd turn.", triggerEveryNTurns: 2 },
    deck: [
      { name: "War Drone", type: "unit", rarity: "common", attack: 3, defense: 2, cost: 1, ability: "Charge: Can attack the turn it is deployed.", lore: "Built for destruction.", imageUrl: "" },
      { name: "War Drone", type: "unit", rarity: "common", attack: 3, defense: 2, cost: 1, ability: "Charge.", lore: "Destruction.", imageUrl: "" },
      { name: "Bombardment", type: "spell", rarity: "common", attack: 4, defense: 0, cost: 2, ability: "Deal 4 damage to a random enemy.", lore: "No mercy.", imageUrl: "" },
      { name: "Shield Wall", type: "spell", rarity: "common", attack: 0, defense: 3, cost: 1, ability: "Give a unit +3 defense.", lore: "Legendary defenses.", imageUrl: "" },
      { name: "Battle Commander", type: "unit", rarity: "uncommon", attack: 4, defense: 4, cost: 2, ability: "All friendly units gain +1 attack.", lore: "Iron discipline.", imageUrl: "" },
      { name: "Siege Engine", type: "unit", rarity: "uncommon", attack: 5, defense: 3, cost: 3, ability: "Deals double damage to units with Taunt.", lore: "No wall can withstand.", imageUrl: "" },
      { name: "Blitz Protocol", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 2, ability: "All friendly units can attack again this turn.", lore: "Strike twice.", imageUrl: "" },
      { name: "Iron Legion", type: "unit", rarity: "rare", attack: 5, defense: 6, cost: 4, ability: "Taunt. Gains +2 attack when damaged.", lore: "The Iron Legion does not break.", imageUrl: "" },
      { name: "Total War", type: "spell", rarity: "rare", attack: 3, defense: 0, cost: 3, ability: "Deal 3 damage to all units and both players.", lore: "Everyone suffers.", imageUrl: "" },
      { name: "The Warlord's Fist", type: "unit", rarity: "legendary", attack: 9, defense: 7, cost: 6, ability: "Charge. All friendly units gain +2 attack when deployed.", lore: "It has crushed empires.", imageUrl: "" },
    ],
    rewards: { xp: 350, dreamTokens: 200, cardReward: { name: "Warlord's Banner", type: "artifact", rarity: "legendary", attack: 3, defense: 1, cost: 3, ability: "All units gain +3/+1. Charge.", lore: "Under this banner, armies march to victory.", imageUrl: "" } },
  },
  {
    id: "boss-source",
    name: "The Source",
    entityId: "entity_55",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/036_the_source_512e9def.png",
    description: "The Source pulses with raw creative energy in the Cargo Hold.",
    taunt: "I am the beginning and the end. You challenge the Source of all things?",
    defeatLine: "You have dimmed my light but the Source cannot be extinguished.",
    victoryLine: "Return to the void from which you came.",
    roomId: "cargo-hold",
    difficulty: "legendary",
    hp: 40,
    passiveAbility: { name: "Reality Warp", description: "Randomly transforms a card on the field every 2 turns.", triggerEveryNTurns: 2 },
    deck: [
      { name: "Energy Fragment", type: "unit", rarity: "common", attack: 2, defense: 3, cost: 1, ability: "Deathrattle: Restore 2 energy.", lore: "Pure creative energy.", imageUrl: "" },
      { name: "Energy Fragment", type: "unit", rarity: "common", attack: 2, defense: 3, cost: 1, ability: "Deathrattle.", lore: "Energy.", imageUrl: "" },
      { name: "Reality Fracture", type: "spell", rarity: "common", attack: 3, defense: 0, cost: 1, ability: "Deal 3 damage. Transform target into a 1/1.", lore: "Reality cracks.", imageUrl: "" },
      { name: "Terminus Pulse", type: "spell", rarity: "common", attack: 2, defense: 0, cost: 1, ability: "Deal 2 damage to all enemies.", lore: "The Terminus Swarm.", imageUrl: "" },
      { name: "Thought Made Flesh", type: "unit", rarity: "uncommon", attack: 4, defense: 4, cost: 2, ability: "Gains +1/+1 for each spell cast this game.", lore: "An idea given physical form.", imageUrl: "" },
      { name: "Entropy Wave", type: "spell", rarity: "uncommon", attack: 5, defense: 0, cost: 3, ability: "Deal 5 damage. Discard a random card from opponent's hand.", lore: "Order dissolves.", imageUrl: "" },
      { name: "Terminus Herald", type: "unit", rarity: "rare", attack: 6, defense: 5, cost: 4, ability: "When deployed, deal 3 damage to all enemy units.", lore: "Where it goes, annihilation follows.", imageUrl: "" },
      { name: "Genesis Protocol", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 3, ability: "Summon two 3/3 Energy Constructs.", lore: "The Source creates from nothing.", imageUrl: "" },
      { name: "Cosmic Unraveling", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 5, ability: "Destroy all enemy units. Deal 2 damage per unit.", lore: "Reality comes undone.", imageUrl: "" },
      { name: "The Source Incarnate", type: "unit", rarity: "legendary", attack: 10, defense: 10, cost: 8, ability: "Deploy: Deal 5 damage to all enemies. Gains +1/+1 each turn.", lore: "The origin of all power.", imageUrl: "" },
    ],
    rewards: { xp: 500, dreamTokens: 350, cardReward: { name: "Fragment of the Source", type: "unit", rarity: "legendary", attack: 8, defense: 8, cost: 6, ability: "Deploy: Deal 3 damage to all enemies. Gains +1/+1 each turn.", lore: "A fragment of infinite power.", imageUrl: "" } },
  },
  {
    id: "boss-architect",
    name: "The Architect",
    entityId: "entity_2",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/002_the_architect_b57a8e73.png",
    description: "The Architect awaits in the Captain's Quarters, the designer of the Inception Arks.",
    taunt: "I designed this Ark. I designed this moment. I designed you.",
    defeatLine: "Impossible. This was not in the design. You introduced a variable I did not account for.",
    victoryLine: "As designed. You were never meant to win.",
    roomId: "captains-quarters",
    difficulty: "legendary",
    hp: 45,
    passiveAbility: { name: "Grand Design", description: "Gains +1 max energy permanently every 3 turns.", triggerEveryNTurns: 3 },
    deck: [
      { name: "Blueprint Construct", type: "unit", rarity: "common", attack: 3, defense: 3, cost: 1, ability: "Deploy: Gain 1 energy.", lore: "Perfect specifications.", imageUrl: "" },
      { name: "Blueprint Construct", type: "unit", rarity: "common", attack: 3, defense: 3, cost: 1, ability: "Deploy: Gain 1 energy.", lore: "Blueprint.", imageUrl: "" },
      { name: "Structural Collapse", type: "spell", rarity: "common", attack: 4, defense: 0, cost: 2, ability: "Deal 4 damage.", lore: "What the Architect builds, the Architect can destroy.", imageUrl: "" },
      { name: "Perfect Defense", type: "spell", rarity: "common", attack: 0, defense: 5, cost: 2, ability: "Shield a unit for 5. It gains Taunt.", lore: "Mathematically perfect.", imageUrl: "" },
      { name: "Inception Engine", type: "unit", rarity: "uncommon", attack: 4, defense: 5, cost: 3, ability: "All friendly units gain +1 defense.", lore: "The engine that powers the Inception Arks.", imageUrl: "" },
      { name: "Redesign", type: "spell", rarity: "uncommon", attack: 0, defense: 0, cost: 2, ability: "Transform target unit into a 4/4 with no abilities.", lore: "Redesigned.", imageUrl: "" },
      { name: "Ark Guardian", type: "unit", rarity: "rare", attack: 6, defense: 7, cost: 4, ability: "Taunt. Reduces all damage taken by 1.", lore: "Ultimate defender.", imageUrl: "" },
      { name: "Paradigm Shift", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 4, ability: "Swap all units' attack and defense. Deal 2 damage to all.", lore: "The rules change.", imageUrl: "" },
      { name: "Master Plan", type: "spell", rarity: "rare", attack: 0, defense: 0, cost: 3, ability: "Draw 3 cards. Gain 3 energy.", lore: "Everything is going according to plan.", imageUrl: "" },
      { name: "The Grand Design", type: "unit", rarity: "legendary", attack: 10, defense: 12, cost: 8, ability: "Deploy: Destroy all enemy units with less than 4 attack. Gains +2/+2 each turn.", lore: "The blueprint for a new reality.", imageUrl: "" },
    ],
    rewards: { xp: 500, dreamTokens: 350, cardReward: { name: "Architect's Blueprint", type: "artifact", rarity: "legendary", attack: 2, defense: 4, cost: 4, ability: "All units gain +2/+4. Gain 1 extra energy each turn.", lore: "The blueprint for the Inception Arks.", imageUrl: "" } },
  },
];

export function getBossForRoom(roomId: string): BossEncounter | undefined {
  return BOSS_ENCOUNTERS.find(b => b.roomId === roomId);
}

export function getBossById(bossId: string): BossEncounter | undefined {
  return BOSS_ENCOUNTERS.find(b => b.id === bossId);
}

export function getBossesByDifficulty(difficulty: BossEncounter["difficulty"]): BossEncounter[] {
  return BOSS_ENCOUNTERS.filter(b => b.difficulty === difficulty);
}
