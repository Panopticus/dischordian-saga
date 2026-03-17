/* ═══════════════════════════════════════════════════════
   CHARACTER MODEL 3D — Anime Billboard Sprite System
   Uses actual character artwork as textured billboard sprites
   in the 3D scene for AAA-quality anime visuals.
   Each character loads their artwork image as a texture
   and animates through transform manipulation.
   ═══════════════════════════════════════════════════════ */
import * as THREE from "three";

/* ─── CHARACTER VISUAL CONFIG ─── */
export interface CharacterConfig {
  id: string;
  name: string;
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  eyeColor: string;
  skinColor: string;
  // Body proportions (relative scale)
  height: number;       // total height in world units
  bulk: number;         // 0.7=slim, 1.0=normal, 1.3=heavy
  // Equipment
  helmetStyle: "none" | "visor" | "crown" | "hood" | "mask" | "horns" | "halo";
  armorStyle: "light" | "medium" | "heavy" | "robes" | "tech";
  weaponType: "none" | "sword" | "staff" | "claws" | "dual-blades" | "hammer" | "scythe" | "chains" | "gauntlets" | "orb";
  hasCape: boolean;
  glowColor: string;
  // Fighting style for AI
  fightStyle: "aggressive" | "defensive" | "evasive" | "balanced";
  // Image URL for billboard sprite
  imageUrl?: string;
}

/* ─── BONE NAMES (kept for compatibility) ─── */
export const BONES = {
  ROOT: "root",
  SPINE: "spine",
  CHEST: "chest",
  NECK: "neck",
  HEAD: "head",
  L_SHOULDER: "l_shoulder",
  L_UPPER_ARM: "l_upper_arm",
  L_LOWER_ARM: "l_lower_arm",
  L_HAND: "l_hand",
  R_SHOULDER: "r_shoulder",
  R_UPPER_ARM: "r_upper_arm",
  R_LOWER_ARM: "r_lower_arm",
  R_HAND: "r_hand",
  L_UPPER_LEG: "l_upper_leg",
  L_LOWER_LEG: "l_lower_leg",
  L_FOOT: "l_foot",
  R_UPPER_LEG: "r_upper_leg",
  R_LOWER_LEG: "r_lower_leg",
  R_FOOT: "r_foot",
} as const;

