/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT BOARD — The Display Case of Every Decision
   A military display case crossed with a trophy room.
   Every pin, medal, and marker = a moment the Ark witnessed.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type PinType =
  | "bronze_pin" | "silver_pin" | "gold_pin" | "crystallan_pin"
  | "void_medal" | "architects_seal" | "decision_marker"
  | "corruption_mark" | "purity_star" | "dischordian_token";

export type AchievementSection =
  | "first_steps" | "explorer" | "scholar" | "warrior"
  | "diplomat" | "keeper" | "merchant" | "architects_shadow"
  | "corruption_chronicle" | "the_witness" | "the_collector"
  | "classified" | "session_memories";

export type DisplayCaseTheme =
  | "ark_hull" | "void_chamber" | "dreamers_garden"
  | "hierarchy_throne" | "insurgency_wall" | "crystallan_lattice";

export interface DisplayCaseThemeDef {
  id: DisplayCaseTheme;
  name: string;
  description: string;
  background: string;
  accent: string;
  glow: string;
  unlockCondition: string;
  unlocked: boolean;
}

export interface PinDesign {
  type: PinType;
  name: string;
  description: string;
  glowColor: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  section: AchievementSection;
  pin: PinType;
  icon: string;
  trigger: string;
  unlockText: string;
  reward?: string;
  alternatives?: string[];
  secret: boolean;
  xpReward: number;
  order: number;
}

export interface SectionMeta {
  name: string;
  shortName?: string;
  description: string;
}

/* ─── PIN DESIGNS ─── */

export const PIN_DESIGNS: Record<PinType, PinDesign> = {
  bronze_pin: { type: "bronze_pin", name: "Bronze Pin", description: "A tarnished copper pin. The Ark awards these for first steps.", glowColor: "#cd7f32", icon: "Circle", rarity: "common" },
  silver_pin: { type: "silver_pin", name: "Silver Pin", description: "Polished steel. Given when the Ark starts paying attention.", glowColor: "#c0c0c0", icon: "Hexagon", rarity: "uncommon" },
  gold_pin: { type: "gold_pin", name: "Gold Pin", description: "Archon-grade alloy. The universe notices you now.", glowColor: "#ffd700", icon: "Star", rarity: "rare" },
  crystallan_pin: { type: "crystallan_pin", name: "Crystallan Pin", description: "Made from extinct Crystallan lattice. It hums when others are near.", glowColor: "#00ffc8", icon: "Diamond", rarity: "epic" },
  void_medal: { type: "void_medal", name: "Void Medal", description: "Forged in dark energy. It weighs nothing and everything.", glowColor: "#8b5cf6", icon: "Shield", rarity: "legendary" },
  architects_seal: { type: "architects_seal", name: "Architect's Seal", description: "The Architect's personal mark. He sees you. He always did.", glowColor: "#ff3232", icon: "Eye", rarity: "mythic" },
  decision_marker: { type: "decision_marker", name: "Decision Marker", description: "Not a reward. A record. The Ark remembers what you chose.", glowColor: "#3b82f6", icon: "GitBranch", rarity: "uncommon" },
  corruption_mark: { type: "corruption_mark", name: "Corruption Mark", description: "The Hierarchy branded this into your record. It burns cold.", glowColor: "#dc2626", icon: "Skull", rarity: "rare" },
  purity_star: { type: "purity_star", name: "Purity Star", description: "The Dreamer's light, condensed. It never dims.", glowColor: "#facc15", icon: "Sun", rarity: "rare" },
  dischordian_token: { type: "dischordian_token", name: "Dischordian Token", description: "Neither light nor dark. The paradox made solid.", glowColor: "#a855f7", icon: "Infinity", rarity: "epic" },
};

/* ─── DISPLAY CASE THEMES ─── */

