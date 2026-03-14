/* ═══════════════════════════════════════════════════════
   CHARACTER MODEL 3D — Procedural Humanoid Fighter Models
   Built from geometric primitives with skeletal animation.
   Each character has unique colors, proportions, armor,
   and weapons based on their lore.
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
}

/* ─── BONE NAMES ─── */
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
    primaryColor: "#8b1a1a", secondaryColor: "#1a0000", accentColor: "#ff4444",
    eyeColor: "#ff0000", skinColor: "#2a1a1a",
    height: 2.0, bulk: 1.15,
    helmetStyle: "crown", armorStyle: "heavy", weaponType: "orb",
    hasCape: true, glowColor: "#ef4444",
    fightStyle: "balanced",
  },
  "collector": {
    id: "collector", name: "The Collector",
    primaryColor: "#4a1a8a", secondaryColor: "#1a0033", accentColor: "#c084fc",
    eyeColor: "#a855f7", skinColor: "#2a1a3a",
    height: 1.85, bulk: 0.9,
    helmetStyle: "hood", armorStyle: "robes", weaponType: "staff",
    hasCape: true, glowColor: "#a855f7",
    fightStyle: "defensive",
  },
  "enigma": {
    id: "enigma", name: "The Enigma",
    primaryColor: "#0e5e6e", secondaryColor: "#001a2e", accentColor: "#22d3ee",
    eyeColor: "#22d3ee", skinColor: "#1a2a3a",
    height: 1.75, bulk: 0.85,
    helmetStyle: "none", armorStyle: "light", weaponType: "dual-blades",
    hasCape: false, glowColor: "#22d3ee",
    fightStyle: "evasive",
  },
  "warlord": {
    id: "warlord", name: "The Warlord",
    primaryColor: "#8a5a00", secondaryColor: "#1a0f00", accentColor: "#fbbf24",
    eyeColor: "#f59e0b", skinColor: "#3a2a1a",
    height: 2.1, bulk: 1.3,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "hammer",
    hasCape: false, glowColor: "#f59e0b",
    fightStyle: "aggressive",
  },
  "necromancer": {
    id: "necromancer", name: "The Necromancer",
    primaryColor: "#1a4a1a", secondaryColor: "#0a1a0a", accentColor: "#4ade80",
    eyeColor: "#22c55e", skinColor: "#1a2a1a",
    height: 1.9, bulk: 0.95,
    helmetStyle: "hood", armorStyle: "robes", weaponType: "staff",
    hasCape: true, glowColor: "#22c55e",
    fightStyle: "defensive",
  },
  "meme": {
    id: "meme", name: "The Meme",
    primaryColor: "#6a1a6a", secondaryColor: "#2a002a", accentColor: "#f472b6",
    eyeColor: "#ec4899", skinColor: "#2a1a2a",
    height: 1.7, bulk: 0.8,
    helmetStyle: "mask", armorStyle: "light", weaponType: "claws",
    hasCape: false, glowColor: "#ec4899",
    fightStyle: "evasive",
  },
  "shadow-tongue": {
    id: "shadow-tongue", name: "Shadow Tongue",
    primaryColor: "#1a1a2a", secondaryColor: "#0a0a1a", accentColor: "#6366f1",
    eyeColor: "#818cf8", skinColor: "#1a1a2a",
    height: 1.8, bulk: 0.85,
    helmetStyle: "mask", armorStyle: "light", weaponType: "dual-blades",
    hasCape: true, glowColor: "#6366f1",
    fightStyle: "evasive",
  },
  "watcher": {
    id: "watcher", name: "The Watcher",
    primaryColor: "#1a3a5a", secondaryColor: "#0a1a3a", accentColor: "#60a5fa",
    eyeColor: "#3b82f6", skinColor: "#1a2a3a",
    height: 1.95, bulk: 1.0,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "none",
    hasCape: false, glowColor: "#3b82f6",
    fightStyle: "balanced",
  },
  "game-master": {
    id: "game-master", name: "The Game Master",
    primaryColor: "#5a1a3a", secondaryColor: "#2a0a1a", accentColor: "#fb923c",
    eyeColor: "#f97316", skinColor: "#2a1a1a",
    height: 1.85, bulk: 1.0,
    helmetStyle: "none", armorStyle: "medium", weaponType: "none",
    hasCape: true, glowColor: "#f97316",
    fightStyle: "balanced",
  },
  "authority": {
    id: "authority", name: "The Authority",
    primaryColor: "#3a3a3a", secondaryColor: "#1a1a1a", accentColor: "#e5e5e5",
    eyeColor: "#ffffff", skinColor: "#2a2a2a",
    height: 2.05, bulk: 1.2,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "gauntlets",
    hasCape: true, glowColor: "#e5e5e5",
    fightStyle: "aggressive",
  },
  "source": {
    id: "source", name: "The Source",
    primaryColor: "#4a4a00", secondaryColor: "#1a1a00", accentColor: "#facc15",
    eyeColor: "#eab308", skinColor: "#2a2a1a",
    height: 2.0, bulk: 1.1,
    helmetStyle: "halo", armorStyle: "robes", weaponType: "orb",
    hasCape: true, glowColor: "#eab308",
    fightStyle: "balanced",
  },
  "jailer": {
    id: "jailer", name: "The Jailer",
    primaryColor: "#4a2a1a", secondaryColor: "#1a0a00", accentColor: "#a16207",
    eyeColor: "#ca8a04", skinColor: "#3a2a1a",
    height: 2.15, bulk: 1.35,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "chains",
    hasCape: false, glowColor: "#ca8a04",
    fightStyle: "aggressive",
  },
  "host": {
    id: "host", name: "The Host",
    primaryColor: "#2a4a5a", secondaryColor: "#0a2a3a", accentColor: "#67e8f9",
    eyeColor: "#06b6d4", skinColor: "#1a3a4a",
    height: 1.8, bulk: 0.9,
    helmetStyle: "none", armorStyle: "tech", weaponType: "none",
    hasCape: false, glowColor: "#06b6d4",
    fightStyle: "defensive",
  },
  "iron-lion": {
    id: "iron-lion", name: "Iron Lion",
    primaryColor: "#5a5a5a", secondaryColor: "#2a2a2a", accentColor: "#fbbf24",
    eyeColor: "#f59e0b", skinColor: "#4a4a4a",
    height: 2.2, bulk: 1.4,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "gauntlets",
    hasCape: false, glowColor: "#fbbf24",
    fightStyle: "aggressive",
  },
  "oracle": {
    id: "oracle", name: "The Oracle",
    primaryColor: "#1a1a5a", secondaryColor: "#0a0a3a", accentColor: "#c4b5fd",
    eyeColor: "#a78bfa", skinColor: "#1a1a3a",
    height: 1.75, bulk: 0.8,
    helmetStyle: "halo", armorStyle: "robes", weaponType: "orb",
    hasCape: true, glowColor: "#a78bfa",
    fightStyle: "defensive",
  },
  "agent-zero": {
    id: "agent-zero", name: "Agent Zero",
    primaryColor: "#1a1a1a", secondaryColor: "#0a0a0a", accentColor: "#ef4444",
    eyeColor: "#dc2626", skinColor: "#2a2a2a",
    height: 1.8, bulk: 0.9,
    helmetStyle: "mask", armorStyle: "light", weaponType: "dual-blades",
    hasCape: false, glowColor: "#dc2626",
    fightStyle: "aggressive",
  },
  "engineer": {
    id: "engineer", name: "The Engineer",
    primaryColor: "#2a4a2a", secondaryColor: "#0a2a0a", accentColor: "#86efac",
    eyeColor: "#4ade80", skinColor: "#2a3a2a",
    height: 1.85, bulk: 1.0,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "gauntlets",
    hasCape: false, glowColor: "#4ade80",
    fightStyle: "balanced",
  },
  "eyes": {
    id: "eyes", name: "The Eyes",
    primaryColor: "#2a2a4a", secondaryColor: "#0a0a2a", accentColor: "#93c5fd",
    eyeColor: "#60a5fa", skinColor: "#1a1a3a",
    height: 1.7, bulk: 0.75,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "none",
    hasCape: false, glowColor: "#60a5fa",
    fightStyle: "evasive",
  },
  "akai-shi": {
    id: "akai-shi", name: "Akai Shi",
    primaryColor: "#8b0000", secondaryColor: "#2a0000", accentColor: "#ff6b6b",
    eyeColor: "#ff0000", skinColor: "#3a1a1a",
    height: 1.8, bulk: 0.9,
    helmetStyle: "mask", armorStyle: "light", weaponType: "sword",
    hasCape: false, glowColor: "#ff0000",
    fightStyle: "aggressive",
  },
  "wraith-calder": {
    id: "wraith-calder", name: "Wraith Calder",
    primaryColor: "#2a2a3a", secondaryColor: "#0a0a1a", accentColor: "#a5b4fc",
    eyeColor: "#818cf8", skinColor: "#1a1a2a",
    height: 1.85, bulk: 0.85,
    helmetStyle: "hood", armorStyle: "light", weaponType: "scythe",
    hasCape: true, glowColor: "#818cf8",
    fightStyle: "evasive",
  },
  "wolf": {
    id: "wolf", name: "The Wolf",
    primaryColor: "#4a3a2a", secondaryColor: "#1a1a0a", accentColor: "#fb923c",
    eyeColor: "#f97316", skinColor: "#3a2a1a",
    height: 1.95, bulk: 1.15,
    helmetStyle: "none", armorStyle: "medium", weaponType: "claws",
    hasCape: false, glowColor: "#f97316",
    fightStyle: "aggressive",
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
  },
  "judge": {
    id: "judge", name: "The Judge",
    primaryColor: "#3a3a1a", secondaryColor: "#1a1a0a", accentColor: "#fde047",
    eyeColor: "#eab308", skinColor: "#2a2a1a",
    height: 2.0, bulk: 1.15,
    helmetStyle: "visor", armorStyle: "heavy", weaponType: "hammer",
    hasCape: true, glowColor: "#eab308",
    fightStyle: "balanced",
  },
  "inventor": {
    id: "inventor", name: "The Inventor",
    primaryColor: "#1a3a3a", secondaryColor: "#0a1a1a", accentColor: "#5eead4",
    eyeColor: "#2dd4bf", skinColor: "#1a2a2a",
    height: 1.8, bulk: 0.95,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "gauntlets",
    hasCape: false, glowColor: "#2dd4bf",
    fightStyle: "balanced",
  },
  "seer": {
    id: "seer", name: "The Seer",
    primaryColor: "#1a1a4a", secondaryColor: "#0a0a2a", accentColor: "#a5b4fc",
    eyeColor: "#818cf8", skinColor: "#1a1a3a",
    height: 1.7, bulk: 0.75,
    helmetStyle: "halo", armorStyle: "robes", weaponType: "orb",
    hasCape: true, glowColor: "#818cf8",
    fightStyle: "defensive",
  },
  "knowledge": {
    id: "knowledge", name: "The Knowledge",
    primaryColor: "#2a3a1a", secondaryColor: "#0a1a0a", accentColor: "#bef264",
    eyeColor: "#a3e635", skinColor: "#1a2a1a",
    height: 1.85, bulk: 1.0,
    helmetStyle: "none", armorStyle: "medium", weaponType: "staff",
    hasCape: false, glowColor: "#a3e635",
    fightStyle: "balanced",
  },
  "silence": {
    id: "silence", name: "The Silence",
    primaryColor: "#1a1a1a", secondaryColor: "#0a0a0a", accentColor: "#737373",
    eyeColor: "#525252", skinColor: "#1a1a1a",
    height: 1.8, bulk: 0.85,
    helmetStyle: "hood", armorStyle: "light", weaponType: "dual-blades",
    hasCape: true, glowColor: "#525252",
    fightStyle: "evasive",
  },
  "storm": {
    id: "storm", name: "The Storm",
    primaryColor: "#1a2a4a", secondaryColor: "#0a1a2a", accentColor: "#38bdf8",
    eyeColor: "#0ea5e9", skinColor: "#1a2a3a",
    height: 2.0, bulk: 1.2,
    helmetStyle: "horns", armorStyle: "heavy", weaponType: "hammer",
    hasCape: false, glowColor: "#0ea5e9",
    fightStyle: "aggressive",
  },
  "degen": {
    id: "degen", name: "The Degen",
    primaryColor: "#4a1a1a", secondaryColor: "#2a0a0a", accentColor: "#f87171",
    eyeColor: "#ef4444", skinColor: "#2a1a1a",
    height: 1.75, bulk: 0.85,
    helmetStyle: "none", armorStyle: "light", weaponType: "claws",
    hasCape: false, glowColor: "#ef4444",
    fightStyle: "aggressive",
  },
  "advocate": {
    id: "advocate", name: "The Advocate",
    primaryColor: "#3a3a4a", secondaryColor: "#1a1a2a", accentColor: "#e2e8f0",
    eyeColor: "#cbd5e1", skinColor: "#2a2a3a",
    height: 1.85, bulk: 1.0,
    helmetStyle: "none", armorStyle: "medium", weaponType: "sword",
    hasCape: true, glowColor: "#cbd5e1",
    fightStyle: "balanced",
  },
  "forgotten": {
    id: "forgotten", name: "The Forgotten",
    primaryColor: "#2a2a2a", secondaryColor: "#0a0a0a", accentColor: "#a3a3a3",
    eyeColor: "#737373", skinColor: "#1a1a1a",
    height: 1.8, bulk: 0.9,
    helmetStyle: "hood", armorStyle: "robes", weaponType: "chains",
    hasCape: true, glowColor: "#737373",
    fightStyle: "defensive",
  },
  "resurrectionist": {
    id: "resurrectionist", name: "The Resurrectionist",
    primaryColor: "#1a4a3a", secondaryColor: "#0a2a1a", accentColor: "#6ee7b7",
    eyeColor: "#34d399", skinColor: "#1a3a2a",
    height: 1.9, bulk: 1.0,
    helmetStyle: "halo", armorStyle: "robes", weaponType: "staff",
    hasCape: true, glowColor: "#34d399",
    fightStyle: "balanced",
  },
};

