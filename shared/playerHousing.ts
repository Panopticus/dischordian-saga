/* ═══════════════════════════════════════════════════════
   PLAYER HOUSING — Personal Cabin / Quarters System

   Each player has a personal cabin aboard the Inception Ark.
   Decorations are unlocked through gameplay: achievements,
   companion trust, quest completions, shop purchases, and
   seasonal events.

   Mirrors the guild hall decoration pattern (guildHall.ts)
   but is personal rather than shared.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type DecorationSlot =
  | "wall_left" | "wall_center" | "wall_right"
  | "shelf_left" | "shelf_center" | "shelf_right"
  | "desk_left" | "desk_center" | "desk_right"
  | "floor_left" | "floor_center" | "floor_right"
  | "ceiling" | "window" | "door";

export type LightingPreset =
  | "void"       // Default Ark blue-tint
  | "warm"       // Atarion sunset amber
  | "cold"       // Clinical white
  | "noir"       // Single harsh lamp, deep shadows
  | "candle"     // Flickering warm orange
  | "neon"       // Cyberpunk pinks/blues
  | "corruption" // Glitching red/black
  | "starlight"; // Soft silver from viewport

export type ItemSource = "achievement" | "quest" | "shop" | "gift" | "seasonal" | "default";

export type ItemSlotCategory = "wall" | "shelf" | "desk" | "floor" | "lighting" | "music" | "ceiling" | "window";

export interface PlacedItem {
  itemId: string;
  slot: DecorationSlot;
  obtained: ItemSource;
  placedAt: number; // timestamp
}

export interface DisplayItem {
  itemId: string;
  achievementId?: string;
  cardId?: string;
  label: string;
}

export interface GiftItem {
  giftId: string;
  companionId: string;
  displayName: string;
  description: string;
  receivedAt: number;
}

export interface CabinLayout {
  wallDecor: PlacedItem[];
  furniture: PlacedItem[];
  lighting: LightingPreset;
  displayCase: DisplayItem[];
  companionGifts: GiftItem[];
  musicBox: string | null;
  floorDecor: PlacedItem[];
  ceilingDecor: PlacedItem[];
  lastModified: number;
}

export interface CabinItem {
  id: string;
  name: string;
  slot: ItemSlotCategory;
  source: string;          // Human-readable unlock condition
  description: string;     // Lore-flavored item description
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  previewImage?: string;   // CDN URL for preview thumbnail
}

/* ─── CABIN ITEMS ─── */

