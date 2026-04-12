/* ═══════════════════════════════════════════════════════
   ASSET PROMPT TEMPLATES

   Locked prompt structure per asset category. When generating
   ANY asset, build the prompt from:
     1. The template's required tokens (always the same)
     2. The character's DNA (from characterVisualDNA.ts)
     3. A scene-specific delta (the only free-form part)

   Style tokens on a template are NON-NEGOTIABLE. They are the
   aesthetic contract for that asset category.
   ═══════════════════════════════════════════════════════ */

import { formatDnaForPrompt, formatVoiceForPrompt } from "./characterVisualDNA";

export interface AssetPromptTemplate {
  id: string;
  category: "character_portrait" | "scene_cutscene" | "room_vista" | "music_track" | "voice_line" | "fighter_sprite" | "card_art";
  /** Prefix — always prepended */
  prefix: string;
  /** Required style tokens — always appended */
  requiredTokens: string[];
  /** Negative tokens — always excluded */
  negativeTokens: string[];
  /** Lock a seed for reproducibility (image models) */
  lockedSeed?: number;
  /** Lock a LoRA or style reference */
  lockedLora?: string;
  /** Target aspect ratio */
  aspect?: "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
  /** Target model */
  targetModel?: string;
  /** Additional required fields the scene must provide */
  sceneFieldsRequired: string[];
}

export const PROMPT_TEMPLATES: Record<string, AssetPromptTemplate> = {
  character_portrait_anchor: {
    id: "character_portrait_anchor",
    category: "character_portrait",
    prefix: "High-detail character portrait, chest-up framing, direct gaze,",
    requiredTokens: [
      "cinematic lighting",
      "neon-rim backlight",
      "afrofuturist aesthetic",
      "35mm film grain",
      "dramatic shadows",
    ],
    negativeTokens: [
      "low quality", "blurry", "watermark", "text overlay",
      "cartoon", "anime", "full body", "multiple people",
    ],
    lockedSeed: 4471,
    lockedLora: "dischordian_v3",
    aspect: "3:4",
    targetModel: "flux-dev",
    sceneFieldsRequired: ["characterDnaId", "mood"],
  },

  fighter_sprite_combat: {
    id: "fighter_sprite_combat",
    category: "fighter_sprite",
    prefix: "Character-select splash art, full body, combat stance,",
    requiredTokens: [
      "cinematic",
      "afrofuturist",
      "neon-rim backlight",
      "dynamic pose",
      "transparent background",
      "hero shot",
    ],
    negativeTokens: [
      "multiple characters", "weapons drawn towards camera", "gore",
      "western fantasy tropes", "generic armor",
    ],
    lockedSeed: 4472,
    lockedLora: "dischordian_fighters_v2",
    aspect: "9:16",
    targetModel: "flux-dev",
    sceneFieldsRequired: ["characterDnaId", "combatMove"],
  },

  scene_cutscene_wide: {
    id: "scene_cutscene_wide",
    category: "scene_cutscene",
    prefix: "Cinematic wide shot, film still,",
    requiredTokens: [
      "cinematic lighting",
      "atmospheric haze",
      "35mm anamorphic",
      "afrofuturist design language",
      "2.35:1 letterbox",
    ],
    negativeTokens: [
      "centered subject", "portrait", "vertical composition", "text",
    ],
    lockedSeed: 4473,
    lockedLora: "dischordian_scenes_v2",
    aspect: "16:9",
    targetModel: "flux-dev + kling-video",
    sceneFieldsRequired: ["location", "timeOfDay", "action"],
  },

  room_vista_establishing: {
    id: "room_vista_establishing",
    category: "room_vista",
    prefix: "Interior establishing shot, no people,",
    requiredTokens: [
      "architectural precision",
      "atmospheric depth",
      "tech-organic fusion",
      "muted cinematic palette",
      "interior lighting sources visible",
    ],
    negativeTokens: [
      "characters", "clean-sterile", "modern office", "people",
    ],
    lockedSeed: 4474,
    lockedLora: "dischordian_interiors_v2",
    aspect: "16:9",
    targetModel: "flux-dev",
    sceneFieldsRequired: ["roomId", "roomMood", "lightingSources"],
  },

  card_art_potential: {
    id: "card_art_potential",
    category: "card_art",
    prefix: "Trading card portrait, ornate frame,",
    requiredTokens: [
      "afrofuturist",
      "trading card aesthetic",
      "cinematic lighting",
      "3:4 portrait framing",
      "neon-edge detail",
    ],
    negativeTokens: [
      "generic fantasy", "anime", "chibi", "realistic photo",
    ],
    lockedSeed: 4475,
    lockedLora: "dischordian_cards_v2",
    aspect: "3:4",
    targetModel: "flux-dev",
    sceneFieldsRequired: ["characterDnaId", "rarity", "class"],
  },

  music_track_signature: {
    id: "music_track_signature",
    category: "music_track",
    prefix: "",
    requiredTokens: [
      "afrofuturist",
      "cinematic scoring",
      "Malkia Ukweli signature",
      "electronic-orchestral hybrid",
    ],
    negativeTokens: [
      "generic EDM", "trap-only", "pop-radio-ready",
    ],
    targetModel: "suno-v4",
    sceneFieldsRequired: ["mode", "chapter", "faction", "emotionalArc"],
  },

  voice_line_dialog: {
    id: "voice_line_dialog",
    category: "voice_line",
    prefix: "",
    requiredTokens: ["natural cadence", "emotional authenticity"],
    negativeTokens: ["robotic-TTS", "over-acted"],
    targetModel: "elevenlabs-multilingual-v2",
    sceneFieldsRequired: ["characterDnaId", "emotion", "situation"],
  },
};

