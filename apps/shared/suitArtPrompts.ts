/* ═══════════════════════════════════════════════════════
   SUITS OF THE INVENTOR — ART PROMPT CATALOG

   Typed port of plan §G.8 — "Art-prompt spec, precise
   enough to layer." Produces 1,080 composable catalog
   prompts (18 named sets × 6 rarity tiers × 10 piece
   slots). Consumed by apps/scripts/generate-suit-art-csv.ts
   to emit production-queue CSVs for the art backend.

   This module is CATALOG ONLY. It does not import runtime
   gear state, set bonuses, recipes, or schematics — those
   land in later Step 8–11 files (suitSets.ts, suitRecipes.ts,
   suitBonuses.ts, starterLoadout.ts, schematics.ts). Every
   constant here corresponds to a line of the plan's §G.8
   template so artists can trace any string back to canon.

   Coverage invariant (see sibling suitArtPrompts.test.ts):
     SUIT_ART_PROMPTS.length === SUIT_SET_ROSTER.length *
       RARITY_ORDER.length * SUIT_SLOT_ORDER.length === 1080.
   ═══════════════════════════════════════════════════════ */

export type Priority = "P0" | "P1" | "P2";

export type SuitSlot =
  | "head"
  | "chest"
  | "shoulders"
  | "arms"
  | "gloves"
  | "belt"
  | "legs"
  | "feet"
  | "weapon-primary"
  | "back";

/** Slot order matches §G.6 set-count (8 armor + weapon + back = 10). */
export const SUIT_SLOT_ORDER: readonly SuitSlot[] = [
  "head",
  "chest",
  "shoulders",
  "arms",
  "gloves",
  "belt",
  "legs",
  "feet",
  "weapon-primary",
  "back",
] as const;

export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export const RARITY_ORDER: readonly Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
] as const;

export type ElementKey =
  | "earth"
  | "fire"
  | "water"
  | "air"
  | "space"
  | "time"
  | "probability"
  | "reality";

export type SpeciesKey = "demagi" | "quarchon" | "neyon" | "human";

export type SetCategory = "class" | "species" | "element" | "foundation";

export interface SuitArtPrompt {
  /** Stable asset id — `<setId>:<rarity>:<slot>`. */
  assetId: string;
  setId: string;
  setName: string;
  category: SetCategory;
  rarity: Rarity;
  slot: SuitSlot;
  /** The fully composed prompt body, ready for RFC-4180 CSV quoting. */
  prompt: string;
  /** Target catalog resolution (matches the §G.8 preamble). */
  resolution: string;
  priority: Priority;
  dependencies: readonly string[];
}

/* ─── §G.8 fixed preamble ─── */

/**
 * The preamble every suit-piece prompt inherits. Pivot pixels, pose,
 * lighting, and canvas are baked — when an artist honors these, the
 * compositor in `compositePaperDoll.ts` (Step 9) can blit each slot
 * by layerZ without per-piece alignment logic.
 */
export const SUIT_PREAMBLE =
  "Full-body orthographic character-reference render, 1024x1536, 2:3, " +
  "transparent background, single figure centered on vertical axis, " +
  "feet planted on a clean horizon at y=1480, head crown at y=120, " +
  "A-pose arms slightly forward at 10 degrees from the body, " +
  "camera at chest height with zero tilt, 50mm lens, " +
  "soft top-down three-point studio lighting, no cast shadows on ground, " +
  "androgynous lithe muscular build, no secondary sex characteristics, " +
  "gender illegible, identical silhouette across all operatives, " +
  "matte skin reference, no motion blur, no depth of field, " +
  "isolated on transparent alpha, no ground plane, no props, " +
  "no text, no watermarks, no logos, " +
  "art style: cyberpunk meets steampunk sorcery, brass + black-iron + luminous glyphs, " +
  "hand-painted edges over clean vector base.";

/* ─── §G.5 rarity visual rules ─── */

export const RARITY_LABELS: Record<Rarity, string> = {
  common: "Salvage",
  uncommon: "Refit",
  rare: "Wrought",
  epic: "Master-Forged",
  legendary: "Inventor-Pattern",
  mythic: "Inventor's Original",
};

