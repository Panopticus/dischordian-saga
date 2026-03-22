/**
 * PREMIUM COSMETIC SHOP
 * ══════════════════════════════════════════════════════════
 * Card art variants, skins, theme packs, pricing.
 * Purchased with Dreams (in-game currency).
 */

export type CosmeticType = "card_art" | "avatar_frame" | "title" | "theme_pack" | "emote" | "trail_effect" | "board_skin" | "tower_skin";
export type CosmeticRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export interface CosmeticItem {
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: CosmeticType;
  rarity: CosmeticRarity;
  /** Cost in Dreams */
  price: number;
  /** Sale price (optional) */
  salePrice?: number;
  /** Preview image key */
  previewKey?: string;
  /** Limited edition */
  limited: boolean;
  /** Required prestige class */
  requiredPrestige?: string;
  /** Required level */
  requiredLevel?: number;
}

export const COSMETIC_ITEMS: CosmeticItem[] = [
  // ── CARD ART VARIANTS ──
  { key: "architect_gold", name: "The Architect (Gold)", description: "Golden variant of The Architect card", icon: "Sparkles", color: "#fbbf24", type: "card_art", rarity: "epic", price: 200, limited: false },
  { key: "enigma_holographic", name: "The Enigma (Holographic)", description: "Holographic variant of The Enigma card", icon: "Sparkles", color: "#8b5cf6", type: "card_art", rarity: "legendary", price: 500, limited: true },
  { key: "iron_lion_chromatic", name: "Iron Lion (Chromatic)", description: "Color-shifting Iron Lion card", icon: "Sparkles", color: "#f97316", type: "card_art", rarity: "epic", price: 250, limited: false },
  { key: "necromancer_shadow", name: "The Necromancer (Shadow)", description: "Shadow-infused Necromancer card art", icon: "Sparkles", color: "#1e1b4b", type: "card_art", rarity: "rare", price: 150, limited: false },
  { key: "oracle_celestial", name: "The Oracle (Celestial)", description: "Celestial variant of The Oracle card", icon: "Sparkles", color: "#0ea5e9", type: "card_art", rarity: "epic", price: 200, limited: false },

  // ── AVATAR FRAMES ──
  { key: "frame_fire", name: "Inferno Frame", description: "Burning avatar frame", icon: "Flame", color: "#ef4444", type: "avatar_frame", rarity: "rare", price: 100, limited: false },
  { key: "frame_void", name: "Void Frame", description: "Dark energy avatar frame", icon: "Circle", color: "#6d28d9", type: "avatar_frame", rarity: "epic", price: 200, limited: false },
  { key: "frame_chrono", name: "Chrono Frame", description: "Time-warped avatar frame", icon: "Timer", color: "#0ea5e9", type: "avatar_frame", rarity: "epic", price: 200, limited: false, requiredPrestige: "chronomancer" },
  { key: "frame_champion", name: "Champion Frame", description: "For league champions only", icon: "Crown", color: "#fbbf24", type: "avatar_frame", rarity: "legendary", price: 500, limited: true },
  { key: "frame_shadow", name: "Shadow Broker Frame", description: "Frame of the shadow broker", icon: "Moon", color: "#1e1b4b", type: "avatar_frame", rarity: "legendary", price: 400, limited: false, requiredPrestige: "shadow_broker" },

  // ── TITLES ──
  { key: "title_legend", name: "The Legend", description: "Display 'The Legend' title", icon: "Award", color: "#fbbf24", type: "title", rarity: "legendary", price: 300, limited: false, requiredLevel: 20 },
  { key: "title_phantom", name: "The Phantom", description: "Display 'The Phantom' title", icon: "Ghost", color: "#6d28d9", type: "title", rarity: "epic", price: 150, limited: false },
  { key: "title_architect", name: "Master Architect", description: "Display 'Master Architect' title", icon: "Building", color: "#f59e0b", type: "title", rarity: "rare", price: 100, limited: false },
  { key: "title_void_walker", name: "Void Walker", description: "Display 'Void Walker' title", icon: "Zap", color: "#8b5cf6", type: "title", rarity: "epic", price: 175, limited: false },

  // ── THEME PACKS ──
  { key: "theme_neon", name: "Neon Cyberpunk Theme", description: "Neon-soaked cyberpunk UI theme", icon: "Palette", color: "#f472b6", type: "theme_pack", rarity: "epic", price: 350, limited: false },
  { key: "theme_ancient", name: "Ancient Ruins Theme", description: "Stone and moss UI theme", icon: "Palette", color: "#92400e", type: "theme_pack", rarity: "rare", price: 200, limited: false },
  { key: "theme_void", name: "Void Dimension Theme", description: "Dark void UI theme", icon: "Palette", color: "#1e1b4b", type: "theme_pack", rarity: "legendary", price: 500, limited: true },
  { key: "theme_celestial", name: "Celestial Theme", description: "Starlit celestial UI theme", icon: "Palette", color: "#6366f1", type: "theme_pack", rarity: "epic", price: 300, limited: false },

  // ── EMOTES ──
  { key: "emote_gg", name: "GG Emote", description: "Good game!", icon: "ThumbsUp", color: "#22c55e", type: "emote", rarity: "common", price: 25, limited: false },
  { key: "emote_rage", name: "Rage Emote", description: "Express your frustration", icon: "Angry", color: "#ef4444", type: "emote", rarity: "common", price: 25, limited: false },
  { key: "emote_mind_blown", name: "Mind Blown", description: "When the play is incredible", icon: "Brain", color: "#f59e0b", type: "emote", rarity: "rare", price: 75, limited: false },
  { key: "emote_slow_clap", name: "Slow Clap", description: "Sarcastic applause", icon: "Hand", color: "#78716c", type: "emote", rarity: "rare", price: 75, limited: false },

  // ── TRAIL EFFECTS ──
  { key: "trail_fire", name: "Fire Trail", description: "Leave flames in your wake", icon: "Flame", color: "#ef4444", type: "trail_effect", rarity: "epic", price: 250, limited: false },
  { key: "trail_shadow", name: "Shadow Trail", description: "Darkness follows you", icon: "Moon", color: "#6d28d9", type: "trail_effect", rarity: "epic", price: 250, limited: false },
  { key: "trail_sparkle", name: "Sparkle Trail", description: "Glittering particles", icon: "Sparkles", color: "#fbbf24", type: "trail_effect", rarity: "rare", price: 150, limited: false },

  // ── BOARD SKINS ──
  { key: "board_lava", name: "Lava Board", description: "Chess/card board with lava theme", icon: "Flame", color: "#ef4444", type: "board_skin", rarity: "rare", price: 125, limited: false },
  { key: "board_ice", name: "Ice Board", description: "Frozen crystal board", icon: "Snowflake", color: "#38bdf8", type: "board_skin", rarity: "rare", price: 125, limited: false },
  { key: "board_void", name: "Void Board", description: "Board floating in the void", icon: "Circle", color: "#6d28d9", type: "board_skin", rarity: "epic", price: 200, limited: false },

  // ── TOWER SKINS ──
  { key: "tower_crystal", name: "Crystal Towers", description: "Towers made of pure crystal", icon: "Diamond", color: "#38bdf8", type: "tower_skin", rarity: "epic", price: 300, limited: false },
  { key: "tower_shadow", name: "Shadow Towers", description: "Dark energy towers", icon: "Moon", color: "#1e1b4b", type: "tower_skin", rarity: "epic", price: 300, limited: false },
];

export const COSMETIC_TYPE_LABELS: Record<CosmeticType, string> = {
  card_art: "Card Art",
  avatar_frame: "Avatar Frame",
  title: "Title",
  theme_pack: "Theme Pack",
  emote: "Emote",
  trail_effect: "Trail Effect",
  board_skin: "Board Skin",
  tower_skin: "Tower Skin",
};

export function getShopItems(opts: {
  prestigeClass?: string;
  citizenLevel?: number;
}): CosmeticItem[] {
  return COSMETIC_ITEMS.filter(item => {
    if (item.requiredPrestige && item.requiredPrestige !== opts.prestigeClass) return false;
    if (item.requiredLevel && (opts.citizenLevel || 0) < item.requiredLevel) return false;
    return true;
  });
}