/* ─── CHARACTER CONFIGS FOR ALL FIGHTERS ─── */
export const CHARACTER_CONFIGS: Record<string, CharacterConfig> = {
  "architect": {
    id: "architect", name: "The Architect",
    primaryColor: "#1a0a00", secondaryColor: "#0a0a0f", accentColor: "#ff8c00",
    eyeColor: "#ffaa00", skinColor: "#1a1a1a",
    height: 2.0, bulk: 1.15,
    helmetStyle: "crown", armorStyle: "heavy", weaponType: "orb",
    hasCape: true, glowColor: "#ff8c00",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_architect_112e44c3.png",
  },
  "collector": {
    id: "collector", name: "The Collector",
    primaryColor: "#4a1a8a", secondaryColor: "#1a0033", accentColor: "#c084fc",
    eyeColor: "#a855f7", skinColor: "#2a1a3a",
    height: 1.85, bulk: 0.9,
    helmetStyle: "hood", armorStyle: "robes", weaponType: "staff",
    hasCape: true, glowColor: "#a855f7",
    fightStyle: "defensive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_collector_b186a524.png",
  },
  "enigma": {
    id: "enigma", name: "The Enigma",
    primaryColor: "#2a0050", secondaryColor: "#001a2e", accentColor: "#9945ff",
    eyeColor: "#22d3ee", skinColor: "#3a2020",
    height: 1.75, bulk: 0.85,
    helmetStyle: "none", armorStyle: "light", weaponType: "dual-blades",
    hasCape: false, glowColor: "#9945ff",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_enigma_cdfd92b5.png",
  },
  "warlord": {
    id: "warlord", name: "The Warlord",
    primaryColor: "#8a5a00", secondaryColor: "#1a0f00", accentColor: "#fbbf24",
    eyeColor: "#f59e0b", skinColor: "#3a2a1a",
    height: 2.1, bulk: 1.3,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "hammer",
    hasCape: false, glowColor: "#f59e0b",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_warlord_c8a0631b.png",
  },
  "necromancer": {
    id: "necromancer", name: "The Necromancer",
    primaryColor: "#1a4a1a", secondaryColor: "#0a1a0a", accentColor: "#4ade80",
    eyeColor: "#22c55e", skinColor: "#1a2a1a",
    height: 1.9, bulk: 0.95,
    helmetStyle: "hood", armorStyle: "robes", weaponType: "staff",
    hasCape: true, glowColor: "#22c55e",
    fightStyle: "defensive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_necromancer_19def768.png",
  },
  "meme": {
    id: "meme", name: "The Meme",
    primaryColor: "#6a1a6a", secondaryColor: "#2a002a", accentColor: "#f472b6",
    eyeColor: "#ec4899", skinColor: "#2a1a2a",
    height: 1.7, bulk: 0.8,
    helmetStyle: "mask", armorStyle: "light", weaponType: "claws",
    hasCape: false, glowColor: "#ec4899",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_meme_7e48e410.png",
  },
  "shadow-tongue": {
    id: "shadow-tongue", name: "Shadow Tongue",
    primaryColor: "#1a1a2a", secondaryColor: "#0a0a1a", accentColor: "#6366f1",
    eyeColor: "#818cf8", skinColor: "#1a1a2a",
    height: 1.8, bulk: 0.85,
    helmetStyle: "mask", armorStyle: "light", weaponType: "dual-blades",
    hasCape: true, glowColor: "#6366f1",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/007_the_shadow_tongue_dd8299da.png",
  },
  "watcher": {
    id: "watcher", name: "The Watcher",
    primaryColor: "#1a3a5a", secondaryColor: "#0a1a3a", accentColor: "#60a5fa",
    eyeColor: "#3b82f6", skinColor: "#1a2a3a",
    height: 1.95, bulk: 1.0,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "none",
    hasCape: false, glowColor: "#3b82f6",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_watcher_5fc20ca2.png",
  },
  "game-master": {
    id: "game-master", name: "The Game Master",
    primaryColor: "#5a1a3a", secondaryColor: "#2a0a1a", accentColor: "#fb923c",
    eyeColor: "#f97316", skinColor: "#2a1a1a",
    height: 1.85, bulk: 1.0,
    helmetStyle: "none", armorStyle: "medium", weaponType: "none",
    hasCape: true, glowColor: "#f97316",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/017_the_game_master_e5ceb4cc.png",
  },
  "authority": {
    id: "authority", name: "The Authority",
    primaryColor: "#3a3a3a", secondaryColor: "#1a1a1a", accentColor: "#e5e5e5",
    eyeColor: "#ffffff", skinColor: "#2a2a2a",
    height: 2.05, bulk: 1.2,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "gauntlets",
    hasCape: true, glowColor: "#e5e5e5",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_authority_c03da69b.png",
  },
  "source": {
    id: "source", name: "The Source",
    primaryColor: "#4a4a00", secondaryColor: "#1a1a00", accentColor: "#facc15",
    eyeColor: "#eab308", skinColor: "#2a2a1a",
    height: 2.0, bulk: 1.1,
    helmetStyle: "halo", armorStyle: "robes", weaponType: "orb",
    hasCape: true, glowColor: "#eab308",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_source_6bcf173a.png",
  },
  "jailer": {
    id: "jailer", name: "The Jailer",
    primaryColor: "#4a2a1a", secondaryColor: "#1a0a00", accentColor: "#a16207",
    eyeColor: "#ca8a04", skinColor: "#3a2a1a",
    height: 2.15, bulk: 1.35,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "chains",
    hasCape: false, glowColor: "#ca8a04",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_jailer_3f88a56e.png",
  },
  "host": {
    id: "host", name: "The Host",
    primaryColor: "#2a4a5a", secondaryColor: "#0a2a3a", accentColor: "#67e8f9",
    eyeColor: "#06b6d4", skinColor: "#1a3a4a",
    height: 1.8, bulk: 0.9,
    helmetStyle: "none", armorStyle: "tech", weaponType: "none",
    hasCape: false, glowColor: "#06b6d4",
    fightStyle: "defensive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_host_a8b29b53.png",
  },
  "iron-lion": {
    id: "iron-lion", name: "Iron Lion",
    primaryColor: "#5a5a5a", secondaryColor: "#2a2a2a", accentColor: "#fbbf24",
    eyeColor: "#f59e0b", skinColor: "#4a4a4a",
    height: 2.2, bulk: 1.4,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "gauntlets",
    hasCape: false, glowColor: "#fbbf24",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/012_iron_lion_4bc7731f.png",
  },
  "oracle": {
    id: "oracle", name: "The Oracle",
    primaryColor: "#1a1a5a", secondaryColor: "#0a0a3a", accentColor: "#c4b5fd",
    eyeColor: "#a78bfa", skinColor: "#1a1a3a",
    height: 1.75, bulk: 0.8,
    helmetStyle: "halo", armorStyle: "robes", weaponType: "orb",
    hasCape: true, glowColor: "#a78bfa",
    fightStyle: "defensive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_oracle_ed065bf8.png",
  },
  "agent-zero": {
    id: "agent-zero", name: "Agent Zero",
    primaryColor: "#1a1a1a", secondaryColor: "#0a0a0a", accentColor: "#ef4444",
    eyeColor: "#dc2626", skinColor: "#2a2a2a",
    height: 1.8, bulk: 0.9,
    helmetStyle: "mask", armorStyle: "light", weaponType: "dual-blades",
    hasCape: false, glowColor: "#dc2626",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/013_agent_zero_56b59bd8.png",
  },
  "engineer": {
    id: "engineer", name: "The Engineer",
    primaryColor: "#2a4a2a", secondaryColor: "#0a2a0a", accentColor: "#86efac",
    eyeColor: "#4ade80", skinColor: "#2a3a2a",
    height: 1.85, bulk: 1.0,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "gauntlets",
    hasCape: false, glowColor: "#4ade80",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_engineer_d136fa7e.png",
  },
  "eyes": {
    id: "eyes", name: "The Eyes",
    primaryColor: "#2a2a4a", secondaryColor: "#0a0a2a", accentColor: "#93c5fd",
    eyeColor: "#60a5fa", skinColor: "#1a1a3a",
    height: 1.7, bulk: 0.75,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "none",
    hasCape: false, glowColor: "#60a5fa",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_eyes_b09d565b.png",
  },
  "akai-shi": {
    id: "akai-shi", name: "Akai Shi",
    primaryColor: "#8b0000", secondaryColor: "#2a0000", accentColor: "#ff6b6b",
    eyeColor: "#ff0000", skinColor: "#3a1a1a",
    height: 1.8, bulk: 0.9,
    helmetStyle: "mask", armorStyle: "light", weaponType: "sword",
    hasCape: false, glowColor: "#ff0000",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/057_akai_shi_603ea11d.png",
  },
  "wraith-calder": {
    id: "wraith-calder", name: "Wraith Calder",
    primaryColor: "#2a2a3a", secondaryColor: "#0a0a1a", accentColor: "#a5b4fc",
    eyeColor: "#818cf8", skinColor: "#1a1a2a",
    height: 1.85, bulk: 0.85,
    helmetStyle: "hood", armorStyle: "light", weaponType: "scythe",
    hasCape: true, glowColor: "#818cf8",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/059_wraith_calder_2b6b0a6e.png",
  },
  "wolf": {
    id: "wolf", name: "The Wolf",
    primaryColor: "#4a3a2a", secondaryColor: "#1a1a0a", accentColor: "#fb923c",
    eyeColor: "#f97316", skinColor: "#3a2a1a",
    height: 1.95, bulk: 1.15,
    helmetStyle: "none", armorStyle: "medium", weaponType: "claws",
    hasCape: false, glowColor: "#f97316",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_wolf_217e2a67.png",
  },
  // Ne-Yons
  "dreamer": {
    id: "dreamer", name: "The Dreamer",
    primaryColor: "#3a1a5a", secondaryColor: "#1a0a3a", accentColor: "#d8b4fe",
    eyeColor: "#c084fc", skinColor: "#2a1a3a",
    height: 1.7, bulk: 0.8,
    helmetStyle: "none", armorStyle: "robes", weaponType: "orb",
    hasCape: true, glowColor: "#c084fc",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_dreamer_d31b6f9d.png",
  },
  "judge": {
    id: "judge", name: "The Judge",
    primaryColor: "#3a3a1a", secondaryColor: "#1a1a0a", accentColor: "#fde047",
    eyeColor: "#eab308", skinColor: "#2a2a1a",
    height: 2.0, bulk: 1.15,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "hammer",
    hasCape: true, glowColor: "#eab308",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_judge_3bf3afc0.png",
  },
  "inventor": {
    id: "inventor", name: "The Inventor",
    primaryColor: "#1a3a3a", secondaryColor: "#0a1a1a", accentColor: "#5eead4",
    eyeColor: "#2dd4bf", skinColor: "#1a2a2a",
    height: 1.8, bulk: 0.95,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "gauntlets",
    hasCape: false, glowColor: "#2dd4bf",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_inventor_3a8fbc14.png",
  },
  "seer": {
    id: "seer", name: "The Seer",
    primaryColor: "#1a3a4a", secondaryColor: "#0a1a2a", accentColor: "#67e8f9",
    eyeColor: "#22d3ee", skinColor: "#1a2a3a",
    height: 1.75, bulk: 0.8,
    helmetStyle: "none", armorStyle: "light", weaponType: "orb",
    hasCape: false, glowColor: "#22d3ee",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_seer_410f778d.png",
  },
  "knowledge": {
    id: "knowledge", name: "The Knowledge",
    primaryColor: "#1a3a2a", secondaryColor: "#0a1a0a", accentColor: "#34d399",
    eyeColor: "#10b981", skinColor: "#1a2a1a",
    height: 1.85, bulk: 0.9,
    helmetStyle: "none", armorStyle: "robes", weaponType: "orb",
    hasCape: true, glowColor: "#34d399",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_knowledge_ffa95ea0.png",
  },
  "silence": {
    id: "silence", name: "The Silence",
    primaryColor: "#2a2a3a", secondaryColor: "#0a0a1a", accentColor: "#94a3b8",
    eyeColor: "#64748b", skinColor: "#1a1a2a",
    height: 1.8, bulk: 0.85,
    helmetStyle: "hood", armorStyle: "robes", weaponType: "none",
    hasCape: true, glowColor: "#94a3b8",
    fightStyle: "defensive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_silence_a2503cd2.png",
  },
  "storm": {
    id: "storm", name: "The Storm",
    primaryColor: "#1a2a4a", secondaryColor: "#0a0a2a", accentColor: "#60a5fa",
    eyeColor: "#3b82f6", skinColor: "#1a1a3a",
    height: 1.9, bulk: 1.0,
    helmetStyle: "none", armorStyle: "medium", weaponType: "gauntlets",
    hasCape: false, glowColor: "#60a5fa",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_storm_56ab8f6d.png",
  },
  "degen": {
    id: "degen", name: "The Degen",
    primaryColor: "#3a2a1a", secondaryColor: "#1a0a00", accentColor: "#fb923c",
    eyeColor: "#f97316", skinColor: "#2a1a0a",
    height: 1.75, bulk: 0.85,
    helmetStyle: "none", armorStyle: "light", weaponType: "none",
    hasCape: false, glowColor: "#fb923c",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_degen_5dc9101e.png",
  },
  "advocate": {
    id: "advocate", name: "The Advocate",
    primaryColor: "#3a3a1a", secondaryColor: "#1a1a00", accentColor: "#fcd34d",
    eyeColor: "#eab308", skinColor: "#2a2a1a",
    height: 1.8, bulk: 0.9,
    helmetStyle: "none", armorStyle: "medium", weaponType: "none",
    hasCape: false, glowColor: "#fcd34d",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_advocate_873d8277.png",
  },
  "forgotten": {
    id: "forgotten", name: "The Forgotten",
    primaryColor: "#2a2a2a", secondaryColor: "#0a0a0a", accentColor: "#94a3b8",
    eyeColor: "#64748b", skinColor: "#1a1a1a",
    height: 1.8, bulk: 0.85,
    helmetStyle: "hood", armorStyle: "light", weaponType: "none",
    hasCape: true, glowColor: "#94a3b8",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_forgotten_327e7019.png",
  },
  "resurrectionist": {
    id: "resurrectionist", name: "The Resurrectionist",
    primaryColor: "#1a3a1a", secondaryColor: "#0a1a0a", accentColor: "#4ade80",
    eyeColor: "#22c55e", skinColor: "#1a2a1a",
    height: 1.85, bulk: 0.9,
    helmetStyle: "none", armorStyle: "robes", weaponType: "staff",
    hasCape: true, glowColor: "#4ade80",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_resurrectionist_e790c330.png",
  },
};

