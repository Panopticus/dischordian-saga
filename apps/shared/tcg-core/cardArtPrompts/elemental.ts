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

  // ─── WATER ELEMENT — heal + dispel + drain ───
  {
    cardId: "s1_elem_water_01",
    sceneDelta:
      "Mid-shot. A Tide Keeper — a humanoid water-elemental, female-presenting silhouette, body composed of translucent cool-cyan water with subtle internal currents visible. They stand at the edge of an open shore, mid-tide, the sea at their right. Their posture is calm-attentive — they are NOT facing the wave currently breaking; they are facing the wave that comes AFTER, standing 'one wave back' from it. One hand is extended palm-down toward the friendly side (off-frame at frame-left), a faint warm-amber heal-glow pulse traveling down their arm and outward (heal-2 visualized). Behind them, the breaking wave is already past; ahead of them in the sea, the next wave is forming. Their face is composed of cool-cyan water with two small luminous deeper-cyan eye-points and a calm mouth-line.",
    moodKeywords: [
      "knows which wave is going to be the one that matters",
      "stands one wave back",
      "facing the wave after the breaking one",
      "calm-attentive water-elemental",
    ],
    palette:
      "Cool-cyan translucent water-body + warm-amber heal-glow + cool deep-sea blue + warm shore-sand + cool dawn ambient",
    composition:
      "Mid-shot side three-quarter, Tide Keeper at frame-centre, breaking wave behind them, forming wave ahead",
    notes:
      "Common unit. The 'one wave back from the wave that matters' framing is canon-direct from flavor — rendered as the Keeper's posture and gaze. Heal-glow as warm-amber is the canonical heal visual idiom (consistent with Locke Imprint set's Ark life-support visualization).",
  },
  {
    cardId: "s1_elem_water_02",
    sceneDelta:
      "Wider mid-shot. A Dissolving Wave — a single tall wall of cool-cyan water mid-rise, approximately 4 meters tall, frozen at the apex of formation. Through the water's translucent body, ghostly traceries of QUESTIONS form into faint script-like patterns (the 'water taught to ask questions' visualized as visible interrogation-marks dissolved into the wave's structure). The wave is curling toward camera-right, where the implied target stands off-frame. A faint cool grey silence-nullification-haze (consistent with the silence keyword's visual idiom from Spy class spy_04) trails ahead of the wave's curl — the silencing is the wave's leading edge. NO human figure. The shore beneath is sparse; the sky is overcast.",
    moodKeywords: [
      "water that has been taught to ask questions",
      "eventually becomes a solvent",
      "questions visible as script in the wave's body",
      "silence-haze at the leading edge",
    ],
    palette:
      "Cool-cyan translucent wave + faint silver question-script in wave-body + cool grey silence-nullification-haze + cool overcast sky + sparse warm shore",
    composition:
      "Wider mid-shot side three-quarter, wave at frame-centre mid-curl toward camera-right, no human figures",
    notes:
      "Spell card. Silence keyword as cool-grey nullification-haze (consistent with spy_04 visual). The 'questions in the wave' is canon-direct from flavor — rendered as faint script-traceries within the translucent water-body.",
  },
  {
    cardId: "s1_elem_water_03",
    sceneDelta:
      "Wider mid-shot. A Mercy Current — a slow visible current within a wider river, the current itself rendered as a pale-cream-cyan luminous flow distinct from the surrounding deeper-blue water. The current is FLOWING DOWNRIVER, visibly carrying NOTHING (no debris, no dust, no leaves — it has chosen not to take anything with it on purpose). Around the river, autumnal trees on either bank, leaves falling, but the current's surface is unbroken — the leaves drift past WITHOUT being absorbed. A friendly figure is implied at the lower-right (only their reaching hand visible at the river's edge, palm-up, mid-receiving), and a strong warm-amber heal-glow pulse travels from the current INTO their palm (heal-6 visualized). The light is late-afternoon golden-hour.",
    moodKeywords: [
      "the part of a river that decides not to take anything",
      "leaves drift past without being absorbed",
      "current flowing downriver carrying nothing",
      "warm-amber heal-pulse into the palm",
    ],
    palette:
      "Cool deeper-blue river + pale-cream-cyan luminous current + warm autumnal trees + warm late-afternoon golden-hour + warm-amber heal-pulse + warm river-bank shore",
    composition:
      "Wider mid-shot, river extending diagonally across frame, current at frame-centre, friendly hand at lower-right edge",
    notes:
      "Spell card. Anonymous reaching-hand (no body visible, only the hand) preserves no-character-conflation. The 'chosen not to take anything' is rendered as leaves passing the current's surface unabsorbed — canon-direct from flavor.",
  },
  {
    cardId: "s1_elem_water_04",
    sceneDelta:
      "Mid-shot. An Abyssal Form — a humanoid water-elemental, but of DEEP-DARK water (almost black at the body-core, transitioning through deep-cyan-blue at the body's outer-edge to almost-clear at the silhouette-edge). The Form's body internal-currents are extremely slow, almost still, as if the water has weight. Where the Form's eyes would be, two small luminous deeper-cyan eye-points; the mouth-line is a single horizontal current. They stand on what was once a sea-floor — but the sea is gone, replaced by dry rocky ground with faint mineral-deposits suggesting the water that used to be there. Faint cool-cream drain-glow rims the Form's body (drain visualized); faint translucent ripple-patterns (dispel visualized) propagate outward at chest-height. The deep-background suggests an empty sky; the time of day is ambiguous.",
    moodKeywords: [
      "the bottom of a sea that existed for four days",
      "the second week of the Fall",
      "remembered by nobody",
      "the water has weight",
    ],
    palette:
      "Deep-dark water-core + deep-cyan outer-edge + dry rocky sea-floor + faint mineral-deposits + cool drain-rim + translucent dispel-ripples + ambiguous empty sky",
    composition:
      "Mid-shot front three-quarter, Abyssal Form at frame-centre, dry sea-floor beneath them, empty sky above",
    notes:
      "Epic unit. The 'sea that existed for four days in the second week of the Fall' is canon-direct from flavor — rendered as the dry rocky ground with mineral-deposits showing the absent water. The Fall (Genesis-era event) is fully revealed by end of Epoch 2. Dual-keyword rendering: drain = rim-glow, dispel = ripple-patterns.",
  },
  {
    cardId: "s1_elem_water_05",
    sceneDelta:
      "Wider mid-shot. The Ocean That Forgives — a vast open ocean filling 70% of the frame, mid-distance to deep-distance, with a small humanoid figure (anonymous, generic-presenting, in shore-clothes) standing at the very edge of the shore in the lower-third of the frame, back to camera. The ocean is calm, deep cool-blue with subtle warm-amber dawn-light glittering on its surface. A SINGLE wave is mid-arrival from the deep distance, perfectly visible in its scale relative to the figure (the wave is small relative to the ocean but arriving WHETHER OR NOT THE FIGURE ASKED). The wave carries a faint warm-amber heal-glow at its leading edge (heal-8 visualized as the wave itself); a faint cool drain-rim wraps the figure (drain visualized as what the ocean takes back); faint translucent dispel-ripples propagate from the figure outward (dispel visualized). The figure's posture is open, receiving, exhausted-but-relieved.",
    moodKeywords: [
      "big enough that the thing you are ashamed of is smaller than a wave",
      "the wave will arrive whether or not you asked",
      "back-to-camera figure receiving",
      "exhausted-but-relieved",
    ],
    palette:
      "Deep cool-blue ocean + warm-amber dawn-glitter on surface + warm-amber heal-glow on wave-leading-edge + cool drain-rim + translucent dispel-ripples + warm shore-sand",
    composition:
      "Wider mid-shot back-three-quarter on figure, ocean filling 70% of frame, single arriving wave mid-distance",
    notes:
      "Legendary unit. CRITICAL: receiving figure is back-to-camera and ANONYMOUS — must NOT match any named character. The 'wave arrives whether or not you asked' framing is canon-direct from flavor and is rendered as the wave already mid-arrival before any visible request from the figure. Three effects (heal + drain + dispel) rendered as three distinct visual elements.",
  },
] as const;

/**
 * Elemental faction's prompt registry, keyed by card id.
 *
 * Currently populated: 2 / 4 elements (Fire, Water).
 * TODO: earth, air.
 */
export const ELEMENTAL_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(ELEMENTAL_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
