/* ═══════════════════════════════════════════════════════
   CHARACTER SPRITES — sprite-sheet registry for talking
   heads and idle animation.

   Each character has up to four sheets:
     - viseme:     mouth-shape grid driven by wawa-lipsync
     - blink:      open / half / closed eye triptych
     - breathing:  N-frame chest-rise loop
     - expressions: emotion grid (used for choice-hover swaps)

   Plus a static `bust` (or `idle`) frame shown when no
   sheet animation is active.

   Sheets live under `apps/client/public/characters/<id>/` and
   are mirrored to S3 via apps/scripts/upload-public-to-s3.ts.

   The visemes map maps wawa-lipsync's 15-viseme set onto each
   character's actual cell layout (some characters use only 5
   vowel cells, some have rich consonant coverage).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@/lib/assetUrl";

/** wawa-lipsync's 15 visemes plus our explicit silence label. */
export type WawaViseme =
  | "viseme_sil" | "viseme_PP" | "viseme_FF" | "viseme_TH" | "viseme_DD"
  | "viseme_kk" | "viseme_CH" | "viseme_SS" | "viseme_nn" | "viseme_RR"
  | "viseme_aa" | "viseme_E" | "viseme_I" | "viseme_O" | "viseme_U";

/** A grid sheet split into evenly-sized cells, indexed in row-major order. */
export interface SpriteSheet {
  url: string;
  cols: number;
  rows: number;
  /** Total frames laid out in the sheet (cols*rows by default). */
  frames?: number;
}

/** Maps each wawa viseme to a cell index in the viseme sheet. */
export type VisemeMap = Record<WawaViseme, number>;

/** Position of the mouth on the bust, as fractions of the bust's width/height.
 *  Used to composite a mouth-only viseme cell onto the bust without hiding
 *  the eyes/hair. Origin is top-left of the visible bust frame. */
export interface MouthBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CharacterSprite {
  id: string;
  /** Static idle / bust image shown when nothing is animating. */
  bust: string;
  /** Mouth-shape sheet. Required for lip sync. */
  viseme?: SpriteSheet & { map: VisemeMap };
  /** If true, the viseme sheet is a mouth-only close-up and should be
   *  composited on top of `bust` at `mouthBox`, instead of replacing the
   *  bust entirely. When false/undefined, the viseme sheet is treated as
   *  a full-face grid (legacy NPC behaviour). */
  visemeOverlay?: boolean;
  /** Where to draw the mouth overlay on the bust. Required when
   *  `visemeOverlay` is true. Values are 0-1 fractions. */
  mouthBox?: MouthBox;
  /** Eye triptych: cell 0 open, 1 half, 2 closed. */
  blink?: SpriteSheet;
  /** Idle breathing loop. Played in order at low fps when not speaking. */
  breathing?: SpriteSheet;
  /** Expression sheet. Indices map to keys in `expressionMap`. */
  expressions?: SpriteSheet & { map: Record<string, number> };
}

/* ─── Standard viseme grids ─── */

/** Most NPCs use the 5x3 layout: REST, AA, EE, IH, OH, OO, AH, EH, UH, ER, TH, F/V, L, M/B/P, W. */
const NPC_5x3_VISEME_MAP: VisemeMap = {
  viseme_sil: 0,   // REST
  viseme_aa:  1,   // AA
  viseme_E:   7,   // EH (closer to /e/ than EE)
  viseme_I:   3,   // IH
  viseme_O:   4,   // OH
  viseme_U:   5,   // OO
  viseme_PP:  13,  // M/B/P
  viseme_FF:  11,  // F/V
  viseme_TH:  10,  // TH
  viseme_DD:  12,  // L (alveolar)
  viseme_nn:  12,  // L
  viseme_RR:  9,   // ER
  viseme_kk:  6,   // AH (back vowel approximation)
  viseme_CH:  7,   // EH (no sibilant cell)
  viseme_SS:  7,   // EH
};

/** Elara's 4x4 mouth-only grid: REST, M/B/P, F/V, TH, AH, OH, OO, EE, EH, L, K/G, W, S/Z, SURPRISE, WHISPER, SHOUT. */
const ELARA_VISEME_MAP: VisemeMap = {
  viseme_sil: 0,   // REST
  viseme_PP:  1,   // M/B/P
  viseme_FF:  2,   // F/V
  viseme_TH:  3,   // TH
  viseme_aa:  4,   // AH
  viseme_O:   5,   // OH
  viseme_U:   6,   // OO
  viseme_E:   7,   // EE
  viseme_I:   8,   // EH (closest)
  viseme_DD:  9,   // L
  viseme_nn:  9,   // L
  viseme_kk:  10,  // K/G
  viseme_RR:  11,  // W (rounded)
  viseme_SS:  12,  // S/Z
  viseme_CH:  12,  // S/Z
};

/* ─── Helper: build the standard NPC sprite bundle ─── */

/** Optional overrides for `npc()`. Pass `mouthBox` once an NPC's viseme sheet
 *  has been regenerated as a tight mouth-only crop (matching the current
 *  bust's identity) so it composites onto the bust instead of replacing it.
 *  NPCs without a `mouthBox` fall back to the legacy bust-swap path, which
 *  visually breaks until their viseme is regenerated. */