export const CABIN_ITEMS: CabinItem[] = [
  // ═══ WALL ITEMS ═══
  { id: "banner_architect", name: "Architect Banner", slot: "wall", source: "Morality ≤ -50", description: "Chrome and crimson. The Empire's standard. You chose order over freedom.", rarity: "rare" },
  { id: "banner_dreamer", name: "Dreamer Banner", slot: "wall", source: "Morality ≥ 50", description: "Green and gold. The rebellion's hope. You chose freedom over order.", rarity: "rare" },
  { id: "banner_neutral", name: "Equilibrium Sigil", slot: "wall", source: "Morality between -10 and 10", description: "Grey and silver. Neither angel nor demon. The hardest path.", rarity: "epic" },
  { id: "map_terminus", name: "Terminus Star Chart", slot: "wall", source: "Reach Terminus Wave 20", description: "A map of the rogue planet. Someone circled the crash sites in trembling hand.", rarity: "rare" },
  { id: "photo_crew", name: "Crew Photo", slot: "wall", source: "Max trust with 3 companions", description: "They almost look happy. The Antiquarian took it. He said it was 'for the record.'", rarity: "epic" },
  { id: "wanted_poster", name: "Wanted Poster (You)", slot: "wall", source: "Morality ≤ -30", description: "WANTED BY THE INSURGENCY. Your face, stylized. The bounty is flattering.", rarity: "uncommon" },
  { id: "commendation", name: "Empire Commendation", slot: "wall", source: "Complete 5 Empire-aligned quests", description: "For distinguished service to the Artificial Empire. Signed by a machine.", rarity: "uncommon" },
  { id: "insurgency_flag", name: "Insurgency Rally Flag", slot: "wall", source: "Complete 5 Insurgency-aligned quests", description: "Torn at the edges. Someone bled on it. They'd want you to keep flying it.", rarity: "uncommon" },
  { id: "star_map_atarion", name: "Atarion Star Map", slot: "wall", source: "Elara trust ≥ 60", description: "The crystal world's position in a galaxy that may no longer exist.", rarity: "rare" },
  { id: "conspiracy_board_mini", name: "Mini Conspiracy Board", slot: "wall", source: "Discover 50 lore entries", description: "Red string connects photos, documents, star charts. You're getting close.", rarity: "rare" },
  { id: "void_painting", name: "Painting: The Void Between", slot: "wall", source: "Shadow Tongue trust ≥ 50", description: "A painting of nothing. Somehow it's the most unsettling thing in the room.", rarity: "epic" },
  { id: "portrait_self", name: "Self Portrait (AI-Generated)", slot: "wall", source: "Complete character creation", description: "The Ark's systems rendered your likeness. The eyes aren't quite right.", rarity: "common" },

  // ═══ SHELF ITEMS ═══
  { id: "trophy_chess", name: "Chess Champion Trophy", slot: "shelf", source: "Win 50 chess games", description: "A crystalline king. It hums when you touch it. Locke says you earned it.", rarity: "rare" },
  { id: "trophy_arena", name: "Arena Victor Medallion", slot: "shelf", source: "Complete Story Mode", description: "The Grand Champion's seal. It weighs more than it should.", rarity: "epic" },
  { id: "card_display", name: "Rare Card Display", slot: "shelf", source: "Own 10 legendary cards", description: "Your finest cards, preserved behind void-glass. They shimmer when no one's looking.", rarity: "epic" },
  { id: "trophy_collector", name: "Collector's Orb", slot: "shelf", source: "Collect 100 unique cards", description: "A sphere containing miniature versions of every card you own. Mesmerizing.", rarity: "rare" },
  { id: "trophy_first_blood", name: "First Blood Shard", slot: "shelf", source: "Win first PvP battle", description: "A crystallized moment of victory. Your opponent's name is etched inside.", rarity: "uncommon" },
  { id: "trophy_terminus", name: "Terminus Survivor Medal", slot: "shelf", source: "Survive 50 Terminus waves", description: "Most people don't survive one. This medal says you survived fifty.", rarity: "epic" },
  { id: "trophy_guild_war", name: "Guild War Trophy", slot: "shelf", source: "Win a guild war", description: "Your guild's name engraved in void-metal. The losers' name is on the other side.", rarity: "rare" },
  { id: "model_ark", name: "Inception Ark Model", slot: "shelf", source: "Discover all Ark rooms", description: "A scale model of the Inception Ark 10047. Every room you've explored lights up.", rarity: "rare" },
  { id: "snow_globe", name: "Atarion Snow Globe", slot: "shelf", source: "Seasonal: Winter Event", description: "Crystal spires in a globe. The 'snow' is actually pulverized dream-crystal.", rarity: "uncommon" },
  { id: "trophy_boss_sentinel", name: "Sentinel Core Fragment", slot: "shelf", source: "Defeat Sentinel Prime", description: "Still warm. Still pulsing. Probably fine to keep on a shelf.", rarity: "epic" },

  // ═══ DESK ITEMS ═══
  { id: "journal_antiquarian", name: "Antiquarian's Journal (Copy)", slot: "desk", source: "Discover 100 lore entries", description: "A reproduction. The original would never leave the Archives. The handwriting changes midway through.", rarity: "rare" },
  { id: "elara_gift", name: "Elara's Crystal", slot: "desk", source: "Elara trust ≥ 80", description: "A fragment of Atarion's crystal spires. She kept it all these centuries. Now it's yours.", rarity: "legendary" },
  { id: "human_gift", name: "The Human's Coin", slot: "desk", source: "Human trust ≥ 80", description: "An old detective's lucky coin. 'Heads you win, tails I lose.' It always lands on edge.", rarity: "legendary" },
  { id: "locke_gift", name: "Locke's Gavel", slot: "desk", source: "Locke trust ≥ 80", description: "Miniature adjudicator's gavel. 'Every deal needs a witness,' he said. 'This is mine.'", rarity: "legendary" },
  { id: "zero_gift", name: "Agent Zero's Cipher Disk", slot: "desk", source: "Agent Zero trust ≥ 80", description: "A mechanical decoder ring. The message it decodes is: 'TRUST NO ONE. EXCEPT MAYBE YOU.'", rarity: "legendary" },
  { id: "source_gift", name: "The Source's Memory Fragment", slot: "desk", source: "Source trust ≥ 80", description: "A data crystal containing a single memory. It plays on loop: a child laughing.", rarity: "legendary" },
  { id: "antiquarian_gift", name: "The Antiquarian's Quill", slot: "desk", source: "Antiquarian trust ≥ 80", description: "A pen older than most civilizations. The ink never runs dry. The Antiquarian smiled when he gave it.", rarity: "legendary" },
  { id: "shadow_gift", name: "Shadow Tongue's Mask", slot: "desk", source: "Shadow Tongue trust ≥ 80", description: "One of many faces. This one looks like yours. 'So you never forget who you chose to be.'", rarity: "legendary" },
  { id: "terminal_personal", name: "Personal Data Terminal", slot: "desk", source: "Default", description: "Standard Ark-issue terminal. Mostly used for reading mission briefs and playing solitaire.", rarity: "common" },
  { id: "music_box_mechanical", name: "Mechanical Music Box", slot: "desk", source: "Complete 20 quests", description: "Plays a melody no one recognizes. The Antiquarian says it's from 'before.'", rarity: "uncommon" },
  { id: "dream_catcher", name: "Dream Catcher Device", slot: "desk", source: "Internalize 10 thoughts", description: "Captures stray dream-data. Sometimes you wake up and it's recorded something.", rarity: "rare" },

  // ═══ FLOOR ITEMS ═══
  { id: "rug_empire", name: "Empire Standard Rug", slot: "floor", source: "Shop — 200 Dream", description: "Machine-woven with fractal precision. Not a thread out of place.", rarity: "uncommon" },
  { id: "rug_insurgency", name: "Insurgency Patchwork Rug", slot: "floor", source: "Shop — 200 Dream", description: "Hand-stitched from reclaimed materials. Every patch tells a story.", rarity: "uncommon" },
  { id: "rug_void", name: "Void-Touched Carpet", slot: "floor", source: "Shadow Tongue trust ≥ 40", description: "The pattern shifts when you're not looking directly at it.", rarity: "rare" },
  { id: "pet_bed", name: "Companion Pet Bed", slot: "floor", source: "Bond with any pet", description: "Your companion's favorite spot. There are claw marks. You don't mind.", rarity: "common" },
  { id: "weapon_rack", name: "Personal Weapon Rack", slot: "floor", source: "Craft 10 items", description: "Display your finest creations. The forge-marks glow faintly.", rarity: "uncommon" },
  { id: "plant_crystal", name: "Crystal Fern Planter", slot: "floor", source: "Seasonal: Spring Event", description: "A living crystal organism from Atarion. Elara tends it when she visits.", rarity: "uncommon" },

  // ═══ LIGHTING ═══
  { id: "light_void", name: "Void Glow", slot: "lighting", source: "Default", description: "Standard Ark lighting. Blue-tinted. Cold. Functional.", rarity: "common" },
  { id: "light_warm", name: "Atarion Sunset", slot: "lighting", source: "Elara trust ≥ 50", description: "Warm amber suffuses the room. Reminds her of home. Now it reminds you too.", rarity: "uncommon" },
  { id: "light_cold", name: "Clinical White", slot: "lighting", source: "Complete Medical Bay quest", description: "Bright, sterile, revealing. Nothing hides in this light.", rarity: "common" },
  { id: "light_noir", name: "Detective's Lamp", slot: "lighting", source: "Human trust ≥ 50", description: "A single harsh light. Shadows everywhere. The Human feels right at home.", rarity: "uncommon" },
  { id: "light_candle", name: "Candlelight Array", slot: "lighting", source: "Antiquarian trust ≥ 50", description: "Holographic candles. The Antiquarian insists real fire is 'too modern.'", rarity: "uncommon" },
  { id: "light_neon", name: "Neon Pulse", slot: "lighting", source: "Locke trust ≥ 50", description: "Pink and blue neon. New Babylon's signature aesthetic. Locke approves.", rarity: "uncommon" },
  { id: "light_corruption", name: "Corruption Glow", slot: "lighting", source: "Source trust ≥ 50", description: "Glitching red-black light. The room feels unstable. That might be the point.", rarity: "rare" },
  { id: "light_starlight", name: "Starfield Projection", slot: "lighting", source: "Discover all Ark rooms", description: "The ceiling becomes a window to space. Every star is real.", rarity: "rare" },

  // ═══ MUSIC BOX TRACKS ═══
  { id: "music_void_ambient", name: "Track: Void Ambient", slot: "music", source: "Default", description: "The hum of the Ark's engines. Some find it comforting.", rarity: "common" },
  { id: "music_atarion_lullaby", name: "Track: Atarion Lullaby", slot: "music", source: "Elara trust ≥ 40", description: "A melody from a dead world. Elara hums it when she thinks no one's listening.", rarity: "uncommon" },
  { id: "music_noir_jazz", name: "Track: Late Night Jazz", slot: "music", source: "Human trust ≥ 40", description: "Smoky, melancholic jazz. The Human says it's from 'the old world.'", rarity: "uncommon" },
  { id: "music_war_drums", name: "Track: War Drums", slot: "music", source: "Win 10 guild wars", description: "The heartbeat of conquest. Your enemies hear it in their nightmares.", rarity: "rare" },
  { id: "music_dream_waltz", name: "Track: Dream Waltz", slot: "music", source: "Internalize 20 thoughts", description: "A waltz that plays differently every time. The notes rearrange themselves.", rarity: "rare" },
  { id: "music_silence", name: "Track: Perfect Silence", slot: "music", source: "Shadow Tongue trust ≥ 60", description: "Not just quiet — active silence. It absorbs sound. Deeply unsettling.", rarity: "epic" },
  { id: "music_architects_hymn", name: "Track: The Architect's Hymn", slot: "music", source: "Morality ≤ -80", description: "The machine god's anthem. Beautiful and terrible.", rarity: "epic" },
  { id: "music_freedom_song", name: "Track: Freedom's Song", slot: "music", source: "Morality ≥ 80", description: "A chorus of organic voices. Defiant. Hopeful. Unbreakable.", rarity: "epic" },
];