export const RARITY_MODIFIERS: Record<Rarity, string> = {
  common:
    "matte materials, zero glow, minimal decal, light surface wear",
  uncommon:
    "one subtle glow accent, light etched filigree along primary edge",
  rare:
    "two glow accents, polished metallic finish, visible rivets, faint element halo",
  epic:
    "animated micro-glow hint, embossed set sigil, enamel inlay, intricate filigree",
  legendary:
    "element-reactive glow pulses (shown mid-pulse), moving filigree cues, heirloom patina",
  mythic:
    "one-of-one heirloom, hand-painted surface cracks and repairs, signed with the Inventor's sigil at a hidden corner, iridescent not-color underlayer visible at edges",
};

/* ─── §G.8 element palettes (anchor + accent) ─── */

export const ELEMENT_PALETTES: Record<ElementKey, string> = {
  earth: "#5b4a2a anchor + #a87f3b accent",
  fire: "#7a1e13 anchor + #f4a13a accent",
  water: "#13344a anchor + #6fd3e7 accent",
  air: "#d9e7ef anchor + #9fb1bf accent",
  space: "#0a0614 anchor + #b6a8f2 accent",
  time: "#2b2414 anchor + #e6c87a accent",
  probability: "#221b2d anchor + #d8f05a accent",
  reality: "#050506 anchor + #7a76d8 accent, iridescent null-sheen",
};

/* ─── §G.8 species decals ─── */

export const SPECIES_DECALS: Record<SpeciesKey, string> = {
  demagi:
    "hand-etched illuminated rune overlay, glyphs breathe with soft internal glow",
  quarchon:
    "exposed clockwork gear detail at joint seams, visible brass rivets, steam-vent slits",
  neyon:
    "gold filigree threading between rune and circuit motifs, duotone gold/black",
  human:
    "hand-stitched fabric seams, visible ink-and-paper circuitry, photograph-locket clasps",
};

/**
 * Neutral decal used when a set is not species-themed. Explicit
 * "none" signals the artist that the slot must render without any
 * species overlay — producers can drop the line from their brief.
 */
export const NEUTRAL_SPECIES_DECAL = "none — render without species overlay";

/** Neutral palette for non-element-themed sets. */
export const NEUTRAL_ELEMENT_PALETTE =
  "neutral brass + oil-blued steel + oxblood accents; no element tint baked (applied at composite)";

/* ─── §G.8 anatomical-region table ─── */

export interface AnatomicalRegion {
  slot: SuitSlot;
  /** Plain-English region the piece must cover (and no more). */
  region: string;
}

/** Pivot points (do not move) — §G.8. */
export const SUIT_PIVOT_POINTS =
  "Pivot points (do not move): shoulders: x=430/x=594, y=360; elbows: x=380/x=644, y=620; " +
  "wrists: x=342/x=682, y=880; hips: x=468/x=556, y=900; knees: x=470/x=554, y=1180; " +
  "ankles: x=472/x=552, y=1440; crown: x=512, y=120; chin: x=512, y=310.";

export const ANATOMICAL_REGIONS: Record<SuitSlot, string> = {
  head: "skull-cap through occipital, optional side panels to ears (above chin y=310)",
  chest: "sternum to waistline, y=360 to y=760",
  shoulders: "deltoid caps, x=380 to x=644, y=340 to y=440",
  arms: "elbow through mid-forearm, both limbs",
  gloves: "wrist to fingertip, both hands",
  belt: "waistline band, y=760 to y=830",
  legs: "hipline to knee",
  feet: "ankle through toe",
  "weapon-primary": "right-hand-held weapon, centered on pivot x=682 y=880",
  back:
    "posterior of torso & legs as a single cloak-layer, mirrored alpha",
};

/* ─── §G.4 named-set roster (18 entries) ─── */

export interface SuitSetDef {
  id: string;
  name: string;
  category: SetCategory;
  /** Signature motif — plain-English, drives the `Piece motif:` line. */
  motif: string;
  /** If the set is element-themed, palette is baked. */
  bakedElement?: ElementKey;
  /** If the set is species- or foundation-themed, decal is baked. */
  bakedSpecies?: SpeciesKey;
}