/* ─── GET CONFIG ─── */
export function getCharacterConfig(id: string): CharacterConfig {
  return CHARACTER_CONFIGS[id] || CHARACTER_CONFIGS["architect"];
}

/* ═══════════════════════════════════════════════════════
   CHARACTER MODEL — Billboard Sprite with Anime Artwork
   ═══════════════════════════════════════════════════════ */

/* Proxy mesh — invisible mesh used to satisfy the animation interface */
function createProxyMesh(): THREE.Mesh {
  const geo = new THREE.BoxGeometry(0.001, 0.001, 0.001);
  const mat = new THREE.MeshBasicMaterial({ visible: false });
  const mesh = new THREE.Mesh(geo, mat);
  return mesh;
}

function createProxyGroup(): THREE.Group {
  return new THREE.Group();
}

export interface CharacterModel {
  group: THREE.Group;
  config: CharacterConfig;
  bones: Record<string, THREE.Bone>;
  weapon: THREE.Group | null;
  cape: THREE.Mesh | null;
  // The main sprite plane
  sprite: THREE.Mesh;
  spriteMaterial: THREE.ShaderMaterial;
  // Glow outline mesh
  glowSprite: THREE.Mesh;
  glowMaterial: THREE.ShaderMaterial;
  // Energy particles group
  energyParticles: THREE.Group;
  // Ground shadow
  groundShadow: THREE.Mesh;
  // Part references for animation (proxy objects)
  parts: {
    head: THREE.Group;
    torso: THREE.Group;
    lUpperArm: THREE.Mesh;
    lLowerArm: THREE.Mesh;
    lHand: THREE.Mesh;
    rUpperArm: THREE.Mesh;
    rLowerArm: THREE.Mesh;
    rHand: THREE.Mesh;
    lUpperLeg: THREE.Mesh;
    lLowerLeg: THREE.Mesh;
    lFoot: THREE.Mesh;
    rUpperLeg: THREE.Mesh;
    rLowerLeg: THREE.Mesh;
    rFoot: THREE.Mesh;
  };
}