interface NpcOverrides {
  mouthBox?: MouthBox;
}

function npc(id: string, overrides: NpcOverrides = {}): CharacterSprite {
  return {
    id,
    bust: assetUrl(`characters/${id}/bust.avif`),
    viseme: {
      url: assetUrl(`characters/${id}/viseme.avif`),
      cols: 5, rows: 3, frames: 15,
      map: NPC_5x3_VISEME_MAP,
    },
    blink: {
      url: assetUrl(`characters/${id}/blink.avif`),
      cols: 3, rows: 1, frames: 3,
    },
    breathing: {
      url: assetUrl(`characters/${id}/breathing.avif`),
      cols: 4, rows: 2, frames: 8,
    },
    ...(overrides.mouthBox
      ? { visemeOverlay: true, mouthBox: overrides.mouthBox }
      : {}),
  };
}

/* ─── Registry ─── */

export const CHARACTER_SPRITES: Record<string, CharacterSprite> = {
  /* Elara — protagonist; mouth-only viseme overlay, no blink/breathing in the bundle.
     The viseme sheet is a close-up of the lower face; it is composited on top
     of `bust` at `mouthBox`, rather than replacing the bust. */
  elara: {
    id: "elara",
    bust: assetUrl("characters/elara/idle_hologram.avif"),
    viseme: {
      url: assetUrl("characters/elara/viseme.avif"),
      cols: 4, rows: 4, frames: 16,
      map: ELARA_VISEME_MAP,
    },
    visemeOverlay: true,
    // Bust is 1045x1400; viseme cells are 512x512 (square). The box is sized
    // and positioned so each cell's nose-tip and chin land on Elara's nose-tip
    // (~y=0.29) and chin (~y=0.36), with the cell's hologram-collar glow
    // overlapping the bust's collar. Width keeps the px aspect square.
    mouthBox: { x: 0.389, y: 0.278, width: 0.162, height: 0.121 },
  },

  /* The Human — protagonist; expression sheet only, no viseme/blink/breathing. */
  the_human: {
    id: "the_human",
    bust: assetUrl("characters/the_human/front_turnaround.avif"),
  },

  /* Main faction NPC speakers — full bundle. */
  // Agent Zero's viseme sheet is a 5×3 nose-to-chin mouth crop (cells
  // ~409×409, 1:1). Box positions each cell's nose-tip and chin onto her
  // bust's nose-tip (~y=0.36) and chin (~y=0.44). Her face sits slightly
  // right-of-center because of the asymmetric hood drape + windswept hair.
  agent_zero:        npc("agent_zero", {
    mouthBox: { x: 0.461, y: 0.340, width: 0.158, height: 0.118 },
  }),
  // Locke's viseme sheet is a 5×3 nose-to-chin mouth crop (cells ~409×409,
  // 1:1). Box positions each cell's nose-tip and chin onto her bust's
  // nose-tip (~y=0.42) and chin (~y=0.50). Width keeps px aspect square.
  adjudicator_locke: npc("adjudicator_locke", {
    mouthBox: { x: 0.428, y: 0.409, width: 0.143, height: 0.107 },
  }),
  // Antiquarian's viseme cells have a thinned mustache per the art brief
  // (§2A §beard-clearance) so phoneme silhouettes read through. Box is
  // sized so each cell's nose-tip lands on his bust's nose-tip (~y=0.40)
  // and the cell's mouth region overlays where his mouth is hidden under
  // the mustache (~y=0.46). Larger than the others because his cells
  // include substantial visible beard that blends with the bust's beard.
  the_antiquarian:   npc("the_antiquarian", {
    mouthBox: { x: 0.256, y: 0.374, width: 0.287, height: 0.214 },
  }),
  the_source:        npc("the_source"),
  shadow_tongue:     npc("shadow_tongue"),
  the_meme:          npc("the_meme"),

  /* Bonus characters present in the bundle. Wired so any future faction
     NPC code that references these IDs gets a portrait for free. */
  architect:         npc("architect"),
  cades:             npc("cades"),
  collector:         npc("collector"),
  degen:             npc("degen"),
  eidola:            npc("eidola"),
  engineer:          npc("engineer"),
  enigma:            npc("enigma"),
  eyes:              npc("eyes"),
  gamemaster:        npc("gamemaster"),
  iron_lion:         npc("iron_lion"),
  kael_recruiter:    npc("kael_recruiter"),
  matrikala:         npc("matrikala"),
  necromancer:       npc("necromancer"),
  nilmorg:           npc("nilmorg"),
  programmer:        npc("programmer"),
  seer:              npc("seer"),
  warlord:           npc("warlord"),
  watcher:           npc("watcher"),
};

/** Resolve a character sprite bundle by NPC id, normalising the id. */
export function getCharacterSprite(npcId: string): CharacterSprite | null {
  const key = npcId.toLowerCase().replace(/[- ]/g, "_");
  return CHARACTER_SPRITES[key] ?? null;
}