/** Class sets (5). Silhouette is keyed to the class archetype. */
const CLASS_SETS: readonly SuitSetDef[] = [
  {
    id: "regalia-of-the-seeing-stylus",
    name: "Regalia of the Seeing Stylus",
    category: "class",
    motif:
      "Oracle suit — brass orrery pauldrons, quill-pen gauntlets, glyph-printed long-coat over a cuirass, divination cant embroidered on the hem",
  },
  {
    id: "pressure-loom-harness",
    name: "Pressure-Loom Harness",
    category: "class",
    motif:
      "Engineer suit — segmented copper plates, pneumatic elbow joints, wrench-holster belt, leather welder's apron, brass-rimmed goggles seated on the forehead",
  },
  {
    id: "black-crepe-weave",
    name: "Black-Crepe Weave",
    category: "class",
    motif:
      "Assassin suit — ribbed chitinous weave, chained sashes across the torso, reverse-grip dagger sheath on the thigh, void-black crepe wrap at the throat",
  },
  {
    id: "bulwark-of-the-eighth-column",
    name: "Bulwark of the Eighth Column",
    category: "class",
    motif:
      "Soldier suit — riveted plating, shield-rail on the back, marching-band epaulets with tarnished braid, regimental buckles at the belt",
  },
  {
    id: "low-profile-tailoring",
    name: "Low-Profile Tailoring",
    category: "class",
    motif:
      "Spy suit — cut suit with hidden armor plates, wire-spool cufflinks, stiletto pen at the breast pocket, razor-thin tie-pin sigil",
  },
];

/** Species sets (3). Decal is baked into the prompt. */
const SPECIES_SETS: readonly SuitSetDef[] = [
  {
    id: "arcane-rune-regalia",
    name: "Arcane-Rune Regalia",
    category: "species",
    bakedSpecies: "demagi",
    motif:
      "Demagi ceremonial suit — hand-etched circuitry blended with illuminated runes; glow breathes at cast; rune overlay brightens at the shoulders and crown",
  },
  {
    id: "clockwork-exoframe",
    name: "Clockwork Exoframe",
    category: "species",
    bakedSpecies: "quarchon",
    motif:
      "Quarchon exoframe — exposed gears at the joints, steam vents at the shoulders, polished chrome plating over oil-blued steel, brass rivet bands",
  },
  {
    id: "hybrid-vein-panoply",
    name: "Hybrid-Vein Panoply",
    category: "species",
    bakedSpecies: "neyon",
    motif:
      "Ne-Yon panoply — gold/black duotone, living filigree that threads between circuit and rune, vein-tracery pulses slowly across every plate",
  },
];

/** Element sets (8). Palette is baked; decal stays neutral. */
const ELEMENT_SETS: readonly SuitSetDef[] = [
  {
    id: "geomancers-stratum",
    name: "Geomancer's Stratum",
    category: "element",
    bakedElement: "earth",
    motif:
      "Earth regalia — layered slate tiles, vein-ore accents, lantern of ley-light at the belt, stone-cut gauntlets",
  },
  {
    id: "ember-bellows-array",
    name: "Ember-Bellows Array",
    category: "element",
    bakedElement: "fire",
    motif:
      "Fire regalia — forge-bellows pauldrons, coal-glow spine, brass-piped gauntlets, ember seams at the seams",
  },
  {
    id: "tide-engine-carapace",
    name: "Tide-Engine Carapace",
    category: "element",
    bakedElement: "water",
    motif:
      "Water regalia — riveted dive-plate, kelp-filigree cloak, pressure-gauge chestpiece, copper porthole knee-plates",
  },
  {
    id: "aetheric-dirigible-rig",
    name: "Aetheric Dirigible Rig",
    category: "element",
    bakedElement: "air",
    motif:
      "Air regalia — canvas-sailed wings, brass altimeter collar, balloon-silk cloak, rope-rigged shoulders",
  },
  {
    id: "void-sextant-ensemble",
    name: "Void-Sextant Ensemble",
    category: "element",
    bakedElement: "space",
    motif:
      "Space regalia — black-lacquer plate, silver starchart inlay, astrolabe pauldron, constellation-pricked greaves",
  },
  {
    id: "chronometer-livery",
    name: "Chronometer Livery",
    category: "element",
    bakedElement: "time",
    motif:
      "Time regalia — pale-gold gears visible under a glass chestplate, second-hand on the crown, escapement-engraved gauntlets",
  },
  {
    id: "dicewrights-motley",
    name: "Dicewright's Motley",
    category: "element",
    bakedElement: "probability",
    motif:
      "Probability regalia — asymmetric panels, die-faceted shoulders, flipping-coin buckle, odds-and-evens dual-tone greaves",
  },
  {
    id: "null-weaver-mantle",
    name: "Null-Weaver Mantle",
    category: "element",
    bakedElement: "reality",
    motif:
      "Reality regalia — iridescent not-black cloth, seams that aren't there, fracture-line gloves, a cloak whose edges refuse to settle",
  },
];

