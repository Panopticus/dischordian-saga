/**
 * Card art prompts — ELEMENTAL faction (4 elements × 5 cards = 20 cards).
 *
 * Element cards are NOT tier-up variants — they are 5 discrete
 * cards per element (common → uncommon → rare → epic → legendary),
 * numbered `s1_elem_<element>_01` through `_05`. All are
 * faction-neutral. Each element has its own visual language tied
 * to its mechanical identity:
 *
 *   - fire:  fast/aggressive/brittle (rush, celerity, direct damage)
 *   - water: control/heal/dispel
 *   - earth: defensive/grow/provoke
 *   - air:   evasion/flying/draw
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const ELEMENTAL_PROMPTS_LIST: readonly CardArtPrompt[] = [
  // ─── FIRE ELEMENT — rush + celerity + direct damage ───
  {
    cardId: "s1_elem_fire_01",
    sceneDelta:
      "Mid-shot. An Ember Scout — a small humanoid fire-elemental, approximately knee-high to a human, made of glowing ember-orange coals with thin warm-amber flame-edges along its outline. Its head is a single bright ember with two small black eye-voids; its body is roughly human-shaped but proportioned for SPRINTING. It is mid-stride along a long empty stone road at dusk — leading foot already ahead of its body, trailing foot still pushing off, faint warm rush-trails leaking from both heels (rush visualized). Behind it, the road extends to the horizon, completely empty. Ahead of it, a single distant door at the road's far end is faintly visible. The Ember Scout is the SINGLE bright thing on the entire road.",
    moodKeywords: [
      "a single candle on a long empty road",
      "does not last — gets the door open",
      "the only bright thing on the road",
      "mid-stride, rush-trails",
    ],
    palette:
      "Warm ember-orange + warm-amber flame-edge + cool dusk grey-violet sky + cool grey stone road + faint warm rush-trails",
    composition:
      "Mid-shot side three-quarter, Ember Scout mid-stride at frame-centre, road extending to horizon, distant door at upper-third",
    notes:
      "Common unit. The 'single candle on a long empty road' is canon-direct from flavor. Rush visualized as heel-trails (consistent with Soldier-class Rush idiom). Generic-elemental form — not a known character.",
  },
  {
    cardId: "s1_elem_fire_02",
    sceneDelta:
      "Tight composition. A Spark Fragment caught in mid-flight at the moment of release — a single luminous warm-amber spark approximately the size of a fist, leaving a hand at frame-left (only the fingertips of the casting hand visible at the very edge of frame). The spark is mid-trajectory, three faint after-image trails behind it (the moment-of-decision visualized as multiple). Ahead of it (out of frame) the implied target. The casting hand is anonymous (only fingertips); the fingers are mid-release-gesture, fingers extended in a flick. Around the spark, faint heat-haze distorts the air. Behind the spark, the deep-background is intentionally sparse — a single low warm-amber horizon-glow only.",
    moodKeywords: [
      "a decision that stops being one the moment you let go",
      "fingertips at the edge of frame",
      "three after-image trails",
      "deal 3 damage as a single spark",
    ],
    palette:
      "Warm-amber spark core + warm fingertip-light + cool deep-background + low warm horizon-glow + faint heat-haze",
    composition:
      "Tight composition, spark at frame-centre mid-trajectory, casting fingertips at frame-left edge",
    notes:
      "Spell card. Anonymous fingertips (only the very tips) preserve no-character-conflation. The 'decision stops being one' framing is rendered as the spark's irreversible mid-flight — already past the point of recall.",
  },
  {
    cardId: "s1_elem_fire_03",
    sceneDelta:
      "Action mid-shot. A Blaze Lancer — a humanoid fire-elemental in rough female-presenting silhouette, made of denser deep-orange flame than the Scout (more saturated, more concentrated, but visibly THINNING at the lower legs — half of her is already SPENT). She is mid-attack with a tall lance of pure pale-amber flame, the lance held in both hands diagonally across her body, mid-swing. Two faint warm-amber after-image strikes hover behind the active strike (celerity visualized — she has already struck once and is striking again). Around her, the air is heat-distorted. Her face is set, focused, slightly hollow at the cheek-bones (the cost is showing). Behind her, the deep-background is a smoke-blackened battlefield mid-distance.",
    moodKeywords: [
      "the first strike has already used up half of her",
      "thinning at the lower legs",
      "two after-image strikes — celerity",
      "set, focused, slightly hollow",
    ],
    palette:
      "Deep-orange flame-body + pale-amber lance-flame + warm-amber after-images + cool smoke-blackened battlefield + heat-distortion",
    composition:
      "Action mid-shot side three-quarter, Lancer at frame-centre mid-strike with lance, after-images at upper-third",
    notes:
      "Rare unit. The thinning-lower-body is the canonical visualization of fire-elemental cost-of-celerity (the first strike spent half of her). Generic-elemental form; female-presenting silhouette must NOT match any named character.",
  },
  {
    cardId: "s1_elem_fire_04",
    sceneDelta:
      "Wider mid-shot. A Conflagration — a massive sustained fire occupying most of the frame, NOT a discrete elemental but a self-sustaining inferno that has stopped requiring fuel. The flames are deep-orange at the core, transitioning through warm-amber to a strange pale-blue-white at the outermost edges (the heat is so intense that the flame's COLOR has shifted past visible-fire into something else). Through the heart of the flame, faint ghostly silhouettes of CONTEXT being metabolized are barely visible — the shape of a wall, a column, a chair, all being consumed not for fuel but for MEANING. The conflagration radiates outward in all directions. There is no human figure in the frame. The targeting is implied as 'this is what hits the enemy general.'",
    moodKeywords: [
      "stopped waiting for fuel",
      "now metabolizing context",
      "color shifted past visible-fire",
      "ghostly silhouettes of meaning being consumed",
    ],
    palette:
      "Deep-orange fire-core + warm-amber middle-zone + pale-blue-white outermost-edge + ghostly cool silhouettes through heart + heat-distortion all directions",
    composition:
      "Wider mid-shot, conflagration filling frame, ghostly context-silhouettes barely visible through heart",
    notes:
      "Spell card. NO human figure (conflagration IS the subject). The 'metabolizing context' is rendered literally as ghostly silhouettes of objects being consumed for meaning rather than fuel. Pale-blue-white outermost edge is the canonical fire-beyond-fire visual signature.",
  },
  {
    cardId: "s1_elem_fire_05",
    sceneDelta:
      "Wider mid-shot. The First Flame — a tall humanoid fire-elemental, taller than a normal human by half, of EXTREMELY dense and saturated deep-orange-and-warm-amber flame-body. Where most fire-elementals are flickering/unstable, the First Flame is solid — has been burning so long it has become STABLE. Its silhouette is broadly humanoid but with subtly archaic proportions (an older-than-civilization stance — feet planted slightly wider, shoulders set slightly more square than modern bodies). Its 'face' is composed of two deeper-orange eye-voids and a single horizontal flame-line for a mouth, the mouth-line slightly tense. Around it, faint warm rush-trails leak from heels (rush); two after-image strikes flicker at its hands (celerity); a faint warm-amber frenzy-rim flickers along its body's leading edge (frenzy). Behind it, an empty pre-civilization landscape — bare rock, distant volcanic glow, no buildings, no people, no warmth-needing-bodies. The flame's expression conveys patience worn thin.",
    moodKeywords: [
      "burning since before there were hands to warm by it",
      "very tired of not being used",
      "patience worn thin",
      "pre-civilization landscape",
    ],
    palette:
      "Deep-orange-and-warm-amber stable flame-body + pre-civilization bare-rock + distant volcanic glow + warm rush-trails + warm celerity after-images + warm frenzy-rim",
    composition:
      "Wider mid-shot front three-quarter, First Flame at frame-centre, pre-civilization landscape extending behind",
    notes:
      "Legendary unit. The pre-civilization landscape (bare rock + volcanic glow + no buildings) is the visual key to 'before there were hands.' Three keywords (rush + celerity + frenzy) rendered as three distinct visual elements simultaneously. Stable-flame silhouette differentiates from unstable lower-tier fire-elementals.",
  },
] as const;

/**
 * Elemental faction's prompt registry, keyed by card id.
 *
 * Currently populated: 1 / 4 elements (Fire).
 * TODO: water, earth, air.
 */
export const ELEMENTAL_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(ELEMENTAL_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
