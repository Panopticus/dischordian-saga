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
  {
    cardId: "s1_char_027",
    sceneDelta:
      "Wider mid-shot. The Enigma — a tall figure of indeterminate gender, body composed of overlapping CONTRADICTORY-IDENTITIES rendered as multiple translucent silhouettes layered at slight offsets (a male-presenting silhouette, a female-presenting silhouette, a non-binary silhouette, all visible simultaneously, none fully solid). They wear flowing Dreamer-aurora-violet robes with deep crimson under-tunic. Where their face would be, the layered identities show different partial-faces — the viewer cannot fix on any one. They stand at the centre of a Dreamer-sanctum war-archive, where a faded MEMORY-FRESCO at upper-third depicts the canonical pre-Fall destruction of the Warden alongside the White Oracle (warrior-figures and the Oracle's silver-mist projection wielding cool-cyan-and-aurora-violet light against a fragmenting Warden-figure — the historical victory). A translucent green-tinted forcefield-shimmer wraps the Enigma. Generic non-conflating silhouettes.",
    moodKeywords: [
      "played a crucial role in destroying the Warden alongside the White Oracle",
      "before the Fall of Reality",
      "overlapping contradictory-identities",
      "viewer cannot fix on any one face",
    ],
    palette:
      "Dreamer-aurora-violet robes + deep crimson under-tunic + multiple overlapping translucent identity-silhouettes + faded memory-fresco + translucent green-tinted forcefield + Dreamer-sanctum war-archive + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Enigma at frame-centre with overlapping identities, memory-fresco at upper-third behind",
    notes:
      "Legendary unit. The Warden's destruction is canon at end of Epoch 2 (Genesis-era event, fully revealed). Memory-fresco depicts the historical event without naming the specific Warden-incarnation (which version was destroyed is left ambiguous). The Enigma's overlapping identities is the canonical 'enigma' visualization. Visual continuity with The Enigma Imprint set's third-option framing.",
  },
  {
    cardId: "s1_char_029",
    sceneDelta:
      "Mid-shot. The Forgotten — a humanoid figure in mid-thirties at frame-centre, but the figure is RENDERED AS PARTIALLY FADING from existence: their body shows visible translucent gaps (forearms partially-transparent, jaw-line beginning to dissolve, edges of the silhouette feathering away). They wear plain Dreamer-cream traveling robes with no faction-markers (no insignia survives a forgotten-history). Around them, the SETTING ITSELF is empty — a featureless cool-cream space with no architecture, no other figures, no environment-marks (the absence of context is the visual key). Faint warm-amber memory-pages float around their head — but the pages are BLANK. Their face is half-formed: eyes visible, mouth-line visible, but no specific identifying features fix.",
    moodKeywords: [
      "no connected characters",
      "no appearances in stories",
      "partially fading from existence",
      "empty featureless space — no environment marks",
    ],
    palette:
      "Dreamer-cream traveling robes + faint translucent body-gaps + featureless cool-cream space + warm-amber blank memory-pages + faint feathering body-edge",
    composition:
      "Mid-shot front three-quarter, Forgotten at frame-centre fading, blank pages floating, no environment",
    notes:
      "Rare unit. CRITICAL: 'no environment, no marks' is canon-direct from flavor (the Forgotten has no connections, no appearances). The blank memory-pages communicate 'no stories' explicitly. Generic-fading face must NOT match any named character (the entire point is that they don't connect to anyone).",
  },
  {
    cardId: "s1_char_034",
    sceneDelta:
      "Mid-shot. The Inventor — male-presenting figure in mid-fifties, generic-eccentric features (alert eyes, slightly rumpled), in a worn Dreamer-cream-and-aurora-violet inventor's smock over a cool-cream linen shirt with multiple chest-pocket tools clipped (small precision instruments). He stands at a long Dreamer-vision workshop bench at frame-centre. On the bench, a small INNOVATION mid-construction: a chrome-and-aurora-violet spherical artifact, partially-disassembled, with internal cool-cyan filigree visible through translucent panels. The Inventor holds in his right hand a long PRECISION TOOL with a Dreamer-amber tip; his left hand holds a small visionary-blueprint sketch. A translucent green-tinted forcefield-shimmer wraps the bench-area (forcefield). Around him, faint translucent dream-substance drifts (the Dreamer's visions made manifest as he works).",
    moodKeywords: [
      "driven by the Dreamer's visions",
      "crafts tools and innovations that can empower or undermine any faction",
      "small spherical artifact with cool-cyan internal filigree",
      "alert eyes, slightly rumpled",
    ],
    palette:
      "Dreamer-cream-and-aurora-violet inventor's smock + cool-cream linen + chrome-and-aurora-violet spherical artifact + cool-cyan internal filigree + translucent green-tinted forcefield + faint translucent dream-substance + warm bench-light",
    composition:
      "Mid-shot front three-quarter, Inventor at frame-centre at workshop-bench, artifact mid-construction at lower-third",
    notes:
      "Rare unit. Generic-eccentric features must NOT match The Engineer (whose identity is [CLASSIFIED] in Imprint set + Engineer Class set). Different aesthetic: this is a Dreamer-aligned visionary-inventor (cream-and-aurora-violet) vs the Antiquarian-aligned Engineer (amber-and-brass). Distinct visual lineages.",
  },
  {
    cardId: "s1_char_036",
    sceneDelta:
      "Wider mid-shot. The Judge — tall figure of indeterminate gender at frame-centre, wearing formal Dreamer-aurora-violet judicial-robes with a deep crimson sash (the canonical balance-arbiter's regalia), a small chrome-and-aurora-violet ceremonial scale-pendant at the throat. They stand at the centre of a high circular Dreamer-judgment-chamber, both hands extended outward in a wide WEIGHING-GESTURE — the air between their hands shows a translucent aurora-violet-and-crimson SCALE-PROJECTION (not a physical scale; a manifest-scale of judgment) with two small translucent silhouettes balanced at the scale's pans (one at frame-left in faint cool blue, one at frame-right in faint warm amber — the two sides being weighed). The figure's face is composed, neutral, deeply attentive. Faint warm provoke-glow rims their leading shoulder.",
    moodKeywords: [
      "deciding the fate of individuals, civilizations, and ideologies",
      "guided solely by their perception of balance",
      "wide weighing-gesture between hands",
      "two translucent silhouettes at scale's pans",
    ],
    palette:
      "Dreamer-aurora-violet judicial-robes + deep crimson sash + chrome-and-aurora-violet scale-pendant + translucent aurora-violet-and-crimson scale-projection + cool-blue (left) + warm-amber (right) silhouettes + warm provoke-rim + cool Dreamer-judgment-chamber",
    composition:
      "Wider mid-shot front three-quarter, Judge at frame-centre with arms extended, scale-projection between hands, judgment-chamber depth behind",
    notes:
      "Rare unit. Indeterminate gender + neutral face is canon for the Judge (their balance-discipline requires non-aligned identity). The two translucent silhouettes at the pans (cool-blue + warm-amber) represent generic-archetype factions being weighed; NOT specific named characters.",
  },
  {
    cardId: "s1_char_037",
    sceneDelta:
      "Mid-shot. The Knowledge — female-presenting figure in mid-forties, generic-thoughtful features (calm, slightly amused, attentive), in formal Dreamer-cream-and-aurora-violet scholar's robes with a single small Dreamer-three-rings sigil at the collar. She stands at a tall LIBRARY-BALANCE — the library wall behind her is divided into TWO HALVES vertically: the LEFT HALF shows fully-illuminated shelves of clear knowledge-books (books open, pages legible, warm reading-light); the RIGHT HALF shows shelves DELIBERATELY DARKENED, with books closed, spines facing inward (the kept-ignorance, the half she preserves). At her hands, a single book is held between the two halves — the boundary-keeper. A translucent green-tinted forcefield-shimmer wraps her body. Faint warm-amber paper-drifts above (draw idiom). The maintained equilibrium is the visual key.",
    moodKeywords: [
      "maintaining an equilibrium of enlightenment and ignorance",
      "ensures the Ne-Yons remain indispensable",
      "library wall divided: illuminated half + darkened half",
      "the book held at the boundary",
    ],
    palette:
      "Dreamer-cream-and-aurora-violet scholar's robes + Dreamer-three-rings sigil + warm illuminated half-library + cool darkened half-library + warm-amber paper-drifts + translucent green-tinted forcefield + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Knowledge at frame-centre at library-balance, divided shelves filling background",
    notes:
      "Rare unit. The two-half-library visualization (illumination ↔ ignorance) is canon-direct from 'equilibrium of enlightenment and ignorance.' Generic-thoughtful features must NOT match any named character. The boundary-keeper-book at her hands is the visual key to her function.",
  },
  {
    cardId: "s1_char_045",
    sceneDelta:
      "Wider mid-shot. The Resurrectionist — tall figure in early-fifties, generic-deliberate features (calm, slightly weary, very precise), in formal Dreamer-aurora-violet-and-deep-crimson resurrection-mage's robes with chrome ceremonial wrist-bands. They stand at a low circular resurrection-altar at frame-centre. On the altar, TWO smaller translucent figures are mid-resurrection simultaneously: one in faint warm-amber (Architect-aligned silhouette being raised), one in faint cool-violet (Hierarchy-aligned silhouette being raised), each at a different position around the altar. The Resurrectionist's hands are extended outward to BOTH figures in a balanced gesture — both are being equally restored. Around the altar, faint translucent resurrection-glow propagates outward in a balanced pattern. The maintained-balance is rendered as the symmetrical-resurrection composition.",
    moodKeywords: [
      "resurrecting key figures on both sides",
      "maintain a balance favorable to the Ne-Yons",
      "ensuring no faction becomes dominant",
      "two translucent figures simultaneously raised — Architect + Hierarchy",
    ],
    palette:
      "Dreamer-aurora-violet-and-deep-crimson resurrection-mage's robes + chrome ceremonial wrist-bands + warm-amber Architect-aligned silhouette + cool-violet Hierarchy-aligned silhouette + translucent resurrection-glow + warm circular altar + cool deep-sanctum-ambient",
    composition:
      "Wider mid-shot front three-quarter, Resurrectionist at frame-centre with hands extended to both sides, two simultaneous resurrections at altar",
    notes:
      "Rare unit. The 'two simultaneous resurrections, balanced' is the visual key to 'maintains balance.' Generic-archetype silhouettes (no specific named characters being resurrected). Generic-deliberate features must NOT match any named character.",
  },
  {
    cardId: "s1_char_046",
    sceneDelta:
      "Wider mid-shot. The Seer — male-presenting figure of indeterminate age (could be 30s, could be 70s, deliberately ambiguous), in plain unbound traveling-robes (no faction-markers, the canonical 'unbound by allegiance' detail), at the centre of a crossroads on a Dreamer-aligned hilltop. Around the Seer, FOUR DIRECTIONS are visible at the cardinal points: each direction shows a different translucent FORESIGHT-VISION (a different possible future the Seer can see — one direction shows opportunity, one shows danger, one shows balance, one shows shift). The Seer is mid-action of looking at ONE specific direction (frame-right), eyes focused, the rest of the body STILL. A translucent green-tinted forcefield-shimmer wraps them. The hilltop is windswept; faint cool-cyan visioning-rings emanate from the Seer's eyes outward.",
    moodKeywords: [
      "unbound by allegiance",
      "identifies opportunities and dangers",
      "foresight that shifts the balance",
      "four directions, four possible futures",
    ],
    palette:
      "Plain unbound traveling-robes + cool-cream Dreamer-hilltop + four translucent foresight-visions at cardinal points + translucent green-tinted forcefield + cool-cyan visioning-rings + warm windswept hilltop ambient",
    composition:
      "Wider mid-shot front three-quarter, Seer at frame-centre at crossroads, four foresight-visions at cardinal points",
    notes:
      "Rare unit. Indeterminate age is canon-direct from 'unbound' — the Seer doesn't fit any specific time-period. Plain robes (no faction markers) preserve unbound visualization. Four cardinal-direction visions is a new visual idiom for foresight-as-multi-path.",
  },
  {
    cardId: "s1_char_109",
    sceneDelta:
      "Mid-shot. The Enigma (probability-variant) — female-presenting figure in mid-thirties, generic-quietly-confident features (slight smile, knowing eyes), in formal Dreamer-cream-and-aurora-violet probability-mage's robes. She stands at the centre of a Dreamer probability-chamber where multiple translucent COIN-FLIP visualizations float at chest-height around her — each coin caught mid-flip showing IMPOSSIBLE OUTCOMES (one coin showing both heads AND tails simultaneously, one showing neither, one showing a third faceless side). The Enigma is mid-action of FLIPPING ONE coin herself; the coin is mid-air at frame-centre, the moment-of-uncertainty held still. Faint translucent aurora-violet probability-ribbons trail from her hand. Her face shows the canonical 'exception that proves there are no rules' confidence — she is not breaking probability; she is OUTSIDE it.",
    moodKeywords: [
      "she does not break the rules of probability",
      "she is the exception that proves there are no rules",
      "coins showing impossible outcomes",
      "flipping one coin held mid-air",
    ],
    palette:
      "Dreamer-cream-and-aurora-violet probability-mage's robes + translucent coin-flip visualizations + aurora-violet probability-ribbons + cool probability-chamber + warm coin-glint + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Enigma at frame-centre flipping coin, multiple impossible-coins floating around",
    notes:
      "Epic unit. CRITICAL: this card is DIFFERENT from s1_char_027 The Enigma (Warden-destroyer with overlapping identities). This Enigma is the PROBABILITY-EXCEPTION variant. Different visual signature: solid body (vs s1_char_027's overlapping silhouettes), confident face (vs s1_char_027's unfixed face), coin-flip visualizations. Same archetypal name, different facets.",
  },
  {
    cardId: "s1_char_110",
    sceneDelta:
      "Mid-shot. A Prophecy Keeper — female-presenting figure in mid-forties, generic-attentive features (eyes half-closed in concentration), in plain Dreamer-cream sanctum-robes with a single small Living-Universe-pulse pendant at the throat (a small chrome-and-aurora-violet device that pulses faintly with the universe's heartbeat). She kneels at a low Dreamer-meditation-table, both hands extended outward palms-down, fingertips touching the table's surface. From the table's centre, a faint translucent AURORA-VIOLET HEARTBEAT-PULSE radiates outward in slow rhythmic waves — the Living Universe's heartbeat made visible. With each pulse, faint translucent prophecy-script (illegible but suggestive) propagates briefly outward then fades. Her face is rapt, listening. Cool Dreamer-sanctum ambient.",
    moodKeywords: [
      "reads the future in the Living Universe's heartbeat",
      "not in tea leaves or stars",
      "each pulse is a chapter yet unwritten",
      "rapt, listening",
    ],
    palette:
      "Plain Dreamer-cream sanctum-robes + chrome-and-aurora-violet heartbeat-pendant + translucent aurora-violet heartbeat-pulse + warm meditation-table + faint translucent prophecy-script + cool sanctum-ambient",
    composition:
      "Mid-shot front three-quarter, Keeper kneeling at meditation-table, heartbeat-pulse radiating from table's centre",
    notes:
      "Rare unit. The 'Living Universe's heartbeat' framing is rendered as the rhythmic aurora-violet pulse from the table-centre. Generic-attentive features must NOT match any named character. The illegible prophecy-script preserves the 'yet unwritten' framing — readable as PRESENCE rather than CONTENT.",
  },
  {
    cardId: "s1_char_111",
    sceneDelta:
      "Mid-shot. A Vision Walker — female-presenting figure in early-twenties, generic-light features (slight, agile, lightly weathered), in plain Dreamer-cream-and-warm-leather traveling clothes, mid-action of WALKING ALONG A DREAMER-PATH that is invisible to ordinary perception. The path is rendered as a translucent silver-mist FOOTPATH visible only as faint cool-cream stones at her footsteps (the path is THERE but only her training reveals it). She is mid-stride, leading foot landing on the next stone. Around her, the SURROUNDING ENVIRONMENT shows TWO STATES simultaneously: at frame-left, the world as ORDINARY EYES see it (a wall, blocking her path); at frame-right, the world as the DREAMER'S EYES see it (the same wall has a passable archway right where she walks). Faint silver-mist wing-shape projection-echoes trail behind her shoulders.",
    moodKeywords: [
      "to the untrained eye, she vanishes",
      "to the Dreamer's eye, she simply takes a different path",
      "one that was always there",
      "two states of the world: wall vs passable archway",
    ],
    palette:
      "Dreamer-cream-and-warm-leather traveling clothes + translucent silver-mist footpath + faint cool-cream stones at footsteps + warm cool-cyan blocking-wall (left) + warm passable-archway (right) + silver-mist wing-shape projection-echoes",
    composition:
      "Mid-shot side three-quarter, Vision Walker mid-stride at frame-centre, two-state environment split at her path",
    notes:
      "Common unit. The 'two-state environment' (ordinary view vs Dreamer view) is the visual key to 'a different path that was always there.' Generic-light features must NOT match any named character. Wing-shape projection-echoes consistent with Dreamer flying-as-projection idiom.",
  },
  {
    cardId: "s1_char_112",
    sceneDelta:
      "Mid-shot. A Reality Anchor — male-presenting figure in mid-fifties, generic-grounded features (steady eyes, solid stance), in plain heavy Dreamer-cream-and-deep-stone over-robes. He stands at frame-centre at a Dreamer reality-stabilization point, both feet planted shoulder-width with the floor visibly DEPRESSED beneath his weight (he is the certainty in a probabilistic world). Around him, faint translucent SHIFTING-PROBABILITY-RIPPLES try to propagate but visibly DECAY toward his body — within a circle of ground around the Anchor, the probability-shift cannot reach. The ground around him is solid, unchanging cool-stone; further out, the ground shows visible probability-flicker (multiple alternate-floor-textures briefly visible at the edges). A faint warm provoke-glow rims his shoulders. His face is composed-grave.",
    moodKeywords: [
      "in a world of shifting probabilities",
      "certainty is the heaviest chain",
      "ground depressed beneath his weight",
      "probability-ripples decay toward his body",
    ],
    palette:
      "Heavy Dreamer-cream-and-deep-stone over-robes + solid cool-stone ground around him + faint translucent shifting-probability-ripples + multiple alternate-floor-textures at edges + warm provoke-rim + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Anchor at frame-centre with depressed-ground footprint, probability-ripples decaying inward",
    notes:
      "Common unit. The 'depressed ground' visual is the canonical 'heaviest chain' visualization — certainty has weight. Generic-grounded features must NOT match any named character.",
  },
  {
    cardId: "s1_char_203",
    sceneDelta:
      "Mid-shot. An Astral Warden — female-presenting figure in mid-twenties, generic-poised features (calm, slightly secretive, attentive), in flowing Dreamer-aurora-violet robes with deep starfield embroidery (small embedded silver-mist star-points sewn throughout the fabric). She stands at the threshold of an opening Dreamer-portal at frame-centre, mid-action of having JUST STEPPED OUT of the dream. In her left hand, a SHIELD OF STARLIGHT — a translucent cool-cream shield, the size of a small buckler, composed of crystallized starlight (visible as compressed silver-mist substance with small twinkling deeper-stars within). In her right hand, a small folded note (the secret) extended outward toward an off-frame recipient. Her face is composed; the secret is meant only for the one who is looking. Translucent green-tinted forcefield-shimmer wraps her body.",
    moodKeywords: [
      "she stepped out of the dream",
      "carrying a shield of starlight",
      "and a secret meant only for you",
      "small folded note extended outward",
    ],
    palette:
      "Dreamer-aurora-violet robes + deep starfield embroidery + translucent cool-cream starlight-shield + translucent silver-mist substance + warm folded note + translucent green-tinted forcefield + cool dream-portal threshold",
    composition:
      "Mid-shot front three-quarter, Warden at frame-centre at portal-threshold, shield in left hand, note extended right",
    notes:
      "Uncommon unit. The shield-of-starlight is canon-direct from flavor — rendered as crystallized-starlight buckler. The 'secret meant only for you' is rendered as the extended folded note (the recipient is implied off-frame). Generic-poised features must NOT match any named character.",
  },
  {
    cardId: "s1_pack_015",
    sceneDelta:
      "Mid-shot. A Probability Surge — anonymous female-presenting Dreamer-aligned figure (back-three-quarter, generic-cream-and-aurora-violet robes), reaching her right hand INTO a translucent aurora-violet PROBABILITY-FIELD that hovers at chest-height in front of her. The field is rendered as a swirling cloud of overlapping ghost-futures (each ghost a different possible outcome — faintly visible as translucent miniature scenes). Her hand is mid-action of CLOSING around ONE specific ghost-future, pulling it FORWARD into reality. The pulled-future glows brighter than the others (the chosen outcome). NO face visible (back-three-quarter only). Around her, faint translucent paper-drifts.",
    moodKeywords: [
      "she did not see the future",
      "she reached into the probability field and pulled out the one she wanted",
      "anonymous reaching back-three-quarter",
      "chosen ghost-future glowing brighter",
    ],
    palette:
      "Cream-and-aurora-violet generic Dreamer robes + translucent aurora-violet probability-field + multiple translucent ghost-futures + warm pulled-future glow + warm-amber paper-drifts + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter, figure at frame-centre with hand in probability-field, chosen ghost-future being pulled forward",
    notes:
      "Common spell. Anonymous figure (back-three-quarter) preserves no-character-conflation. The 'reaching INTO probability and pulling out' is the canonical visualization of probability-as-medium rather than passive-prediction.",
  },
  {
    cardId: "s1_pack_016",
    sceneDelta:
      "Mid-shot. A Vision Weaver — female-presenting figure in early-thirties, generic-deft features (focused, calm, slightly tired from continuous-work), in plain Dreamer-cream-and-aurora-violet weaver's apron over flowing under-robes. She sits at a tall LOOM at frame-centre — but the loom's threads are made of TRANSLUCENT FUTURE-STRANDS (each strand a different possible-future, woven in cool-cream and warm-amber and aurora-violet and silver-mist). At her hands, a NEW STRAND has just appeared — the canonical 'each dawn, a new strand' detail. She holds the new strand poised, deciding where to weave it. Behind her, a wide arched window onto a Dreamer-sanctum dawn (faint warm-amber sky). Her face is composed, attentive, the work continuing.",
    moodKeywords: [
      "she weaves futures like thread",
      "each dawn, a new strand appears in her hands",
      "loom threads made of translucent future-strands",
      "composed, attentive, the work continuing",
    ],
    palette:
      "Dreamer-cream-and-aurora-violet weaver's apron + flowing under-robes + tall loom + multi-color translucent future-strands + warm new-strand glow + warm dawn arched-window + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Weaver at frame-centre at loom, dawn-window behind",
    notes:
      "Uncommon unit. Generic-deft features must NOT match any named character. The future-strand-loom is a new visual idiom — distinct from the Knowledge's library-balance and the Resurrectionist's altar.",
  },
  {
    cardId: "s1_pack_017",
    sceneDelta:
      "Action mid-shot. Fate's Edge — a female-presenting figure in mid-thirties at frame-centre, in plain dark Dreamer-traveling-leathers, mid-action of HAVING CHOSEN. In front of her at frame-centre, a translucent enemy BLADE is FROZEN MID-SWING toward her chest — the blade's leading edge mere centimeters from her. She is unmoving, unflinching, calm. Around the blade, faint translucent aurora-violet TIMELINE-SELECTOR rings (the rings showing the moment of selection — a faint ghost of an alternate-timeline visible in the deep background where the blade DOES land, then fading). Her face is composed-grave; she made the choice. A small chrome-and-aurora-violet timeline-selector pendant at her throat is faintly luminous. NO opponent visible — only the blade.",
    moodKeywords: [
      "she saw the blade that would end her",
      "she chose the timeline where it froze mid-swing",
      "blade frozen centimeters from chest",
      "composed-grave — she made the choice",
    ],
    palette:
      "Dark Dreamer-traveling-leathers + translucent enemy blade + aurora-violet timeline-selector rings + faint deep-background alternate-timeline ghost + chrome-and-aurora-violet pendant + cool deep-shadow",
    composition:
      "Action mid-shot front three-quarter, figure at frame-centre, frozen blade at lower-third, timeline-rings around blade",
    notes:
      "Rare unit. Generic-mid-thirties features must NOT match any named character. The 'frozen blade with alternate-timeline ghost in deep-background' is the canonical visualization of timeline-selection — the choice made visible by what DIDN'T happen.",
  },
  {
    cardId: "s1_pack_018",
    sceneDelta:
      "Wider mid-shot. A Dream Sentinel — humanoid translucent guardian, approximately 2m tall, body composed of CRYSTALLIZED-DREAM-SUBSTANCE (translucent silver-mist with internal aurora-violet swirls). It stands at the threshold of a Dreamer sanctum-corridor, both arms extended outward in a defensive blocking-pose. Behind the Sentinel, a vast translucent WALL extends across the corridor — the dreamed-of wall made manifest, currently solid (the Sentinel's belief in the wall sustains the wall). Faint warm provoke-glow rims its leading shoulder. Where its face would be, a single calm warm-amber dream-eye. NO human face. The corridor behind shows the wall holding firm.",
    moodKeywords: [
      "it dreams of an impenetrable wall",
      "and so the wall exists",
      "crystallized-dream-substance body",
      "single calm warm-amber dream-eye",
    ],
    palette:
      "Translucent silver-mist Sentinel-body + internal aurora-violet swirls + translucent dreamed-wall + warm-amber dream-eye + warm provoke-rim + cool sanctum-corridor + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Sentinel at frame-centre with arms extended, dreamed-wall behind",
    notes:
      "Common unit. NO human face (the Sentinel is a dream-construct). The 'wall exists because dreamed' is the canonical Dreamer-faction reality-by-belief visualization.",
  },
  {
    cardId: "s1_pack_019",
    sceneDelta:
      "Wider mid-shot. An Oracle's Wrath — at frame-centre, the canonical Oracle-projection (consistent with gen_dreamer + Oracle Imprint set: silver-mist, aurora-violet shimmer, faceless cream-mist) but rendered in DECISIVE-WRATH posture: arms extended outward in a wide condemnation-gesture, the projection's intensity is HIGHER than at default-state (brighter, more saturated aurora-violet, more solid silhouette). From her extended hands, two PARALLEL aurora-violet WRATH-BEAMS extend forward toward off-frame targets. The beams are NOT prediction-rays; they are ORDINATION-rays — ending what they touch. Around her, the air shows distortion-rings from the intensity. NO face visible (cream-mist faceless oval per canonical Oracle leak/projection visualization).",
    moodKeywords: [
      "she did not foresee your destruction",
      "she ordained it",
      "two parallel ordination-beams from extended hands",
      "intensity higher than default-state",
    ],
    palette:
      "Brighter Oracle silver-mist + saturated aurora-violet + faceless cream-mist oval + parallel aurora-violet wrath-beams + air-distortion-rings + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Oracle-projection at frame-centre with arms extended, two beams toward off-frame targets",
    notes:
      "Epic spell. CRITICAL spoiler-discipline: face is FACELESS cream-mist oval (consistent with Oracle Imprint set + Oracle Class spell s1_class_oracle_05 + gen_dreamer). The 'ordination not prediction' is rendered as the destructive beams (vs the default observational projection).",
  },
  {
    cardId: "s1_pack_020",
    sceneDelta:
      "Wider mid-shot. Prophecy Incarnate — a tall figure of indeterminate gender at frame-centre, body composed entirely of CRYSTALLIZED PROPHECY-SUBSTANCE (translucent aurora-violet with embedded readable PROPHECY-SCRIPT visible throughout the body — every limb, every fingertip, every contour shows running prophetic-text in cool-cyan glyphs). The figure has no separate clothes; the prophecy IS the body. Where their face would be, a wide aurora-violet PROPHECY-EYE (one large luminous eye occupying the entire face-region). The figure speaks; from their mouth-region, faint translucent prophetic-words emit forward. The setting is a vast featureless cool-cream void — no architecture, no environment, just the Prophecy made visible. The figure cannot be silenced.",
    moodKeywords: [
      "the prophecy did not predict the end",
      "it was the end",
      "given a body and a voice that would not be silenced",
      "body composed of crystallized prophecy-substance",
    ],
    palette:
      "Translucent aurora-violet prophecy-substance body + embedded cool-cyan prophecy-script + wide aurora-violet prophecy-eye + translucent prophetic-words emitting + featureless cool-cream void",
    composition:
      "Wider mid-shot front three-quarter, Prophecy Incarnate at frame-centre, void backdrop",
    notes:
      "Legendary unit. The body-IS-the-prophecy framing is the canonical visualization. NO specific named character (Prophecy Incarnate is by definition impersonal). The 'voice that would not be silenced' is rendered as the visible emitted-words — present even when not heard.",
  },
  {
    cardId: "s1_pack_021",
    sceneDelta:
      "Tight composition. A Starlight Familiar — a small translucent silver-mist creature, approximately 15cm long, hovering at frame-centre in mid-air. Body shape suggests a tiny dragon-form or a fox-shape (deliberately ambiguous — different viewers will see different forms). Internal cool-cyan-and-aurora-violet starlight pulses softly within its body. Two tiny luminous deeper-cool-cyan eye-points. Around the Familiar, faint translucent starlight-trails of its single thought (the ONE thought it lived for, made visible as a brief luminous arc trailing through the air). The setting is a quiet Dreamer-sanctum night-window with starlight beyond. The Familiar is mid-action of fading — its substance visibly thinning at the edges (the thought is ending; the Familiar with it).",
    moodKeywords: [
      "lived for the span of a single thought",
      "but what a thought it was",
      "ambiguous dragon-or-fox form",
      "substance visibly thinning at edges",
    ],
    palette:
      "Translucent silver-mist Familiar-body + internal cool-cyan-and-aurora-violet starlight + deeper-cool-cyan eye-points + faint translucent starlight-trail-arc + warm Dreamer-sanctum night-window + cool starlight backdrop",
    composition:
      "Tight composition, Familiar at frame-centre hovering, sanctum-window behind",
    notes:
      "Common unit. Deliberately ambiguous form (dragon-or-fox) is the visual key — the Familiar is a thought, not a creature. NO human figure. Echoes Air-elemental Breeze Whisper's barely-formed silhouette but explicitly Dreamer-aurora-violet rather than cool-cream-air.",
  },
] as const;

/**
 * Dreamer faction's prompt registry, keyed by card id.
 *
 * Currently populated: 25 / 61 cards
 * (gen_dreamer, s1_char_005, s1_char_014, s1_char_017,
 *  s1_char_023, s1_char_025, s1_char_027, s1_char_029,
 *  s1_char_034, s1_char_036, s1_char_037, s1_char_045,
 *  s1_char_046, s1_char_109, s1_char_110, s1_char_111,
 *  s1_char_112, s1_char_203, s1_pack_015-021).
 */
export const DREAMER_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(DREAMER_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