/* ─── ANIME SPRITE SHADER ─── */
const spriteVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const spriteFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uHitFlash;
  uniform float uSpecialGlow;
  uniform float uBlockTint;
  uniform float uOpacity;
  uniform vec3 uGlowColor;
  uniform float uTime;
  varying vec2 vUv;
  
  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    
    // Discard transparent pixels
    if (tex.a < 0.1) discard;
    
    vec3 color = tex.rgb;
    
    // Hit flash — white flash on damage
    color = mix(color, vec3(1.0, 0.3, 0.2), uHitFlash * 0.7);
    
    // Block tint — blue/white shield effect
    color = mix(color, vec3(0.5, 0.7, 1.0), uBlockTint * 0.4);
    
    // Special glow — character color energy
    float specialPulse = uSpecialGlow * (0.5 + 0.5 * sin(uTime * 8.0));
    color = mix(color, uGlowColor, specialPulse * 0.6);
    color += uGlowColor * specialPulse * 0.3;
    
    gl_FragColor = vec4(color, tex.a * uOpacity);
  }
`;

/* ─── GLOW OUTLINE SHADER ─── */
const glowVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec3 uGlowColor;
  uniform float uGlowIntensity;
  uniform float uTime;
  varying vec2 vUv;
  
  void main() {
    // Sample surrounding pixels to create outline
    float alpha = 0.0;
    float spread = 0.008;
    for (int i = -2; i <= 2; i++) {
      for (int j = -2; j <= 2; j++) {
        if (i == 0 && j == 0) continue;
        vec2 offset = vec2(float(i), float(j)) * spread;
        alpha += texture2D(uTexture, vUv + offset).a;
      }
    }
    alpha = clamp(alpha / 8.0, 0.0, 1.0);
    
    // Subtract the original shape to get just the outline
    float originalAlpha = texture2D(uTexture, vUv).a;
    float outline = alpha * (1.0 - originalAlpha);
    
    // Pulse effect
    float pulse = 0.6 + 0.4 * sin(uTime * 3.0);
    
    gl_FragColor = vec4(uGlowColor, outline * uGlowIntensity * pulse);
  }
`;