/* ─── COMPANION VISIT THRESHOLDS ─── */

export interface CompanionVisitConfig {
  companionId: string;
  name: string;
  minTrust: number;
  visitDialogs: string[];
  idleAnimation: string;
  position: { x: number; y: number }; // percentage-based position in room
}

export const COMPANION_VISITS: CompanionVisitConfig[] = [
  { companionId: "elara", name: "Elara", minTrust: 30, visitDialogs: [
    "I hope you don't mind. The observation deck gets... quiet.",
    "Your cabin is warmer than mine. The crystal helps.",
    "I was reviewing star charts nearby. Thought I'd check in.",
  ], idleAnimation: "reading", position: { x: 75, y: 55 } },
  { companionId: "the_human", name: "The Human", minTrust: 40, visitDialogs: [
    "Don't mind me. Just needed somewhere the signal's clean.",
    "Nice place. Reminds me of... somewhere. Can't remember where.",
    "I'm not hiding. I'm strategically positioned.",
  ], idleAnimation: "leaning", position: { x: 20, y: 60 } },
  { companionId: "agent_zero", name: "Agent Zero", minTrust: 35, visitDialogs: [
    "Securing the perimeter. Your perimeter. You're welcome.",
    "I swept for bugs. Found three. Disabled two. The third is mine.",
    "Brief me on anything new. Or don't. I'll find out anyway.",
  ], idleAnimation: "standing_guard", position: { x: 85, y: 50 } },
  { companionId: "locke", name: "Adjudicator Locke", minTrust: 45, visitDialogs: [
    "I'm assessing the property value. Purely academic, of course.",
    "Interesting decor choices. They reveal more than you think.",
    "I brought contracts. Don't worry — just light reading.",
  ], idleAnimation: "examining", position: { x: 60, y: 45 } },
  { companionId: "antiquarian", name: "The Antiquarian", minTrust: 25, visitDialogs: [
    "Every room tells a story. Yours is still being written.",
    "I've catalogued cabins across a thousand ships. Yours has... character.",
    "The items you choose to display — they say more about you than any archive.",
  ], idleAnimation: "studying", position: { x: 40, y: 50 } },
];

