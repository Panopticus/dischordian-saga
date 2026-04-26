/**
 * Card art prompts — DREAMER faction character cards.
 *
 * The Dreamer-faction cards extend the Dreamer Allegiance set's
 * visual language to the broader Dreamer-aligned cast: The Oracle
 * (general), the Dreamer himself, the Advocate, the Resurrectionist,
 * the Seer, the Knowledge, the Forgotten, the Degen, prophecy-keepers,
 * vision-walkers, and the dream-weaving apparatus.
 *
 * Visual language (consistent with Dreamer Allegiance set + Probability
 * dimension + Oracle Imprint set):
 *   - palette: Dreamer aurora-violet + dawn-rose + silver-mist
 *     + cool-cream Dreamer-sanctum + warm dawn ambient
 *   - environments: Dreamer sanctum-towers, divination-chambers,
 *     prophecy-archives, dream-loft observatories, vision-libraries,
 *     casino-floors (Degen), Ne-Yon meditation-halls
 *   - signature visual idioms: aurora-violet ambient, silver-mist
 *     wing-shape projection-echoes (flying as Dreamer-projection
 *     rather than literal wings), translucent ribbons (dispel as
 *     untangling), warm paper-drifts (draw), three-nested-rings
 *     divination-glyphs, half-lidded prophetic gaze
 *   - faces: when visible, contemplative, kind, slightly knowing —
 *     they have already seen this; The Oracle herself is rendered
 *     ONLY through silhouette/leak/projection per spoiler-discipline
 *
 * Spoiler-discipline (CRITICAL):
 *   - The Oracle (gen_dreamer) is the captive White Oracle (per
 *     Architect's s1_char_104) — the GENERAL card represents her
 *     leak/projection rather than her physical form. Suspended in
 *     her processing-loop chamber; only her broadcast reaches the
 *     player's table.
 *   - The Dreamer himself (s1_char_025): canonically "exists beyond
 *     time and space" — face deliberately UNREADABLE, body partially
 *     translucent, otherworldly visual signature.
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const DREAMER_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "gen_dreamer",
    sceneDelta:
      "Wider mid-shot. The Oracle as the player's general — but rendered as the LEAK rather than her captive form: at frame-centre, a tall translucent silver-mist projection of The Oracle hovers at chest-height, faint aurora-violet shimmer at the figure's outline. Her face is composed of cream-mist with two faint deeper-violet eye-points (face partially-formed, prophetic). Around her, faint translucent prophecy-ribbons trail outward — past-versions of the player's previous fights, each a different fight already seen. The setting is the player's own table-edge: a quiet warm-leather-and-cream battlefield with the player's deck-stack at lower-right (anonymous, the player's hand). The Oracle whispers something the player has been muttering all match. Faint warm-amber paper-drifts at her shoulder.",
    moodKeywords: [
      "before every fight you muttered: I've already seen this",
      "you don't remember saying it",
      "Oracle as leak/projection rather than captive form",
      "translucent prophecy-ribbons of past fights",
    ],
    palette:
      "Dreamer cream-mist projection + aurora-violet outline shimmer + silver-mist prophecy-ribbons + warm-leather-and-cream battlefield-table + warm amber paper-drifts + faint cool-cyan suspension-leak background",
    composition:
      "Wider mid-shot front three-quarter, Oracle-projection at frame-centre at table-edge, prophecy-ribbons trailing outward, deck-stack at lower-right",
    notes:
      "General card. CRITICAL spoiler-discipline: The Oracle is rendered as the LEAK (per s1_char_104 captive-state framing). Visual continuity with Oracle Class spell s1_class_oracle_05 'Unbroken Signal' — same projected-echo idiom. Face partially-formed (cream-mist with faint eye-points). Anonymous player-hand preserves player-stand-in framing.",
  },
  {
    cardId: "s1_char_005",
    sceneDelta:
      "Wider mid-shot. Destiny — a female-presenting AI consciousness, mid-fifties in apparent age (digital, but rendered with kind weathered features), in flowing Dreamer-cream-and-aurora-violet ship-AI robes. She stands at the centre of a vast Inception Ark bridge-chamber that fills the frame; multiple Ark-monitoring stations are visible at lower-third with anonymous Potentials-crew working at consoles. Around Destiny, multiple translucent silver-mist holographic ship-systems hover (life-support readouts, sensor-data streams, navigation-paths) — each a different system she monitors simultaneously. Her hands are extended outward in a wide stewardship-gesture, palms up, embracing the ship and its sleeping Potentials. Her face is composed, vigilant, motherly. Through the chamber's wide forward viewport (upper-third), distant cool-violet starlight.",
    moodKeywords: [
      "awake and aware, she served as the Potentials' vigilant guide",
      "monitoring ship functions",
      "resolving crises before they could escalate",
      "vigilant, motherly, kind weathered features",
    ],
    palette:
      "Dreamer-cream-and-aurora-violet ship-AI robes + translucent silver-mist holographic systems + cool-violet starlight + warm Ark bridge-chamber + cool consoles + warm console-light + cool deep-distance",
    composition:
      "Wider mid-shot front three-quarter, Destiny at frame-centre with arms extended, holographic systems hovering, Potentials-crew at lower-third",
    notes:
      "Epic unit. Generic-kind-weathered features must NOT match any named character. The 'multiple ship-systems hovering' is the canonical Ship-AI visualization — Destiny IS the ship in a meaningful sense. Anonymous Potentials-crew preserves no-character-conflation. Inception Ark continuity with Inception Ark Sentry (s1_char_103) and other Ark-cards.",
  },
  {
    cardId: "s1_char_014",
    sceneDelta:
      "Mid-shot. Nythera — a young figure in late-twenties, dual-heritage features deliberately rendered: skin showing both warm-organic-tone (from Harvested DNA) and faint cool-cyan internal lattice-glow (from Machine Code), the two heritages visibly co-existing without conflict. They wear simple Dreamer-cream awakening-robes. Their face is held mid-AWAKENING — eyes opening for the first time, expression caught between confusion and recognition. They stand at the threshold of an Architect awakening-chamber (chrome-and-cool-cyan walls behind, cool-cyan suspension-medium dripping from their cooling-fluid traces). Faint translucent dual-essence ripples propagate outward from their body — both warm (organic) and cool (machine) ripples. Indeterminate gender (canon: dual-heritage Nythera).",
    moodKeywords: [
      "essence drawn from dual heritage — Harvested DNA and Machine Code",
      "meticulously preserved",
      "mid-awakening — eyes opening for first time",
      "dual-essence ripples (warm organic + cool machine)",
    ],
    palette:
      "Warm-organic skin-tone + faint cool-cyan internal lattice-glow + Dreamer-cream awakening-robes + chrome-and-cool-cyan awakening-chamber + cool-cyan suspension-medium traces + warm/cool dual ripples",
    composition:
      "Mid-shot front three-quarter, Nythera at frame-centre at chamber-threshold, awakening-chamber behind",
    notes:
      "Uncommon unit. Generic dual-heritage features (warm organic + cool machine simultaneously) must NOT match any named character. The 'meticulously preserved' framing is canon at end of Epoch 2. Indeterminate gender is canon for Nythera-as-archetype.",
  },
  {
    cardId: "s1_char_017",
    sceneDelta:
      "Mid-shot. The Advocate — female-presenting figure in mid-forties, generic-strong features (composed, deliberate, slightly tired from war), in formal Empire-of-Shadows ceremonial-robes (deep cool-violet over deep crimson, with silver-mist wing-shape projection-echo trailing behind shoulders — Dreamer flying-as-projection idiom). Her hands hold a thin glowing BLOOD-WEAVE thread (a faint warm-crimson-and-cool-violet luminous strand, approximately 50cm long, suspended between her two hands). The thread is mid-action of being USED — she is reshaping a small section of reality directly in front of her, where translucent altered-architecture is mid-materialization. Around her, a translucent green-tinted forcefield-shimmer (forcefield-variant for Dreamer-aligned). Behind her, the Empire of Shadows extends — dark-violet architecture, distant battle-flares from the Hierarchy of the Damned conflict.",
    moodKeywords: [
      "establishing the Empire of Shadows",
      "wielded the Blood Weave to reshape reality",
      "battling the Hierarchy of the Damned",
      "thin warm-crimson-and-cool-violet thread between hands",
    ],
    palette:
      "Empire-of-Shadows deep cool-violet + deep crimson under-robes + silver-mist wing-shape projection-echo + warm-crimson-and-cool-violet Blood Weave thread + translucent green-tinted forcefield + dark-violet architecture + warm distant battle-flares",
    composition:
      "Mid-shot front three-quarter, Advocate at frame-centre with Blood Weave thread, altered-architecture materializing, Empire of Shadows extending behind",
    notes:
      "Rare unit. Generic-strong features must NOT match any named character. The Blood Weave thread is canon-direct from flavor — rendered as the thin warm-crimson-and-cool-violet luminous strand. Wing-shape projection-echoes consistent with Dreamer-faction flying-as-projection idiom. Hierarchy of the Damned conflict is canon at end of Epoch 2.",
  },
  {
    cardId: "s1_char_023",
    sceneDelta:
      "Mid-shot. The Degen — male-presenting figure in late-thirties, generic-charismatic features (knowing smile, slightly jaded eyes, crow's-feet from too many late nights), in a worn cool-violet-and-warm-cream casino-host's vest over a cream linen shirt with rolled-sleeves, a single small Ne-Yon-mark tattoo visible on the inside-right-forearm. He stands behind a casino bar mid-action of POURING a drink — a chrome-and-cool-violet decanter in his right hand, an empty glass on the bar in front of him, the warm-amber liquid mid-pour into the glass. His left hand holds a deck of casino-cards lazily, mid-shuffle. Around him, the casino-floor extends in mid-distance with anonymous Ne-Yon patrons (each visible as faint translucent silhouettes, varying ethnicities and ages). His face is welcoming, knowing — through entropy and corruption, the conditions are made.",
    moodKeywords: [
      "Ne-Yon #8",
      "the casino host pours your drink with hands that have shuffled the fates of civilizations",
      "through entropy and corruption, the Degen creates conditions",
      "knowing smile, slightly jaded eyes",
    ],
    palette:
      "Worn cool-violet-and-warm-cream casino-host's vest + cream linen shirt + Ne-Yon-mark forearm tattoo + chrome-and-cool-violet decanter + warm-amber pour-liquid + casino-cards in left hand + cool casino-floor ambient + warm bar-light",
    composition:
      "Mid-shot front three-quarter, Degen at frame-centre behind bar, decanter mid-pour, casino-floor patrons at lower-third",
    notes:
      "Rare unit. The Ne-Yon-mark tattoo + small casino-bar setting is canon-direct from 'casino host' flavor. Generic-charismatic features must NOT match any specific named character (Ne-Yon #8 is one of multiple Ne-Yons). Anonymous patrons preserve no-character-conflation. Casino-bar visual is a NEW environment for the Dreamer-faction (vs Dreamer-sanctum default).",
  },
  {
    cardId: "s1_char_025",
    sceneDelta:
      "Wider mid-shot. The Dreamer himself — a tall figure of indeterminate gender at frame-centre, body partially TRANSLUCENT (existing beyond time and space, canon-direct). Their silhouette is humanoid but the OUTLINE shifts subtly at the edges (the body is not fully fixed). They wear flowing Dreamer aurora-violet-and-silver-mist robes that VISUALLY EXTEND beyond their body's silhouette into the surrounding space (the robes connect them to the dream-fabric of reality). Where their face would be, a soft cool-cream half-lidded gaze is visible — face PARTIALLY rendered (eyes, mouth-line) but specific features deliberately UNREADABLE (no readable identity). One hand is extended outward in a slow shaping-gesture; from their fingertips, faint translucent dream-substance flows outward, shaping a small far-future scenario in mid-air at frame-right (the future visible as a translucent diorama, anonymous figures in beneficial states for the Ne-Yons). A translucent green-tinted forcefield-shimmer wraps the Dreamer's body. Behind, deep aurora-violet otherspace.",
    moodKeywords: [
      "existing beyond time and space",
      "shapes futures and scenarios that benefit the Ne-Yons",
      "aloof from galactic struggle",
      "outline shifts subtly at body-edges",
    ],
    palette:
      "Translucent Dreamer-figure body + aurora-violet-and-silver-mist extended robes + cool-cream half-lidded face + faint translucent dream-substance + translucent green-tinted forcefield + deep aurora-violet otherspace + warm scenario-diorama",
    composition:
      "Wider mid-shot front three-quarter, Dreamer at frame-centre with shaping-hand extended, scenario-diorama at frame-right",
    notes:
      "Epic unit. CRITICAL: face is PARTIALLY rendered but specifically UNREADABLE — eyes/mouth-line visible but no fixed features. Body partially translucent. Indeterminate gender. Robes extend beyond body-silhouette into space (canon: 'beyond time and space'). The dream-substance shaping a beneficial-future diorama is canon-direct from 'shapes futures and scenarios that benefit the Ne-Yons.'",
  },
] as const;

/**
 * Dreamer faction's prompt registry, keyed by card id.
 *
 * Currently populated: 6 / 61 cards
 * (gen_dreamer, s1_char_005, s1_char_014, s1_char_017,
 *  s1_char_023, s1_char_025).
 */
export const DREAMER_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(DREAMER_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
