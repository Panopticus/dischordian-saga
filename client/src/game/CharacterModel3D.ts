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
  // Pose sprite URLs for animation states
  poseSprites?: {
    idle?: string;
    attack?: string;
    block?: string;
    hit?: string;
    ko?: string;
    victory?: string;
    walkForward?: string;
    walkBack?: string;
    crouch?: string;
    dash?: string;
    lightPunch?: string;
    mediumPunch?: string;
    heavyPunch?: string;
    lightKick?: string;
    mediumKick?: string;
    heavyKick?: string;
    crouchPunch?: string;
    crouchKick?: string;
    sweep?: string;
    jump?: string;
    jumpAttack?: string;
    grab?: string;
    knockdown?: string;
    dizzy?: string;
    special?: string;
    taunt?: string;
  };
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_idle_73497ee2.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_attack_9e30a872.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_block_fc0bdcce.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_hit_7c5d6f27.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_ko_6d2ebde3.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_victory_5aa1b3c5.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_crouch-2gkBbHzZxuSMGbmHfeK3uu.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_crouch_kick-GWwzaDHbog3EsmpAx6BHt2.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_crouch_punch-kQJKY2zp57jyHMKEXq3P7T.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_dash-4gkEysVEQERCk3qwqv2X2D.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_dizzy-Nb3UgbEmRtLXTFa78ozkuM.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_grab-RiPT9JYE2YZhWkTThg7byc.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_heavy_kick-Jk9qT9hQX2oHMGoJ2mr6Yo.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_heavy_punch-GVYdrf9vTHjMthvuoucdzA.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_jump-Emcv2jTzV3364JbtNKjaAA.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_jump_attack-B6q9bT6uqRQ92eMVgjAXtp.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_knockdown-BvT6yDYZyXkhLVCfGtmKhm.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_light_kick-gc4pZCTRPu4FDNe9UEB4nc.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_light_punch-V2P2Sn6EM7bhVK27TGocvH.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_medium_kick-LANC34fgkmSdnCDFNMY3Tv.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_medium_punch-XHq8o2qVgXKtAZhLwSCTt9.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_special-aDSoE39uhBeiFpbRtZdPBn.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_crouch_heavy-hnPKVqGoVoS8R83GpavS3m.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_taunt-eZL68dhpj6eCD2MiLwNH9N.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_walk_back-MPxQp2kYFFfqXRijrVRHuC.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_architect_walk_fwd-9xhzkxNtY37eRLLS8PosU3.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_idle_ed891822.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_attack_e9d6b69e.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_block_fe1d6aa0.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_hit_3a2ccff6.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_ko_c8256632.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_victory_08d3cc21.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_crouch_54b84367.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_crouch_kick_ab10b365.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_crouch_punch_f2e2b672.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_dash_d925338b.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_dizzy_35ddd2cd.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_grab_918096aa.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_heavy_kick_48f3fc2d.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_heavy_punch_7f5d6874.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_jump_a67b6e09.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_jump_attack_33b4d3e6.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_knockdown_7ef5274a.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_light_kick_d5059dad.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_light_punch_955b8529.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_medium_kick_498db964.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_medium_punch_f6d4d2e3.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_special_21f0a615.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_sweep_9a3407e2.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_taunt_a440e8df.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_walk_back_ef978586.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_collector_walk_fwd_313377e7.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_idle_3a055f6f.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_attack_5fca073c.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_block_b4dd6d7d.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_hit_6eff60dc.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_ko_c09a22ac.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_victory_c5851ae8.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_crouch-J5kBPku3PjQwQTNgWmLuai.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_crouch_kick_fa2ad446.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_crouch_punch_b49ba0de.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_dash-hjt3KKTqMpCRfF6eqWMWd5.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_dizzy_e1763122.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_grab_678015e4.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_heavy_kick-9SdeUKX5RiivT6CL59KPCZ.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_heavy_punch-NLJQZyK4MXyiLb7wEwxb3b.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_jump_26b76a2a.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_jump_attack_8e28ae5b.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_knockdown_6067ad4c.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_light_kick-ccezG7kXjCpzFnhgGfQ9sP.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_light_punch-ACkYYHYAtpUnBKrrzBqqdV.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_medium_kick-QKZ826b9dVMLnS8AyE2uzL.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_medium_punch-8rGXtWMU72qtNDofAwo66H.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_special_bf1dae02.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_sweep_3afb9ce8.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_taunt_397409b5.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_walk_back-JHTKpzKo6LFUo82HAvtXxD.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_enigma_walk_fwd-77tXf93mDxT5t4b87k9fdL.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_idle_f9433b68.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_attack_ea98368b.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_block_1711e375.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_hit_6915506d.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_ko_0e63f821.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_victory_e7b25576.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_crouch_5fff3e8e.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_crouch_kick_7f2aaa50.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_crouch_punch_61dd31c0.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_dash_4e0748aa.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_dizzy_e5c515ef.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_grab_d21c039c.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_heavy_kick_fca57c28.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_heavy_punch_6dbe69a3.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_jump_c5cd3f97.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_jump_attack_f89d347d.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_knockdown_ab46081c.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_light_kick_8e61a49a.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_light_punch_c401231b.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_medium_kick_b524c740.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_medium_punch_0507b692.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_special_adff40f7.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_sweep_529869f6.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_taunt_c2522781.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_walk_back_c68dda31.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_warlord_walk_fwd_738c0b33.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_idle_5095faaa.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_attack_b60fc80d.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_block_afaeaa38.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_hit_f174b2d0.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_ko_4ba40fc9.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_victory_7a6fa1cf.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_crouch_faef22bf.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_crouch_kick_1217c36d.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_crouch_punch_4ad0af94.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_dash_1c55678c.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_dizzy_77047a48.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_grab_e012b50b.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_heavy_kick_c3a80dbe.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_heavy_punch_be51d481.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_jump_10efe107.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_jump_attack_32145519.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_knockdown_ba25c88c.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_light_kick_2b7d57c7.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_light_punch_6d63b9f5.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_medium_kick_8ac5c940.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_medium_punch_bdf22c5f.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_special_4529b05b.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_sweep_c4054231.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_taunt_eb689d41.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_walk_back_48afa30e.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_necromancer_walk_fwd_00d85ca8.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_idle_8003ac16.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_attack_064a2569.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_block_82ce7d05.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_hit_368a54a9.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_ko_da9d53a8.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_victory_182435d8.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_crouch_761cecbc.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_crouch_kick_bd502051.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_crouch_punch_134626a1.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_dash_8aab8d4e.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_dizzy_a6b29b30.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_grab_b77e2251.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_heavy_kick_26228817.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_heavy_punch_a678b76c.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_jump_c94f64c7.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_jump_attack_5642b522.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_knockdown_7de1d79d.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_light_kick_994936f9.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_light_punch_76b0839f.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_medium_kick_36243468.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_medium_punch_032389a1.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_special_1efb9e68.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_sweep_96d4572a.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_taunt_e0571c07.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_walk_back_e17ee9c2.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_meme_walk_fwd_4002d434.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow-tongue_idle_1d6aa2c4.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow-tongue_attack_ddfc8f91.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow-tongue_block_d583a6aa.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow-tongue_hit_f0290884.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow-tongue_ko_ea598646.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow-tongue_victory_42f4694c.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_crouch_a22da01e.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_crouch_kick_8298f8c9.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_crouch_punch_ef154599.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_dash_3868f039.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_dizzy_10d08e62.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_grab_cd3db686.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_heavy_kick_6b20951b.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_heavy_punch_8ba0d700.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_jump_90738de1.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_jump_attack_143af388.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_knockdown_2df21bc9.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_light_kick_4cafc02b.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_light_punch_01375a25.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_medium_kick_be78ad07.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_medium_punch_bd31d371.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_special_08d73fee.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_sweep_0c30a81d.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_taunt_53a56854.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_walk_back_dddd60ce.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_shadow_tongue_walk_fwd_8be232a5.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_idle_5fcc345b.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_attack_f47745e6.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_block_72347f4e.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_hit_07dd0ab3.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_ko_79f6aca1.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_victory_ffa01ec4.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_crouch_6bd0b1df.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_crouch_kick_559a5877.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_crouch_punch_a039410a.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_dash_5ad4fbc3.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_dizzy_238dea8e.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_grab_9e995339.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_heavy_kick_83133413.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_heavy_punch_108e3de1.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_jump_ca3bdeb4.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_jump_attack_2e85186b.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_knockdown_6b4a17f0.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_light_kick_aad8b247.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_light_punch_a0b94b35.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_medium_kick_189167a5.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_medium_punch_ea1fb210.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_special_a55aedda.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_sweep_15b92c5a.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_taunt_8bd5de28.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_walk_back_cfe0eebb.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_watcher_walk_fwd_2c92c6aa.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game-master_idle_8ae48ac0.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game-master_attack_a98c500d.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game-master_block_91ec4acb.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game-master_hit_eb842a79.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game-master_ko_744bfbb8.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game-master_victory_937ba7d2.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_crouch_f506c0b1.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_crouch_kick_7481c085.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_crouch_punch_fb771373.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_dash_844ae6b5.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_dizzy_105c3ab9.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_grab_ccf64d95.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_heavy_kick_07ef6018.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_heavy_punch_aa799aff.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_jump_c7d89a0e.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_jump_attack_b5b692fb.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_knockdown_28bd318f.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_light_kick_a6ed8c1c.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_light_punch_6b3db152.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_medium_kick_229bad4d.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_medium_punch_20267fc8.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_special_c44b00ea.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_sweep_317877e9.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_taunt_3efed4be.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_walk_back_2eb7c6a6.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_game_master_walk_fwd_4cf6a523.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/fighter_authority_c03da69b.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_light_punch_214cef91.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_crouch_c7f0bc92.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_knockdown_e640392d.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_dizzy_ff134d46.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_taunt_9d671b55.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_crouch_c7f0bc92.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_crouch_kick_0b864fa8.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_crouch_punch_734f354a.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_dash_8bd00596.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_dizzy_ff134d46.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_grab_a8178dcf.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_heavy_kick_379e86c8.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_heavy_punch_e53beecd.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_jump_89e7b1c5.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_jump_attack_5d470079.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_knockdown_e640392d.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_light_kick_e97d1221.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_light_punch_214cef91.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_medium_kick_c889d6aa.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_medium_punch_2d8ad1f2.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_special_8a2ae7cd.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_sweep_00aa10a2.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_taunt_9d671b55.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_walk_back_62f75746.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_authority_walk_fwd_dbde6357.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_idle_899c637f.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_attack_6eb83b01.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_block_8efc9c03.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_hit_a0015fbe.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_ko_bc43ff01.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_victory_2134d38f.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_crouch_8f6838ef.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_crouch_kick_946ca959.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_crouch_punch_fbf99337.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_dash_cbb2b894.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_dizzy_2a4e21ac.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_grab_8bb46393.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_heavy_kick_f5796198.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_heavy_punch_65ada094.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_jump_66acdf24.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_jump_attack_493a9fd8.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_knockdown_554bab73.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_light_kick_ae3f7e2d.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_light_punch_683f8552.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_medium_kick_52767efe.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_medium_punch_bce2700b.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_special_d3ffc8ac.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_sweep_f1a732a9.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_taunt_dbfe00f8.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_walk_back_1fc72922.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_source_walk_fwd_0ea82dcd.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_idle_79b80ce8.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_attack_5009c334.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_block_f24098e2.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_hit_46eae29b.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_ko_a52adcf0.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_victory_2e0f0f32.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_crouch_dfff17fa.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_crouch_kick_7507db81.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_crouch_punch_7e2c7194.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_dash_9645f7c9.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_dizzy_22a4aed4.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_grab_48075fd6.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_heavy_kick_4735e382.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_heavy_punch_673d6cca.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_jump_36162b99.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_jump_attack_683b2e83.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_knockdown_6f24de0c.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_light_kick_cffd0041.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_light_punch_a0e50ddd.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_medium_kick_e0bb46eb.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_medium_punch_0ec5dfd5.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_special_7e8ef54c.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_sweep_2ce37dd7.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_taunt_b6804833.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_walk_back_224224dc.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_jailer_walk_fwd_19257e6d.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_idle_58db1cc0.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_attack_94121d04.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_block_a3313369.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_hit_0c99503d.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_ko_493cf379.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_victory_900788dd.png",
      crouch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_crouch_28ba9067.png",
      crouchKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_crouch_kick_27bd964b.png",
      crouchPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_crouch_punch_39b2ea2c.png",
      dash: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_dash_160a6e87.png",
      dizzy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_dizzy_fe6bbb8c.png",
      grab: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_grab_7ad30cd7.png",
      heavyKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_heavy_kick_e7601d76.png",
      heavyPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_heavy_punch_6968f9e4.png",
      jump: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_jump_2a57c4a3.png",
      jumpAttack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_jump_attack_1197b6a8.png",
      knockdown: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_knockdown_02a0a805.png",
      lightKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_light_kick_d8f522c4.png",
      lightPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_light_punch_70197053.png",
      mediumKick: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_medium_kick_8393b074.png",
      mediumPunch: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_medium_punch_236c5c28.png",
      special: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_special_3396ea8d.png",
      sweep: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_sweep_44593609.png",
      taunt: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_taunt_acc76418.png",
      walkBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_walk_back_f4988717.png",
      walkForward: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_host_walk_fwd_27b5e1b8.png",
    },
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_iron-lion_idle_0c05173e.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_iron-lion_attack_5f6f1016.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_iron-lion_block_67b25cb3.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_iron-lion_hit_eabd6788.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_iron-lion_ko_54805259.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_iron-lion_victory_b0cc68c9.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_oracle_idle_b9526377.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_oracle_attack_1b49a101.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_oracle_block_e7a6732b.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_oracle_hit_7abd0d56.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_oracle_ko_bba1b0a8.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_oracle_victory_cdd27cea.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_agent-zero_idle_76bbfc3f.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_agent-zero_attack_4a64b570.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_agent-zero_block_c62ccaef.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_agent-zero_hit_452be8cb.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_agent-zero_ko_0398ca16.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_agent-zero_victory_9cdcea48.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_engineer_idle_95e18f41.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_engineer_attack_a234f150.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_engineer_block_77fab509.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_engineer_hit_698b0661.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_engineer_ko_86ca8415.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_engineer_victory_fa890110.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_eyes_idle_9238e541.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_eyes_attack_0e8cb738.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_eyes_block_c20450d0.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_eyes_hit_bb7c18cd.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_eyes_ko_e10cf91a.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_eyes_victory_fc850bdf.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_akai-shi_idle_efa9efd7.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_akai-shi_attack_b7ede174.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_akai-shi_block_3d5f5b22.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_akai-shi_hit_e0b3b934.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_akai-shi_ko_9838d6a5.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_akai-shi_victory_c904e331.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wraith-calder_idle_14fb4636.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wraith-calder_attack_28022774.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wraith-calder_block_623f2d1a.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wraith-calder_hit_a32e22b2.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wraith-calder_ko_d142d2ba.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wraith-calder_victory_1da316f6.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wolf_idle_65f34087.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wolf_attack_401439d6.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wolf_block_87c713b2.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wolf_hit_33a12fa9.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wolf_ko_c43a5c14.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_wolf_victory_a9ec1cc1.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_dreamer_idle_78e0426e.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_dreamer_attack_250939d8.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_dreamer_block_7c61cfa3.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_dreamer_hit_d141de7f.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_dreamer_ko_0a60ee30.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_dreamer_victory_8e2091c1.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_judge_idle_d676e148.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_judge_attack_d2cbdfc7.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_judge_block_3eb07d65.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_judge_hit_bdf016dd.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_judge_ko_4de5cb89.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_judge_victory_69f67651.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_inventor_idle_503bfec3.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_inventor_attack_c3ceef5d.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_inventor_block_ed8981ae.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_inventor_hit_b22897a8.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_inventor_ko_674bad1a.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_inventor_victory_f6445167.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_seer_idle_60eca86e.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_seer_attack_eefceaf7.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_seer_block_31d0b801.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_seer_hit_a37807fb.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_seer_ko_e24d02db.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_seer_victory_2a694f20.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_knowledge_idle_731f684d.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_knowledge_attack_c278b34b.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_knowledge_block_b2ee2d30.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_knowledge_hit_00df2e38.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_knowledge_ko_981821c4.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_knowledge_victory_abbf1f38.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_silence_idle_ba65aa82.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_silence_attack_ca8ccd89.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_silence_block_fa9c787f.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_silence_hit_0496f3c4.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_silence_ko_910973f8.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_silence_victory_79de7ed2.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_storm_idle_ab1c8ec7.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_storm_attack_da6809a7.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_storm_block_1f7818a3.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_storm_hit_6772e4d6.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_storm_ko_e3ecd3e4.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_storm_victory_087424c1.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_degen_idle_177b17ff.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_degen_attack_229618b2.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_degen_block_f4d8bdc8.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_degen_hit_8a282caf.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_degen_ko_3a88b75d.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_degen_victory_40143896.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_advocate_idle_b1312545.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_advocate_attack_49c3994d.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_advocate_block_8c533e45.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_advocate_hit_20ef14e5.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_advocate_ko_d14285bd.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_advocate_victory_69f90a77.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_forgotten_idle_6abc791f.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_forgotten_attack_b57715ad.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_forgotten_block_c4238cff.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_forgotten_hit_a1287b39.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_forgotten_ko_b0df28d3.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_forgotten_victory_764c0b61.png",
    }
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
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_resurrectionist_idle_28d9e4bd.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_resurrectionist_attack_f1809ba5.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_resurrectionist_block_9dc8b6d4.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_resurrectionist_hit_64add1d7.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_resurrectionist_ko_1e07f990.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_resurrectionist_victory_9d116648.png",
    }
  },
  /* ─── HIERARCHY OF THE DAMNED — DEMON FIGHTERS ─── */
  "molgrath": {
    id: "molgrath", name: "Mol'Garath",
    primaryColor: "#4a0000", secondaryColor: "#1a0000", accentColor: "#dc2626",
    eyeColor: "#ff0000", skinColor: "#2a0a0a",
    height: 2.3, bulk: 1.4,
    helmetStyle: "crown", armorStyle: "heavy", weaponType: "orb",
    hasCape: true, glowColor: "#dc2626",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/0_nyHL4hnAT48JokfLRErio9_1773778548521_na1fn_L2hvbWUvdWJ1bnR1L21vbGdhcmF0aF9zcHJpdGU_837ed7b8.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_molgrath_idle_b74c1a6c.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_molgrath_attack_6499961b.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_molgrath_block_4c8fa80d.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_molgrath_hit_5d5fa521.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_molgrath_ko_7509d896.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_molgrath_victory_39c12733.png",
    }
  },
  "xethraal": {
    id: "xethraal", name: "Xeth'Raal",
    primaryColor: "#2a1a00", secondaryColor: "#1a0a00", accentColor: "#f59e0b",
    eyeColor: "#fbbf24", skinColor: "#3a1a0a",
    height: 2.0, bulk: 1.0,
    helmetStyle: "visor", armorStyle: "tech", weaponType: "chains",
    hasCape: false, glowColor: "#f59e0b",
    fightStyle: "defensive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/1_fQwRsUQ4sbto3Om2YIbNvZ_1773778542417_na1fn_L2hvbWUvdWJ1bnR1L3hldGhfcmFhbF9zcHJpdGU_3c6e7389.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_xethraal_idle_83ebc41c.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_xethraal_attack_a647268f.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_xethraal_block_111b97a3.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_xethraal_hit_f32b6ba8.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_xethraal_ko_0e1a84e7.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_xethraal_victory_f255645f.png",
    }
  },
  "vexahlia": {
    id: "vexahlia", name: "Vex'Ahlia",
    primaryColor: "#1a002a", secondaryColor: "#0a0014", accentColor: "#a855f7",
    eyeColor: "#c084fc", skinColor: "#2a1a3a",
    height: 2.1, bulk: 1.2,
    helmetStyle: "horns", armorStyle: "heavy", weaponType: "hammer",
    hasCape: false, glowColor: "#a855f7",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/2_B1Mwqtxcs505WVXjSEwqmd_1773778543993_na1fn_L2hvbWUvdWJ1bnR1L3ZleGFobGlhX3Nwcml0ZQ_c7c609fe.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_vexahlia_idle_bc7f7c66.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_vexahlia_attack_2fe2c0e7.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_vexahlia_block_32ea846e.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_vexahlia_hit_546b1d5e.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_vexahlia_ko_7f4729d5.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_vexahlia_victory_b11ef8e8.png",
    }
  },
  "draelmon": {
    id: "draelmon", name: "Drael'Mon",
    primaryColor: "#001a2a", secondaryColor: "#000a14", accentColor: "#06b6d4",
    eyeColor: "#22d3ee", skinColor: "#0a1a2a",
    height: 1.95, bulk: 1.1,
    helmetStyle: "hood", armorStyle: "robes", weaponType: "staff",
    hasCape: true, glowColor: "#06b6d4",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/3_JufiJIgx6WRsxjUkI9Pin0_1773778544419_na1fn_L2hvbWUvdWJ1bnR1L2RyYWVsX21vbl9zcHJpdGU_d1425cfa.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_draelmon_idle_fbda4939.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_draelmon_attack_46e47d4d.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_draelmon_block_4d213909.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_draelmon_hit_495156c6.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_draelmon_ko_1ec608ea.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_draelmon_victory_b83b9c52.png",
    }
  },
  /* shadow-tongue already exists in base fighters above — demon variant uses same config */
  "nykoth": {
    id: "nykoth", name: "Ny'Koth",
    primaryColor: "#2a0a2a", secondaryColor: "#140014", accentColor: "#ec4899",
    eyeColor: "#f472b6", skinColor: "#3a1a3a",
    height: 2.15, bulk: 1.3,
    helmetStyle: "none", armorStyle: "medium", weaponType: "claws",
    hasCape: false, glowColor: "#ec4899",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/5_Hh9K0mWXpVEPiRXjnjqpdI_1773778546128_na1fn_L2hvbWUvdWJ1bnR1L255X2tvdGhfdGhlX2ZsYXllcg_e1f416f9.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_nykoth_idle_423470af.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_nykoth_attack_c251a233.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_nykoth_block_19b4eeff.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_nykoth_hit_d5181326.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_nykoth_ko_5c722ad9.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_nykoth_victory_a9ad8257.png",
    }
  },
  "sylvex": {
    id: "sylvex", name: "Syl'Vex",
    primaryColor: "#0a2a0a", secondaryColor: "#001400", accentColor: "#22c55e",
    eyeColor: "#4ade80", skinColor: "#1a2a1a",
    height: 1.85, bulk: 0.9,
    helmetStyle: "hood", armorStyle: "robes", weaponType: "staff",
    hasCape: true, glowColor: "#22c55e",
    fightStyle: "defensive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/6_AqlG6ENJBQWlzF7gEZSAPY_1773778535229_na1fn_L2hvbWUvdWJ1bnR1L3N5bHZleF90aGVfY29ycnVwdG9y_601de94d.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_sylvex_idle_a5f88e58.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_sylvex_attack_d96e5e36.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_sylvex_block_b9e1eb76.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_sylvex_hit_e1e8c677.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_sylvex_ko_1db14ff1.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_sylvex_victory_a7e06940.png",
    }
  },
  "varkul": {
    id: "varkul", name: "Varkul",
    primaryColor: "#3a0000", secondaryColor: "#1a0000", accentColor: "#b91c1c",
    eyeColor: "#ef4444", skinColor: "#2a0a0a",
    height: 2.2, bulk: 1.35,
    helmetStyle: "horns", armorStyle: "heavy", weaponType: "sword",
    hasCape: false, glowColor: "#b91c1c",
    fightStyle: "aggressive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/7_OuHQkfh4sCo760hBsGKxhP_1773778552306_na1fn_L2hvbWUvdWJ1bnR1L3Zhcmt1bF90aGVfYmxvb2RfbG9yZA_eda11841.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_varkul_idle_7be364af.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_varkul_attack_2184e98f.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_varkul_block_b98257d6.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_varkul_hit_29b7538d.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_varkul_ko_2f51ef28.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_varkul_victory_6a68827d.png",
    }
  },
  "fenra": {
    id: "fenra", name: "Fenra",
    primaryColor: "#1a1a3a", secondaryColor: "#0a0a1a", accentColor: "#818cf8",
    eyeColor: "#a5b4fc", skinColor: "#1a1a2a",
    height: 2.0, bulk: 1.15,
    helmetStyle: "crown", armorStyle: "medium", weaponType: "scythe",
    hasCape: true, glowColor: "#818cf8",
    fightStyle: "balanced",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/8_Sej4UYKCxogZQF9iMoQ7th_1773778553143_na1fn_L2hvbWUvdWJ1bnR1L2ZlbnJhX3RoZV9tb29uX3R5cmFudA_708c19a0.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_fenra_idle_ae52a366.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_fenra_attack_599bf076.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_fenra_block_9c88c2fb.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_fenra_hit_5839eea4.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_fenra_ko_e12007d6.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_fenra_victory_46f02bd9.png",
    }
  },
  "ithrael": {
    id: "ithrael", name: "Ith'Rael",
    primaryColor: "#2a2a0a", secondaryColor: "#14140a", accentColor: "#eab308",
    eyeColor: "#facc15", skinColor: "#2a2a1a",
    height: 1.8, bulk: 0.8,
    helmetStyle: "mask", armorStyle: "light", weaponType: "gauntlets",
    hasCape: false, glowColor: "#eab308",
    fightStyle: "evasive",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/9_7zFEz6U97veRJtFarlSbPi_1773778546408_na1fn_L2hvbWUvdWJ1bnR1L2l0aF9yYWVsX3Nwcml0ZQ_7de2b56d.png",
    poseSprites: {
      idle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_ithrael_idle_0a337810.png",
      attack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_ithrael_attack_7746b192.png",
      block: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_ithrael_block_58b19a78.png",
      hit: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_ithrael_hit_c2ddb1e9.png",
      ko: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_ithrael_ko_b3d65e8d.png",
      victory: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/sprite_ithrael_victory_bb7ed7ca.png",
    }
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
  // Pose textures for state-based sprite swapping
  poseTextures: Record<string, THREE.Texture>;
  currentPose: string;
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
  
  // ── Load pose textures ──
  const poseTextures: Record<string, THREE.Texture> = {};
  if (config.poseSprites) {
    for (const [pose, url] of Object.entries(config.poseSprites)) {
      if (url) poseTextures[pose] = loadCharacterTexture(url);
    }
  }

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
    poseTextures,
    currentPose: "idle",
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
