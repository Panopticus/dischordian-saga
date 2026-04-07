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

/* ─── Chunk boundary — more achievements appended below ─── */