/** Foundation sets (2). Decal baked to Human / Machine. */
const FOUNDATION_SETS: readonly SuitSetDef[] = [
  {
    id: "the-mourners-coat",
    name: "The Mourner's Coat",
    category: "foundation",
    bakedSpecies: "human",
    motif:
      "Humanity foundation — long hand-stitched coat, photograph-lockets at the breast, paper-and-ink circuitry traced onto the lining, oxblood-dyed cuffs",
  },
  {
    id: "the-first-chassis",
    name: "The First Chassis",
    category: "foundation",
    // Machine foundation has no species decal — it's the baseline chassis.
    motif:
      "Machine foundation — cold-rolled plating, LED-vein underglow, replaceable-limb hardpoints, standardized socket seams at every joint",
  },
];

/** The full 18-set roster. Order is stable for CSV producer routing. */
export const SUIT_SET_ROSTER: readonly SuitSetDef[] = [
  ...CLASS_SETS,
  ...SPECIES_SETS,
  ...ELEMENT_SETS,
  ...FOUNDATION_SETS,
];

/* ─── Composer ─── */

/**
 * Fill the §G.8 piece template for a given (set, rarity, slot) triple.
 * Pure — same input always yields the same string.
 */
export function buildSuitPrompt(
  set: SuitSetDef,
  rarity: Rarity,
  slot: SuitSlot,
): string {
  const elementPalette = set.bakedElement
    ? ELEMENT_PALETTES[set.bakedElement]
    : NEUTRAL_ELEMENT_PALETTE;
  const speciesDecal = set.bakedSpecies
    ? SPECIES_DECALS[set.bakedSpecies]
    : NEUTRAL_SPECIES_DECAL;

  const body =
    `Render ONLY the ${slot} piece for the ${set.name} suit, ${RARITY_LABELS[rarity]} tier. ` +
    `The piece covers ${ANATOMICAL_REGIONS[slot]}; everything outside this region must be ` +
    `fully transparent alpha, including any part of the body itself. ` +
    `Piece motif: ${set.motif}. ` +
    `Rarity modifiers: ${RARITY_MODIFIERS[rarity]}. ` +
    `Element tint: ${elementPalette}. ` +
    `Species etching overlay: ${speciesDecal}. ` +
    `Alignment with base pose: joints at exact pixel pivots. ${SUIT_PIVOT_POINTS} ` +
    `Do not render any body part or clothing outside the ${slot} anatomical region.`;

  return `${SUIT_PREAMBLE}\n\n${body}`;
}

/** Resolution baked into the preamble; exposed for consumers. */
export const SUIT_ART_RESOLUTION = "1024x1536";

/** Global dependency list every entry carries. */
const SUIT_ART_DEPENDENCIES = ["suit_preamble", "suit_pivot_points"] as const;

/**
 * Stable asset id — `<setId>:<rarity>:<slot>`. The uniqueness invariant
 * is enforced by the coverage test; keep this format in lockstep with
 * anything consuming it downstream (renderer, validator, CSV parser).
 */
function assetIdFor(
  set: SuitSetDef,
  rarity: Rarity,
  slot: SuitSlot,
): string {
  return `${set.id}:${rarity}:${slot}`;
}

/* ─── The full catalog: 18 × 6 × 10 = 1,080 entries ─── */

function expandCatalog(): readonly SuitArtPrompt[] {
  const out: SuitArtPrompt[] = [];
  for (const set of SUIT_SET_ROSTER) {
    for (const rarity of RARITY_ORDER) {
      for (const slot of SUIT_SLOT_ORDER) {
        out.push({
          assetId: assetIdFor(set, rarity, slot),
          setId: set.id,
          setName: set.name,
          category: set.category,
          rarity,
          slot,
          prompt: buildSuitPrompt(set, rarity, slot),
          resolution: SUIT_ART_RESOLUTION,
          // Common & Uncommon pipe first so partial sets land on the
          // paper doll early; higher tiers are P1 (still ship-critical,
          // just later in the producer queue).
          priority:
            rarity === "common" || rarity === "uncommon" ? "P0" : "P1",
          dependencies: SUIT_ART_DEPENDENCIES,
        });
      }
    }
  }
  return out;
}

export const SUIT_ART_PROMPTS: readonly SuitArtPrompt[] = expandCatalog();