/* ─── DEFAULT CONFIG FOR UNKNOWN CHARACTERS ─── */
const DEFAULT_CONFIG: CharacterConfig = {
  id: "unknown", name: "Unknown",
  primaryColor: "#4a4a4a", secondaryColor: "#1a1a1a", accentColor: "#888888",
  eyeColor: "#ffffff", skinColor: "#2a2a2a",
  height: 1.85, bulk: 1.0,
  helmetStyle: "none", armorStyle: "medium", weaponType: "none",
  hasCape: false, glowColor: "#888888",
  fightStyle: "balanced",
};

export function getCharacterConfig(id: string): CharacterConfig {
  return CHARACTER_CONFIGS[id] || { ...DEFAULT_CONFIG, id, name: id };
}

/* ═══════════════════════════════════════════════════════
   3D MODEL BUILDER — Creates a rigged humanoid from primitives
   ═══════════════════════════════════════════════════════ */

function createMaterial(color: string, emissive?: string, emissiveIntensity = 0.2): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: emissive ? new THREE.Color(emissive) : new THREE.Color(color),
    emissiveIntensity,
    roughness: 0.6,
    metalness: 0.3,
  });
}

function createArmorMaterial(color: string, accent: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(accent),
    emissiveIntensity: 0.15,
    roughness: 0.3,
    metalness: 0.7,
  });
}

