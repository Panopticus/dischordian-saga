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
  {
    cardId: "s1_pack_cosm_card_back",
    sceneDelta:
      "Wider mid-shot. Echoes of the Fall — at frame-centre, a vast translucent silver-mist DREAMER-MEMORY-GLYPH (a complex prophecy-pattern composed of overlapping aurora-violet ring-fragments and silver-mist arc-fragments). Around the glyph, the SCENE shows TWO STATES at once: the foreground (lower-third) shows a DAMAGED REALITY — dust-and-debris, broken architecture-fragments, a single shattered Dreamer-prophecy-mirror; the upper-third shows the GLYPH-ECHO PUTTING THINGS BACK — translucent silver-mist threads connecting broken-fragments back to their original positions in a slow rebuild. Mid-action of restoration. NO human figure. Faint warm-amber paper-drifts above.",
    moodKeywords: [
      "the Fall broke everything",
      "the echoes put some of it back",
      "two-state scene: damaged reality + glyph-echo restoration",
      "translucent silver-mist threads connecting broken fragments",
    ],
    palette:
      "Translucent silver-mist Dreamer-glyph + aurora-violet ring-fragments + cool-grey damaged reality + warm restoration-threads + warm-amber paper-drifts + warm low rebuild-light + cool deep-shadow",
    composition:
      "Wider mid-shot, glyph at frame-centre upper-third, damaged reality at lower-third, restoration-threads connecting",
    notes:
      "Rare spell. NO human figure (the spell IS the restoration-pattern). The Fall (Genesis-era event) is fully revealed at end of Epoch 2; rendering the AFTERMATH of the Fall is canon. The 'echoes putting things back' is rendered as the visible thread-restoration without specifying any single named restoration-target.",
  },
  {
    cardId: "s1_pack_cosm_frame_gold",
    sceneDelta:
      "Tight composition. A Golden Prophecy Shard — a single crystallized fragment of vision, approximately 25cm long, hovering at frame-centre on a Dreamer-aligned display-pedestal. The shard is GOLDEN aurora-violet (golden alloy with internal aurora-violet glow), faceted and translucent, with embedded cool-cyan PROPHECY-FRAGMENT script visible within the crystal (a partial-prophecy made matter). Faint translucent aurora-violet resonance-rings emanate outward from the shard. Around the pedestal, faint warm-amber sanctum-light. NO human figure (the shard IS the subject). The pedestal sits on a small Dreamer-altar in a quiet sanctum-chamber.",
    moodKeywords: [
      "a fragment of the Oracle's golden vision",
      "crystallized into matter",
      "faceted and translucent",
      "embedded prophecy-script visible within",
    ],
    palette:
      "Golden alloy aurora-violet shard + internal aurora-violet glow + embedded cool-cyan prophecy-script + Dreamer-aligned display-pedestal + faint translucent resonance-rings + warm sanctum-light",
    composition:
      "Tight composition, shard at frame-centre on pedestal, faint sanctum-altar at lower-third",
    notes:
      "Rare unit. NO human figure (the Shard is the subject). The 'Oracle's golden vision crystallized' is the canonical visualization of prophecy-as-matter. Internal embedded script is illegible-but-suggestive (preserves the 'fragment' framing — incomplete on purpose).",
  },
  {
    cardId: "s1_pack_id_oracle_ascended",
    sceneDelta:
      "Wider mid-shot. The Ascended Oracle — at frame-centre, the canonical Oracle-projection (silver-mist body, aurora-violet shimmer, faceless cream-mist face per Imprint set + gen_dreamer + s1_char_104) but rendered at MAXIMUM INTENSITY: the body is brighter and more saturated than any other Oracle-rendering, the silhouette is more solid, the aurora-violet shimmer extends in a wider radiance that fills the upper half of the frame. Around her, FROZEN ENEMY FIGURES are visible at lower-third: anonymous opponent silhouettes (generic-mixed faction-archetype gear) all caught mid-action, IMMOBILIZED IN COOL-CYAN STASIS-LIGHT (the absolute-foresight visualization — every enemy now KNOWN, therefore frozen). Her arms are extended in a wide ascended-gesture. NO face visible (cream-mist faceless oval per spoiler-discipline).",
    moodKeywords: [
      "the full prophecy realized",
      "every enemy frozen in the light of absolute foresight",
      "maximum intensity Oracle-projection",
      "anonymous frozen enemy silhouettes",
    ],
    palette:
      "Maximum-intensity silver-mist Oracle-body + saturated aurora-violet shimmer + faceless cream-mist oval + wider radiance + cool-cyan enemy stasis-light + anonymous frozen silhouettes + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Oracle at frame-centre with arms extended ascended-gesture, frozen enemies at lower-third",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: face remains FACELESS cream-mist oval (consistent across all Oracle renderings — Imprint, gen_dreamer, s1_char_104, s1_class_oracle_05, Oracle's Wrath). Anonymous frozen-enemies prevent named-character conflation. The 'ascended' framing is rendered as INTENSITY-INCREASE rather than IDENTITY-REVEAL — preserves Oracle face-discipline.",
  },
  {
    cardId: "s1_pack_id_oracle_prisoner",
    sceneDelta:
      "Mid-shot. The Prisoner — a humanoid figure within a cool-cyan suspension-pillar (consistent with s1_char_104 captive-state), but rendered with even LESS individual identity than the captive Oracle: the figure inside the suspension-medium is rendered as a TRANSLUCENT SILHOUETTE only, no white-robed Oracle-form, no silver-mist hair, just a generic humanoid shape barely visible through cool-cyan medium. At the figure's neck-region, a single chrome-and-cool-cyan SHIELD-PENDANT remains visible (the only thing not stripped). The face is absent — face-region shows only deep cool-cyan shadow. Around the suspension-pillar, faint cool-cyan stasis-glow. NO Architect-glyph speech-patterns (consistent with stripping — silence rather than puppet-speech).",
    moodKeywords: [
      "memory erased",
      "identity stripped",
      "only the shield remains",
      "deep cool-cyan shadow where face would be",
    ],
    palette:
      "Cool-cyan suspension-pillar + translucent humanoid silhouette inside + chrome-and-cool-cyan shield-pendant + cool-cyan stasis-glow + cool deep-shadow + cool ambient",
    composition:
      "Mid-shot front three-quarter, suspension-pillar at frame-centre with stripped silhouette, no Architect-glyph apparatus",
    notes:
      "Common unit. CRITICAL: this is a stripped-identity captive — DELIBERATELY DIFFERENT from the canonical captive Oracle (s1_char_104), which retains the Oracle's recognizable form. The Prisoner here has been further stripped — even the form is gone. The retained shield-pendant is canon-direct from flavor. Generic humanoid silhouette must NOT match any specific named character.",
  },
  {
    cardId: "s1_pack_id_oracle_prophet",
    sceneDelta:
      "Wider mid-shot. The Oracle, Prophet — at frame-centre, the canonical Oracle-projection (silver-mist body, aurora-violet shimmer, faceless cream-mist face) but rendered in MID-PROPHECY-TRANSMISSION: from her body, FRAGMENTS OF PROPHECY emit forward in burning-bright sparks (each spark a different prophecy-fragment, varying brightness). Some sparks are dim (older prophecies fading); some are mid-bright (active prophecies); some are SEARING-BRIGHT (newest prophecies, most powerful). Her arms are extended outward in a wide transmission-gesture. The intensity is BETWEEN default-projection and ascended-mode — she is mid-broadcast. NO face visible (cream-mist faceless oval per spoiler-discipline). Around her, faint translucent prophecy-script trails.",
    moodKeywords: [
      "the prophecy returns in fragments",
      "each piece burns brighter than the last",
      "mid-prophecy-transmission",
      "varying-brightness sparks emitting forward",
    ],
    palette:
      "Silver-mist Oracle-body + aurora-violet shimmer + faceless cream-mist oval + warm-cream prophecy-fragment sparks (varying brightness) + faint translucent prophecy-script + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Oracle at frame-centre with arms extended transmission-gesture, sparks emitting forward",
    notes:
      "Epic unit. CRITICAL spoiler-discipline: face remains FACELESS cream-mist oval (consistent across all Oracle renderings). The 'fragments' framing is rendered as varying-brightness sparks — each spark is a piece of prophecy, NOT a complete revelation. This is the BETWEEN-state (vs Prisoner = stripped, Ascended = full).",
  },
  {
    cardId: "s1_pack_pet_glyph_moth_1",
    sceneDelta:
      "Tight composition. A Glyph Larva — a small translucent silver-mist creature, approximately 8cm long, clinging to the underside of a Dreamer-aligned reality-surface (the surface visible at upper-frame as a shimmering aurora-violet membrane). The Larva's body is segmented and quiet, with faint cool-cyan glyph-marks pulsing softly along its back (early-stage glyph-language). Two tiny deeper-cool-cyan eye-points. It is currently STILL, waiting. Faint translucent rebirth-doubled-edge runs along its outline (rebirth keyword visualized). NO human figure. The deep-background is dark Dreamer-otherspace.",
    moodKeywords: [
      "clings to the underside of reality",
      "waiting to become something worth noticing",
      "early-stage glyph-marks pulsing softly",
      "translucent rebirth-doubled-edge",
    ],
    palette:
      "Translucent silver-mist Larva-body + faint cool-cyan glyph-marks + deeper-cool-cyan eye-points + shimmering aurora-violet reality-membrane + translucent rebirth-edge + dark Dreamer-otherspace",
    composition:
      "Tight composition, Larva at frame-centre clinging to reality-membrane at upper-third, otherspace below",
    notes:
      "Common unit. NO human figure. The 'underside of reality' is the canonical visualization — the Larva is BENEATH the surface of the world, not yet on it. First stage of glyph-moth lineage.",
  },
  {
    cardId: "s1_pack_pet_glyph_moth_2",
    sceneDelta:
      "Mid-shot. A Sigil Moth — adult-stage moth, approximately 30cm wingspan, with broad translucent silver-mist wings displaying readable PRAYER-SIGILS (each wing covered in cool-cyan glyph-script, the wings themselves are written-prayers). Body is slim, aurora-violet, with two larger deeper-cool-cyan eye-points. It is mid-flight at chest-height in a Dreamer-sanctum, faint cool-cream wing-trails behind. Around its wings, faint visible BLESSING-DUST drifts outward (the dust is faintly luminous, the blessing made visible). Faint silver-mist wing-shape projection-echoes consistent with Dreamer flying-as-projection idiom. NO human figure.",
    moodKeywords: [
      "its wings are prayers",
      "its dust is a blessing",
      "readable prayer-sigils on each wing",
      "luminous blessing-dust drifting outward",
    ],
    palette:
      "Translucent silver-mist wings + cool-cyan prayer-sigil script + slim aurora-violet body + deeper-cool-cyan eye-points + faint cool-cream wing-trails + luminous blessing-dust + cool Dreamer-sanctum ambient",
    composition:
      "Mid-shot side three-quarter, Sigil Moth at frame-centre mid-flight, wings spread to display sigils",
    notes:
      "Rare unit. NO human figure. The 'wings as prayers' is rendered literally — the wing-script is legible-but-suggestive (preserves prayer-as-presence rather than specific-content). Second stage of glyph-moth lineage.",
  },
  {
    cardId: "s1_pack_pet_glyph_moth_3",
    sceneDelta:
      "Wider mid-shot. An Arcane Monarch — vast adult-stage moth, approximately 1.2m wingspan, fully spread wings dominating frame-centre. Wings are translucent silver-mist with DENSE cool-cyan glyph-script + interweaving aurora-violet COMBAT-MEMORIES (the wings now hold both prayers AND remembered-battles, the script and memory layered together). Body is more substantial than the Sigil Moth, with a broad cool-cyan thorax-marking. As wings spread, a translucent BATTLEFIELD-BENEATH-IT shows anonymous warrior-silhouettes RECOVERING combat-memory from the wing-script (figures regaining stances mid-fight). Faint cool-cream wing-trails. NO human face visible — the warrior-silhouettes are translucent only.",
    moodKeywords: [
      "when it spreads its wings, the battlefield remembers how to fight",
      "wings layered with prayers and combat-memories",
      "warrior-silhouettes recovering combat-memory below",
      "vast 1.2m wingspan",
    ],
    palette:
      "Translucent silver-mist wings + dense cool-cyan glyph-script + interweaving aurora-violet combat-memories + broad cool-cyan thorax-marking + translucent warrior-silhouettes below + cool wing-trails + cool deep-shadow",
    composition:
      "Wider mid-shot, Monarch at frame-centre with wings fully spread, translucent battlefield with warrior-silhouettes at lower-third",
    notes:
      "Epic unit. NO specific human face (warrior-silhouettes are translucent generic-archetype). Third stage of glyph-moth lineage. The 'battlefield remembers' is rendered as the warriors below recovering stances from the wing-script.",
  },
  {
    cardId: "s1_pack_pet_holo_fox_1",
    sceneDelta:
      "Tight composition. A Fox Kit — a small luminous holographic fox, approximately 25cm long, mid-MATERIALIZATION at frame-centre. Body is translucent cool-cyan-and-aurora-violet with internal starlight-flecks visible. The Kit is mid-action of HAVING JUST BLINKED INTO EXISTENCE — its body is half-formed at the back end (still materializing), full-formed at the front. Two small tiny deeper-aurora-violet ear-tufts. Two cool-cyan eye-points already alert. Around it, faint translucent OZONE-RIPPLES (the smell rendered visible as concentric thin rings). Background: a quiet warm-leather Dreamer floor; faint warm distant lamp at frame-corner.",
    moodKeywords: [
      "blinked into existence smelling of ozone and starlight",
      "half-formed at the back end (still materializing)",
      "full-formed at the front",
      "concentric ozone-rings visible",
    ],
    palette:
      "Translucent cool-cyan-and-aurora-violet Kit-body + internal starlight-flecks + deeper-aurora-violet ear-tufts + cool-cyan eye-points + translucent ozone-ripples + warm-leather Dreamer floor + warm distant lamp",
    composition:
      "Tight composition, Fox Kit at frame-centre mid-materialization, ozone-ripples around",
    notes:
      "Common unit. NO human figure. The 'blinked into existence' is rendered as half-formed-back + full-formed-front. First stage of holo-fox lineage.",
  },
  {
    cardId: "s1_pack_pet_holo_fox_2",
    sceneDelta:
      "Mid-shot. A Spectral Fox — adult-stage fox, approximately 60cm long, fully translucent cool-cyan-and-aurora-violet body, mid-action of WALKING ON A BEAM OF LIGHT. The light-beam extends diagonally across the frame from upper-left to lower-right (a translucent warm-cream beam), and the fox is balanced atop it, four paws on the beam-surface. Its body is now denser than the Kit but still partially translucent. Faint silver-mist wing-shape projection-echoes trail behind shoulders (Dreamer flying-as-projection idiom — the fox flies because it walks on light). Three deeper-cool-cyan eye-points (the third on the forehead — between-worlds awareness). NO human figure.",
    moodKeywords: [
      "between worlds, it learned to walk on light",
      "balanced atop a translucent warm-cream beam",
      "third eye on the forehead — between-worlds awareness",
      "wing-shape projection-echoes",
    ],
    palette:
      "Translucent cool-cyan-and-aurora-violet Spectral Fox-body + warm-cream light-beam + silver-mist wing-shape projection-echoes + three deeper-cool-cyan eye-points + cool deep-shadow",
    composition:
      "Mid-shot side three-quarter, Spectral Fox at frame-centre walking on diagonal light-beam",
    notes:
      "Rare unit. NO human figure. Second stage of holo-fox lineage. The 'walking on light' is rendered literally as the diagonal beam under the paws.",
  },
  {
    cardId: "s1_pack_pet_holo_fox_3",
    sceneDelta:
      "Mid-shot. A Holographic Apex Fox — vast adult-stage fox, approximately 1m long at shoulder-height (large, regal), body now FULLY DENSE (no longer translucent — solid cool-cyan-and-aurora-violet mass), but rendered as EXISTING IN BOTH WORLDS SIMULTANEOUSLY: the body shows TWO overlapping renderings at slight offset, each fully-solid (vs the Kit's half-formed or the Spectral Fox's translucent — the Apex is BOTH). Both versions are aligned to occupy the same space. Faint silver-mist wing-shape projection-echoes trail behind. Five deeper-cool-cyan eye-points across the face (escalation: 2 → 3 → 5). Around the body, the air shows MULTI-WORLD distortion (each world's faint backdrop visible at the body-edges). NO human figure.",
    moodKeywords: [
      "no longer phases between worlds",
      "it is both at once",
      "two overlapping fully-solid renderings",
      "five deeper eye-points across face",
    ],
    palette:
      "Solid cool-cyan-and-aurora-violet Apex Fox-body + double overlapping rendering + silver-mist wing-shape projection-echoes + five deeper-cool-cyan eye-points + multi-world distortion at body-edges + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Apex Fox at frame-centre with double-overlapping body, multi-world distortion at edges",
    notes:
      "Epic unit. NO human figure. Third stage of holo-fox lineage with eye-escalation: 2 (Kit) → 3 (Spectral) → 5 (Apex). The 'both at once' is rendered as the double-overlap — solid in both renderings simultaneously.",
  },
  {
    cardId: "s1_pack_pet_temporal_kitten_1",
    sceneDelta:
      "Tight composition. A Chrono Kitten — a small kitten, approximately 15cm long, at frame-centre mid-leap. The body shows visible CELERITY-LIKE MOTION-BLUR at the back-end — the kitten is moving so fast through its own life that its trailing edge is BLURRED with after-image-trails (the canonical 'burning through nine lives so fast it looks like one'). Its body color is warm-cream with faint aurora-violet temporal-tint. Two bright cool-cyan eye-points wide with predatory focus. Around the body, faint warm rush-trails (rush keyword visualized). Background: a quiet Dreamer-sanctum floor; faint warm lamp ambient.",
    moodKeywords: [
      "nine lives, but it burns through them so fast",
      "you'd swear it only has one",
      "body trailing edge blurred with after-image-trails",
      "predatory focus eye-points",
    ],
    palette:
      "Warm-cream Chrono Kitten body + faint aurora-violet temporal-tint + cool-cyan eye-points + after-image-trails + warm rush-trails + warm Dreamer-sanctum floor + warm lamp",
    composition:
      "Tight composition, Kitten at frame-centre mid-leap, after-image-trails extending behind",
    notes:
      "Common unit. NO human figure. The 'nine lives compressed' is rendered as the after-image-trails — the kitten is multiple lives at once. First stage of temporal-cat lineage.",
  },
  {
    cardId: "s1_pack_pet_temporal_kitten_2",
    sceneDelta:
      "Mid-shot. A Temporal Cat — mid-life cat, approximately 50cm long, sitting calmly at frame-centre on a low Dreamer-meditation cushion. The body is SUBTLY YOUNGER on one side than the other (visible asymmetric aging — left side shows slightly fuller fur, brighter eyes; right side shows slightly more weathered face, deeper-set eye). The aging-asymmetry is the canonical 'ages backward when no one is looking' rendering. Two amber eye-points, alert but composed. Around the cat, faint translucent temporal-resonance-rings propagate slowly (the time-effect ongoing). Background: a quiet Dreamer-altar with faint warm candle-light.",
    moodKeywords: [
      "ages backward when no one is looking",
      "subtly younger on one side than the other",
      "alert but composed",
      "temporal-resonance-rings propagating",
    ],
    palette:
      "Warm-cream Temporal Cat body + asymmetric aging (left younger, right older) + amber eye-points + translucent temporal-resonance-rings + warm Dreamer-altar candle-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Cat at frame-centre on cushion, asymmetry visible across body",
    notes:
      "Rare unit. NO human figure. The asymmetric-aging is the visual key to 'ages backward when no one is looking' — different sides have lived different lengths. Second stage of temporal-cat lineage.",
  },
  {
    cardId: "s1_pack_pet_temporal_kitten_3",
    sceneDelta:
      "Wider mid-shot. An Epoch Panther — vast adult panther, approximately 1.5m at shoulder, mid-stride across a wide Dreamer-vista. The Panther's body is fully solid deep cool-violet-and-warm-cream, sleek and powerful. Critically, the panther is rendered MOVING THROUGH TIME — each footstep along its path shows the GROUND BENEATH IT in a different era-state (the front paw lands on warm-amber pre-Fall stone; the back paw is leaving a cool-grey current-Epoch-2 ash; in between, the ground transitions through visible eras). Three cool-cyan eye-points (one on each side, one on forehead). Faint cool celerity after-image trails behind. The Panther's expression is CASUAL, almost bored — terrifying, casual ease.",
    moodKeywords: [
      "moves through time the way other creatures move through space",
      "with terrifying, casual ease",
      "ground beneath each footstep in a different era-state",
      "casual, almost bored expression",
    ],
    palette:
      "Solid deep cool-violet-and-warm-cream Panther body + warm-amber pre-Fall stone (front paw) + cool-grey current-Epoch-2 ash (back paw) + transitioning ground between + three cool-cyan eye-points + cool celerity after-images + cool wide vista",
    composition:
      "Wider mid-shot side three-quarter, Panther mid-stride at frame-centre, transitioning ground beneath footpath",
    notes:
      "Epic unit. NO human figure. Third stage of temporal-cat lineage. The 'moves through time' is rendered as the multi-era ground-strata under the footsteps. Visually rhymes with Antiquarian Epoch Walker (s1_char_058) — same multi-era ground-transition idiom, applied here to a creature.",
  },
  {
    cardId: "s1_reward_campaign_finale",
    sceneDelta:
      "Wider mid-shot. A Resurrection Protocol — at frame-centre, a tall translucent column of cool-cream void-substance reaches from the floor up to off-frame upper-distance (the void where the Dreamer whispered). From within the column, a humanoid figure is RETURNING — emerging from the upper-third, body partially-translucent, descending downward into manifest reality. The figure is anonymous (back-three-quarter, generic-cool-leather restored gear). Critically, the returned figure is VISIBLY CHANGED: small details are different from any specific original — slight aurora-violet tint to skin, faint silver-mist fingertip-trails (residue of the void-passage). Around the figure, faint translucent void-substance falls away. NO face visible (back-three-quarter only).",
    moodKeywords: [
      "the Dreamer whispered into the void, and the void answered",
      "what returns is changed — but it returns",
      "anonymous figure returning, visibly changed",
      "translucent void-substance falling away",
    ],
    palette:
      "Translucent cool-cream void-column + warm-leather restored gear + faint aurora-violet skin-tint + silver-mist fingertip-trails + translucent void-substance + cool deep-shadow",
    composition:
      "Wider mid-shot back-three-quarter, void-column at frame-centre, returning figure mid-descent",
    notes:
      "Epic spell. Anonymous figure (back-three-quarter) preserves no-character-conflation. The 'changed but returned' framing is rendered through the aurora-violet tint and silver-mist trails — visible alteration without specifying who returned.",
  },
  {
    cardId: "s1_reward_campaign_truth",
    sceneDelta:
      "Mid-shot. An Oracle's Memory Fragment — a single small CRYSTALLINE SHARD of silver-mist substance, approximately 20cm long, hovering at frame-centre on a Dreamer-sanctum altar. The shard is faintly luminous with internal aurora-violet WORLD-AS-MEANT-TO-BE script visible through translucent surface (a partial vision of the unbroken world). Around the shard, faint translucent prophecy-trails. The shard sits ALONE on a small altar — there are CRACK-MARKS on the altar's surface where OTHER SHARDS once sat (the canonical 'shattered herself rather than let the Architect possess her whole' visualization — multiple shards exist elsewhere). NO Oracle figure visible — only her fragment.",
    moodKeywords: [
      "she shattered herself rather than let the Architect possess her whole",
      "each shard still remembers what the world was meant to be",
      "single shard with internal world-as-meant-to-be script",
      "crack-marks on altar where other shards sat",
    ],
    palette:
      "Crystalline silver-mist Shard + internal aurora-violet world-script + faint translucent prophecy-trails + Dreamer-sanctum altar + crack-marks on altar surface + warm low altar-light + cool deep-shadow",
    composition:
      "Mid-shot, Shard at frame-centre on altar, crack-marks visible on altar-surface",
    notes:
      "Rare unit. NO Oracle figure visible (consistent with spoiler-discipline — the Oracle is captive/leak, not present in person). The crack-marks where other shards sat communicate 'multiple fragments' without requiring all to be drawn.",
  },
  {
    cardId: "s1_reward_casino_dice",
    sceneDelta:
      "Tight composition. An Entropy Roll — a single chrome-and-aurora-violet DIE, approximately 5cm per side, mid-tumble at frame-centre. The die's faces show NUMBERED SYMBOLS in cool-cyan but each visible face shows a DIFFERENT POTENTIAL OUTCOME (one face shows a sword-icon, one shows a shield-icon, one shows a dawn-icon, one shows a void-icon — chaos chooses among diverse outcomes). The die is mid-tumble, blurred at the edges from rotation. Around the die, faint translucent probability-ribbons trail behind. NO human figure (the die IS the subject). Background: a quiet warm-leather casino-table surface (consistent with The Degen's casino).",
    moodKeywords: [
      "chaos doesn't choose sides",
      "it just chooses",
      "die mid-tumble with diverse-outcome faces",
      "translucent probability-ribbons trailing",
    ],
    palette:
      "Chrome-and-aurora-violet die + cool-cyan numbered-symbol faces + diverse outcome-icons + translucent probability-ribbons + warm-leather casino-table + cool deep-shadow",
    composition:
      "Tight composition, die at frame-centre mid-tumble, casino-table surface beneath",
    notes:
      "Common spell. NO human figure. Different faces showing different outcome-types is the canonical 'chaos chooses' visualization — multiple potentials in a single roll.",
  },
  {
    cardId: "s1_reward_class_neyon",
    sceneDelta:
      "Mid-shot. An Awakened Ne-Yon — generic-mixed features figure in late-twenties, just OPENING THEIR EYES from a meditation-trance, in plain Dreamer-cream-and-warm-cream Ne-Yon meditation-robes. They sit cross-legged on a low Dreamer-meditation-platform. Around them, the AIR shows the FRESH EVIDENCE of their dream-conjuring: faint translucent silver-mist FORM-OUTLINES of every class-discipline they envisioned (assassin-strike trail, oracle-divination ring, soldier-formation echo, engineer-paper-drift, spy-stealth-shimmer, ne-yon-multi-token, all overlapping at chest-height in front of them). The Awakened figure stands AT the edge of the platform — they have JUST stood up, the dream becoming the body. Their face is calm, freshly-aware.",
    moodKeywords: [
      "the Ne-Yon dreamed of a warrior who mastered every discipline",
      "then it opened its eyes, and the warrior was standing there",
      "fresh evidence of dream-conjuring",
      "every class-discipline visible as form-outlines around them",
    ],
    palette:
      "Dreamer-cream-and-warm-cream Ne-Yon robes + low Dreamer-meditation-platform + translucent silver-mist form-outlines (assassin/oracle/soldier/engineer/spy/ne-yon overlapping) + cool deep-shadow + warm meditation-light",
    composition:
      "Mid-shot front three-quarter, Awakened Ne-Yon at frame-centre standing from platform, form-outlines hovering around",
    notes:
      "Legendary unit. The 'every class-discipline visible' is a canonical Ne-Yon visualization — multiple disciplines in one body (consistent with Ne-Yon class set s1_class_neyon_*). Generic-mixed features must NOT match any named character.",
  },
  {
    cardId: "s1_reward_class_oracle",
    sceneDelta:
      "Mid-shot. A Master Oracle — female-presenting figure in mid-forties (NOT The Oracle herself; this is a Master-rank class-tier reward), generic-attentive features (calm, deeply present), in Dreamer-aurora-violet apprentice-master Oracle-school robes with three-nested-rings sigil at the throat. She stands in a quiet Dreamer-divination-chamber. In her right hand, a translucent silver-mist FORESIGHT-SCROLL is partially-unfurled showing PROPHESIED-WOUND-PATTERNS (cool-cyan damage-trajectory glyphs predicting future battle). Her left hand is placed on the chest of an anonymous ally figure (only the ally's shoulder visible at frame-right edge), preparing the ally with a faint warm-cream defense-pulse. Faint translucent dispel-ribbon trails around her hands.",
    moodKeywords: [
      "the Oracle sees every wound before it is dealt",
      "and prepares accordingly",
      "foresight-scroll showing prophesied-wound-patterns",
      "warm-cream defense-pulse on ally",
    ],
    palette:
      "Dreamer-aurora-violet apprentice-master Oracle-school robes + three-nested-rings sigil + translucent silver-mist foresight-scroll + cool-cyan damage-trajectory glyphs + warm-cream defense-pulse + translucent dispel-ribbon + cool divination-chamber ambient",
    composition:
      "Mid-shot front three-quarter, Master Oracle at frame-centre with scroll in right hand, anonymous ally-shoulder at frame-right edge",
    notes:
      "Rare unit. CRITICAL: this is a class-rank reward Oracle (Master Oracle, similar idiom to Master Engineer s1_reward_class_engineer), NOT The Oracle herself (whose face remains FACELESS cream-mist oval per spoiler-discipline). The Master Oracle is generic-attentive features; visible mid-forties woman, full-faced. Anonymous ally preserves no-character-conflation.",
  },
  {
    cardId: "s1_reward_cycle_light",
    sceneDelta:
      "Wider mid-shot. A Dawn Ascendant — male-presenting figure in early-twenties at frame-centre, generic-quiet features (alert, slightly cold, attentive), in plain Dreamer-cool-cream cyclic-acolyte robes. He stands on a high Dreamer-aligned dawn-tower platform, both arms slightly extended outward in a wide CYCLE-WELCOMING gesture. Around him, the SCENE shows the moment of FIRST LIGHT after a long darkness: the sky at upper-third is mid-transition from deep cool-violet (night ending) to thin warm-amber (first dawn beginning), with the very first cool-cream sun-edge cresting at the horizon at upper-frame-right. The light hits him at an angle, casting a long cool shadow behind. His breath is visibly cold (a faint cool-cream exhale-cloud at his mouth). The light is BEAUTIFUL but COLD.",
    moodKeywords: [
      "when the Cycle turns, the first light is always the coldest",
      "but it is light nonetheless",
      "first sun-edge cresting at horizon",
      "alert, slightly cold, attentive",
    ],
    palette:
      "Dreamer-cool-cream cyclic-acolyte robes + deep cool-violet night-ending sky + thin warm-amber first-dawn + cool-cream sun-edge + cool-cream exhale-cloud + long cool shadow behind + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Dawn Ascendant at frame-centre on tower-platform, dawn-horizon at upper-third",
    notes:
      "Rare unit. Generic-quiet features must NOT match any named character. The 'first light is the coldest' is rendered as the cool-tinted dawn (not the warm dawn typical of Dreamer-faction default). The visible cool exhale-breath is the visual key to the cold.",
  },
  {
    cardId: "s1_reward_eidolon_lux",
    sceneDelta:
      "Wider mid-shot. Lux, the Light — a translucent humanoid figure of CONCENTRATED LIGHT at frame-centre, approximately 1.7m tall, body composed entirely of warm-cream brilliance with internal cool-cyan core-glow. The figure's outline is humanoid but the FACE is rendered as PURE WARM LIGHT (no specific features, just brightness). Around Lux, the SETTING is the deepest level of Dreamer-recursion: a vast cool-violet otherspace with multiple translucent SLEEPING-DREAMER-LAYERS visible at differing depths (the Dreamer's nested levels of sleep). Lux is the SINGLE LIGHT in this depth — refusing to extinguish. Faint warm rays extend outward from his body in all directions. NO recognizable face.",
    moodKeywords: [
      "in the deepest recursion of the Dreamer's sleep",
      "a light persisted",
      "it called itself Lux, and it refused to go out",
      "humanoid concentrated-light figure with no facial features",
    ],
    palette:
      "Translucent warm-cream brilliance Lux body + internal cool-cyan core-glow + pure warm light face-region + cool-violet otherspace + multiple translucent sleeping-Dreamer-layers + warm radiating rays",
    composition:
      "Wider mid-shot front three-quarter, Lux at frame-centre as concentrated light, otherspace recursion-layers behind",
    notes:
      "Rare unit. Featureless light-face preserves no-character-conflation (Lux is a personification of persistence, not a specific named character). The recursion-layers communicate 'deepest level of Dreamer's sleep' without specifying any single named layer.",
  },
  {
    cardId: "s1_reward_palimpsest_signal",
    sceneDelta:
      "Mid-shot. A Signal Bearer — male-presenting figure in late-thirties, generic-resolute features (steady eyes, set jaw), in plain Dreamer-cream traveler's coat over a warm-leather under-tunic. He stands at frame-centre at the edge of an Architect-faction propaganda-wall (visible at upper-third of frame, the wall covered in many overlapping Architect-cyan posters showing OVERWRITTEN historical claims — multiple layers of paste, the most recent layer the loudest). In his hand, a small SCROLL — the original-text, cool-cream parchment with deep warm script visible. He extends the scroll toward an off-frame recipient. Faint translucent silver-mist memory-ribbons trail from his shoulder (he carries the original). His face is determined.",
    moodKeywords: [
      "in a world of overwritten truths",
      "the Signal Bearer remembers the original text",
      "Architect-faction propaganda-wall with overlapping overwritten posters",
      "scroll containing the original-text in his hand",
    ],
    palette:
      "Dreamer-cream traveler's coat + warm-leather under-tunic + Architect-cyan overwritten propaganda-wall + cool-cream parchment original-scroll + warm script + translucent silver-mist memory-ribbons + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Bearer at frame-centre at propaganda-wall, scroll extended outward",
    notes:
      "Rare unit. Generic-resolute features must NOT match any named character. The overwritten propaganda-wall + retained original-scroll is the canonical 'palimpsest' visualization — the original beneath the overwriting.",
  },
  {
    cardId: "s1_reward_vortex_close",
    sceneDelta:
      "Wider mid-shot. A Vortex Seal — at frame-centre, a CLOSING dimensional rift in the air, approximately 2m tall and 1.5m wide, mid-action of contracting. The rift's interior shows deep cool-violet otherspace; through the closing seam, a CREATURE'S CLAW is visible (translucent, threatening, mid-action of trying to push through, but being EXPELLED back as the rift closes). The creature is anonymous (only the claw and a hint of teeth visible — no full body). Around the rift, an anonymous Dreamer-aligned figure (back-three-quarter, cream-and-aurora-violet seal-mage robes) extends both hands toward the rift, faint translucent aurora-violet seal-glyphs propagating from her fingertips. The rift is mid-scream — visible distortion-rings emanate from both rift and creature. NO face visible.",
    moodKeywords: [
      "the rift screamed as it closed",
      "the creature on the other side screamed louder",
      "claw mid-expulsion as rift contracts",
      "anonymous Dreamer seal-mage with extended hands",
    ],
    palette:
      "Closing dimensional rift + deep cool-violet otherspace interior + translucent threatening claw + Dreamer cream-and-aurora-violet seal-mage robes + translucent aurora-violet seal-glyphs + visible distortion-rings + cool deep-shadow",
    composition:
      "Wider mid-shot, rift at frame-centre mid-closing, creature-claw at frame-right edge of rift, seal-mage at frame-left back-three-quarter",
    notes:
      "Rare spell. Anonymous seal-mage (back-three-quarter) preserves no-character-conflation. The claw + teeth (no full body) preserves the threat without specifying any named-creature.",
  },
  {
    cardId: "s1_reward_vortex_master",
    sceneDelta:
      "Wider mid-shot. A Vortex Walker — female-presenting figure of indeterminate ethnicity, mid-thirties, generic-deliberate features (calm, slightly sad, very practiced), in Dreamer cream-and-aurora-violet vortex-tied robes. Her body is rendered as PARTIALLY-MERGED with a small dimensional vortex at her chest (the canonical 'becomes the vortex' transformation): a translucent aurora-violet vortex-spiral is embedded WITHIN her chest-region, visibly pulsing with otherspace-substance. Her arms are extended outward in a wide opening-gesture — she is now the OPENING ITSELF. Behind her, fifty FAINT TRANSLUCENT SEAL-MARKS hang in the air at varying depths (each a previous closure she made). Now there are no more closures left — only her becoming.",
    moodKeywords: [
      "fifty incursions, fifty seals",
      "now she does not close the vortex — she becomes it",
      "translucent aurora-violet vortex embedded in chest",
      "fifty faint translucent seal-marks behind her",
    ],
    palette:
      "Dreamer cream-and-aurora-violet vortex-tied robes + translucent aurora-violet chest-vortex + faint otherspace-substance pulse + extended arms + fifty faint translucent seal-marks behind + cool deep-shadow + warm vortex-glow",
    composition:
      "Wider mid-shot front three-quarter, Walker at frame-centre with embedded chest-vortex, seal-marks at varying depths behind",
    notes:
      "Epic unit. Generic-deliberate features must NOT match any named character. The 'fifty seal-marks behind' is the canonical visualization of fifty-incursions without requiring fifty distinct closures to be drawn. Embedded chest-vortex is the visual key to 'she becomes it.'",
  },
  {
    cardId: "s1_reward_vote_t1_truth",
    sceneDelta:
      "Mid-shot. An Investigator's Lens — male-presenting figure in early-thirties at frame-centre, generic-attentive features (sharp eyes behind glasses, slight forward-lean), in plain Dreamer-cream investigator's coat over warm-leather sleeve-cuffs. In his right hand, a small chrome-and-aurora-violet HAND-LENS — the lens itself is translucent and faintly luminous. He holds the lens up to his eye, examining a small EVIDENCE-FRAGMENT in his left hand (a faint cool-cyan card-fragment, intentionally illegible). Through the lens, the evidence shows clearer, with cool-cyan TRUTH-TRACES visible on its surface (only when seen through the lens). His face shows mid-discovery — the truth is becoming aimable.",
    moodKeywords: [
      "truth is a weapon",
      "the Lens simply makes it easier to aim",
      "evidence-fragment in left hand, lens to right eye",
      "cool-cyan truth-traces visible only through lens",
    ],
    palette:
      "Dreamer-cream investigator's coat + warm-leather sleeve-cuffs + chrome-and-aurora-violet hand-lens + faint cool-cyan card-fragment + cool-cyan truth-traces + warm investigation-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Investigator at frame-centre with lens to right eye, evidence-fragment in left hand",
    notes:
      "Common unit. Generic-attentive features must NOT match The Detective (s1_char_024 — distinct character). The 'truth visible through the lens' is the canonical investigation-mechanic visualization.",
  },
  {
    cardId: "s1_song_082",
    sceneDelta:
      "Wider mid-shot. Top Floor Door — at frame-centre, a tall Dreamer-aurora-violet door at the top of a long curved stairwell. The door is partially OPEN, revealing a translucent warm-cream chamber within. From the chamber, a faint warm-cream RESTORATION-GLOW emerges, descending the stairs as visible light-substance. An anonymous figure (back-three-quarter, generic Dreamer-cream traveler's robes) stands at the top step, mid-action of having JUST OPENED the door, the restoration washing over them. Faint translucent drain-rim wraps the figure (drain keyword visualized as the door's effect — taking from the seeker, restoring to the broken). The stairwell descends into deep warm-shadow below.",
    moodKeywords: [
      "behind the last door at the top of the stairwell",
      "the Dreamer found not answers but restoration",
      "warm-cream restoration emerging from chamber",
      "anonymous figure mid-opening, restoration washing over them",
    ],
    palette:
      "Dreamer-aurora-violet door + translucent warm-cream chamber-glow + Dreamer-cream traveler's robes + warm-cream restoration light-substance + translucent drain-rim + curved stairwell + deep warm-shadow descending",
    composition:
      "Wider mid-shot back-three-quarter, door at frame-centre upper-third, anonymous figure at top step, stairwell descending below",
    notes:
      "Rare spell. Anonymous figure (back-three-quarter) preserves no-character-conflation. The 'not answers but restoration' is rendered as the warm-cream wash from the chamber — visible benefit without specifying any named-truth being received.",
  },
  {
    cardId: "s1_spell_108",
    sceneDelta:
      "Mid-shot. A Prophetic Collapse — anonymous female-presenting Dreamer-aligned figure (back-three-quarter, generic Dreamer-cream-and-aurora-violet seer-robes, eyes shown through hair-back as currently CLOSED). At frame-centre in front of her, MULTIPLE TRANSLUCENT TIMELINES converge from many directions toward a single VANISHING-POINT — each timeline rendered as a faint translucent ribbon-strand showing a different possible-future. The convergence-point is brilliant warm-amber. The figure is mid-action of OPENING her eyes — at the moment her eyes open, only ONE timeline will remain solid (the chosen one). NO face visible (back-three-quarter). The setting is a Dreamer-divination-platform under aurora-violet sky.",
    moodKeywords: [
      "she closed her eyes and saw every timeline converge",
      "when she opened them, only one remained",
      "multiple translucent timelines converging at warm-amber vanishing-point",
      "back-three-quarter eyes-mid-opening",
    ],
    palette:
      "Dreamer-cream-and-aurora-violet seer-robes + multiple translucent timeline-ribbons + warm-amber vanishing-point + Dreamer-divination-platform + aurora-violet sky + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter, figure at frame-centre, timeline-convergence at upper-third toward vanishing-point",
    notes:
      "Uncommon spell. Anonymous figure (back-three-quarter) preserves no-character-conflation. The convergence-of-timelines visualization is a new visual idiom — distinct from Probability Surge's reach-into-field.",
  },
  {
    cardId: "s1_spell_109",
    sceneDelta:
      "Mid-shot. A Vision Cascade — at frame-centre, a TRANSLUCENT FOREST of FUTURE-BLOOMS: hundreds of small translucent silver-mist FLOWER-LIKE FORMATIONS suspended in the air at varying heights (each bloom is a different possible-future). One bloom at frame-centre is SEARING-BRIGHT (the chosen one); around it, the remaining blooms are visibly WITHERING (fading translucent, browning at the edges, dropping faint dust). An anonymous Dreamer-aligned hand (only fingertips visible at frame-bottom-edge, generic Dreamer-cream sleeve) plucks the bright bloom. NO face visible. The setting is a quiet Dreamer-cosmology-chamber.",
    moodKeywords: [
      "a thousand futures bloom in the Oracle's mind",
      "she plucks the brightest and lets the rest wither",
      "translucent forest of future-blooms",
      "anonymous fingertips plucking the bright one",
    ],
    palette:
      "Translucent silver-mist future-blooms + searing-bright chosen bloom + withering faint blooms + warm Dreamer-cream sleeve fingertips + cool Dreamer-cosmology-chamber + cool deep-shadow",
    composition:
      "Mid-shot, future-bloom forest at frame-centre, plucking fingertips at frame-bottom-edge",
    notes:
      "Common spell. Anonymous fingertips (no body visible) preserves no-character-conflation. The blooms-as-futures with one bright + many withering is the canonical Vision Cascade visualization.",
  },
  {
    cardId: "s1_spell_110",
    sceneDelta:
      "Mid-shot. A Dream Walk — anonymous Dreamer-aligned figure (back-three-quarter, generic-cream traveling robes) standing at a Dreamer-Arena floor-position. The figure is mid-action of TRANSPLACING: their body shows a faint translucent DEPARTURE-AFTERIMAGE at frame-left (where they were standing one moment ago) and is currently solid at frame-right (where they are standing now, having simply DECIDED elsewhere into existence). Between the two positions, a faint translucent silver-mist transit-trail. The Arena beneath their new position visibly SHIFTED slightly to accommodate (translucent floor-tiles re-aligning). NO face visible.",
    moodKeywords: [
      "she dreamed of standing elsewhere, and the Arena obliged",
      "reality is only stubborn for those who lack imagination",
      "departure-afterimage at left, solid at right",
      "Arena floor-tiles re-aligning to accommodate",
    ],
    palette:
      "Generic Dreamer-cream traveling robes + translucent departure-afterimage + faint translucent silver-mist transit-trail + Dreamer-Arena floor + translucent floor-tile re-alignment + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter, departure-position at frame-left translucent, arrival-position at frame-right solid",
    notes:
      "Common spell. Anonymous figure preserves no-character-conflation. The transplace visual differs from Parallax Walker (s1_dim_space_01) — that was airdrop with ghost-trails as spatial displacement; this is dream-walk with floor-tile-re-alignment (the Arena agrees rather than being closed-over).",
  },
  {
    cardId: "s1_spell_111",
    sceneDelta:
      "Wider mid-shot. A Probability Storm — at frame-centre, a vast STORM of overlapping translucent OUTCOME-BOLTS striking across an Architect-aligned battlefield simultaneously. Each bolt is rendered as a faint translucent aurora-violet lightning-strike between sky and ground; multiple bolts (hundreds, varying brightness) strike at varying positions across the battlefield-floor. Each bolt represents a different probable-attack-outcome arriving at once. Anonymous figures at lower-third (generic-mixed combatants, multiple, all back-three-quarter) are caught between the strikes — survivors visible at varying postures, looking around in confusion at the surviving-state. NO specific named character.",
    moodKeywords: [
      "every probable outcome struck at once",
      "the survivors could only wonder which future they'd been assigned",
      "hundreds of translucent outcome-bolts striking simultaneously",
      "anonymous survivors in confusion at the surviving-state",
    ],
    palette:
      "Translucent aurora-violet lightning-strikes + multiple varying-brightness bolts + cool battlefield-ground + Architect-cyan distant architecture + anonymous combatant silhouettes + cool deep-shadow",
    composition:
      "Wider mid-shot, storm of bolts filling upper-two-thirds, anonymous survivors at lower-third",
    notes:
      "Rare spell. Anonymous combatants (back-three-quarter, generic-mixed) preserve no-character-conflation. The 'every probable outcome at once' is rendered as the visible bolt-storm — making probability-as-multiplicity visible.",
  },
  {
    cardId: "s1_spell_212",
    sceneDelta:
      "Tight composition. A Lucid Clarity — anonymous figure (back-three-quarter only, generic Dreamer-cream meditation-robes), eyes CLOSED in meditation, head tilted slightly. Despite their closed eyes, around their head, faint translucent silver-mist EVERYTHING-PERCEPTION-RIBBONS extend outward in all directions (the whole field of perception now visible, not blocked by closed eyes). The ribbons each carry faint readable hints of THINGS BEING SEEN (an enemy position, a hidden door, an approaching threat, all faintly readable as silver-mist suggestions). NO face visible. The setting is a quiet Dreamer-meditation-platform; cool deep-shadow.",
    moodKeywords: [
      "close your eyes",
      "what do you see? everything",
      "perception-ribbons extending outward in all directions",
      "things being seen as faint silver-mist suggestions",
    ],
    palette:
      "Dreamer-cream meditation-robes + translucent silver-mist perception-ribbons + faint readable everything-being-seen suggestions + cool Dreamer-meditation-platform + cool deep-shadow",
    composition:
      "Tight composition back-three-quarter, head at frame-centre, perception-ribbons extending outward in all directions",
    notes:
      "Common spell. Anonymous figure (back-three-quarter, eyes-closed) preserves no-character-conflation. The 'see everything with closed eyes' is the canonical Lucid Clarity visualization.",
  },
  {
    cardId: "s1_spell_213",
    sceneDelta:
      "Action mid-shot. A Precognition — anonymous female-presenting figure (back-three-quarter, generic-cool-leather Dreamer-traveler's gear), mid-DODGE action: her body is LEANED SIDEWAYS just enough to miss a translucent enemy BLADE that has appeared at her former-position (the blade is visible at frame-left, mid-swing where she was three seconds ago). She has just moved. Above her head, a faint translucent THREE-SECOND-GLYPH (a small chrome-and-aurora-violet hourglass-symbol with three sand-grains visible) suggests the foresight-window. Her face is partially-visible (profile only, no full features), composed-deliberate. The setting is a battlefield-edge.",
    moodKeywords: [
      "she saw the blade three seconds before it fell",
      "three seconds was enough",
      "leaned sideways, blade swung through former position",
      "translucent three-second-glyph above head",
    ],
    palette:
      "Generic-cool-leather Dreamer-traveler's gear + translucent enemy blade + chrome-and-aurora-violet three-second-glyph hourglass-symbol + cool battlefield-edge + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, figure leaned at frame-centre, blade at frame-left in former-position",
    notes:
      "Common spell. Anonymous figure (profile/back) preserves no-character-conflation. The three-second-glyph above-head is a new visual idiom for foresight-time-window made specific.",
  },
  {
    cardId: "s1_spell_214",
    sceneDelta:
      "Mid-shot. A Mind's Eye — anonymous Dreamer-aligned figure (back-three-quarter, generic Dreamer-cream-and-aurora-violet meditation-robes) standing motionless at frame-centre. Her body is COMPLETELY STILL — no blink, no flinch, no movement at all. Around her head, a single translucent aurora-violet third-eye-glyph (a single deeper-aurora-violet eye-symbol on her forehead, faintly luminous) is RENDERING the spell. Around the figure, a small translucent BURST of action takes place at frame-right — a target struck, an enemy felled, an effect achieved — but the figure's body is unmoved. The thinking IS the action. NO mouth visible (no command spoken).",
    moodKeywords: [
      "she did not blink. she did not flinch",
      "she simply thought, and it was done",
      "third-eye-glyph at forehead",
      "burst of action at frame-right while body unmoved",
    ],
    palette:
      "Dreamer-cream-and-aurora-violet meditation-robes + translucent aurora-violet third-eye-glyph + faint deeper-aurora-violet eye-symbol + translucent action-burst at frame-right + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter, motionless figure at frame-centre, action-burst at frame-right",
    notes:
      "Uncommon spell. Anonymous figure preserves no-character-conflation. The 'thinking IS action' framing is rendered as the unmoved body + third-eye-glyph + remote action-burst.",
  },
  {
    cardId: "s1_spell_215",
    sceneDelta:
      "Wider mid-shot. A Reality Fracture — at frame-centre, a CRACK runs vertically through reality, splitting the frame into two halves. The LEFT half shows a NIGHTMARE realm (deep cool-violet, twisted architecture, faint screaming-ribbons in the air, threatening shadow-figures in deep distance); the RIGHT half shows a GENTLE DAWN realm (warm-amber light, soft cream-cloud sky, a quiet meadow extending to deep distance, peaceful). Through the central crack, faint translucent crossover-ribbons connect the two halves — the boundary is fragile. NO human figure (the spell IS the crack). At the very crack-line, faint silver-mist edge-substance keeps the two from collapsing into each other.",
    moodKeywords: [
      "the crack runs through everything",
      "on one side, nightmare. on the other, a gentle dawn",
      "vertical crack splitting frame",
      "fragile boundary, faint silver-mist edge-substance",
    ],
    palette:
      "Deep cool-violet nightmare half (left) + warm-amber dawn half (right) + faint translucent crossover-ribbons + faint silver-mist edge-substance + cool deep-shadow + warm peaceful-meadow ambient",
    composition:
      "Wider mid-shot, crack at frame-centre vertical, two halves split frame",
    notes:
      "Rare spell. NO human figure (the spell IS the crack). The two-halves split is the canonical Reality Fracture visualization. Echoes Reality dimension Consensus Weaver's nine-supporters but applied at cosmic scale.",
  },
  {
    cardId: "s1_spell_216",
    sceneDelta:
      "Action mid-shot. An Oracle's Blessing — at frame-centre, an enemy BLADE mid-passage THROUGH a friendly figure's chest — but the blade is rendered as TRANSLUCENT LIGHT and the friendly figure's body is rendered as TRANSLUCENT GLASS (the blade passes through without harm). The friendly figure (anonymous, back-three-quarter, generic Insurgency-aligned slate field-gear) is upright, untroubled. From off-frame upper-left, a faint translucent Oracle-syllable (a single cool-cream-and-aurora-violet glyph hovering in the air) is mid-emission — the syllable that caused the blade-light-passage. The enemy wielding the blade is anonymous off-frame at frame-right (only their hand visible at edge). NO face visible.",
    moodKeywords: [
      "the Oracle spoke a single syllable",
      "the blade passed through like light through glass",
      "blade as translucent light through translucent-glass body",
      "single cool-cream Oracle-syllable glyph mid-emission",
    ],
    palette:
      "Translucent light-blade + translucent glass-body + Insurgency-slate field-gear + cool-cream-and-aurora-violet Oracle-syllable glyph + warm anonymous enemy-hand at edge + cool deep-shadow",
    composition:
      "Action mid-shot, friendly figure at frame-centre back-three-quarter, blade passing through, syllable-glyph at upper-left",
    notes:
      "Common spell. Anonymous friendly + enemy preserve no-character-conflation. The 'blade like light through glass' is rendered literally as translucent-blade + translucent-glass-body. The single syllable-glyph preserves the spell's source without requiring an Oracle render in this card (consistent with Oracle face-discipline).",
  },
  {
    cardId: "s1_spell_217",
    sceneDelta:
      "Wider mid-shot. A Dream Weave — anonymous Dreamer-aligned figure (back-three-quarter, generic Dreamer-cream-and-aurora-violet weaver-meditation robes), JUST WAKING — eyes half-opened, body uncurling from a meditation-cushion at lower-third. In front of her at upper-third, a vast TRANSLUCENT ARMY is mid-MARCHING ACROSS THE FRAME — multiple translucent silver-mist warrior-silhouettes in formation, banners visible (banners are silver-mist Dreamer-aligned), all moving from left to right. The army is mid-stride; they were already marching when she woke. Faint translucent dream-substance falls away from the army's edges (still settling into reality). NO specific named character.",
    moodKeywords: [
      "she dreamed of an army",
      "when she woke, they were already marching",
      "translucent silver-mist warrior-silhouettes mid-march",
      "anonymous dreamer just-waking from cushion",
    ],
    palette:
      "Dreamer-cream-and-aurora-violet weaver-meditation robes + cushion + translucent silver-mist warrior-silhouettes + silver-mist Dreamer-banners + faint translucent dream-substance falling + cool deep-shadow",
    composition:
      "Wider mid-shot back-three-quarter, dreamer at lower-third uncurling, army mid-march at upper-third",
    notes:
      "Rare spell. Anonymous dreamer (back-three-quarter, just-waking) preserves no-character-conflation. The 'army already marching when she woke' is rendered through the army's mid-stride state — they were not summoned-and-now-march; they were dreamed-and-already-marching.",
  },
] as const;