/* ─── BUILDERS ─── */

export interface SceneInputs {
  characterDnaId?: string;
  mood?: string;
  combatMove?: string;
  location?: string;
  timeOfDay?: string;
  action?: string;
  roomId?: string;
  roomMood?: string;
  lightingSources?: string;
  rarity?: string;
  class?: string;
  mode?: string;
  chapter?: string;
  faction?: string;
  emotionalArc?: string;
  emotion?: string;
  situation?: string;
  sceneDelta?: string;
}

/**
 * Build a complete prompt from a template + scene inputs + character DNA.
 * Missing required fields will throw — this is the enforcement point.
 */
export function buildPrompt(templateId: string, scene: SceneInputs): {
  prompt: string;
  negative: string;
  seed?: number;
  lora?: string;
  aspect?: string;
  model?: string;
  metadata: Record<string, unknown>;
} {
  const tpl = PROMPT_TEMPLATES[templateId];
  if (!tpl) throw new Error(`Unknown prompt template: ${templateId}`);

  // Enforce required scene fields
  const missing = tpl.sceneFieldsRequired.filter(k => !(k in scene) || !(scene as any)[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required scene fields for ${templateId}: ${missing.join(", ")}`);
  }

  // Character DNA injection
  const characterLine = scene.characterDnaId
    ? (tpl.category === "voice_line"
        ? formatVoiceForPrompt(scene.characterDnaId)
        : formatDnaForPrompt(scene.characterDnaId))
    : "";

  const parts = [
    tpl.prefix,
    characterLine,
    scene.sceneDelta ?? "",
    tpl.requiredTokens.join(", "),
  ].filter(Boolean);

  return {
    prompt: parts.join(" "),
    negative: tpl.negativeTokens.join(", "),
    seed: tpl.lockedSeed,
    lora: tpl.lockedLora,
    aspect: tpl.aspect,
    model: tpl.targetModel,
    metadata: {
      templateId,
      category: tpl.category,
      characterDnaId: scene.characterDnaId,
      builtAt: new Date().toISOString(),
    },
  };
}

/**
 * Lint a free-form prompt: returns warnings if required tokens are missing
 * or negative tokens appear. Use this to audit manually-written prompts.
 */
export function lintPrompt(templateId: string, freeformPrompt: string): {
  warnings: string[];
  errors: string[];
} {
  const tpl = PROMPT_TEMPLATES[templateId];
  if (!tpl) return { warnings: [], errors: [`Unknown template: ${templateId}`] };

  const warnings: string[] = [];
  const errors: string[] = [];
  const lower = freeformPrompt.toLowerCase();

  for (const tok of tpl.requiredTokens) {
    if (!lower.includes(tok.toLowerCase())) {
      warnings.push(`Missing required token: "${tok}"`);
    }
  }
  for (const neg of tpl.negativeTokens) {
    if (lower.includes(neg.toLowerCase())) {
      errors.push(`Negative token present: "${neg}"`);
    }
  }
  return { warnings, errors };
}
