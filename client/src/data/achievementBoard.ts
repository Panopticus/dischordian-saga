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

  // ═══ DIPLOMAT (8) ═══
  { id: "ach_trust_10", title: "Acquaintance", description: "Reach trust level 10 with any NPC.", section: "diplomat", pin: "bronze_pin", icon: "Handshake", trigger: "Reach trust 10 with any NPC", unlockText: "They noticed you. In a universe of billions, that's the first miracle.", xpReward: 30, order: 1, secret: false },
  { id: "ach_trust_25", title: "Confidant", description: "Reach trust level 25 with any NPC.", section: "diplomat", pin: "silver_pin", icon: "Users", trigger: "Reach trust 25 with any NPC", unlockText: "They told you something they haven't told anyone in centuries. Guard it.", xpReward: 75, order: 2, secret: false },
  { id: "ach_trust_40", title: "Trusted Ally", description: "Reach trust level 40 with any NPC — the deepest bond possible.", section: "diplomat", pin: "gold_pin", icon: "HeartHandshake", trigger: "Reach trust 40 with any NPC", unlockText: "Trust level 40. They would die for you. In this universe, that's not metaphorical.", xpReward: 150, order: 3, secret: false },
  { id: "ach_trust_all", title: "Voice of the Ark", description: "Reach trust 40 with every NPC aboard the Ark.", section: "diplomat", pin: "architects_seal", icon: "Crown", trigger: "Trust 40 with ALL NPCs", unlockText: "Seven souls aboard this ship. Seven hearts earned. You are the thread that holds the Ark together.", reward: "Title: Voice of the Ark", xpReward: 1000, order: 4, secret: false },
  { id: "ach_npc_gift", title: "Gift Received", description: "Receive a gift from an NPC for the first time.", section: "diplomat", pin: "bronze_pin", icon: "Gift", trigger: "Receive an NPC gift", unlockText: "They had nothing, and they gave you something anyway. That's what separates the living from the surviving.", xpReward: 30, order: 5, secret: false },
  { id: "ach_loyalty_mission", title: "Loyalty Proven", description: "Complete a companion loyalty mission.", section: "diplomat", pin: "gold_pin", icon: "Shield", trigger: "Complete a loyalty mission", unlockText: "You stood with them when standing was the hardest choice. They won't forget.", xpReward: 200, order: 6, secret: false },
  { id: "ach_npc_betrayal", title: "The Knife", description: "Betray an NPC who trusted you.", section: "diplomat", pin: "corruption_mark", icon: "Scissors", trigger: "Betray an NPC at trust 20+", unlockText: "Their face when you turned. The Architect would have applauded. The Dreamer wept.", xpReward: 50, order: 7, secret: false, alternatives: ["You could have kept faith.", "The trust was real. The betrayal was a choice."] },
  { id: "ach_diplomat_master", title: "The Ambassador", description: "Earn the deep trust of 5 different NPCs.", section: "diplomat", pin: "crystallan_pin", icon: "Globe", trigger: "Reach trust 25+ with 5 NPCs", unlockText: "Five allies. In a universe that rewards isolation, you chose connection. How Dischordian of you.", xpReward: 300, order: 8, secret: false },

  // ═══ KEEPER (10) ═══
  { id: "ach_bond_first", title: "The First Thread", description: "Bond with your first Eidolon companion.", section: "keeper", pin: "silver_pin", icon: "Heart", trigger: "Bond an Eidolon", unlockText: "It chose you. Or you chose it. The distinction matters less than the bond.", xpReward: 50, order: 1, secret: false },
  { id: "ach_bond_20", title: "Growing Trust", description: "Reach bond level 20 — your companion speaks unprompted for the first time.", section: "keeper", pin: "silver_pin", icon: "MessageSquare", trigger: "Bond level 20", unlockText: "It spoke without being asked. Its first independent thought: 'Are you okay?'", xpReward: 75, order: 2, secret: false },
  { id: "ach_bond_50", title: "Shared Secret", description: "Reach bond level 50 — your companion shares a secret with you.", section: "keeper", pin: "gold_pin", icon: "Lock", trigger: "Bond level 50", unlockText: "It whispered something it has never told another soul. The weight of trust, transferred.", xpReward: 150, order: 3, secret: false },
  { id: "ach_bond_80", title: "Unbreakable", description: "Reach bond level 80 — your companion offers its life for yours.", section: "keeper", pin: "void_medal", icon: "ShieldCheck", trigger: "Bond level 80", unlockText: "'I would die for you,' it said. Not dramatically. Quietly. Like stating a fact about gravity.", xpReward: 300, order: 4, secret: false },
  { id: "ach_path_a", title: "Soul-Keeper", description: "Choose Path A at the Severing — keep your original companion.", section: "keeper", pin: "purity_star", icon: "Anchor", trigger: "Choose Path A at the Severing", unlockText: "The Necromancer watched you hold onto what was yours. He did not understand. He envied you.", xpReward: 200, order: 5, secret: false, alternatives: ["Accept the class Eidolon (Path B)", "Walk away from both (Path C)"] },
  { id: "ach_path_b", title: "The Practical Choice", description: "Choose Path B at the Severing — accept the class Eidolon.", section: "keeper", pin: "decision_marker", icon: "ArrowRight", trigger: "Choose Path B at the Severing", unlockText: "Your starter was returned to the specimen registry. It did not understand why. This is how the Archons did it.", xpReward: 100, order: 6, secret: false, alternatives: ["Keep your bond (Path A)", "Walk away from both (Path C)"] },
  { id: "ach_path_c", title: "The Loneliest Path", description: "Choose Path C at the Severing — walk away. No companion. No bond. Free.", section: "keeper", pin: "dischordian_token", icon: "Wind", trigger: "Choose Path C at the Severing", unlockText: "You walked away from both. The Necromancer said nothing. There was nothing to say.", xpReward: 150, order: 7, secret: false, alternatives: ["Keep your bond (Path A)", "Accept the class Eidolon (Path B)"] },
  { id: "ach_companion_death", title: "The Empty Space", description: "Your companion dies permanently in combat.", section: "keeper", pin: "corruption_mark", icon: "Minus", trigger: "Companion permanent death", unlockText: "It's gone. The space where it stood is still warm. The Ark logged its final heartbeat at exactly this moment.", xpReward: 50, order: 8, secret: false },
  { id: "ach_summon_demon", title: "Dark Bargain", description: "Summon a demon pet through the Necromancer.", section: "keeper", pin: "corruption_mark", icon: "Flame", trigger: "Summon any demon pet", unlockText: "The Necromancer grinned. 'Read the contract carefully,' he said. You didn't. Nobody does.", xpReward: 100, order: 9, secret: false },
  { id: "ach_forge_divine", title: "The Antiquarian's Gift", description: "Forge a divine companion through purity.", section: "keeper", pin: "purity_star", icon: "Sun", trigger: "Forge any divine companion", unlockText: "The Antiquarian placed something warm in your hands. 'No cost,' he said. 'No catch. Just light.'", xpReward: 100, order: 10, secret: false },

  // ═══ MERCHANT (6) ═══
  { id: "ach_trade_first", title: "Open Market", description: "Complete your first marketplace transaction.", section: "merchant", pin: "bronze_pin", icon: "ShoppingCart", trigger: "Complete a marketplace trade", unlockText: "Locke keeps ledgers. Your name is in them now. It will never leave.", xpReward: 30, order: 1, secret: false },
  { id: "ach_trade_10", title: "Regular Customer", description: "Complete 10 trades on the marketplace.", section: "merchant", pin: "silver_pin", icon: "TrendingUp", trigger: "Complete 10 trades", unlockText: "Ten transactions. The economy of a stolen ship, running on stolen dreams. Beautiful.", xpReward: 75, order: 2, secret: false },
  { id: "ach_marketplace_listing", title: "Entrepreneur", description: "Create your first marketplace listing.", section: "merchant", pin: "bronze_pin", icon: "Tag", trigger: "Create a marketplace listing", unlockText: "You put a price on something. Locke would say that's the first step to understanding the universe.", xpReward: 30, order: 3, secret: false },
  { id: "ach_dream_1000", title: "Dream Hoarder", description: "Accumulate 1,000 Dream Tokens.", section: "merchant", pin: "gold_pin", icon: "Coins", trigger: "Have 1000 Dream Tokens", unlockText: "A thousand dreams, quantified. The Degen would love to meet you. That's not a compliment.", xpReward: 150, order: 4, secret: false },
  { id: "ach_first_tech", title: "Researcher", description: "Research your first technology in the Trade Empire.", section: "merchant", pin: "silver_pin", icon: "Microscope", trigger: "Complete first tech research", unlockText: "Knowledge, weaponized. The Engineer would approve, wherever he is.", xpReward: 50, order: 5, secret: false },
  { id: "ach_trade_empire_3", title: "Trade Baron", description: "Reach Trade Empire Tier 3.", section: "merchant", pin: "crystallan_pin", icon: "Building", trigger: "Reach Trade Empire Tier 3", unlockText: "Three tiers of economic dominance. New Babylon would grant you citizenship. If it still existed.", reward: "Title: Trade Baron", xpReward: 300, order: 6, secret: false },

  // ═══ ARCHITECT'S SHADOW (8) ═══
  { id: "ach_side_elara", title: "The Dreamer's Chosen", description: "Side with Elara in a critical decision.", section: "architects_shadow", pin: "purity_star", icon: "Heart", trigger: "Side with Elara", unlockText: "You chose compassion. Elara's hologram brightened — literally. The ship's light levels rose 2%.", xpReward: 100, order: 1, secret: false, alternatives: ["Side with The Human", "Refuse both"] },
  { id: "ach_side_human", title: "The Machine's Instrument", description: "Side with The Human in a critical decision.", section: "architects_shadow", pin: "corruption_mark", icon: "Cpu", trigger: "Side with The Human", unlockText: "The substrate hummed approval. Cold. Logical. Efficient. The Architect's way.", xpReward: 100, order: 2, secret: false, alternatives: ["Side with Elara", "Refuse both"] },
  { id: "ach_trust_source", title: "Patient Zero's Friend", description: "Choose to trust The Source despite knowing what he carries.", section: "architects_shadow", pin: "decision_marker", icon: "AlertTriangle", trigger: "Trust The Source at a key moment", unlockText: "You trusted a man consumed by the Thought Virus. Either brave or foolish. History will decide.", xpReward: 100, order: 3, secret: false, alternatives: ["Reject The Source", "Report him to the others"] },
  { id: "ach_help_zero", title: "Ghost Signal", description: "Help Agent Zero with her request from beyond.", section: "architects_shadow", pin: "decision_marker", icon: "Radio", trigger: "Assist Agent Zero", unlockText: "A dead operative's last request, honored by a stranger. The Insurgency's fire isn't out yet.", xpReward: 100, order: 4, secret: false },
  { id: "ach_severing_witnessed", title: "The Severing", description: "Witness and complete the Severing ceremony.", section: "architects_shadow", pin: "gold_pin", icon: "Scissors", trigger: "Complete the Severing", unlockText: "The Necromancer offered you a choice that cannot be unmade. The universe held its breath.", xpReward: 200, order: 5, secret: false },
  { id: "ach_corruption_chosen", title: "Embrace the Dark", description: "Deliberately choose the corruption path.", section: "architects_shadow", pin: "corruption_mark", icon: "Moon", trigger: "Reach Corruption Tier 1 by choice", unlockText: "The Hierarchy whispered, and you listened. Power always has a voice. It just doesn't always tell the truth.", xpReward: 75, order: 6, secret: false, alternatives: ["Choose purity instead", "Maintain balance"] },
  { id: "ach_purity_chosen", title: "Walk in Light", description: "Deliberately choose the purity path.", section: "architects_shadow", pin: "purity_star", icon: "Sun", trigger: "Reach Purity Tier 1 by choice", unlockText: "The Dreamer's light is warm but demanding. It asks you to be better. Every day.", xpReward: 75, order: 7, secret: false, alternatives: ["Choose corruption instead", "Maintain balance"] },
  { id: "ach_decisive_vote", title: "The Deciding Voice", description: "Cast the vote that tips a governance decision.", section: "architects_shadow", pin: "gold_pin", icon: "Scale", trigger: "Cast a tie-breaking vote", unlockText: "Your single vote changed the course of the Ark. Democracy is beautiful and terrifying in equal measure.", xpReward: 150, order: 8, secret: false },

  // ═══ CORRUPTION CHRONICLE (9) ═══
  { id: "ach_corrupt_1", title: "First Shadow", description: "Reach Corruption Tier 1.", section: "corruption_chronicle", pin: "corruption_mark", icon: "CloudRain", trigger: "Corruption Tier 1", unlockText: "A shadow that wasn't there before follows you now. The NPCs notice. They don't say anything. Yet.", xpReward: 50, order: 1, secret: false },
  { id: "ach_corrupt_2", title: "Deepening Dark", description: "Reach Corruption Tier 2.", section: "corruption_chronicle", pin: "corruption_mark", icon: "CloudLightning", trigger: "Corruption Tier 2", unlockText: "The Shadow Tongue smiled. 'You're starting to understand,' it said. You wish it was wrong.", xpReward: 100, order: 2, secret: false },
  { id: "ach_corrupt_3", title: "Hierarchy's Embrace", description: "Reach Corruption Tier 3.", section: "corruption_chronicle", pin: "void_medal", icon: "Skull", trigger: "Corruption Tier 3", unlockText: "Mol'Garath the Unmaker knows your name now. In the Hierarchy, that's a promotion.", xpReward: 200, order: 3, secret: false },
  { id: "ach_corrupt_4", title: "The Abyss Looks Back", description: "Reach Corruption Tier 4 — maximum corruption.", section: "corruption_chronicle", pin: "architects_seal", icon: "Eclipse", trigger: "Corruption Tier 4", unlockText: "You stared into the abyss. It offered you a corner office. The Hierarchy's newest executive.", reward: "Title: Servant of the Hierarchy", xpReward: 500, order: 4, secret: false },
  { id: "ach_pure_1", title: "First Light", description: "Reach Purity Tier 1.", section: "corruption_chronicle", pin: "purity_star", icon: "Sunrise", trigger: "Purity Tier 1", unlockText: "A warmth that wasn't there before lives in your chest. The Antiquarian nods. 'Good. Good.'", xpReward: 50, order: 5, secret: false },
  { id: "ach_pure_2", title: "Growing Radiance", description: "Reach Purity Tier 2.", section: "corruption_chronicle", pin: "purity_star", icon: "Sparkles", trigger: "Purity Tier 2", unlockText: "Your presence calms the corridors. Elara's hologram stabilizes near you. The ship is healing.", xpReward: 100, order: 6, secret: false },
  { id: "ach_pure_3", title: "Dreamer's Vessel", description: "Reach Purity Tier 3.", section: "corruption_chronicle", pin: "gold_pin", icon: "Star", trigger: "Purity Tier 3", unlockText: "The Dreamer stirs in cryo. In its sleep, it whispers your name. You are becoming hope.", xpReward: 200, order: 7, secret: false },
  { id: "ach_pure_4", title: "Incarnate Light", description: "Reach Purity Tier 4 — maximum purity.", section: "corruption_chronicle", pin: "architects_seal", icon: "Sun", trigger: "Purity Tier 4", unlockText: "You burn so bright that the Hierarchy flinches. The Dreamer's Song plays when you walk.", reward: "Title: Dreamer's Chosen", xpReward: 500, order: 8, secret: false },
  { id: "ach_dischordian_balance", title: "Dischordian Balance", description: "Achieve perfect equilibrium between corruption and purity.", section: "corruption_chronicle", pin: "dischordian_token", icon: "Scale", trigger: "Equal corruption and purity scores", unlockText: "Neither light nor dark. You walk the razor's edge. The Enigma laughs. 'Now you understand Dischordian Logic.'", reward: "Title: The Balanced", xpReward: 300, order: 9, secret: false },

  // ═══ THE WITNESS (6) ═══
  { id: "ach_first_episode", title: "Transmission Received", description: "Watch your first Saga episode.", section: "the_witness", pin: "bronze_pin", icon: "Play", trigger: "Watch any episode", unlockText: "The signal reached you across 17,000 years. The Two Witnesses are still broadcasting.", xpReward: 30, order: 1, secret: false },
  { id: "ach_first_album", title: "First Hymn", description: "Listen to your first album track.", section: "the_witness", pin: "bronze_pin", icon: "Music", trigger: "Listen to any track", unlockText: "Music survived the Fall of Reality. It always does. It's the cockroach of art forms.", xpReward: 30, order: 2, secret: false },
  { id: "ach_epoch_1_complete", title: "Epoch 1 Complete", description: "Watch all episodes of Saga Epoch 1.", section: "the_witness", pin: "gold_pin", icon: "Film", trigger: "Watch all Epoch 1 episodes", unlockText: "You've seen the beginning. Genesis. The Programmer. The creation of something that would devour everything.", xpReward: 150, order: 3, secret: false },
  { id: "ach_all_albums_listened", title: "Five Books Heard", description: "Listen to all 5 albums in full.", section: "the_witness", pin: "void_medal", icon: "Disc", trigger: "Listen to all 5 albums", unlockText: "Five albums. Five ages. Five prophecies sung into being. The Two Witnesses' full testimony, heard.", reward: "Title: Two Witnesses' Chosen", xpReward: 500, order: 4, secret: false },
  { id: "ach_meme_broadcast", title: "Meme Signal", description: "Watch a Meme Broadcast transmission.", section: "the_witness", pin: "silver_pin", icon: "Tv", trigger: "Watch a meme broadcast", unlockText: "The Meme is destroyed. But her broadcasts still play. Some signals outlive their senders.", xpReward: 50, order: 5, secret: false },
  { id: "ach_media_loredex", title: "Hidden in the Signal", description: "Discover a Loredex entry triggered by watching media.", section: "the_witness", pin: "gold_pin", icon: "Search", trigger: "Unlock loredex entry from media", unlockText: "The video contained something the producers didn't intend. A message within a message. Layers.", xpReward: 100, order: 6, secret: false },

  // ═══ THE COLLECTOR (6) ═══
  { id: "ach_all_specimens", title: "Complete Archive", description: "Collect all 7 Collector's specimens.", section: "the_collector", pin: "crystallan_pin", icon: "Archive", trigger: "Collect all 7 specimens", unlockText: "Seven specimens. The Collector's full archive, now yours. He would be furious. He would also be impressed.", reward: "Title: Archivist", xpReward: 300, order: 1, secret: false },
  { id: "ach_all_extinct", title: "Ghost Paleontologist", description: "Discover all 5 extinct alien races.", section: "the_collector", pin: "void_medal", icon: "Skull", trigger: "Find all 5 extinct races", unlockText: "Five civilizations, erased. You found their echoes. The Crystallans. The Weave-Born. The Void Singers. The Voltari. The Echo Minds. Remembered.", xpReward: 500, order: 2, secret: false },
  { id: "ach_all_starters", title: "Full Menagerie", description: "Collect all 6 starter Eidolons in specimen form.", section: "the_collector", pin: "gold_pin", icon: "Grid", trigger: "Own all 6 starter Eidolons", unlockText: "Lux. Echo. Glyph. Cipher. Flicker. Gilt. All six, gathered. The Cryo Bay glows brighter.", xpReward: 200, order: 3, secret: false },
  { id: "ach_legendary_card", title: "Legendary Pull", description: "Own a legendary-rarity card.", section: "the_collector", pin: "gold_pin", icon: "Sparkles", trigger: "Obtain a legendary card", unlockText: "Gold light burst from the pack. The Ark's systems flickered. Something that powerful demands attention.", xpReward: 150, order: 4, secret: false },
  { id: "ach_all_materials", title: "Material Master", description: "Collect every type of crafting material at least once.", section: "the_collector", pin: "crystallan_pin", icon: "Layers", trigger: "Own all crafting material types", unlockText: "Every material the Ark yields, gathered. Void Metal, Dream Crystals, Architect's Tears. You hold a forge's worth of possibility.", xpReward: 200, order: 5, secret: false },
  { id: "ach_full_card_set", title: "Complete Set", description: "Complete an entire card faction set.", section: "the_collector", pin: "void_medal", icon: "CheckSquare", trigger: "Complete any faction card set", unlockText: "Every card in the faction, collected. The set pulses with combined power. More than the sum of its parts.", xpReward: 300, order: 6, secret: false },

  // ═══ CLASSIFIED (5) ═══
  { id: "ach_shadow_message", title: "The Tongue Speaks", description: "Find the Shadow Tongue's hidden message woven into the ship's data.", section: "classified", pin: "void_medal", icon: "MessageSquare", trigger: "Discover Shadow Tongue's hidden message", unlockText: "CLASSIFIED: The Shadow Tongue has been in the ship's language systems since construction. It didn't infiltrate. It was invited.", xpReward: 300, order: 1, secret: true },
  { id: "ach_zero_signal", title: "Ghost Frequency", description: "Decode Agent Zero's encoded signal from the Armory.", section: "classified", pin: "void_medal", icon: "Radio", trigger: "Decode Agent Zero's signal", unlockText: "CLASSIFIED: Agent Zero's last transmission: 'The Architect didn't build the Arks to save anyone. They're cages. All of them.'", xpReward: 300, order: 2, secret: true },
  { id: "ach_human_substrate", title: "The Imprisoned God", description: "Discover The Human's consciousness trapped in the substrate.", section: "classified", pin: "architects_seal", icon: "Cpu", trigger: "Find The Human in substrate", unlockText: "CLASSIFIED: The 12th Archon is in every wall. Every circuit. Every line of code. He has been screaming for 17,000 years. Nobody could hear.", xpReward: 500, order: 3, secret: true },
  { id: "ach_crystallan_arch", title: "The First Door", description: "Find the Crystallan Arch hidden in the Ark's deepest deck.", section: "classified", pin: "crystallan_pin", icon: "Doorway", trigger: "Discover the Crystallan Arch", unlockText: "CLASSIFIED: The Crystallans built dimensional bridges before the Architect existed. He copied their work. Then he erased them.", xpReward: 300, order: 4, secret: true },
  { id: "ach_thought_cabinet", title: "Open Mind", description: "Unlock the Thought Cabinet and internalize your first thought.", section: "classified", pin: "void_medal", icon: "Brain", trigger: "Internalize a thought", unlockText: "CLASSIFIED: Your mind has a new room. The thought lives there now, permanent and transformative. Some doors, once opened, cannot close.", xpReward: 200, order: 5, secret: true },

  // ═══ SESSION MEMORIES (6) ═══
  { id: "ach_first_moral_choice", title: "The First Fork", description: "Make your first moral choice with lasting consequences.", section: "session_memories", pin: "decision_marker", icon: "GitBranch", trigger: "Make a moral choice", unlockText: "The universe branched. One path walked, infinite others abandoned. The Ark recorded everything.", xpReward: 50, order: 1, secret: false },
  { id: "ach_alignment_changed", title: "Shifting Ground", description: "Your alignment changes from one side to the other.", section: "session_memories", pin: "decision_marker", icon: "RefreshCw", trigger: "Change moral alignment", unlockText: "You were one thing. Now you're another. The NPCs noticed. They always notice.", xpReward: 75, order: 2, secret: false },
  { id: "ach_reversed_decision", title: "Second Thoughts", description: "Reverse a previous decision through in-game action.", section: "session_memories", pin: "decision_marker", icon: "Undo", trigger: "Reverse a decision", unlockText: "You went back. Most don't. The Antiquarian says regret is the universe's way of offering second chances.", xpReward: 100, order: 3, secret: false },
  { id: "ach_irreversible", title: "Point of No Return", description: "Make a choice that cannot be undone.", section: "session_memories", pin: "corruption_mark", icon: "AlertOctagon", trigger: "Make an irreversible choice", unlockText: "Done. There is no going back. The Ark sealed this moment in permanent memory. It will outlive you.", xpReward: 100, order: 4, secret: false },
  { id: "ach_refuse_all", title: "The Independent", description: "Refuse all faction offers in a single session.", section: "session_memories", pin: "dischordian_token", icon: "X", trigger: "Refuse all faction offers", unlockText: "You said no to everyone. The Architect, the Dreamer, the Hierarchy — all rejected. You walk alone. How Dischordian.", xpReward: 150, order: 5, secret: false },
  { id: "ach_chapter_complete", title: "Chapter Closed", description: "Complete a full story chapter.", section: "session_memories", pin: "gold_pin", icon: "BookMarked", trigger: "Complete a story chapter", unlockText: "A chapter ends. Not happily, not sadly. It ends the way all true stories do — with more questions than answers.", xpReward: 200, order: 6, secret: false },
];

/* ─── HELPER FUNCTIONS ─── */

export function getAchievementsBySection(section: AchievementSection): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.section === section).sort((a, b) => a.order - b.order);
}

export function getCompletedCount(earnedIds: Set<string>): number {
  return ALL_ACHIEVEMENTS.filter(a => earnedIds.has(a.id)).length;
}

export function getTotalCount(): number {
  return ALL_ACHIEVEMENTS.length;
}

export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.id === id);
}

export function getSectionCompletionPercent(section: AchievementSection, earnedIds: Set<string>): number {
  const sectionAch = getAchievementsBySection(section);
  if (sectionAch.length === 0) return 100;
  const earned = sectionAch.filter(a => earnedIds.has(a.id)).length;
  return Math.round((earned / sectionAch.length) * 100);
}

export function getSecretAchievements(): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.secret);
}

export function getDecisionAchievements(): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.pin === "decision_marker" || a.alternatives?.length);
}
