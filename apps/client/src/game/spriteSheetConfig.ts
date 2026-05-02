import { assetUrl } from "@/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   SPRITE SHEET CONFIG — Fighter Animation Mapping

   Maps each fighter's sprite sheets (2752×1536 grids of
   16 columns × 6 rows, 172×256 per cell) to named
   animation states consumed by SpriteAnimator.

   Sheet types per fighter:
   - idle_movement.png   → idle, walk, jump, crouch, dash
   - attacks_specials.png → punches, kicks, specials
   - reactions_victory.png → hit, block, ko, grab, victory
   - specials_supers.png  → extended specials & supers
   - portraits.png        → character select art

   Three fighters use variant naming:
   - architect:  basic_attacks, reactions_throws, victory_ko_art
   - collector:  basic_attacks, reactions_victory_ko
   - enigma:     basic_attacks, specials_reactions_victory
   ═══════════════════════════════════════════════════════ */

/* ─── GRID CONSTANTS ─── */

export const SPRITE_SHEET_GRID = {
  cols: 16,
  rows: 6,
  cellWidth: 172,
  cellHeight: 256,
} as const;

/* ─── TYPES ─── */

export interface SpriteSheetAnimation {
  /** Relative path to the sprite sheet image */
  sheet: string;
  /** Row index (0-5) within the sheet */
  row: number;
  /** Starting column within the row */
  startCol: number;
  /** Number of frames in this animation */
  frameCount: number;
  /** Whether the animation loops continuously */
  loop: boolean;
  /** Duration per frame in game ticks (60 fps). 0 = driven by move timing */
  frameDuration: number;
}

export interface FighterSpriteData {
  /** All sheet paths for preloading */
  sheets: string[];
  /** Named animation states */
  animations: Record<string, SpriteSheetAnimation>;
}

/* ─── ANIMATION TEMPLATES ─── */

/**
 * Build the full animation map for a fighter given their sheet paths.
 *
 * Sheet keys expected:
 *   idleMovement   — idle / walk / jump / crouch / dash
 *   attacks        — punches, kicks, specials
 *   reactions      — hit, block, ko, grab, victory
 */
function buildAnimations(
  idleMovement: string,
  attacks: string,
  reactions: string,
): Record<string, SpriteSheetAnimation> {
  return {
    /* ── idle_movement sheet ── */
    idle:        { sheet: idleMovement, row: 0, startCol: 0,  frameCount: 10, loop: true,  frameDuration: 6 },
    walkForward: { sheet: idleMovement, row: 1, startCol: 0,  frameCount: 8,  loop: true,  frameDuration: 5 },
    walkBack:    { sheet: idleMovement, row: 2, startCol: 0,  frameCount: 8,  loop: true,  frameDuration: 5 },
    jump:        { sheet: idleMovement, row: 3, startCol: 0,  frameCount: 8,  loop: false, frameDuration: 4 },
    crouch:      { sheet: idleMovement, row: 4, startCol: 0,  frameCount: 4,  loop: false, frameDuration: 3 },
    dash:        { sheet: idleMovement, row: 5, startCol: 0,  frameCount: 6,  loop: false, frameDuration: 3 },

    /* ── attacks sheet — row 0: light punch / medium punch ── */
    lightPunch:  { sheet: attacks, row: 0, startCol: 0,  frameCount: 5,  loop: false, frameDuration: 0 },
    mediumPunch: { sheet: attacks, row: 0, startCol: 8,  frameCount: 6,  loop: false, frameDuration: 0 },

    /* ── attacks sheet — row 1: heavy punch ── */
    heavyPunch:  { sheet: attacks, row: 1, startCol: 0,  frameCount: 6,  loop: false, frameDuration: 0 },

    /* ── attacks sheet — row 2: kicks ── */
    lightKick:   { sheet: attacks, row: 2, startCol: 0,  frameCount: 5,  loop: false, frameDuration: 0 },
    mediumKick:  { sheet: attacks, row: 2, startCol: 8,  frameCount: 6,  loop: false, frameDuration: 0 },

    /* ── attacks sheet — row 3: heavy kick, crouch attacks, sweep ── */
    heavyKick:   { sheet: attacks, row: 3, startCol: 0,  frameCount: 6,  loop: false, frameDuration: 0 },
    crouchPunch: { sheet: attacks, row: 3, startCol: 6,  frameCount: 4,  loop: false, frameDuration: 0 },
    sweep:       { sheet: attacks, row: 3, startCol: 10, frameCount: 6,  loop: false, frameDuration: 0 },

    /* ── attacks sheet — row 4: crouch kick, special ── */
    crouchKick:  { sheet: attacks, row: 4, startCol: 0,  frameCount: 4,  loop: false, frameDuration: 0 },
    special:     { sheet: attacks, row: 4, startCol: 4,  frameCount: 8,  loop: false, frameDuration: 0 },

    /* ── attacks sheet — row 5: jump attack, taunt ── */
    jumpAttack:  { sheet: attacks, row: 5, startCol: 0,  frameCount: 5,  loop: false, frameDuration: 0 },
    taunt:       { sheet: attacks, row: 5, startCol: 8,  frameCount: 8,  loop: false, frameDuration: 6 },

    /* ── reactions sheet — row 0: hit ── */
    hit:         { sheet: reactions, row: 0, startCol: 0,  frameCount: 4,  loop: false, frameDuration: 4 },

    /* ── reactions sheet — row 1: knockdown ── */
    knockdown:   { sheet: reactions, row: 1, startCol: 0,  frameCount: 6,  loop: false, frameDuration: 0 },

    /* ── reactions sheet — row 2: block, dizzy ── */
    block:       { sheet: reactions, row: 2, startCol: 0,  frameCount: 3,  loop: false, frameDuration: 5 },
    dizzy:       { sheet: reactions, row: 2, startCol: 6,  frameCount: 6,  loop: true,  frameDuration: 6 },

    /* ── reactions sheet — row 3: grab ── */
    grab:        { sheet: reactions, row: 3, startCol: 0,  frameCount: 6,  loop: false, frameDuration: 0 },

    /* ── reactions sheet — row 4: victory ── */
    victory:     { sheet: reactions, row: 4, startCol: 0,  frameCount: 10, loop: true,  frameDuration: 8 },

    /* ── reactions sheet — row 5: ko ── */
    ko:          { sheet: reactions, row: 5, startCol: 0,  frameCount: 6,  loop: false, frameDuration: 0 },
  };
}