/* ─── TEXTURE LOADER ─── */
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "anonymous";

// Cache textures
const textureCache = new Map<string, THREE.Texture>();

function loadCharacterTexture(url: string): THREE.Texture {
  if (textureCache.has(url)) return textureCache.get(url)!;
  
  const texture = textureLoader.load(url);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(url, texture);
  return texture;
}

/* ─── CREATE ENERGY PARTICLES ─── */
function createEnergyParticles(config: CharacterConfig, height: number): THREE.Group {
  const group = new THREE.Group();
  const color = new THREE.Color(config.glowColor);
  // Brighter version of the glow color for inner particles
  const brightColor = color.clone().multiplyScalar(1.5);
  
  for (let i = 0; i < 16; i++) {
    const size = 0.03 + Math.random() * 0.04;
    const geo = new THREE.SphereGeometry(size, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: i % 3 === 0 ? brightColor : color,
      transparent: true,
      opacity: 0.85,
    });
    const particle = new THREE.Mesh(geo, mat);
    
    // Random orbit position — tighter around the character
    const angle = (i / 16) * Math.PI * 2;
    const radius = 0.3 + Math.random() * 0.25;
    particle.position.set(
      Math.cos(angle) * radius,
      Math.random() * height * 0.8 + height * 0.1,
      Math.sin(angle) * radius * 0.3 + 0.1
    );
    particle.userData.angle = angle;
    particle.userData.radius = radius;
    particle.userData.speed = 0.5 + Math.random() * 1.5;
    particle.userData.yBase = particle.position.y;
    
    group.add(particle);
  }
  
  return group;
}