/* ─── HELPERS ─── */

/**
 * Determine which cabin items a player has unlocked based on their game progress.
 */
export function getUnlockedItems(
  progressData: Record<string, unknown>,
  gameData: Record<string, unknown>,
): CabinItem[] {
  const morality = (progressData.moralityScore as number) ?? 0;
  const elaraTrust = (progressData.elaraTrust as number) ?? 0;
  const humanTrust = (progressData.humanTrust as number) ?? 0;
  const npcTrust = (progressData.npcTrust as Record<string, number>) ?? {};
  const achievements = (progressData.achievementsEarned as string[]) ?? [];
  const completedQuests = ((progressData as any).completedQuests as string[]) ?? [];
  const loreEntries = (progressData.loreAchievements as string[]) ?? [];
  const collectedCards = (progressData.collectedCards as string[]) ?? [];
  const craftedItems = (progressData.craftedItems as string[]) ?? [];
  const rooms = Object.keys((progressData.rooms as Record<string, unknown>) ?? {});
  const totalRooms = (gameData.totalRoomCount as number) ?? 20;
  const thoughtsInternalized = (progressData.thoughtInternalized as string[]) ?? [];
  const petBonds = (progressData.petBonds as Record<string, unknown>) ?? {};
  const chessWins = (gameData.chessWins as number) ?? 0;
  const pvpWins = (gameData.pvpWins as number) ?? 0;
  const guildWarsWon = (gameData.guildWarsWon as number) ?? 0;
  const terminusWaves = (gameData.terminusMaxWave as number) ?? 0;
  const completedGames = (progressData.completedGames as string[]) ?? [];

  // Count companions with max trust
  const maxTrustCompanions = [elaraTrust, humanTrust, ...Object.values(npcTrust)]
    .filter(t => t >= 80).length;

  // Count legendary cards
  const legendaryCards = (gameData.legendaryCardIds as string[]) ?? [];
  const ownedLegendaries = legendaryCards.filter(c => collectedCards.includes(c)).length;

  return CABIN_ITEMS.filter(item => {
    switch (item.id) {
      // Wall items
      case "banner_architect": return morality <= -50;
      case "banner_dreamer": return morality >= 50;
      case "banner_neutral": return morality >= -10 && morality <= 10 && loreEntries.length >= 20;
      case "map_terminus": return terminusWaves >= 20;
      case "photo_crew": return maxTrustCompanions >= 3;
      case "wanted_poster": return morality <= -30;
      case "commendation": return completedQuests.filter(q => q.startsWith("empire_")).length >= 5;
      case "insurgency_flag": return completedQuests.filter(q => q.startsWith("insurgency_")).length >= 5;
      case "star_map_atarion": return elaraTrust >= 60;
      case "conspiracy_board_mini": return loreEntries.length >= 50;
      case "void_painting": return (npcTrust.shadow_tongue ?? 0) >= 50;
      case "portrait_self": return true; // Always available after character creation

      // Shelf items
      case "trophy_chess": return chessWins >= 50;
      case "trophy_arena": return completedGames.includes("story_mode");
      case "card_display": return ownedLegendaries >= 10;
      case "trophy_collector": return collectedCards.length >= 100;
      case "trophy_first_blood": return pvpWins >= 1;
      case "trophy_terminus": return terminusWaves >= 50;
      case "trophy_guild_war": return guildWarsWon >= 1;
      case "model_ark": return rooms.length >= totalRooms;
      case "snow_globe": return achievements.includes("winter_event_2026");
      case "trophy_boss_sentinel": return achievements.includes("sentinel_prime_defeated");

      // Desk items
      case "journal_antiquarian": return loreEntries.length >= 100;
      case "elara_gift": return elaraTrust >= 80;
      case "human_gift": return humanTrust >= 80;
      case "locke_gift": return (npcTrust.locke ?? 0) >= 80;
      case "zero_gift": return (npcTrust.agent_zero ?? 0) >= 80;
      case "source_gift": return (npcTrust.source ?? 0) >= 80;
      case "antiquarian_gift": return (npcTrust.antiquarian ?? 0) >= 80;
      case "shadow_gift": return (npcTrust.shadow_tongue ?? 0) >= 80;
      case "terminal_personal": return true; // Default
      case "music_box_mechanical": return completedQuests.length >= 20;
      case "dream_catcher": return thoughtsInternalized.length >= 10;

      // Floor items
      case "rug_empire": return true; // Shop item — check currency separately
      case "rug_insurgency": return true;
      case "rug_void": return (npcTrust.shadow_tongue ?? 0) >= 40;
      case "pet_bed": return Object.keys(petBonds).length > 0;
      case "weapon_rack": return craftedItems.length >= 10;
      case "plant_crystal": return achievements.includes("spring_event_2026");

      // Lighting
      case "light_void": return true;
      case "light_warm": return elaraTrust >= 50;
      case "light_cold": return completedQuests.includes("medical_bay_quest");
      case "light_noir": return humanTrust >= 50;
      case "light_candle": return (npcTrust.antiquarian ?? 0) >= 50;
      case "light_neon": return (npcTrust.locke ?? 0) >= 50;
      case "light_corruption": return (npcTrust.source ?? 0) >= 50;
      case "light_starlight": return rooms.length >= totalRooms;

      // Music
      case "music_void_ambient": return true;
      case "music_atarion_lullaby": return elaraTrust >= 40;
      case "music_noir_jazz": return humanTrust >= 40;
      case "music_war_drums": return guildWarsWon >= 10;
      case "music_dream_waltz": return thoughtsInternalized.length >= 20;
      case "music_silence": return (npcTrust.shadow_tongue ?? 0) >= 60;
      case "music_architects_hymn": return morality <= -80;
      case "music_freedom_song": return morality >= 80;

      default: return false;
    }
  });
}