/* ─── HELPER — build a standard-pattern fighter entry ─── */

function standardFighter(id: string): FighterSpriteData {
  const base = assetUrl(`art/fighters/${id}`);
  const idleMovement = `${base}/${id}_idle_movement.png`;
  const attacks      = `${base}/${id}_attacks_specials.png`;
  const reactions    = `${base}/${id}_reactions_victory.png`;
  const portraits    = `${base}/${id}_portraits.png`;

  return {
    sheets: [idleMovement, attacks, reactions, portraits],
    animations: buildAnimations(idleMovement, attacks, reactions),
  };
}

/* ─── FIGHTER DATABASE ─── */

export const FIGHTER_SPRITE_SHEETS: Record<string, FighterSpriteData> = {
  /* ════════════════════════════════════════════════════
     1. ARCHITECT — unique sheet naming
     ════════════════════════════════════════════════════ */
  architect: (() => {
    const base = assetUrl("art/fighters/architect");
    const idleMovement   = `${base}/architect_idle_movement.png`;
    const attacks        = `${base}/architect_basic_attacks.png`;
    const reactions      = `${base}/architect_reactions_throws.png`;
    const specialsSupers = `${base}/architect_specials_supers.png`;
    const portraits      = `${base}/architect_portraits.png`;
    const victoryKo      = `${base}/architect_victory_ko_art.png`;

    const anims = buildAnimations(idleMovement, attacks, reactions);

    /* Override victory & ko to use the dedicated victory_ko_art sheet */
    anims.victory = { sheet: victoryKo, row: 0, startCol: 0, frameCount: 10, loop: true,  frameDuration: 8 };
    anims.ko      = { sheet: victoryKo, row: 1, startCol: 0, frameCount: 6,  loop: false, frameDuration: 0 };

    return {
      sheets: [idleMovement, attacks, reactions, specialsSupers, portraits, victoryKo],
      animations: anims,
    };
  })(),

  /* ════════════════════════════════════════════════════
     2. COLLECTOR — unique sheet naming
     ════════════════════════════════════════════════════ */
  collector: (() => {
    const base = assetUrl("art/fighters/collector");
    const idleMovement   = `${base}/collector_idle_movement.png`;
    const attacks        = `${base}/collector_basic_attacks.png`;
    const reactions      = `${base}/collector_reactions_victory_ko.png`;
    const specialsSupers = `${base}/collector_specials_supers.png`;
    const portraits      = `${base}/collector_portraits.png`;

    return {
      sheets: [idleMovement, attacks, reactions, specialsSupers, portraits],
      animations: buildAnimations(idleMovement, attacks, reactions),
    };
  })(),

  /* ════════════════════════════════════════════════════
     3. ENIGMA — unique sheet naming
     ════════════════════════════════════════════════════ */
  enigma: (() => {
    const base = assetUrl("art/fighters/enigma");
    const idleMovement        = `${base}/enigma_idle_movement.png`;
    const attacks             = `${base}/enigma_basic_attacks.png`;
    const specialsReactions   = `${base}/enigma_specials_reactions_victory.png`;
    const portraits           = `${base}/enigma_portraits.png`;

    const anims = buildAnimations(idleMovement, attacks, specialsReactions);

    /*
     * Enigma's combined specials_reactions_victory sheet puts reactions
     * in the same sheet as specials, so all reaction/victory animations
     * already point to specialsReactions via buildAnimations.
     */

    return {
      sheets: [idleMovement, attacks, specialsReactions, portraits],
      animations: anims,
    };
  })(),

  /* ════════════════════════════════════════════════════
     4-17. STANDARD PATTERN FIGHTERS
     All follow: {id}_idle_movement, {id}_attacks_specials,
                 {id}_reactions_victory, {id}_portraits
     ════════════════════════════════════════════════════ */
  warlord:       standardFighter("warlord"),
  necromancer:   standardFighter("necromancer"),
  iron_lion:     standardFighter("iron_lion"),
  white_oracle:  standardFighter("white_oracle"),
  agent_zero:    standardFighter("agent_zero"),
  meme:          standardFighter("meme"),
  source:        standardFighter("source"),
  akai_shi:      standardFighter("akai_shi"),
  human:         standardFighter("human"),
  degen:         standardFighter("degen"),
  prisoner:      standardFighter("prisoner"),
  wraith_calder: standardFighter("wraith_calder"),
  warden:        standardFighter("warden"),
  jailer:        standardFighter("jailer"),

  /* ════════════════════════════════════════════════════
     18-22. NEW PLAYABLE ROSTER (added 2026-05-02)
     Sprite kits not yet on CDN — see
     docs/production/OPEN_ASSETS_2026-05-02.md §2.3.

     Note: gameData.ts uses hyphen form for shadow-tongue and
     game-master, while CDN paths use underscore form. Both keys
     are provided so callers using either form resolve correctly.
     ════════════════════════════════════════════════════ */
  programmer:      standardFighter("programmer"),
  shadow_tongue:   standardFighter("shadow_tongue"),
  "shadow-tongue": standardFighter("shadow_tongue"),
  game_master:     standardFighter("game_master"),
  "game-master":   standardFighter("game_master"),
  watcher:         standardFighter("watcher"),
  authority:       standardFighter("authority"),
};