function createGlowMaterial(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: 1.5,
    roughness: 0.1,
    metalness: 0.0,
    transparent: true,
    opacity: 0.8,
  });
}

/* ─── BONE HIERARCHY BUILDER ─── */
function createSkeleton(height: number, bulk: number): { bones: THREE.Bone[]; boneMap: Record<string, THREE.Bone> } {
  const s = height / 2.0; // scale factor
  const boneMap: Record<string, THREE.Bone> = {};
  const bones: THREE.Bone[] = [];

  function makeBone(name: string, parent: THREE.Bone | null, pos: THREE.Vector3): THREE.Bone {
    const bone = new THREE.Bone();
    bone.name = name;
    bone.position.copy(pos);
    if (parent) parent.add(bone);
    boneMap[name] = bone;
    bones.push(bone);
    return bone;
  }

  const root = makeBone(BONES.ROOT, null, new THREE.Vector3(0, 0, 0));
  const spine = makeBone(BONES.SPINE, root, new THREE.Vector3(0, 0.5 * s, 0));
  const chest = makeBone(BONES.CHEST, spine, new THREE.Vector3(0, 0.35 * s, 0));
  const neck = makeBone(BONES.NECK, chest, new THREE.Vector3(0, 0.25 * s, 0));
  makeBone(BONES.HEAD, neck, new THREE.Vector3(0, 0.15 * s, 0));

  // Arms
  const lShoulder = makeBone(BONES.L_SHOULDER, chest, new THREE.Vector3(-0.2 * s * bulk, 0.2 * s, 0));
  const lUpperArm = makeBone(BONES.L_UPPER_ARM, lShoulder, new THREE.Vector3(-0.05 * s, -0.02 * s, 0));
  const lLowerArm = makeBone(BONES.L_LOWER_ARM, lUpperArm, new THREE.Vector3(0, -0.25 * s, 0));
  makeBone(BONES.L_HAND, lLowerArm, new THREE.Vector3(0, -0.2 * s, 0));

  const rShoulder = makeBone(BONES.R_SHOULDER, chest, new THREE.Vector3(0.2 * s * bulk, 0.2 * s, 0));
  const rUpperArm = makeBone(BONES.R_UPPER_ARM, rShoulder, new THREE.Vector3(0.05 * s, -0.02 * s, 0));
  const rLowerArm = makeBone(BONES.R_LOWER_ARM, rUpperArm, new THREE.Vector3(0, -0.25 * s, 0));
  makeBone(BONES.R_HAND, rLowerArm, new THREE.Vector3(0, -0.2 * s, 0));

  // Legs
  const lUpperLeg = makeBone(BONES.L_UPPER_LEG, root, new THREE.Vector3(-0.1 * s * bulk, 0.45 * s, 0));
  const lLowerLeg = makeBone(BONES.L_LOWER_LEG, lUpperLeg, new THREE.Vector3(0, -0.3 * s, 0));
  makeBone(BONES.L_FOOT, lLowerLeg, new THREE.Vector3(0, -0.3 * s, 0));

  const rUpperLeg = makeBone(BONES.R_UPPER_LEG, root, new THREE.Vector3(0.1 * s * bulk, 0.45 * s, 0));
  const rLowerLeg = makeBone(BONES.R_LOWER_LEG, rUpperLeg, new THREE.Vector3(0, -0.3 * s, 0));
  makeBone(BONES.R_FOOT, rLowerLeg, new THREE.Vector3(0, -0.3 * s, 0));

  return { bones, boneMap };
}

