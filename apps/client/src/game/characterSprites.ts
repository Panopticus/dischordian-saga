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
  /** CSS background-size for the bust. Defaults to "cover". Use a custom
   *  value (e.g. "auto 220%") to zoom in on the face when the bust frames
   *  too much body for the consumer's circular crop. */
  bustSize?: string;
  /** CSS background-position for the bust. Defaults to "center top". Use a
   *  custom value to shift the visible window when zoomed in. */
  bustPosition?: string;
  /** Mouth-shape sheet. Required for lip sync. */
  viseme?: SpriteSheet & { map: VisemeMap };
  /** Optional second viseme sheet for per-line revelatory beats (e.g.
   *  Shadow Tongue's hyperextended jaw with second-row teeth on open
   *  vowels). When a caller sets `useHyperVisemes` on `SpriteCharacter`
   *  and this field is present, the runtime draws from `visemeHyper`
   *  instead of `viseme`. Must match `viseme`'s cell layout and map. */
  visemeHyper?: SpriteSheet & { map: VisemeMap };
  /** If true, the viseme sheet is a mouth-only close-up and should be
   *  composited on top of `bust` at `mouthBox`, instead of replacing the
   *  bust entirely. When false/undefined, the viseme sheet is treated as
   *  a full-face grid (legacy NPC behaviour). */
  visemeOverlay?: boolean;
  /** Where to draw the mouth overlay on the bust. Required when
   *  `visemeOverlay` is true. Values are 0-1 fractions of the rendered
   *  container (not the bust source). */
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
    // Bust is 1045x1400 with the face in the upper third (eyes ~18%, chin
    // ~32%). Cover + center-top frames the entire torso + hologram pad in
    // the consumer's circular crop, so the face only occupies ~30% of the
    // frame. Zoom 220% and slide down to centre the face at ~50% of the
    // circle — the standard "transmission portrait" framing.
    bustSize: "auto 220%",
    bustPosition: "center 12%",
    viseme: {
      url: assetUrl("characters/elara/viseme.avif"),
      cols: 4, rows: 4, frames: 16,
      map: ELARA_VISEME_MAP,
    },
    visemeOverlay: true,
    // Viseme cells are 512x512 (square). With the new zoom, the bust's
    // nose-tip lands at ~34% and chin at ~55% of the rendered container.
    // The mouthBox spans nose-to-chin in a square (height = width) so each
    // square cell composites cleanly over the corresponding face region.
    mouthBox: { x: 0.395, y: 0.34, width: 0.21, height: 0.21 },
  },

  /* The Human — protagonist; expression sheet only, no viseme/blink/breathing. */
  the_human: {
    id: "the_human",
    bust: assetUrl("characters/the_human/front_turnaround.avif"),
  },

  /* Minnie — The Meme's first form (7-year-old girl per art brief §2N).
     Inline registry entry because she shares the viseme grid layout with
     standard NPCs but has her own bespoke expression set (neutral,
     speaking, concerned, knowing, vulnerable). mouthBox sits lower in the
     frame because the child face fills a larger fraction of the bust and
     her mouth is below the bust vertical center. */
  minnie: {
    id: "minnie",
    bust: assetUrl("characters/minnie/bust.avif"),
    viseme: {
      url: assetUrl("characters/minnie/viseme.avif"),
      cols: 5, rows: 3, frames: 15,
      map: NPC_5x3_VISEME_MAP,
    },
    visemeOverlay: true,
    mouthBox: { x: 0.380, y: 0.470, width: 0.140, height: 0.105 },
    blink: {
      url: assetUrl("characters/minnie/blink.avif"),
      cols: 3, rows: 1, frames: 3,
    },
    breathing: {
      url: assetUrl("characters/minnie/breathing.avif"),
      cols: 4, rows: 2, frames: 8,
    },
    expressions: {
      url: assetUrl("characters/minnie/expressions.avif"),
      cols: 5, rows: 1, frames: 5,
      map: { neutral: 0, speaking: 1, concerned: 2, knowing: 3, vulnerable: 4 },
    },
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
  // Source is bearded like the Antiquarian; viseme sheet has a thinned
  // beard to let phoneme silhouettes read. Box lands cell nose (~y=0.12)
  // on his bust nose (~y=0.32) and cell chin-zone (~y=0.85) on his bust
  // chin-zone (~y=0.42). Face sits slightly right of frame centre.
  the_source:        npc("the_source", {
    mouthBox: { x: 0.458, y: 0.304, width: 0.184, height: 0.137 },
  }),
  // Shadow Tongue — corporate-adapted anomaly (§2E). Near-black skin,
  // violet slit-pupil eyes, subtle face-drift across cells. Standard
  // mouthBox. The `visemeHyper` slot points at a second sheet used per
  // VO-line for revelatory beats (hyperextended jaw + second-row teeth
  // on open vowels) — opt-in via `useHyperVisemes` on SpriteCharacter.
  // Runtime falls back to the standard sheet if the hyper asset fails
  // to load, so registering the slot before the asset exists is safe.
  shadow_tongue:     (() => {
    const base = npc("shadow_tongue", {
      mouthBox: { x: 0.400, y: 0.345, width: 0.140, height: 0.105 },
    });
    return {
      ...base,
      visemeHyper: {
        url: assetUrl("characters/shadow_tongue/viseme_hyper.avif"),
        cols: 5, rows: 3, frames: 15,
        map: NPC_5x3_VISEME_MAP,
      },
    };
  })(),
  // The Meme is the silver-haired older corporate executive (mechanical
  // hands at the desk). Bust shows him offset to the right of frame
  // centre. mouthBox lands cell nose (~y=0.13) on his bust nose-tip
  // (~y=0.34) and cell chin (~y=0.85) on his chin (~y=0.41).
  the_meme:          npc("the_meme", {
    mouthBox: { x: 0.520, y: 0.310, width: 0.140, height: 0.105 },
  }),

  /* Bonus characters present in the bundle. Wired so any future faction
     NPC code that references these IDs gets a portrait for free.
     Each `mouthBox` was hand-measured against its current bust so the
     mouth-only viseme sheet composites onto the correct face region.
     Characters without a mouthBox here either (a) don't speak in-game,
     or (b) have a bust/viseme mismatch awaiting asset reconciliation. */
  architect:         npc("architect", {
    // Architect's "viseme" cells are mask-vibration emissive intensities,
    // not mouth shapes. Box overlays the mask region of the hooded bust.
    mouthBox: { x: 0.350, y: 0.300, width: 0.280, height: 0.209 },
  }),
  // `cades` was never a character — CADES is the in-game FPS-mode
  // investigation system (see apps/client/src/pages/CADESFPSPage.tsx).
  // The registry stub + asset directory were created by mistake when the
  // old art brief listed CADES as Part 2H; that section has since been
  // retracted. Do not add `cades:` back unless the design genuinely adds
  // a character by that name.
  collector:         npc("collector", {
    mouthBox: { x: 0.430, y: 0.380, width: 0.140, height: 0.105 },
  }),
  degen:             npc("degen", {
    mouthBox: { x: 0.430, y: 0.350, width: 0.140, height: 0.105 },
  }),
  // Eidola: corrected bust matches §2K Sorrow-professor canon (silver-streak
  // hair, silver filigree at temples, sharp blazer + red turtleneck). Standard
  // small mouthBox; cells are mouth-only crops identity-matched to the bust.
  eidola:            npc("eidola", {
    mouthBox: { x: 0.430, y: 0.340, width: 0.140, height: 0.105 },
  }),
  // Engineer (Phase 2 / Memoir per §2V/W). Black man with short-trimmed
  // beard, goggles UP on forehead in the bust (listening variant). His
  // beard is short enough to not need aggressive thinning. Standard box.
  engineer:          npc("engineer", {
    mouthBox: { x: 0.370, y: 0.285, width: 0.140, height: 0.105 },
  }),
  enigma:            npc("enigma", {
    mouthBox: { x: 0.430, y: 0.310, width: 0.140, height: 0.105 },
  }),
  eyes:              npc("eyes", {
    mouthBox: { x: 0.430, y: 0.300, width: 0.140, height: 0.105 },
  }),
  // Gamemaster's "viseme" cells are dual-goggle emissive intensities.
  // Box overlays the cyborg-skull face region of the bust. A second
  // sheet `viseme_offset.avif` is shipped alongside for asymmetric
  // L/R goggle-pulse cues — not yet wired in the registry.
  gamemaster:        npc("gamemaster", {
    mouthBox: { x: 0.350, y: 0.290, width: 0.290, height: 0.216 },
  }),
  // Iron Lion has a full rust-red beard; cells have a thinned mustache
  // per the beard-clearance rule. Larger box for beard-to-beard blending.
  iron_lion:         npc("iron_lion", {
    mouthBox: { x: 0.380, y: 0.320, width: 0.240, height: 0.180 },
  }),
  // Kael Phase 1 (recruiter): early-phase goatee thinned for phoneme clarity.
  kael_recruiter:    npc("kael_recruiter", {
    mouthBox: { x: 0.400, y: 0.330, width: 0.220, height: 0.164 },
  }),
  matrikala:         npc("matrikala", {
    mouthBox: { x: 0.430, y: 0.330, width: 0.140, height: 0.105 },
  }),
  necromancer:       npc("necromancer", {
    mouthBox: { x: 0.430, y: 0.350, width: 0.140, height: 0.105 },
  }),
  nilmorg:           npc("nilmorg", {
    mouthBox: { x: 0.430, y: 0.330, width: 0.140, height: 0.105 },
  }),
  programmer:        npc("programmer", {
    mouthBox: { x: 0.430, y: 0.330, width: 0.140, height: 0.105 },
  }),
  seer:              npc("seer", {
    mouthBox: { x: 0.430, y: 0.350, width: 0.140, height: 0.105 },
  }),
  // Warlord: corrected bust is the armored helm-down canon per §2T. Viseme
  // cells are visor-shimmer intensity (no mouth). Box is a large overlay
  // covering the helm region so the shimmer composites on the visor.
  warlord:           npc("warlord", {
    mouthBox: { x: 0.290, y: 0.060, width: 0.420, height: 0.314 },
  }),
  // Watcher's covid mask covers the lower face. Cells render mask-tension
  // deformation rather than visible lips. Box overlays the mask region.
  watcher:           npc("watcher", {
    mouthBox: { x: 0.420, y: 0.330, width: 0.180, height: 0.134 },
  }),
};

/** Resolve a character sprite bundle by NPC id, normalising the id. */
export function getCharacterSprite(npcId: string): CharacterSprite | null {
  const key = npcId.toLowerCase().replace(/[- ]/g, "_");
  return CHARACTER_SPRITES[key] ?? null;
}