/* ═══════════════════════════════════════════════════════
   BUILD CHARACTER MODEL — Billboard Sprite Version
   ═══════════════════════════════════════════════════════ */
export function buildCharacterModel(id: string): CharacterModel {
  const config = getCharacterConfig(id);
  const spriteHeight = config.height * 0.8; // Slightly taller sprite for presence
  const spriteWidth = spriteHeight * 0.5; // Narrow portrait ratio — prevents edge clipping
  
  const group = new THREE.Group();
  group.name = `fighter_${id}`;
  
  // ── Load character texture ──
  const imageUrl = config.imageUrl || "";
  const texture = imageUrl ? loadCharacterTexture(imageUrl) : null;
  
  // ── Main sprite plane ──
  const spriteGeo = new THREE.PlaneGeometry(spriteWidth, spriteHeight);
  const spriteMaterial = new THREE.ShaderMaterial({
    vertexShader: spriteVertexShader,
    fragmentShader: spriteFragmentShader,
    uniforms: {
      uTexture: { value: texture || new THREE.Texture() },
      uHitFlash: { value: 0.0 },
      uSpecialGlow: { value: 0.0 },
      uBlockTint: { value: 0.0 },
      uOpacity: { value: 1.0 },
      uGlowColor: { value: new THREE.Color(config.glowColor) },
      uTime: { value: 0.0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  
  const sprite = new THREE.Mesh(spriteGeo, spriteMaterial);
  sprite.position.y = spriteHeight / 2 - 0.1; // Feet touching ground level
  sprite.renderOrder = 10;
  group.add(sprite);
  
  // ── Glow outline ──
  const glowGeo = new THREE.PlaneGeometry(spriteWidth * 1.08, spriteHeight * 1.08);
  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    uniforms: {
      uTexture: { value: texture || new THREE.Texture() },
      uGlowColor: { value: new THREE.Color(config.glowColor) },
      uGlowIntensity: { value: 0.8 },
      uTime: { value: 0.0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  
  const glowSprite = new THREE.Mesh(glowGeo, glowMaterial);
  glowSprite.position.y = spriteHeight / 2 - 0.1;
  glowSprite.position.z = -0.01; // Slightly behind main sprite
  glowSprite.renderOrder = 9;
  group.add(glowSprite);
  
  // ── Energy particles ──
  const energyParticles = createEnergyParticles(config, spriteHeight);
  group.add(energyParticles);
  
  // ── Ground shadow (ellipse) ──
  const shadowGeo = new THREE.CircleGeometry(spriteWidth * 0.4, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
  });
  const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.y = 0.02;
  groundShadow.scale.set(1, 0.5, 1); // Elliptical
  groundShadow.renderOrder = 1;
  group.add(groundShadow);
  
  // ── Proxy parts for animation system compatibility ──
  const head = createProxyGroup();
  const torso = createProxyGroup();
  const lUpperArm = createProxyMesh();
  const lLowerArm = createProxyMesh();
  const lHand = createProxyMesh();
  const rUpperArm = createProxyMesh();
  const rLowerArm = createProxyMesh();
  const rHand = createProxyMesh();
  const lUpperLeg = createProxyMesh();
  const lLowerLeg = createProxyMesh();
  const lFoot = createProxyMesh();
  const rUpperLeg = createProxyMesh();
  const rLowerLeg = createProxyMesh();
  const rFoot = createProxyMesh();
  
  // Set default positions to match expected values
  const s = config.height / 2.0;
  head.position.set(0, 1.55 * s, 0);
  torso.position.set(0, 1.2 * s, 0);
  lUpperArm.position.set(-0.2 * s, 1.35 * s, 0);
  lLowerArm.position.set(-0.2 * s, 1.05 * s, 0);
  lHand.position.set(-0.2 * s, 0.82 * s, 0);
  rUpperArm.position.set(0.2 * s, 1.35 * s, 0);
  rLowerArm.position.set(0.2 * s, 1.05 * s, 0);
  rHand.position.set(0.2 * s, 0.82 * s, 0);
  lUpperLeg.position.set(-0.08 * s, 0.85 * s, 0);
  lLowerLeg.position.set(-0.08 * s, 0.5 * s, 0);
  lFoot.position.set(-0.08 * s, 0.2 * s, 0);
  rUpperLeg.position.set(0.08 * s, 0.85 * s, 0);
  rLowerLeg.position.set(0.08 * s, 0.5 * s, 0);
  rFoot.position.set(0.08 * s, 0.2 * s, 0);
  
  return {
    group,
    config,
    bones: {},
    weapon: null,
    cape: null,
    sprite,
    spriteMaterial,
    glowSprite,
    glowMaterial,
    energyParticles,
    groundShadow,
    parts: {
      head, torso,
      lUpperArm, lLowerArm, lHand,
      rUpperArm, rLowerArm, rHand,
      lUpperLeg, lLowerLeg, lFoot,
      rUpperLeg, rLowerLeg, rFoot,
    },
  };
}