/* ─── MESH PART BUILDERS ─── */

function createHead(config: CharacterConfig, s: number): THREE.Group {
  const group = new THREE.Group();
  const headGeo = new THREE.SphereGeometry(0.14 * s, 12, 10);
  const headMat = createMaterial(config.skinColor);
  const head = new THREE.Mesh(headGeo, headMat);
  group.add(head);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.025 * s, 8, 6);
  const eyeMat = createGlowMaterial(config.eyeColor);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.05 * s, 0.02 * s, 0.12 * s);
  group.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.05 * s, 0.02 * s, 0.12 * s);
  group.add(rightEye);

  // Helmet/headgear
  switch (config.helmetStyle) {
    case "crown": {
      const crownMat = createArmorMaterial(config.accentColor, config.accentColor);
      const bandGeo = new THREE.TorusGeometry(0.15 * s, 0.015 * s, 8, 16);
      const band = new THREE.Mesh(bandGeo, crownMat);
      band.position.y = 0.08 * s;
      band.rotation.x = Math.PI / 2;
      group.add(band);
      // Crown points
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const pointGeo = new THREE.ConeGeometry(0.02 * s, 0.08 * s, 4);
        const point = new THREE.Mesh(pointGeo, crownMat);
        point.position.set(Math.sin(angle) * 0.15 * s, 0.12 * s, Math.cos(angle) * 0.15 * s);
        group.add(point);
      }
      break;
    }
    case "visor": {
      const visorMat = createArmorMaterial(config.primaryColor, config.accentColor);
      const visorGeo = new THREE.SphereGeometry(0.155 * s, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.y = 0.03 * s;
      group.add(visor);
      // Visor slit
      const slitGeo = new THREE.BoxGeometry(0.2 * s, 0.015 * s, 0.05 * s);
      const slitMat = createGlowMaterial(config.eyeColor);
      const slit = new THREE.Mesh(slitGeo, slitMat);
      slit.position.set(0, 0.02 * s, 0.13 * s);
      group.add(slit);
      break;
    }
    case "hood": {
      const hoodMat = createMaterial(config.secondaryColor, config.primaryColor, 0.1);
      const hoodGeo = new THREE.SphereGeometry(0.17 * s, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.7);
      const hood = new THREE.Mesh(hoodGeo, hoodMat);
      hood.position.y = 0.02 * s;
      group.add(hood);
      break;
    }
    case "mask": {
      const maskMat = createArmorMaterial(config.secondaryColor, config.accentColor);
      const maskGeo = new THREE.SphereGeometry(0.145 * s, 12, 8, -Math.PI * 0.5, Math.PI);
      const mask = new THREE.Mesh(maskGeo, maskMat);
      mask.position.z = 0.01 * s;
      group.add(mask);
      break;
    }
    case "horns": {
      const hornMat = createArmorMaterial(config.accentColor, config.accentColor);
      for (const side of [-1, 1]) {
        const hornGeo = new THREE.ConeGeometry(0.02 * s, 0.12 * s, 6);
        const horn = new THREE.Mesh(hornGeo, hornMat);
        horn.position.set(side * 0.12 * s, 0.1 * s, 0);
        horn.rotation.z = side * -0.4;
        group.add(horn);
      }
      break;
    }
    case "halo": {
      const haloMat = createGlowMaterial(config.accentColor);
      const haloGeo = new THREE.TorusGeometry(0.18 * s, 0.01 * s, 8, 24);
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.y = 0.2 * s;
      halo.rotation.x = Math.PI / 2;
      group.add(halo);
      break;
    }
  }

  return group;
}

