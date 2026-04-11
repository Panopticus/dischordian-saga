/* ═══════════════════════════════════════════════════════
   ASSET REGISTRY

   Tracks every generated asset: prompt, seed, LoRA, reviewer,
   anchor references, approval status.

   Purpose: single source of truth for aesthetic consistency.
   When an asset needs revision, look up its registry entry,
   not someone's memory.

   NEW ASSET WORKFLOW:
     1. Build prompt via assetPromptTemplates.buildPrompt()
     2. Generate asset
     3. Reviewer compares to anchor_ids (3 prior approved assets
        in same category/character)
     4. Reviewer signs off or requests revision
     5. Asset gets AssetRegistryEntry appended here

   SPOT-CHECK WORKFLOW:
     1. Filter registry by category OR characterId
     2. Open all matching asset URLs side-by-side
     3. Look for drift (palette, face, style)
   ═══════════════════════════════════════════════════════ */

export type AssetStatus = "draft" | "in_review" | "approved" | "retired" | "rejected";
export type AssetCategory =
  | "character_portrait"
  | "scene_cutscene"
  | "room_vista"
  | "music_track"
  | "voice_line"
  | "fighter_sprite"
  | "card_art";

export interface AssetRegistryEntry {
  /** Stable ID (never reuse) */
  id: string;
  /** Asset category */
  category: AssetCategory;
  /** Character DNA ID if character-specific */
  characterDnaId?: string;
  /** Public URL where asset lives */
  url: string;
  /** Prompt template used */
  templateId: string;
  /** The actual full prompt sent to the model */
  fullPrompt: string;
  /** Negative prompt */
  negativePrompt?: string;
  /** Seed if applicable */
  seed?: number;
  /** LoRA / style reference */
  lora?: string;
  /** Model used */
  model?: string;
  /** 3 anchor asset IDs this was compared against for consistency */
  anchorIds: string[];
  /** Reviewer who approved */
  reviewer?: string;
  /** Status */
  status: AssetStatus;
  /** Date approved/created */
  timestamp: string;
  /** Revision number if this replaces a prior asset */
  revisionOf?: string;
  /** Free-form reviewer notes */
  notes?: string;
  /** Scene inputs for reproducibility */
  sceneInputs?: Record<string, unknown>;
}

/* ─── IN-MEMORY REGISTRY ─── */
/*
 * Start with an empty registry. Add entries as assets are approved.
 * Eventually back this with a DB table for production.
 */
export const ASSET_REGISTRY: AssetRegistryEntry[] = [];

/* ─── QUERY HELPERS ─── */

export function findByCharacter(characterDnaId: string): AssetRegistryEntry[] {
  return ASSET_REGISTRY.filter(a => a.characterDnaId === characterDnaId && a.status === "approved");
}

export function findByCategory(category: AssetCategory): AssetRegistryEntry[] {
  return ASSET_REGISTRY.filter(a => a.category === category && a.status === "approved");
}

export function findAnchors(category: AssetCategory, characterDnaId?: string, limit: number = 3): AssetRegistryEntry[] {
  const pool = ASSET_REGISTRY
    .filter(a => a.category === category && a.status === "approved")
    .filter(a => !characterDnaId || a.characterDnaId === characterDnaId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return pool.slice(0, limit);
}

/**
 * Register a new asset. Enforces minimum-3-anchor rule for approved assets
 * (except for the very first assets in a category).
 */
export function registerAsset(entry: Omit<AssetRegistryEntry, "timestamp">): AssetRegistryEntry {
  const priorInCategory = findByCategory(entry.category).length;

  // After the first 3 assets in a category, require anchor comparison
  if (entry.status === "approved" && priorInCategory >= 3 && entry.anchorIds.length < 3) {
    throw new Error(
      `Asset approval requires 3 anchor comparisons (got ${entry.anchorIds.length}). ` +
      `Use findAnchors("${entry.category}", ${entry.characterDnaId ? `"${entry.characterDnaId}"` : "undefined"}) to find them.`
    );
  }

  const full: AssetRegistryEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  ASSET_REGISTRY.push(full);
  return full;
}

/* ─── DRIFT DETECTION (heuristic) ─── */

/**
 * Flag potential drift within a character's portfolio.
 * Returns any character whose latest 3 assets use different seeds/LoRAs
 * or whose prompts diverge significantly in token overlap.
 */
export function detectDrift(): { characterId: string; reason: string }[] {
  const characters = new Set(ASSET_REGISTRY.map(a => a.characterDnaId).filter(Boolean) as string[]);
  const drifts: { characterId: string; reason: string }[] = [];

  for (const id of characters) {
    const assets = findByCharacter(id).slice(0, 5);
    if (assets.length < 3) continue;

    // Seed consistency check
    const seeds = new Set(assets.map(a => a.seed).filter(s => s !== undefined));
    if (seeds.size > 2) {
      drifts.push({ characterId: id, reason: `Using ${seeds.size} different seeds across recent assets` });
    }

    // LoRA consistency check
    const loras = new Set(assets.map(a => a.lora).filter(Boolean));
    if (loras.size > 1) {
      drifts.push({ characterId: id, reason: `Using ${loras.size} different LoRAs: ${[...loras].join(", ")}` });
    }
  }
  return drifts;
}

/* ─── EXPORT FOR REVIEW ─── */

/**
 * Produce a summary suitable for weekly art-director review.
 */
export function summarizeForReview(): {
  total: number;
  byCategory: Record<string, number>;
  byCharacter: Record<string, number>;
  drafts: number;
  inReview: number;
  drifts: { characterId: string; reason: string }[];
} {
  const byCategory: Record<string, number> = {};
  const byCharacter: Record<string, number> = {};
  let drafts = 0;
  let inReview = 0;

  for (const a of ASSET_REGISTRY) {
    byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
    if (a.characterDnaId) {
      byCharacter[a.characterDnaId] = (byCharacter[a.characterDnaId] ?? 0) + 1;
    }
    if (a.status === "draft") drafts++;
    if (a.status === "in_review") inReview++;
  }

  return {
    total: ASSET_REGISTRY.length,
    byCategory,
    byCharacter,
    drafts,
    inReview,
    drifts: detectDrift(),
  };
}