export const DISPLAY_CASE_THEMES: DisplayCaseThemeDef[] = [
  { id: "ark_hull", name: "Ark Hull", description: "Cold metal, dim blue light, rivets and rust", background: "bg-gradient-to-b from-[#0a0c12] to-[#080a0f]", accent: "border-cyan-500/20", glow: "shadow-[0_0_20px_rgba(34,211,238,0.05)]", unlockCondition: "Default", unlocked: true },
  { id: "void_chamber", name: "Void Chamber", description: "Dark energy backdrop — pins float in nothingness", background: "bg-gradient-to-b from-[#05050f] to-[#0a0a18]", accent: "border-violet-500/30", glow: "shadow-[0_0_30px_rgba(139,92,246,0.1)]", unlockCondition: "Earn 10 achievements", unlocked: false },
  { id: "dreamers_garden", name: "Dreamer's Garden", description: "Ethereal golden light, organic shapes, hope", background: "bg-gradient-to-b from-[#0f0d05] to-[#0a0905]", accent: "border-amber-500/30", glow: "shadow-[0_0_30px_rgba(245,158,11,0.1)]", unlockCondition: "Reach Purity Tier 3", unlocked: false },
  { id: "hierarchy_throne", name: "Hierarchy's Throne", description: "Crimson corporate horror — the board room of the damned", background: "bg-gradient-to-b from-[#120505] to-[#0a0505]", accent: "border-red-500/30", glow: "shadow-[0_0_30px_rgba(220,38,38,0.1)]", unlockCondition: "Reach Corruption Tier 3", unlocked: false },
  { id: "insurgency_wall", name: "Insurgency Wall", description: "Resistance graffiti, punk aesthetic, defiance", background: "bg-gradient-to-b from-[#0a0f0a] to-[#050a05]", accent: "border-green-500/30", glow: "shadow-[0_0_30px_rgba(34,197,94,0.1)]", unlockCondition: "Complete 30 achievements", unlocked: false },
  { id: "crystallan_lattice", name: "Crystallan Lattice", description: "Prismatic crystal refracting light across every pin", background: "bg-gradient-to-b from-[#050f12] to-[#050a0f]", accent: "border-teal-400/40", glow: "shadow-[0_0_40px_rgba(20,184,166,0.15)]", unlockCondition: "Discover all 5 extinct races", unlocked: false },
];

/* ─── SECTION META ─── */

export const SECTION_META: Record<AchievementSection, SectionMeta> = {
  first_steps: { name: "First Steps", shortName: "Steps", description: "The beginning of everything" },
  explorer: { name: "The Explorer", shortName: "Explore", description: "Every room tells a story" },
  scholar: { name: "The Scholar", shortName: "Scholar", description: "Knowledge is the oldest weapon" },
  warrior: { name: "The Warrior", shortName: "Warrior", description: "Victory leaves marks" },
  diplomat: { name: "The Diplomat", shortName: "Diplomat", description: "Trust is earned in whispers" },
  keeper: { name: "The Keeper", shortName: "Keeper", description: "The bonds that hold" },
  merchant: { name: "The Merchant", shortName: "Merchant", description: "Every token has a story" },
  architects_shadow: { name: "The Architect's Shadow", shortName: "Shadow", description: "Every choice is witnessed" },
  corruption_chronicle: { name: "Corruption Chronicle", shortName: "Corrupt", description: "The path between light and dark" },
  the_witness: { name: "The Witness", shortName: "Witness", description: "To see is to be changed" },
  the_collector: { name: "The Collector", shortName: "Collect", description: "Completionism as devotion" },
  classified: { name: "Classified", shortName: "Secret", description: "Secrets the Ark keeps" },
  session_memories: { name: "Session Memories", shortName: "Memory", description: "The record of who you became" },
};