function createTorso(config: CharacterConfig, s: number): THREE.Group {
  const group = new THREE.Group();
  const b = config.bulk;

  // Main torso
  const torsoGeo = new THREE.BoxGeometry(0.3 * s * b, 0.35 * s, 0.18 * s * b);
  const torsoMat = config.armorStyle === "heavy" || config.armorStyle === "tech"
    ? createArmorMaterial(config.primaryColor, config.accentColor)
    : createMaterial(config.primaryColor, config.accentColor, 0.15);
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  group.add(torso);

  // Chest plate / detail
  if (config.armorStyle === "heavy") {
    const plateMat = createArmorMaterial(config.secondaryColor, config.accentColor);
    const plateGeo = new THREE.BoxGeometry(0.22 * s * b, 0.2 * s, 0.02 * s);
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.z = 0.1 * s * b;
    group.add(plate);
  }

  // Shoulder pads for heavy armor
  if (config.armorStyle === "heavy" || config.armorStyle === "tech") {
    const padMat = createArmorMaterial(config.primaryColor, config.accentColor);
    for (const side of [-1, 1]) {
      const padGeo = new THREE.SphereGeometry(0.08 * s * b, 8, 6);
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(side * 0.18 * s * b, 0.15 * s, 0);
      group.add(pad);
    }
  }

  // Belt
  const beltGeo = new THREE.BoxGeometry(0.32 * s * b, 0.03 * s, 0.2 * s * b);
  const beltMat = createArmorMaterial(config.secondaryColor, config.accentColor);
  const belt = new THREE.Mesh(beltGeo, beltMat);
  belt.position.y = -0.18 * s;
  group.add(belt);

  return group;
}