/**
 * Dreamer faction's prompt registry, keyed by card id.
 *
 * Currently populated: 61 / 61 cards — COMPLETE
 * (gen_dreamer, s1_char_005, s1_char_014, s1_char_017,
 *  s1_char_023, s1_char_025, s1_char_027, s1_char_029,
 *  s1_char_034, s1_char_036, s1_char_037, s1_char_045,
 *  s1_char_046, s1_char_109, s1_char_110, s1_char_111,
 *  s1_char_112, s1_char_203, s1_pack_015-021,
 *  s1_pack_cosm_card_back, s1_pack_cosm_frame_gold,
 *  s1_pack_id_oracle_ascended, s1_pack_id_oracle_prisoner,
 *  s1_pack_id_oracle_prophet,
 *  s1_pack_pet_glyph_moth_1-3, s1_pack_pet_holo_fox_1-3,
 *  s1_pack_pet_temporal_kitten_1-3,
 *  s1_reward_campaign_finale, s1_reward_campaign_truth,
 *  s1_reward_casino_dice, s1_reward_class_neyon,
 *  s1_reward_class_oracle, s1_reward_cycle_light,
 *  s1_reward_eidolon_lux, s1_reward_palimpsest_signal,
 *  s1_reward_vortex_close, s1_reward_vortex_master,
 *  s1_reward_vote_t1_truth, s1_song_082,
 *  s1_spell_108-111, s1_spell_212-217).
 */
export const DREAMER_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(DREAMER_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