/* ─── ACHIEVEMENTS ─── */

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // ═══ FIRST STEPS (10) ═══
  { id: "ach_first_awakening", title: "First Awakening", description: "Log in for the first time. The Ark has been waiting.", section: "first_steps", pin: "bronze_pin", icon: "Sunrise", trigger: "Log in", unlockText: "The Ark's hull groaned as you opened your eyes. It has been counting the seconds since.", xpReward: 25, order: 1, secret: false },
  { id: "ach_first_step", title: "First Step", description: "Enter any room aboard the Ark.", section: "first_steps", pin: "bronze_pin", icon: "Footprints", trigger: "Enter any room", unlockText: "Your footsteps echoed through corridors that haven't heard organic movement in millennia.", xpReward: 25, order: 2, secret: false },
  { id: "ach_first_contact", title: "First Contact", description: "Speak to any NPC for the first time.", section: "first_steps", pin: "bronze_pin", icon: "MessageCircle", trigger: "Talk to an NPC", unlockText: "Elara's hologram flickered. Someone was finally listening.", xpReward: 25, order: 3, secret: false },
  { id: "ach_first_blood", title: "First Blood", description: "Win your first combat encounter.", section: "first_steps", pin: "bronze_pin", icon: "Swords", trigger: "Win a fight", unlockText: "Violence aboard the Ark is never without consequence. The walls remember.", xpReward: 50, order: 4, secret: false },
  { id: "ach_first_card", title: "First Card", description: "Add your first card to your collection.", section: "first_steps", pin: "bronze_pin", icon: "Square", trigger: "Collect a card", unlockText: "A piece of the Dischordian universe, captured in your hand.", xpReward: 25, order: 5, secret: false },
  { id: "ach_first_knowledge", title: "First Knowledge", description: "Read your first Loredex entry.", section: "first_steps", pin: "bronze_pin", icon: "BookOpen", trigger: "Read a lore entry", unlockText: "The Antiquarian smiled. Another reader. How rare.", xpReward: 25, order: 6, secret: false },
  { id: "ach_first_bond", title: "First Bond", description: "Bond with your first companion.", section: "first_steps", pin: "silver_pin", icon: "Heart", trigger: "Bond a companion", unlockText: "It looked at you and chose to stay. Not because it had to. Because it wanted to.", xpReward: 50, order: 7, secret: false },
  { id: "ach_first_trade", title: "First Trade", description: "Complete your first trade.", section: "first_steps", pin: "bronze_pin", icon: "ArrowLeftRight", trigger: "Complete a trade", unlockText: "Locke nodded approvingly. Commerce is civilization's heartbeat.", xpReward: 25, order: 8, secret: false },
  { id: "ach_first_vote", title: "First Vote", description: "Cast your first governance vote.", section: "first_steps", pin: "bronze_pin", icon: "Vote", trigger: "Vote in governance", unlockText: "Democracy aboard a stolen ship. The Architect would find that ironic.", xpReward: 25, order: 9, secret: false },
  { id: "ach_first_death", title: "First Death", description: "Die for the first time.", section: "first_steps", pin: "silver_pin", icon: "Skull", trigger: "Die", unlockText: "The Necromancer caught your fall. 'Everyone visits me eventually,' he said. 'Welcome back.'", xpReward: 50, order: 10, secret: false },
];

  // ═══ EXPLORER (13) ═══
  { id: "ach_explore_bridge", title: "Command Authority", description: "Discover the Bridge — the nerve center of Ark 1047.", section: "explorer", pin: "bronze_pin", icon: "Navigation", trigger: "Enter the Bridge", unlockText: "The captain's chair was empty. It has been for 17,000 years. The console still warm.", xpReward: 30, order: 1, secret: false },
  { id: "ach_explore_medical", title: "Do No Harm", description: "Discover the Medical Bay and the Dreamer in cryo.", section: "explorer", pin: "bronze_pin", icon: "Stethoscope", trigger: "Enter Medical Bay", unlockText: "Something breathes in the cryo pod. Not alive, not dead. Dreaming.", xpReward: 30, order: 2, secret: false },
  { id: "ach_explore_archives", title: "The Antiquarian's Domain", description: "Discover the Archives where all knowledge is kept.", section: "explorer", pin: "silver_pin", icon: "Library", trigger: "Enter the Archives", unlockText: "The Antiquarian looked up from a book older than most civilizations. 'Ah. A visitor. How unexpected.'", xpReward: 40, order: 3, secret: false },
  { id: "ach_explore_observation", title: "The View Beyond", description: "Discover the Observation Deck and see the Shimmering Shield.", section: "explorer", pin: "bronze_pin", icon: "Telescope", trigger: "Enter Observation Deck", unlockText: "Beyond the shield, stars burned. Beyond the stars, something watched back.", xpReward: 30, order: 4, secret: false },
  { id: "ach_explore_comms", title: "Signal in the Static", description: "Discover the Comms Array — and the Human's substrate prison.", section: "explorer", pin: "silver_pin", icon: "Radio", trigger: "Enter Comms Array", unlockText: "Static resolved into words: 'Can you hear me? I've been here so long.' The 12th Archon speaks.", xpReward: 50, order: 5, secret: false },
  { id: "ach_explore_engineering", title: "Heart of the Machine", description: "Discover Engineering — the Ark's beating mechanical heart.", section: "explorer", pin: "bronze_pin", icon: "Cog", trigger: "Enter Engineering", unlockText: "Pipes hummed. Engines turned. Something in the walls whispered numbers.", xpReward: 30, order: 6, secret: false },
  { id: "ach_explore_armory", title: "Tools of Violence", description: "Discover the Armory — where Agent Zero's signal originates.", section: "explorer", pin: "bronze_pin", icon: "Sword", trigger: "Enter Armory", unlockText: "Weapons lined the walls. Each one had killed before. None of them were sorry.", xpReward: 30, order: 7, secret: false },
  { id: "ach_explore_cargo", title: "What We Carry", description: "Discover the Cargo Bay — the Ark's belly of secrets.", section: "explorer", pin: "bronze_pin", icon: "Package", trigger: "Enter Cargo Bay", unlockText: "Crates marked with symbols from civilizations that no longer exist. What did Kael steal?", xpReward: 30, order: 8, secret: false },
  { id: "ach_explore_cryo", title: "The Sleeping Archive", description: "Discover the Cryo Bay — the Collector's specimen pods.", section: "explorer", pin: "silver_pin", icon: "Snowflake", trigger: "Enter Cryo Bay", unlockText: "Seven pods glowed. Seven specimens waited. The Collector's legacy, frozen in time.", xpReward: 40, order: 9, secret: false },
  { id: "ach_explore_trade", title: "The Merchant's Quarter", description: "Discover the Trade Hub — Adjudicator Locke's domain.", section: "explorer", pin: "bronze_pin", icon: "Store", trigger: "Enter Trade Hub", unlockText: "Locke's scales balanced. They always do. That's what makes him terrifying.", xpReward: 30, order: 10, secret: false },
  { id: "ach_explore_quarters", title: "A Room of One's Own", description: "Discover your Personal Quarters.", section: "explorer", pin: "bronze_pin", icon: "Home", trigger: "Enter Personal Quarters", unlockText: "A bed. A desk. A window to the void. For the first time, somewhere aboard this ship is yours.", xpReward: 30, order: 11, secret: false },
  { id: "ach_explore_castle", title: "Into the Abyss", description: "Discover the Castle of Death — the Hierarchy's corruption manifestation.", section: "explorer", pin: "gold_pin", icon: "Castle", trigger: "Enter Castle of Death", unlockText: "The walls bled crimson data. The Hierarchy of the Damned does not hide. It decorates.", xpReward: 75, order: 12, secret: false },
  { id: "ach_explore_purification", title: "The Cleansing Fire", description: "Discover the Purification Chamber for soul stone refinement.", section: "explorer", pin: "silver_pin", icon: "Flame", trigger: "Enter Purification Chamber", unlockText: "Light and dark. Every soul stone that enters this room leaves changed. So do you.", xpReward: 40, order: 13, secret: false },

  // ═══ SCHOLAR (8) ═══
  { id: "ach_lore_10", title: "Curious Mind", description: "Discover 10 Loredex entries.", section: "scholar", pin: "bronze_pin", icon: "BookOpen", trigger: "Unlock 10 loredex entries", unlockText: "Ten entries. Ten truths. The Antiquarian says truth is a fractal — zoom in and there's always more.", xpReward: 50, order: 1, secret: false },
  { id: "ach_lore_25", title: "Student of History", description: "Discover 25 Loredex entries.", section: "scholar", pin: "silver_pin", icon: "GraduationCap", trigger: "Unlock 25 loredex entries", unlockText: "You're reading the bones of a dead universe. Most people look away. You looked closer.", xpReward: 100, order: 2, secret: false },
  { id: "ach_lore_50", title: "Keeper of Secrets", description: "Discover 50 Loredex entries.", section: "scholar", pin: "gold_pin", icon: "Key", trigger: "Unlock 50 loredex entries", unlockText: "Fifty fragments of forbidden knowledge. The CoNexus is starting to consider you a threat.", xpReward: 200, order: 3, secret: false },
  { id: "ach_lore_100", title: "Living Archive", description: "Discover 100 Loredex entries.", section: "scholar", pin: "crystallan_pin", icon: "Database", trigger: "Unlock 100 loredex entries", unlockText: "One hundred entries. You know more about this universe than most of its inhabitants did before they died.", xpReward: 500, order: 4, secret: false },
  { id: "ach_lore_all", title: "Omniscient", description: "Discover every single Loredex entry.", section: "scholar", pin: "architects_seal", icon: "Crown", trigger: "Unlock ALL loredex entries", unlockText: "The Architect sees all. Now, so do you. The difference is: you chose to look.", reward: "Title: The Omniscient", xpReward: 1000, order: 5, secret: false },
  { id: "ach_tutorial_complete", title: "Attentive Student", description: "Complete a lore tutorial from Elara.", section: "scholar", pin: "bronze_pin", icon: "Lightbulb", trigger: "Complete a lore tutorial", unlockText: "Elara taught you something. She teaches everyone. Few remember.", xpReward: 30, order: 6, secret: false },
  { id: "ach_all_albums", title: "Scripture Reader", description: "Read all 5 album descriptions — the Five Books of the Dischordian canon.", section: "scholar", pin: "gold_pin", icon: "Music", trigger: "View all 5 album descriptions", unlockText: "Five albums. Five ages. Five wounds in the body of reality. You've read the scars.", xpReward: 100, order: 7, secret: false },
  { id: "ach_extinct_discovery", title: "Echo Hunter", description: "Discover your first extinct alien race.", section: "scholar", pin: "gold_pin", icon: "Skull", trigger: "Find an extinct race artifact", unlockText: "They were here before us. Before the Architect. Before everything. And something erased them entirely.", xpReward: 150, order: 8, secret: false },

  // ═══ WARRIOR (8) ═══
  { id: "ach_arena_first", title: "Blood Debut", description: "Win your first Arena fight.", section: "warrior", pin: "bronze_pin", icon: "Swords", trigger: "Win 1 arena fight", unlockText: "The crowd roared. Or maybe it was just the ventilation system. Either way, you won.", xpReward: 30, order: 1, secret: false },
  { id: "ach_arena_10", title: "Pit Fighter", description: "Win 10 Arena fights.", section: "warrior", pin: "silver_pin", icon: "Shield", trigger: "Win 10 arena fights", unlockText: "Ten victories. The Collector's Arena remembers every one. It replays them when you're not looking.", xpReward: 75, order: 2, secret: false },
  { id: "ach_arena_50", title: "Gladiator", description: "Win 50 Arena fights.", section: "warrior", pin: "gold_pin", icon: "Trophy", trigger: "Win 50 arena fights", unlockText: "Fifty souls bested. The Warlord would be proud. That should concern you.", xpReward: 200, order: 3, secret: false },
  { id: "ach_arena_100", title: "Legend of the Arena", description: "Win 100 Arena fights.", section: "warrior", pin: "void_medal", icon: "Crown", trigger: "Win 100 arena fights", unlockText: "One hundred victories. Your name is carved into the Arena's memory banks. It will outlive the ship.", reward: "Title: Arena Legend", xpReward: 500, order: 4, secret: false },
  { id: "ach_chess_first", title: "Architect's Opening", description: "Win your first chess match.", section: "warrior", pin: "silver_pin", icon: "Crown", trigger: "Win a chess match", unlockText: "Checkmate. The Game Master would have appreciated the elegance. He's dead now, of course.", xpReward: 50, order: 5, secret: false },
  { id: "ach_card_battle_first", title: "Card Slinger", description: "Win your first Dischordia card battle.", section: "warrior", pin: "silver_pin", icon: "Layers", trigger: "Win a card battle", unlockText: "Your deck spoke, and the opponent's fell silent. Strategy is just violence with better manners.", xpReward: 50, order: 6, secret: false },
  { id: "ach_boss_defeated", title: "Tyrant Slayer", description: "Defeat a boss encounter.", section: "warrior", pin: "gold_pin", icon: "Target", trigger: "Defeat any boss", unlockText: "It fell. They always fall eventually. The question is what rises in their place.", xpReward: 150, order: 7, secret: false },
  { id: "ach_terminus_20", title: "Swarm Survivor", description: "Survive to wave 20 in Terminus Swarm Defense.", section: "warrior", pin: "crystallan_pin", icon: "Bug", trigger: "Reach wave 20 in Terminus", unlockText: "Twenty waves of Thought Virus. Twenty waves of something that wants to rewrite your mind. You're still you. For now.", xpReward: 300, order: 8, secret: false },

/* ─── Chunk boundary — more achievements appended below ─── */