function createLimb(length: number, width: number, color: string, accent: string, isArmor: boolean): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(width * 0.4, width * 0.5, length, 8);
  const mat = isArmor ? createArmorMaterial(color, accent) : createMaterial(color, accent, 0.1);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = -length / 2;
  return mesh;
}

function createFoot(s: number, color: string, accent: string): THREE.Mesh {
  const geo = new THREE.BoxGeometry(0.08 * s, 0.04 * s, 0.14 * s);
  const mat = createArmorMaterial(color, accent);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, -0.02 * s, 0.03 * s);
  return mesh;
}

function createHand(s: number, color: string, accent: string): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.03 * s, 8, 6);
  const mat = createMaterial(color, accent, 0.1);
  return new THREE.Mesh(geo, mat);
}

function createWeapon(config: CharacterConfig, s: number): THREE.Group | null {
  const group = new THREE.Group();
  const mat = createGlowMaterial(config.accentColor);
  const metalMat = createArmorMaterial(config.accentColor, config.accentColor);

  switch (config.weaponType) {
    case "sword": {
      const bladeGeo = new THREE.BoxGeometry(0.02 * s, 0.5 * s, 0.06 * s);
      group.add(new THREE.Mesh(bladeGeo, metalMat));
      const hiltGeo = new THREE.CylinderGeometry(0.015 * s, 0.015 * s, 0.08 * s, 6);
      const hilt = new THREE.Mesh(hiltGeo, createArmorMaterial(config.secondaryColor, config.accentColor));
      hilt.position.y = -0.28 * s;
      hilt.rotation.z = Math.PI / 2;
      group.add(hilt);
      break;
    }
    case "staff": {
      const staffGeo = new THREE.CylinderGeometry(0.012 * s, 0.012 * s, 0.8 * s, 8);
      group.add(new THREE.Mesh(staffGeo, metalMat));
      const orbGeo = new THREE.SphereGeometry(0.04 * s, 10, 8);
      const orb = new THREE.Mesh(orbGeo, mat);
      orb.position.y = 0.42 * s;
      group.add(orb);
      break;
    }
    case "hammer": {
      const handleGeo = new THREE.CylinderGeometry(0.015 * s, 0.015 * s, 0.5 * s, 6);
      group.add(new THREE.Mesh(handleGeo, metalMat));
      const hammerGeo = new THREE.BoxGeometry(0.15 * s, 0.08 * s, 0.08 * s);
      const hammer = new THREE.Mesh(hammerGeo, metalMat);
      hammer.position.y = 0.28 * s;
      group.add(hammer);
      break;
    }
    case "scythe": {
      const poleGeo = new THREE.CylinderGeometry(0.01 * s, 0.01 * s, 0.7 * s, 6);
      group.add(new THREE.Mesh(poleGeo, metalMat));
      const bladeGeo = new THREE.TorusGeometry(0.12 * s, 0.01 * s, 4, 12, Math.PI * 0.6);
      const blade = new THREE.Mesh(bladeGeo, mat);
      blade.position.y = 0.38 * s;
      blade.rotation.z = Math.PI * 0.2;
      group.add(blade);
      break;
    }
    case "orb": {
      const orbGeo = new THREE.SphereGeometry(0.06 * s, 12, 10);
      const orb = new THREE.Mesh(orbGeo, mat);
      group.add(orb);
      // Orbiting rings
      const ringGeo = new THREE.TorusGeometry(0.09 * s, 0.005 * s, 6, 16);
      const ring1 = new THREE.Mesh(ringGeo, mat);
      ring1.rotation.x = Math.PI / 3;
      group.add(ring1);
      const ring2 = new THREE.Mesh(ringGeo.clone(), mat);
      ring2.rotation.x = -Math.PI / 3;
      ring2.rotation.y = Math.PI / 4;
      group.add(ring2);
      break;
    }
    case "dual-blades": {
      // Returns null — blades are attached to hands directly
      return null;
    }
    case "claws": {
      return null; // Claws are part of hands
    }
    case "chains": {
      const chainGeo = new THREE.TorusGeometry(0.04 * s, 0.008 * s, 6, 8);
      for (let i = 0; i < 5; i++) {
        const link = new THREE.Mesh(chainGeo, metalMat);
        link.position.y = i * 0.06 * s;
        link.rotation.y = (i % 2) * Math.PI / 2;
        group.add(link);
      }
      break;
    }
    case "gauntlets":
    case "none":
      return null;
  }

  return group.children.length > 0 ? group : null;
}