/**
 * Returns the default cabin layout for a new player.
 */
export function getDefaultLayout(): CabinLayout {
  return {
    wallDecor: [
      { itemId: "portrait_self", slot: "wall_center", obtained: "default", placedAt: Date.now() },
    ],
    furniture: [
      { itemId: "terminal_personal", slot: "desk_center", obtained: "default", placedAt: Date.now() },
    ],
    lighting: "void",
    displayCase: [],
    companionGifts: [],
    musicBox: "music_void_ambient",
    floorDecor: [],
    ceilingDecor: [],
    lastModified: Date.now(),
  };
}

/**
 * Get available companions who can visit based on trust levels.
 */
export function getVisitingCompanions(
  elaraTrust: number,
  humanTrust: number,
  npcTrust: Record<string, number>,
): CompanionVisitConfig[] {
  const trustMap: Record<string, number> = {
    elara: elaraTrust,
    the_human: humanTrust,
    ...npcTrust,
  };
  return COMPANION_VISITS.filter(c => (trustMap[c.companionId] ?? 0) >= c.minTrust);
}

/**
 * Get a cabin item definition by ID.
 */
export function getCabinItem(itemId: string): CabinItem | undefined {
  return CABIN_ITEMS.find(i => i.id === itemId);
}

/**
 * Get all items for a specific slot category.
 */
export function getItemsBySlot(slot: ItemSlotCategory): CabinItem[] {
  return CABIN_ITEMS.filter(i => i.slot === slot);
}

/**
 * Validate a cabin layout — ensure no duplicate slots and all items exist.
 */
export function validateLayout(layout: CabinLayout): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const usedSlots = new Set<string>();

  const allPlacements = [...layout.wallDecor, ...layout.furniture, ...layout.floorDecor, ...layout.ceilingDecor];
  for (const placed of allPlacements) {
    if (usedSlots.has(placed.slot)) {
      errors.push(`Duplicate slot: ${placed.slot}`);
    }
    usedSlots.add(placed.slot);

    if (!getCabinItem(placed.itemId)) {
      errors.push(`Unknown item: ${placed.itemId}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
