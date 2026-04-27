/**
 * Expansion prompt types.
 *
 * The CARD_ART_PROMPTS shipped with PR #227 cover the S1_MEMOIR base
 * set only (609 prompts). This module is the typed source of truth
 * for the *expansion* art/cinematic/VFX brief: 122 additional cards
 * (S2_HIERARCHY 84 + ACT_EXCLUSIVES 28 + Specials 10) plus 9
 * cutscenes plus 18 VFX entries. Together they assemble into a
 * single browseable production book at
 * docs/production/EXPANSION_PRODUCTION_BOOK.md via
 * apps/scripts/export-expansion-production-book.ts.
 *
 * ═══════════════════════════════════════════════════════════════
 * LORE BOUNDARY — Epoch-2 cutoff (re-locked 2026-04-27)
 * ═══════════════════════════════════════════════════════════════
 *
 * Same boundary as the existing 609 prompts. Acts 3-7 reveals MUST
 * stay hidden in the art unless the card is explicitly an Act 3-7
 * unlock. The 7 lore-discovery secret cards are the ONLY exception:
 * they are unlock-gated (THE ASSISTANT model from
 * `apps/shared/darrenMemorial.ts`), so their art may reflect the
 * post-Epoch-2 truths the player has earned through that Act's
 * flavor-text completion.
 *
 * The generator script enforces this with a regex sweep for
 * spoiler keywords on every non-secret entry.
 */
import type { CardArtPrompt } from "../cardArtPrompts/types";

export type { CardArtPrompt };

/**
 * Extension of the standard CardArtPrompt with REQUIRED lore
 * citations and an optional archetype rationale for un-canon cards.
 *
 * `loreCitations` is required for every entry — the generator
 * script asserts every card has at least one citation pointing to
 * a real file path. Citations may be of two forms:
 *   - "docs/built/LORE_BIBLE.md §Mol'Garath"
 *   - "apps/shared/tcg-core/story/narrativeActs.ts:Act3"
 *
 * `archetypeRationale` is required for cards lacking a named canon
 * character (every Hierarchy Manager / Analyst / Intern, plus the
 * un-named C-Suite / VPs / Directors). It is a 1-2 sentence tie
 * back to the established framing — "the Hierarchy is an infernal
 * corporation from the Abyss" — so the artist understands the
 * design intent rather than improvising.
 */
export interface ExpansionCardPrompt extends CardArtPrompt {
  /** REQUIRED. ≥1 citation, asserted by the test suite. */
  loreCitations: readonly string[];
  /**
   * Required for cards lacking established canon. Optional for
   * canon-anchored cards (Mol'Garath, Xeth'Raal, etc).
   */
  archetypeRationale?: string;
  /**
   * Public-facing display name. Mirrors what would land in
   * `definition.name`; included here because the expansion cards
   * don't yet have CardDefinitions, and the production book needs
   * to show artists the name regardless.
   */
  name: string;
  /**
   * Set membership for cross-reference. Must equal what
   * `deriveSetCode(cardId)` would produce; the test suite asserts
   * this so author errors fail CI.
   */
  setCode: "S2_HIERARCHY" | "ACT_EXCLUSIVES" | "S1_MEMOIR";
  /** Faction this card belongs to. */
  faction:
    | "architect" | "antiquarian" | "dreamer" | "insurgency"
    | "new_babylon" | "thought_virus" | "neutral";
  /** Rarity tier — drives pack-pull weights + visual ceremony. */
  rarity:
    | "common" | "uncommon" | "rare"
    | "epic" | "legendary" | "mythic" | "neyon";
  /** Card type — units carry baseStats; spells/structures don't. */
  cardType: "unit" | "spell" | "artifact" | "structure" | "general";
  /** In-game flavor text the player sees on the card. Canon. */
  flavorText: string;
}

/**
 * Cutscene prompt — one entry per scripted cinematic moment. Mirrors
 * the existing CutsceneData shape (CutsceneOverlay.tsx) so this
 * data can be lifted into runtime cutscene defs later, but extends
 * each beat with shot-list direction (camera, framing, motion) so
 * the artist/animator can storyboard before any video render.
 */
export interface CutscenePrompt {
  id: string;
  title: string;
  subtitle?: string;
  /** Trigger condition — "purchase memoir_booster", "act3_pack_obtained", etc. */
  trigger: string;
  estimatedDurationSec: number;
  beats: ReadonlyArray<CutsceneBeat>;
  /** Track id from fnord23 / outergroove registry, or "TBD". */
  ambientTrack?: string;
  loreCitations: readonly string[];
}

export interface CutsceneBeat {
  beatId: string;
  durationSec: number;
  /** Speaker for VO line; null when no spoken line on this beat. */
  speaker?: "Elara" | "Human" | "Mol'Garath" | "Xeth'Raal" | "Varkul"
    | "Shadow Tongue" | "Riri'Ahlia" | "Fenra" | "Narrator" | "None";
  /** Optional VO line. */
  line?: string;
  mood?: "neutral" | "intense" | "tender" | "mysterious"
    | "angry" | "sad" | "triumphant";
  /** Camera direction (push-in, low-angle hero, match-cut, etc). */
  cameraDirection: string;
  /** Visual brief for the start frame (1-3 sentences). */
  framingPrompt: string;
  /** Motion description for the video model (Seedance 2.0). */
  motionPrompt: string;
  /** SFX cue — file path or descriptor. */
  sfxCue?: string;
  /** Existing component to reuse — e.g. "BattleVFX.ScreenFlash". */
  existingVfxRef?: string;
}

/**
 * VFX prompt — one entry per discrete visual effect asset. Output
 * spec is locked to the prelude pipeline (1920×1080 VP9/WebM α-
 * channel @30fps), matching prelude-asset-build/prompts/vfx/README.md.
 *
 * `existingPrimitives` lists in-repo components the artist should
 * layer or reference rather than re-specify (e.g. BattleVFX particle
 * burst, RewardCelebration's tier-3 cascade, prelude
 * MemoryCrystalPulse). Reduces duplicate work + ensures consistency.
 */
export interface VfxPrompt {
  id: string;
  trigger: string;
  output: {
    width: 1920;
    height: 1080;
    codec: "vp9";
    alpha: true;
    fps: 30;
  };
  estimatedDurationSec: number;
  startFramePrompt: string;
  endFramePrompt: string;
  motionPrompt: string;
  /** SFX id (must exist in apps/shared/sfxRegistry.ts when shipped). */
  sfxCue: string;
  existingPrimitives: readonly string[];
  loreCitations: readonly string[];
}

/**
 * The locked output spec, exported so all VFX entries can spread it.
 *
 *   output: { ...VFX_OUTPUT_LOCKED }
 */
export const VFX_OUTPUT_LOCKED = {
  width: 1920 as const,
  height: 1080 as const,
  codec: "vp9" as const,
  alpha: true as const,
  fps: 30 as const,
};

export type ExpansionCardRegistry = Readonly<Record<string, ExpansionCardPrompt>>;
export type CutsceneRegistry = Readonly<Record<string, CutscenePrompt>>;
export type VfxRegistry = Readonly<Record<string, VfxPrompt>>;