function createCape(config: CharacterConfig, s: number): THREE.Mesh | null {
  if (!config.hasCape) return null;
  const capeGeo = new THREE.PlaneGeometry(0.35 * s * config.bulk, 0.6 * s, 1, 8);
  const capeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.secondaryColor),
    emissive: new THREE.Color(config.primaryColor),
    emissiveIntensity: 0.1,
    roughness: 0.8,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const cape = new THREE.Mesh(capeGeo, capeMat);
  cape.position.set(0, -0.1 * s, -0.12 * s);
  return cape;
}

/* ═══════════════════════════════════════════════════════
   BUILD COMPLETE CHARACTER MODEL
   Returns a THREE.Group with named children for animation
   ═══════════════════════════════════════════════════════ */
export interface CharacterModel {
  group: THREE.Group;
  config: CharacterConfig;
  bones: Record<string, THREE.Bone>;
  weapon: THREE.Group | null;
  cape: THREE.Mesh | null;
  // Part references for animation
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

export function buildCharacterModel(id: string): CharacterModel {
  const config = getCharacterConfig(id);
  const s = config.height / 2.0 * 1.3; // 30% bigger for 2.5D visibility
  const b = config.bulk;
  const isArmor = config.armorStyle === "heavy" || config.armorStyle === "tech";

  const group = new THREE.Group();
  group.name = `fighter_${id}`;

  // ── Head ──
  const head = createHead(config, s);
  head.position.set(0, 1.55 * s, 0);
  group.add(head);

  // ── Torso ──
  const torso = createTorso(config, s);
  torso.position.set(0, 1.2 * s, 0);
  group.add(torso);

  // ── Arms ──
  const armColor = isArmor ? config.primaryColor : config.skinColor;
  const lUpperArm = createLimb(0.25 * s, 0.06 * s * b, armColor, config.accentColor, isArmor);
  lUpperArm.position.set(-0.2 * s * b, 1.35 * s, 0);
  group.add(lUpperArm);

  const lLowerArm = createLimb(0.22 * s, 0.05 * s * b, armColor, config.accentColor, isArmor);
  lLowerArm.position.set(-0.2 * s * b, 1.05 * s, 0);
  group.add(lLowerArm);

  const lHand = createHand(s, config.skinColor, config.accentColor);
  lHand.position.set(-0.2 * s * b, 0.82 * s, 0);
  group.add(lHand);

  const rUpperArm = createLimb(0.25 * s, 0.06 * s * b, armColor, config.accentColor, isArmor);
  rUpperArm.position.set(0.2 * s * b, 1.35 * s, 0);
  group.add(rUpperArm);

  const rLowerArm = createLimb(0.22 * s, 0.05 * s * b, armColor, config.accentColor, isArmor);
  rLowerArm.position.set(0.2 * s * b, 1.05 * s, 0);
  group.add(rLowerArm);

  const rHand = createHand(s, config.skinColor, config.accentColor);
  rHand.position.set(0.2 * s * b, 0.82 * s, 0);
  group.add(rHand);

  // ── Legs ──
  const legColor = isArmor ? config.primaryColor : config.secondaryColor;
  const lUpperLeg = createLimb(0.3 * s, 0.07 * s * b, legColor, config.accentColor, isArmor);
  lUpperLeg.position.set(-0.08 * s * b, 0.85 * s, 0);
  group.add(lUpperLeg);

  const lLowerLeg = createLimb(0.28 * s, 0.06 * s * b, legColor, config.accentColor, isArmor);
  lLowerLeg.position.set(-0.08 * s * b, 0.5 * s, 0);
  group.add(lLowerLeg);

  const lFoot = createFoot(s, config.secondaryColor, config.accentColor);
  lFoot.position.set(-0.08 * s * b, 0.2 * s, 0);
  group.add(lFoot);

  const rUpperLeg = createLimb(0.3 * s, 0.07 * s * b, legColor, config.accentColor, isArmor);
  rUpperLeg.position.set(0.08 * s * b, 0.85 * s, 0);
  group.add(rUpperLeg);

  const rLowerLeg = createLimb(0.28 * s, 0.06 * s * b, legColor, config.accentColor, isArmor);
  rLowerLeg.position.set(0.08 * s * b, 0.5 * s, 0);
  group.add(rLowerLeg);

  const rFoot = createFoot(s, config.secondaryColor, config.accentColor);
  rFoot.position.set(0.08 * s * b, 0.2 * s, 0);
  group.add(rFoot);

  // ── Weapon ──
  const weapon = createWeapon(config, s);
  if (weapon) {
    weapon.position.set(0.25 * s * b, 1.0 * s, 0.1 * s);
    group.add(weapon);
  }

  // Hand weapons for dual-blades and claws
  if (config.weaponType === "dual-blades") {
    const bladeMat = createGlowMaterial(config.accentColor);
    for (const [hand, sx] of [["left", -1], ["right", 1]] as const) {
      const bladeGeo = new THREE.BoxGeometry(0.01 * s, 0.2 * s, 0.03 * s);
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set((sx as number) * 0.2 * s * b, 0.7 * s, 0.05 * s);
      blade.name = `blade_${hand}`;
      group.add(blade);
    }
  }
  if (config.weaponType === "claws") {
    const clawMat = createGlowMaterial(config.accentColor);
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const clawGeo = new THREE.ConeGeometry(0.008 * s, 0.08 * s, 4);
        const claw = new THREE.Mesh(clawGeo, clawMat);
        claw.position.set(sx * 0.2 * s * b + (i - 1) * 0.015 * s, 0.75 * s, 0.05 * s);
        claw.rotation.x = -Math.PI / 4;
        group.add(claw);
      }
    }
  }
  if (config.weaponType === "gauntlets") {
    const gauntletMat = createArmorMaterial(config.accentColor, config.accentColor);
    for (const sx of [-1, 1]) {
      const gauntletGeo = new THREE.BoxGeometry(0.06 * s, 0.1 * s, 0.06 * s);
      const gauntlet = new THREE.Mesh(gauntletGeo, gauntletMat);
      gauntlet.position.set(sx * 0.2 * s * b, 0.85 * s, 0);
      group.add(gauntlet);
    }
  }

  // ── Cape ──
  const cape = createCape(config, s);
  if (cape) {
    cape.position.set(0, 1.1 * s, -0.12 * s);
    group.add(cape);
  }

  // Center the model so feet are at y=0
  group.position.y = 0;

  return {
    group,
    config,
    bones: {},
    weapon,
    cape,
    parts: {
      head, torso,
      lUpperArm, lLowerArm, lHand,
      rUpperArm, rLowerArm, rHand,
      lUpperLeg, lLowerLeg, lFoot,
      rUpperLeg, rLowerLeg, rFoot,
    },
  };
}