/* ─── UTILITIES ─── */

/**
 * Get the pixel rect for a given animation frame within its sprite sheet.
 */
export function getFrameRect(
  anim: SpriteSheetAnimation,
  frameIndex: number,
): { x: number; y: number; w: number; h: number } {
  const col = anim.startCol + (frameIndex % anim.frameCount);
  return {
    x: col * SPRITE_SHEET_GRID.cellWidth,
    y: anim.row * SPRITE_SHEET_GRID.cellHeight,
    w: SPRITE_SHEET_GRID.cellWidth,
    h: SPRITE_SHEET_GRID.cellHeight,
  };
}

/**
 * Get all sheet paths that need to be preloaded for a fighter.
 */
export function getFighterSheets(fighterId: string): string[] {
  return FIGHTER_SPRITE_SHEETS[fighterId]?.sheets ?? [];
}

/**
 * Look up the animation definition for a fighter + pose.
 * Returns undefined if the fighter or pose is not found.
 */
export function getAnimation(
  fighterId: string,
  pose: string,
): SpriteSheetAnimation | undefined {
  return FIGHTER_SPRITE_SHEETS[fighterId]?.animations[pose];
}

/**
 * All valid animation pose keys.
 */
export const ANIMATION_POSES = [
  "idle",
  "walkForward",
  "walkBack",
  "jump",
  "crouch",
  "dash",
  "lightPunch",
  "mediumPunch",
  "heavyPunch",
  "lightKick",
  "mediumKick",
  "heavyKick",
  "crouchPunch",
  "crouchKick",
  "sweep",
  "jumpAttack",
  "grab",
  "special",
  "hit",
  "block",
  "ko",
  "knockdown",
  "victory",
  "taunt",
  "dizzy",
] as const;

export type AnimationPose = (typeof ANIMATION_POSES)[number];

/**
 * All fighter IDs in roster order.
 */
export const FIGHTER_IDS = [
  "architect",
  "collector",
  "enigma",
  "warlord",
  "necromancer",
  "iron_lion",
  "white_oracle",
  "agent_zero",
  "meme",
  "source",
  "akai_shi",
  "human",
  "degen",
  "prisoner",
  "wraith_calder",
  "warden",
  "jailer",
  "programmer",
  "shadow_tongue",
  "game_master",
  "watcher",
  "authority",
] as const;

export type FighterId = (typeof FIGHTER_IDS)[number];
