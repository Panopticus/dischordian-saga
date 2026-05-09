/* ═══════════════════════════════════════════════════════
   CHARACTER COSPLAY METADATA
   audit/16 PR 12 (Cluster E / finding Cos4 — Cosplay persona).

   Per-NPC metadata that cosplayers and AI-prompt generators
   need to faithfully reproduce a character: canonical
   height (so a 5'2" cosplayer knows whether they're scaling
   up or down), build type, age approximation, default
   expression for prompt-generator priming.

   Lives in a parallel registry rather than extending
   `apps/client/src/game/npcPortraits.ts` so consumers that
   already import that file (lots of them) don't get
   structurally affected. Aggregated alongside portraits
   via `apps/shared/characterCanon.ts`.

   The taxonomy here is intentionally narrow — these are
   the four facts every cosplayer asks first, in the order
   they ask them. Authoring extensions should add new
   per-NPC entries; new TAXONOMY fields require justifying
   the addition against the audit's "what cosplayers need
   to scale" framing.
   ═══════════════════════════════════════════════════════ */

export type CharacterBuildType =
  | "slim" | "athletic" | "average" | "stocky" | "broad"
  | "non_humanoid";

export type CharacterAgeBand =
  | "child" | "teen" | "young_adult" | "adult" | "older_adult"
  | "ancient" | "ageless";

export interface CharacterCosplayMetadata {
  /** NPC id matching `NPC_PORTRAITS[id]` in npcPortraits.ts. */
  id: string;
  /**
   * Canonical height in centimetres (preferred over feet/inches
   * for international cosplay communities). null when the
   * character has no canonical body — Source, Meme, etc. */
  canonicalHeightCm: number | null;
  buildType: CharacterBuildType;
  ageBand: CharacterAgeBand;
  /**
   * Free-text age approximation — useful when ageBand alone
   * undersells the character's lived-history. e.g. Antiquarian
   * is "older_adult" but the prompt context wants "early 60s,
   * a face that's spent forty years in stacks."
   */
  ageApproximationNote: string;
  /**
   * Default expression key on the NPC's expressions map. Used
   * by AI-prompt generators as the priming pose. Maps to
   * `NPC_PORTRAITS[id].expressions[<key>]`. */
  defaultExpressionKey: "neutral" | "emotional1" | "emotional2" | "speaking";
  /**
   * Short cosplay-specific note. Calls out the costume
   * spine — the one thing a cosplayer should get right
   * even at the cost of secondary detail. */
  cosplaySpine: string;
}

/** Seed entries for the 8 NPCs in NPC_PORTRAITS. Authors
 *  extend this list as new NPCs ship. */
export const CHARACTER_COSPLAY_METADATA: Readonly<Record<string, CharacterCosplayMetadata>> = {
  elara: {
    id: "elara",
    canonicalHeightCm: 168,
    buildType: "athletic",
    ageBand: "young_adult",
    ageApproximationNote: "late 20s; the precision is hard-earned, not natural.",
    defaultExpressionKey: "neutral",
    cosplaySpine:
      "The pulled-back hair and the maintenance-jacket cuffs. She's the chief engineer of a sleeping ship — every detail is small, deliberate, and lived-in.",
  },
  the_human: {
    id: "the_human",
    canonicalHeightCm: 175,
    buildType: "average",
    ageBand: "young_adult",
    ageApproximationNote:
      "appears 24-28 depending on trust band; the static-shimmer makes age unreliable on purpose.",
    defaultExpressionKey: "neutral",
    cosplaySpine:
      "The static-shimmer hair effect. Without it, the cosplay looks like a wig and a costume; with it, the character is recognisable from across a convention floor.",
  },
  agent_zero: {
    id: "agent_zero",
    canonicalHeightCm: 182,
    buildType: "athletic",
    ageBand: "adult",
    ageApproximationNote:
      "mid-30s; carries himself like he's older. The trench coat does the aging.",
    defaultExpressionKey: "neutral",
    cosplaySpine:
      "The trench coat's drape and the absence of a visible badge. He's been off-grid long enough that the official iconography is muscle memory he's deliberately erased.",
  },
  locke: {
    id: "locke",
    canonicalHeightCm: 178,
    buildType: "stocky",
    ageBand: "older_adult",
    ageApproximationNote:
      "early 50s; weathered. The hands matter more than the face.",
    defaultExpressionKey: "neutral",
    cosplaySpine:
      "The merchant-coat layering. He's a trader who's been in cold orbit for two decades; the fabric should look like it's outlasted three relationships.",
  },
  the_source: {
    id: "the_source",
    canonicalHeightCm: null,
    buildType: "non_humanoid",
    ageBand: "ageless",
    ageApproximationNote:
      "no body, no age. Cosplays of the Source typically use a robe + projection rig.",
    defaultExpressionKey: "neutral",
    cosplaySpine:
      "The hood/projection silhouette. There's no face to get right — the cosplay is purely about the radiated presence. Less is more.",
  },
  antiquarian: {
    id: "antiquarian",
    canonicalHeightCm: 172,
    buildType: "slim",
    ageBand: "older_adult",
    ageApproximationNote:
      "early 60s; a face that's spent forty years in stacks. Reading glasses on a chain.",
    defaultExpressionKey: "neutral",
    cosplaySpine:
      "The reading-glasses chain and the indigo-stained right cuff. Both are diegetic — the chain because she misplaces them constantly, the cuff because she works the warm-gold layer first and the indigo bleeds.",
  },
  shadow_tongue: {
    id: "shadow_tongue",
    canonicalHeightCm: null,
    buildType: "non_humanoid",
    ageBand: "ageless",
    ageApproximationNote:
      "no canonical body. The Shadow Tongue is presence-as-edit — cosplays render as a diffused silhouette or as a person with their face obscured by black ribbon.",
    defaultExpressionKey: "neutral",
    cosplaySpine:
      "The face-obscurement. The character IS the absence of identity; any visible face contradicts the lore. Black ribbon, indigo light bleed, no eyes.",
  },
  the_meme: {
    id: "the_meme",
    canonicalHeightCm: 168,
    buildType: "average",
    ageBand: "young_adult",
    ageApproximationNote:
      "perpetual 26. The Meme renders as the platonic form of a chaos-agent newscaster.",
    defaultExpressionKey: "speaking",
    cosplaySpine:
      "The PAC News Network microphone + the deliberate-bad-haircut. The Meme is a parody of a parody — the cosplay should look slightly wrong on purpose.",
  },
};

/* ─── Pure helpers ─────────────────────────────────────── */

export function getCharacterCosplayMetadata(
  npcId: string,
): CharacterCosplayMetadata | null {
  return CHARACTER_COSPLAY_METADATA[npcId] ?? null;
}

/** Coverage helper — returns ids declared in the metadata
 *  registry. Useful for ship-check parity once the audit
 *  ratchet for "every NPC_PORTRAITS id has metadata" lands. */
export function listCosplayMetadataIds(): readonly string[] {
  return Object.keys(CHARACTER_COSPLAY_METADATA);
}
