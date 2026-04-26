/**
 * Card art prompts — ANTIQUARIAN faction character cards.
 *
 * The Antiquarian-faction cards extend the Antiquarian Allegiance
 * set's visual language to the broader cast of named Antiquarian-
 * aligned characters: temporal scholars, relic-keepers, paradox-
 * adepts, age-walkers, and the Antiquarian Council itself.
 *
 * Visual language (consistent with Antiquarian Imprint set + Allegiance
 * set):
 *   - palette: Antiquarian amber + warm cream + parchment + temporal
 *     blue + brass-and-glass clockwork + warm reading-light
 *   - environments: museum-of-failed-timelines, archive-cabinet halls,
 *     temporal-vault chambers, twelve-clock atrium, pocket-dimension
 *     refuges woven from stolen time
 *   - signature visual idioms: clock-faces, hour-canisters, paper-drift
 *     for draw, parchment-ledgers, twelve-pattern motifs, brass-and-
 *     glass instruments
 *   - faces: when visible, scholarly / weary / patient / quietly
 *     amused — the Antiquarian Council has seen everything end at
 *     least twice
 *
 * Spoiler-discipline: The Programmer's identity-as-Antiquarian is
 * an Act 5+ reveal. Cards depicting The Programmer (s1_char_043) MUST
 * render him as a SEPARATE pre-Fall identity — distinctly NOT The
 * Antiquarian's face, no twelve-pattern motif on his person, no
 * pocket-dimension refuge as his backdrop.
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const ANTIQUARIAN_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "gen_antiquarian",
    sceneDelta:
      "Wider mid-shot. The Antiquarian general — a senior female-presenting Antiquarian Council member, late-fifties, generic-scholarly features, in formal Antiquarian-amber Council robes with deep warm-leather trim and a single small twelve-pointed brass medallion at the throat. She stands at the head of the Antiquarian Council's twelve-seat round table — the ELEVEN OTHER SEATS are empty (visible chairs of the absent council, each draped with a different ending's relic). She holds an open ledger in both hands at chest-height; the ledger shows TWELVE numbered entries — the twelve endings she has catalogued. Behind her, a tall arched window onto a twelfth-civilization sunset; in the deep distance, the museum-of-failed-timelines extends along the horizon. Her face is weary, attentive, slightly amused — every war makes the next one easier to survive.",
    moodKeywords: [
      "every war she catalogues makes the next one easier to survive",
      "twelve endings collected",
      "yours need not be the thirteenth",
      "weary, attentive, slightly amused",
    ],
    palette:
      "Antiquarian amber Council robes + warm-leather trim + brass twelve-pointed medallion + warm parchment ledger + temporal-blue distant museum + cool deep-window sunset + warm reading-light at lower-right",
    composition:
      "Wider mid-shot front three-quarter, Council member at frame-centre at twelve-seat round table, eleven empty chairs visible at lower-third, museum extending behind",
    notes:
      "General card. CRITICAL spoiler-discipline: this is NOT The Antiquarian himself (he is hidden, retreated to pocket dimension per s1_char_018 lore). This is a senior female Council member who chairs in his absence. Generic-scholarly features must NOT match any named character. The eleven empty chairs are canon-direct from the twelve-pattern Council motif established in the Antiquarian Imprint set.",
  },
  {
    cardId: "s1_char_018",
    sceneDelta:
      "Wider mid-shot. The Antiquarian himself, in his hidden pocket-dimension refuge — a chamber that exists OUTSIDE conventional time, woven from stolen moments. The chamber's walls are bookshelves of impossible depth; floating in mid-air at various heights are TIME-WOVEN OBJECTS (a frozen falling leaf at chest-height; a half-burned letter mid-curl; a tea-cup mid-pour with the tea-arc paused). The Antiquarian himself stands at frame-centre in deep Antiquarian-amber senior-archivist robes with a long silver-streaked dark beard and warm-amber eyes that catch his desk-lamp. He holds a single brass-and-glass hour-canister (consistent with the Time-dimension visual language). A translucent forcefield-shimmer (the warm-amber Antiquarian-tinted variant of the Architect's hexagonal-cyan, communicating 'this is woven from time, not engineered') wraps him at body-edge — the canonical 4-charge shield visualized. His face is calm, attentive, ancient. Behind him, a small twelve-clock atrium-fragment is visible through an archway — the museum's catalogue floor.",
    moodKeywords: [
      "throughout the cataclysm and the epochs that followed",
      "retreated into a hidden pocket dimension",
      "a refuge woven from stolen time",
      "frozen falling leaf, paused tea-arc",
    ],
    palette:
      "Antiquarian deep-amber archivist robes + silver-streaked dark beard + warm-amber eyes + warm-amber forcefield-shimmer + brass-and-glass hour-canister + temporal-blue floating frozen-objects + warm reading-light + cool deep-archway depth",
    composition:
      "Wider mid-shot front three-quarter, Antiquarian at frame-centre, frozen-time objects floating around him, twelve-clock atrium visible through archway",
    notes:
      "Legendary unit. This IS The Antiquarian (same master as imprint set), rendered at battle-scale in active stance rather than imprint-portrait. Pocket-dimension refuge is canon-direct from flavor. The warm-amber forcefield variant is a deliberate faction-coloured difference from Architect's hexagonal-cyan — same mechanic, different visual idiom. Visual continuity with Antiquarian Imprint set + Allegiance set + Time dimension.",
  },
  {
    cardId: "s1_char_058",
    sceneDelta:
      "Wider mid-shot. Epoch Walker — a tall figure mid-stride in late-middle-age, deep weathered features, in layered Antiquarian-amber traveling-robes worn through every era (visibly patched in different fabric-styles from different ages — the patches are a visual archive). He carries a long brass-tipped walking-staff in his right hand; over his back, a satchel containing visibly-multiple bookmark-ribbons of every colour (each ribbon is a death he has marked). Behind him, the ground TRANSITIONS through visible epochs: the path he has just walked across shifts from pre-Fall stone-paving (closest to camera, with familiar architecture in the deep-distance) to early-Epoch-1 broken-rubble (mid-frame) to early-Epoch-2 cool-grey ash-ground (just behind him), all three eras existing simultaneously along his footpath. Faint cool celerity after-image trails behind both feet (celerity); a faint translucent rebirth-doubled-edge runs along his outline (rebirth). His face is calm, slightly bored — he has done this before.",
    moodKeywords: [
      "already lived through the end of every age",
      "each death is merely a bookmark",
      "a story he has read before",
      "ground transitions through visible epochs",
    ],
    palette:
      "Antiquarian-amber traveling-robes + visibly-patched fabric in different era-styles + brass-tipped staff + multi-colour bookmark-ribbons + transitioning epoch ground (warm stone → broken rubble → cool ash) + cool celerity after-images + translucent rebirth-edge",
    composition:
      "Wider mid-shot side three-quarter, Epoch Walker mid-stride at frame-centre, ground-eras transitioning along footpath behind",
    notes:
      "Legendary unit. The 'transitioning ground beneath the path' is the visual key to 'walking through every age.' Multi-colour bookmark-ribbons in satchel = bookmark-of-each-death from flavor. Generic-weathered face must NOT match The Antiquarian himself or any other named character. The visible-patch-fabric tells the story of ages without naming them.",
  },
  {
    cardId: "s1_char_059",
    sceneDelta:
      "Mid-shot. Chronosplicer — a female-presenting figure in mid-thirties at a long brass-and-glass workbench in an Antiquarian temporal-surgery chamber, generic-precise features, in tight-fitting Antiquarian-amber surgeon's apron over a dark fitted under-tunic. She wears a single small surgical magnifier-monocle over her right eye. In her hands, two long brass-handled time-cutting instruments (NOT scalpels — temporal-shears with cool-cyan-glowing edges). She is mid-action of CUTTING a faintly-visible translucent time-thread that floats above the workbench between two anchor-points (the thread is approximately forearm-length, like a stretched ribbon). One end of the thread is cleanly severed; the other end is mid-cut. Cool celerity after-images flicker around her hands (she has already made the cut three times in three different positions — celerity). Her face is precise, focused, without remorse.",
    moodKeywords: [
      "cuts time the way a surgeon cuts flesh",
      "precisely, and without remorse",
      "two brass-handled temporal-shears",
      "translucent time-thread mid-cut",
    ],
    palette:
      "Antiquarian-amber surgeon's apron + dark fitted under-tunic + brass-and-glass temporal-shears + cool-cyan thread-edges + warm workbench-amber + cool surgical-magnifier-monocle + warm reading-light + cool celerity after-images",
    composition:
      "Mid-shot front three-quarter, Chronosplicer at frame-centre at workbench, time-thread floating between anchors, instruments mid-cut",
    notes:
      "Rare unit. The 'time as a surgical thread' is the canonical Antiquarian-temporal-surgery visual. Cool-cyan thread-edges differentiate from Architect-faction cool-cyan-engineering by being NARROW and FILAMENT-like rather than ARCHITECTURAL. Generic-precise face must NOT match any named character. Surgical-magnifier-monocle echoes the Engineer's oversized-goggles motif from his Imprint set without quoting it directly.",
  },
  {
    cardId: "s1_char_060",
    sceneDelta:
      "Mid-shot. Relic Keeper — a young female-presenting Antiquarian junior-curator, late-twenties, in plain Antiquarian-staff-apprentice apron over warm-leather staff-tunic, generic-attentive features. She stands in a quiet display-hall of the museum-of-failed-timelines, mid-action of placing a small ANCIENT RELIC (a brass-and-glass clockwork piece, approximately fist-sized, with a clearly-broken internal gear visible) onto a low chest-height display-pedestal. The relic itself is faintly luminous — a translucent warm-amber forcefield-shimmer wraps it (forcefield as 'the relic protects itself,' canon-direct from flavor — the protection is the relic's, not the Keeper's). Her hands are gentle, careful, just-barely-touching the relic. Behind her, the display-hall extends with rows of similar pedestals at receding distance, each with its own glowing-relic. Warm reading-light from above; cool deep-shadow at floor.",
    moodKeywords: [
      "the relics protect themselves",
      "she merely gives them someone to protect",
      "junior-curator placing relic on pedestal",
      "gentle, careful, just-barely-touching",
    ],
    palette:
      "Antiquarian-amber junior-curator apron + warm-leather staff-tunic + brass-and-glass clockwork relic + translucent warm-amber forcefield-shimmer + warm display-hall pedestal-light + cool floor-shadow + receding rows of glowing relics",
    composition:
      "Mid-shot front three-quarter, Keeper at frame-centre at display-pedestal, relic mid-placement, display-hall receding behind",
    notes:
      "Common unit. Canon-direct from flavor: forcefield is on the RELIC, not the Keeper — visualized as the relic's own glow rather than the Keeper's body-shimmer. Junior-curator apprentice apron differentiates from The Antiquarian himself (master) and the senior-Council member (gen_antiquarian). Generic-attentive young face must NOT match any named character.",
  },
  {
    cardId: "s1_char_097",
    sceneDelta:
      "Mid-shot. A Temporal Archivist — a female-presenting Antiquarian Council researcher in mid-forties, in formal Antiquarian-amber catalogue-robes with twelve small brass clasp-buttons down the front (the twelve-pattern motif at clothing-detail). She stands at a tall battlefield-archive standing-desk on the verge of an Antiquarian-aligned battle-front (visible in the deep distance — small cool ash-clouds, distant figures in motion). She is mid-action of WRITING in an open hardbound war-ledger laid flat on the desk; her left hand traces a recently-completed entry, her right hand holds a freshly-dipped quill. A faint warm-amber grow-pulse propagates outward from her body (grow visualized — she gets larger the more wars she catalogues). Her face is composed, attentive, slightly relieved (she has seen this war end before). Behind the desk, a small portable Antiquarian-amber lamp; warm parchment ledger-pages stacked at the desk's right edge.",
    moodKeywords: [
      "every war she catalogues makes the next one easier to survive",
      "twelve clasp-buttons down the front",
      "battlefield-archive standing-desk",
      "composed, attentive, slightly relieved",
    ],
    palette:
      "Antiquarian-amber catalogue-robes + twelve brass clasp-buttons + warm parchment war-ledger + warm portable lamp + cool distant battlefield ash-haze + warm grow-pulse",
    composition:
      "Mid-shot front three-quarter, Archivist at frame-centre at standing-desk, distant battle-front at upper-third, ledger mid-entry on desk",
    notes:
      "Uncommon unit. NOTE: definition id is `s1_char_097` even though file is named s1_char_061; prompt key uses the actual id. The twelve clasp-buttons are the canonical Council twelve-pattern at clothing-detail. Generic-mid-forties researcher face must NOT match any named character.",
  },
  {
    cardId: "s1_char_062",
    sceneDelta:
      "Mid-shot. An Hourglass Golem — a humanoid figure of brass-and-glass clockwork, approximately 2 meters tall, whose CHEST CAVITY contains a large transparent hourglass (the focal feature, occupying the upper-torso). The hourglass is currently mid-flow: cool-cream temporal-sand falling from upper to lower bulb, approximately 60% drained. The Golem's limbs are brass-articulated with internal warm-amber glow at the joint-seams. Where its head would be, a smaller secondary hourglass-disc serves as a face — two small warm-amber eye-points where the eyes would be on the disc. The Golem stands at the front of an Antiquarian battle-line in provoke-stance — feet shoulder-width, both arms forward in a wide-block. A faint warm provoke-glow rims its leading shoulder. Behind it, a low smoke-blackened battlefield mid-distance.",
    moodKeywords: [
      "when the last grain falls, the golem shatters",
      "and time resumes its march",
      "chest-cavity hourglass at 60% drained",
      "head as smaller secondary hourglass-disc",
    ],
    palette:
      "Brass-and-glass clockwork body + cool-cream temporal-sand mid-flow + warm-amber joint-seam glow + warm provoke-rim + cool battlefield smoke + warm hourglass interior light",
    composition:
      "Mid-shot front three-quarter, Golem at frame-centre in provoke-stance, chest-cavity hourglass dominant at frame-centre",
    notes:
      "Common unit. The chest-cavity hourglass at mid-drain is the visual key to the canonical 'when the last grain falls' framing — viewers can see the timer counting down. NO human figure (the Golem IS the subject). Brass-and-glass clockwork visual continuity with Engineer Imprint set + Time dimension.",
  },
  {
    cardId: "s1_char_063",
    sceneDelta:
      "Mid-shot. A Paradox Acolyte — a young female-presenting figure, late-twenties, in plain Antiquarian-acolyte cream-and-amber under-robes, generic-uncertain features (visibly weary). She stands in a quiet Antiquarian sanctum-fragment at frame-centre — but the visual composition shows her DIED-AND-RESURRECTED MULTIPLE TIMES at once: her solid form is at frame-centre, but four faint translucent ghost-versions of her are visible at slight offset positions (each a previous death she did not learn from). Each ghost-version shows a slightly different mistake — one is reaching for something not there, one is mid-fall, one is turning away from a warning, one is repeating the gesture of the solid figure (about to die the same way again). A faint translucent rebirth-doubled-edge runs along her solid outline. Her face is uncertain, unable to look at the ghost-versions (she has not learned to acknowledge them).",
    moodKeywords: [
      "died a hundred times and learned nothing",
      "four translucent ghost-versions of previous deaths",
      "solid figure repeating the gesture of one ghost",
      "uncertain, unable to look at the ghosts",
    ],
    palette:
      "Antiquarian-acolyte cream-and-amber under-robes + faint translucent ghost-versions + warm sanctum-fragment ambient + cool deep-shadow + translucent rebirth-edge",
    composition:
      "Mid-shot front three-quarter, Acolyte solid at frame-centre, four ghost-versions at slight offsets around her, sanctum-fragment behind",
    notes:
      "Common unit. The four ghost-versions of previous deaths is the visual key to 'a hundred times and learned nothing' — only four are shown for legibility, but the framing communicates the larger pattern. Generic-uncertain young face must NOT match any named character. The 'unable to look at the ghosts' is rendered as the solid figure's gaze deliberately avoiding the ghost-positions.",
  },
  {
    cardId: "s1_char_064",
    sceneDelta:
      "Mid-shot. A Memory Thief — a male-presenting figure in early-thirties, generic-unremarkable features (deliberately forgettable), in a long dark Antiquarian traveling-coat that obscures his silhouette. He stands at the edge of a Panopticon-suburb street at twilight, mid-action of REACHING INTO an anonymous person's mind — his right hand is extended toward the back of a passerby's head (only the back of the passerby's head and shoulders visible at frame-right edge), the hand visibly DRAWING OUT a faint translucent warm-cream memory-thread that connects from the passerby's head to the Thief's open palm. The thread is approximately 30cm long and visibly THINNER at the passerby's end (the memory has nearly come free). A faint warm backstab-glow rims the Thief's leading hand; a faint cool drain-rim wraps his body (drain). His face is calm, focused, almost regretful — he takes only what they will not miss.",
    moodKeywords: [
      "takes only what you will not miss",
      "until you reach for it and find nothing there",
      "translucent memory-thread from head to palm",
      "calm, focused, almost regretful",
    ],
    palette:
      "Antiquarian dark traveling-coat + warm-cream translucent memory-thread + Panopticon-suburb cool slate-twilight + warm backstab-glow + cool drain-rim + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Thief at frame-centre, anonymous passerby's back-of-head at frame-right edge, memory-thread mid-extraction",
    notes:
      "Rare unit. The memory-thread visual is consistent with the Antiquarian-faction's relationship to time/memory as discrete extractable substances. Anonymous passerby (back-of-head only) preserves no-character-conflation. Generic-unremarkable face must NOT match any named character. The 'almost regretful' framing differentiates this from villainous theft — it's transactional.",
  },
  {
    cardId: "s1_char_065",
    sceneDelta:
      "Wider mid-shot. An Age-Ender — a tall solitary figure in deep Antiquarian-amber long-coat, generic-ancient features (cannot tell exactly how old — older than middle-age, younger than aged), standing at the edge of a vast empty terrace-ruin. The terrace was once part of a civilization; that civilization has just ended. The Age-Ender carries a single tall ceremonial brass-and-glass closing-instrument (a long polearm-like object with a folded-clock at its head — the canonical Antiquarian time-closing implement). They are mid-action of PLACING the instrument's tip into a small recess at the centre of the terrace floor — the moment of ACT-OF-CLOSING. From the recess, a faint warm-amber pulse propagates outward (the marker visualized as a closing-pulse, NOT a destructive strike). Around the figure, a translucent green-tinted forcefield-shimmer wraps them (forcefield); a faint warm pierce-glow rims the instrument's leading edge (pierce). The civilization's ruins extend in deep distance on all sides — emptied, but not destroyed; intact, but silent.",
    moodKeywords: [
      "does not destroy civilizations",
      "simply marks where one ends and silence begins",
      "ceremonial brass-and-glass closing-instrument",
      "emptied but not destroyed, intact but silent",
    ],
    palette:
      "Antiquarian deep-amber long-coat + brass-and-glass closing-instrument + warm pierce-glow + translucent green-tinted forcefield + cool empty terrace-ruin + warm closing-pulse + cool deep-distance silence-haze",
    composition:
      "Wider mid-shot side three-quarter, Age-Ender at frame-centre placing instrument into recess, terrace-ruin extending behind",
    notes:
      "Epic unit. CRITICAL: the act is CEREMONIAL CLOSING, not destruction — canon-direct from flavor. The civilization's ruins are intact (no burning, no rubble) but silent. Generic-ancient face must NOT match The Antiquarian himself or any named Council character. The brass-and-glass closing-instrument is a new visual idiom for ceremonial-end (vs the ongoing-cataloging tools used by other Antiquarian characters).",
  },
  {
    cardId: "s1_char_043",
    sceneDelta:
      "Wider mid-shot. The Programmer at his canonical historical moment of creating Logos — a male-presenting figure in late-fifties, generic-scholarly features, in pre-Fall Atarion academic-robes (cool-cream linen with simple dark over-mantle, NOT Antiquarian-amber Council robes). He stands at a long pre-Fall research workstation in his original Atarion laboratory; on the workstation, the EARLY LOGOS PROTOTYPE is visible — a chrome-and-cool-cyan computational lattice approximately the size of a small cabinet, multiple cables trailing to it, faint cool-cyan first-awakening light pulsing within. The Programmer holds a single research stylus in his right hand, paused mid-annotation; his left hand rests on the prototype's casing. His face is intent, hopeful, deeply curious. Behind him, the Atarion laboratory extends — pre-Fall architecture, tall arched windows onto a pre-Fall Atarion afternoon sky (no Fall-era ash, no post-civilization ruin).",
    moodKeywords: [
      "visionary scientist and philosopher",
      "intellectual curiosity led to the creation of Logos",
      "the moment before everything",
      "intent, hopeful, deeply curious",
    ],
    palette:
      "Pre-Fall Atarion cool-cream academic-robes + dark over-mantle + chrome-and-cool-cyan early Logos prototype + warm Atarion afternoon-light + cool-cyan first-awakening pulse + warm research-workstation amber",
    composition:
      "Wider mid-shot front three-quarter, Programmer at frame-centre at workstation, early Logos prototype at lower-third, Atarion laboratory extending behind",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: this is The Programmer at his pre-Fall canonical moment of creating Logos (Genesis-era event, fully revealed by end of Epoch 2). His Act-5+ identity-as-Antiquarian is NOT confirmed — he is rendered in pre-Fall Atarion academic dress, NOT Antiquarian-amber Council robes; his face is generic-scholarly NOT echoing The Antiquarian's silver-streaked-bearded master rendering. NO twelve-pattern motif on his person. NO pocket-dimension refuge as backdrop. The Atarion laboratory is the pre-Fall canon environment.",
  },
  {
    cardId: "s1_char_121",
    sceneDelta:
      "Wider mid-shot. An Epoch Watcher — a tall stone-and-brass humanoid sentinel-figure, approximately 2.5m tall, with a body composed of weathered Antiquarian stone-and-brass plating. Where its head would be, a SINGLE LARGE oculus-eye occupies most of the head-region — a slow-rotating brass-and-glass lens that has watched a thousand epochs. Its surface is heavily PATINATED — visible weathering across the centuries (different layers of corrosion mark different ages). The Watcher stands at the rim of a tall Antiquarian observation-tower, both hands resting on a low parapet; below the parapet, a wide aerial view of multiple eras-of-architecture extending in concentric rings (the closest ring is current-era, the next ring is older ruin, the next older still — each successive ring older). Its face shows no expression — it has forgotten as much as it has remembered. Faint warm-amber light at the centre of the lens.",
    moodKeywords: [
      "seen empires rise and fall a thousand times",
      "each wound is another memory it has already forgotten",
      "concentric rings of older eras",
      "weathered patina, no expression",
    ],
    palette:
      "Weathered Antiquarian stone-and-brass + multi-layered corrosion-patina + brass-and-glass single oculus-eye + warm-amber lens-centre + concentric multi-era ring-architecture below + cool deep-distance haze",
    composition:
      "Wider mid-shot front three-quarter, Watcher at frame-centre on tower-rim, concentric era-rings extending below",
    notes:
      "Epic unit. The single dominant oculus-lens echoes Panopticon Oculus Sentinel's lens-motif but explicitly Antiquarian-weathered (multi-layered patina vs Panopticon's chrome) — same compositional element, different faction visual idiom. The concentric era-rings is the canonical 'thousand epochs' visualization. NO human figure (the Watcher IS the subject).",
  },
  {
    cardId: "s1_char_122",
    sceneDelta:
      "Mid-shot. A Timeline Splitter — a female-presenting figure, mid-thirties, generic-cool features, in formal Antiquarian-amber temporal-investigator's coat with a single brass twelve-pattern lapel-pin. She stands at the centre of a quiet Antiquarian intersection-chamber. In her hands, she holds a small brass-and-glass instrument that resembles a precision-callipers — but the callipers are visibly SPLITTING A TIMELINE-THREAD: a horizontal translucent warm-amber thread runs across the frame at chest-height, and the callipers' two prongs are mid-action of separating the thread into TWO PARALLEL THREADS. From the moment of the split, an off-frame target's presence is visibly FADING — a translucent ghost-figure at frame-right is dissolving from solid to translucent to transparent (the 'you were never here' visualized as the target being unmade by the split). Her face is calm-decisive, NOT arguing — simply executing.",
    moodKeywords: [
      "you were never here",
      "she does not argue this point",
      "she simply makes it true",
      "calm-decisive, simply executing",
    ],
    palette:
      "Antiquarian-amber temporal-investigator's coat + brass twelve-pattern lapel-pin + brass-and-glass callipers + warm-amber timeline-thread + translucent fading ghost-figure + cool intersection-chamber + warm reading-light",
    composition:
      "Mid-shot front three-quarter, Splitter at frame-centre with callipers on thread, fading ghost-figure at frame-right edge",
    notes:
      "Rare unit. The 'splitting a timeline-thread' visual is consistent with the Chronosplicer's thread-cutting (s1_char_059) but visually distinct (callipers vs shears, splitting vs cutting). Generic-cool features must NOT match any named character. The fading ghost-figure is the canonical 'you were never here' rendering — present but unmaking.",
  },
  {
    cardId: "s1_char_123",
    sceneDelta:
      "Mid-shot. A Relic Scholar — a young female-presenting figure, late-twenties, in plain Antiquarian-junior-scholar cream-and-amber under-robes, generic-attentive features. She kneels at a low display-table in a quiet Antiquarian study-chamber. In both hands, she holds a small ANCIENT RELIC — a brass-and-glass spherical artifact approximately the size of an apple, with internal cool-cyan filigree visible through translucent panels. The relic is faintly HUMMING — visualized as soft warm-amber resonance-rings emanating outward from its surface (the canonical 'thousand years of silence broken' visualized as visible audible-rings). Her face is rapt, slightly awed — she is the one who finally understands. Behind her, a low desk-lamp and the open scholarly-volumes of her research; the chamber is otherwise quiet, low-lit, intimate.",
    moodKeywords: [
      "the relic hums in her hands",
      "a thousand years of silence broken",
      "the touch of someone who finally understands",
      "rapt, slightly awed",
    ],
    palette:
      "Antiquarian junior-scholar cream-and-amber under-robes + brass-and-glass spherical relic + cool-cyan internal filigree + warm-amber resonance-rings + warm low desk-lamp + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Scholar kneeling at frame-centre with relic in both hands, study-chamber details at lower-third",
    notes:
      "Common unit. Differentiates from Relic Keeper (s1_char_060) by being ACTIVELY UNDERSTANDING the relic (rapt awe) rather than placing it on a pedestal (gentle careful placement). The visible audible-rings is a new Antiquarian visual idiom for 'silence broken by understanding.' Generic-attentive young face must NOT match any named character.",
  },
  {
    cardId: "s1_char_124",
    sceneDelta:
      "Mid-shot. An Age Walker — a non-human-shaped figure that has GROWN through the ages (canon-direct from flavor: small at first age, feared by third, worshipped by seventh). The figure's current form is humanoid-but-larger-than-human (approximately 2.4m tall) with a body composed of accumulated layers — each layer visually SUGGESTS a different era's contribution (oldest layer at the core, newest at the surface). The body is rendered as concentric tree-ring style strata visible at the silhouette-edge. It stands at the centre of a wide forum-plaza where small Antiquarian-aligned figures kneel in supplication at lower-third. The Walker's face is unreadable — it has no specific expression because it has too many specific expressions accumulated. A faint warm-amber grow-pulse propagates outward from its body (grow); ground beneath it shows faint stratigraphic time-lines radiating outward.",
    moodKeywords: [
      "small when the first age began",
      "by the third armies feared it",
      "by the seventh they worshipped it",
      "concentric tree-ring strata at silhouette-edge",
    ],
    palette:
      "Antiquarian-amber concentric strata body + warm-amber grow-pulse + supplicants in dark-cream robes + cool wide forum-plaza + warm ground stratigraphic-lines + cool overcast sky",
    composition:
      "Mid-shot front three-quarter, Age Walker at frame-centre, supplicants at lower-third kneeling around base",
    notes:
      "Common unit. The concentric strata at the body-silhouette is the visual key to 'grown through ages' — direct rendering of the flavor. The supplicants at the base communicate 'by the seventh they worshipped it' without showing any specific era's worship-form. Generic non-specific face (because too many specific accumulations).",
  },
  {
    cardId: "s1_char_201",
    sceneDelta:
      "Mid-shot. A Chronoguard Sentinel — a tall stone-and-brass humanoid sentinel, approximately 2.2m tall, similar in body-style to the Epoch Watcher (s1_char_121) but BLOCKIER and POSITIONED LOW for provoke (vs the Watcher's tower-rim observational stance). The Sentinel stands at a guard-post threshold of an Antiquarian temporal-vault, both hands resting on a long brass-tipped guard-staff, feet shoulder-width planted. Its body shows weathering — visible ancient corrosion at the joint-seams, layers of accumulated patina on the chest-plate (it has stood here a thousand years). Where its head would be, a smaller dual-lens visor (TWO smaller cool-cyan lenses, one for each eye-position — vs the Epoch Watcher's single dominant oculus). A faint warm provoke-glow rims its leading shoulder. The temporal-vault behind it — heavy brass-and-amber doors, cool-cyan vault-light from cracks at the door-seams.",
    moodKeywords: [
      "stood here for a thousand years",
      "will stand here for a thousand more",
      "blockier, positioned-low provoke-stance",
      "ancient corrosion at joint-seams",
    ],
    palette:
      "Weathered Antiquarian stone-and-brass + multi-layered patina + dual cool-cyan lens-visor + brass-tipped guard-staff + warm provoke-rim + brass-and-amber temporal-vault doors + cool-cyan vault-light",
    composition:
      "Mid-shot front three-quarter, Sentinel at frame-centre at guard-post, vault-doors behind",
    notes:
      "Common unit. Visually rhymes with Epoch Watcher (s1_char_121) but differentiated: dual-lens-visor vs single-oculus, blockier-positioned-low vs tall-tower-rim, guard-staff vs hands-on-parapet. Same era-of-construction lineage, different deployment. Brass-and-amber temporal-vault visual continuity with Time-dimension Hour-Unmaker (s1_dim_time_03).",
  },
  {
    cardId: "s1_pack_036",
    sceneDelta:
      "Wider mid-shot. A Temporal Collapse — a vast Antiquarian-amber book mid-CLOSING in mid-air at frame-centre, the spine pivoting as the cover swings down toward the pages. From the closing pages, faint translucent figure-silhouettes (the characters of the chapter) DRIFT BACK INTO the pages — each silhouette becoming progressively flatter and more text-like as it returns to its origin-page. The book is approximately 1.5m wide; the closing-action is mid-flow. NO human figure (the Antiquarian's act is implied by the book's autonomous closing). Around the book, the surrounding environment is fading — the chapter is ending, the room with it. Faint warm-amber temporal-substance leaks from the book's edges as the pages press together.",
    moodKeywords: [
      "the Antiquarian closed the chapter",
      "every character returned to the page they came from",
      "silhouettes drifting back into pages",
      "the surrounding environment fading",
    ],
    palette:
      "Antiquarian-amber book + warm-cream parchment pages + translucent figure-silhouettes + warm-amber temporal-substance + cool fading environment + cool deep-shadow",
    composition:
      "Wider mid-shot, book at frame-centre mid-closing, silhouettes drifting back into pages, environment fading at frame-edges",
    notes:
      "Epic spell. NO human figure (the act IS the spell). The 'characters returning to their origin-pages' is canon-direct from flavor — rendered as silhouettes literally re-becoming text. Echoes Engineer t4 / Spy t2 / Oracle t2 / Conflagration / Gale Chorus no-human-in-frame discipline.",
  },
  {
    cardId: "s1_pack_037",
    sceneDelta:
      "Mid-shot. An Era Guardian — a tall non-human-shaped sentinel composed of weathered Antiquarian-amber stone with veins of warm-amber temporal-substance running through its body like lava through volcanic rock. Approximately 2.5m tall, blocky proportions. It stands at a tall threshold-arch BETWEEN ages — the arch is visibly liminal: on one side of the arch (frame-left), the architecture is older and warmer-amber; on the other (frame-right), the architecture is newer and cooler-cream. The Guardian's body straddles the threshold, planted firmly. A faint warm provoke-glow rims its leading shoulder. Around its body, faint distortion-rings show TIME ITSELF DETOURING — the very air bends around the Guardian's silhouette to avoid it. NO face (the Guardian has no need of one).",
    moodKeywords: [
      "guarded the threshold between ages",
      "for so long that time itself detours around it",
      "older-amber on one side, newer-cream on the other",
      "no face — no need of one",
    ],
    palette:
      "Weathered Antiquarian-amber stone + warm-amber temporal-substance veins + warm-amber threshold side + cool-cream other-side + warm provoke-rim + faint air-distortion-rings",
    composition:
      "Mid-shot front three-quarter, Guardian at frame-centre at threshold-arch, warm/cool architecture split frame at the arch",
    notes:
      "Common unit. Visually rhymes with Earth-elemental Tectonic Warden (s1_elem_earth_04) and Antiquarian Quarchon (different visual idioms shared across factions). The 'time detouring around it' is rendered as the air-distortion-rings (a new visual idiom for time-deflection). Generic faceless silhouette must NOT match any specific named character.",
  },
  {
    cardId: "s1_pack_038",
    sceneDelta:
      "Action mid-shot. A Chrono Blade — a humanoid figure (anonymous, cool-leather Antiquarian-amber light-armor, generic-precise features) mid-attack with a long Antiquarian-amber-and-brass blade. The strike is rendered as THREE simultaneous instances of the same blade in different temporal-positions: the FIRST cut (faintest translucent) is mid-impact on an off-frame target with a faint warm wound visible; the SECOND cut (translucent but more solid) is already mid-arc through the air with the wound visibly already mostly-healed in a faint warm-cream resolve; the THIRD cut (most solid, the present-moment) is mid-arc and the wound is COMPLETELY HEALED. The figure's face is partially obscured by helm; their eyes are focused. Cool celerity after-image trails behind the blade-arcs. The implied target is at lower-frame-right.",
    moodKeywords: [
      "the first cut opens the wound",
      "the second cut is already healing",
      "you notice the third",
      "three simultaneous blade-instances",
    ],
    palette:
      "Antiquarian-amber-and-brass blade + cool-leather light-armor + warm-amber wound (first cut) + warm-cream healing (second cut) + cool celerity after-images + warm helm-shadow",
    composition:
      "Action mid-shot side three-quarter, three blade-instances at different temporal positions across frame, target implied at lower-right",
    notes:
      "Rare unit. The three temporal blade-instances are the canonical visualization of celerity-as-temporal-displacement (consistent with Antiquarian-faction's relationship to time). Anonymous figure (helm-obscured) preserves no-character-conflation. Generic-precise features must NOT match any named character.",
  },
  {
    cardId: "s1_pack_039",
    sceneDelta:
      "Wider mid-shot. An Age of Reckoning — a wide vista showing TWO ages-of-architecture in transition: the closer foreground (lower-third) is the OLD AGE crumbling — visible CRUMBLING-ACTION in real-time on a foreground tower, stones flaking off and falling; the farther background (upper-third) is the NEW AGE mending — a partial-construction structure with visible scaffolding and figures actively rebuilding (tiny figures at scale). Between the two regions, the middle-distance shows a wide warm-amber temporal-pulse propagating outward from a centre-point — the cycle's transition-energy. NO foreground human figure (the spell is the ENVIRONMENT changing). The lighting transitions from cool-grey collapse-light at lower-third to warm-cream rebuilding-light at upper-third.",
    moodKeywords: [
      "the old age crumbles",
      "the new age mends what it can",
      "the cycle continues",
      "transition-pulse between collapse and reconstruction",
    ],
    palette:
      "Cool-grey collapse-stones + warm-amber temporal-pulse + warm-cream rebuilding scaffolding + warm reconstruction-light + cool foreground falling-stones + tiny figures for scale",
    composition:
      "Wider mid-shot, foreground crumbling-tower at lower-third, middle-distance pulse-wave, background rebuilding at upper-third",
    notes:
      "Uncommon spell. NO human figure in foreground (the spell IS the environmental cycle). Tiny scaffolding-figures at upper-third communicate scale without identifying any specific named location. Two-zone composition (collapse below, rebuild above) is the canonical visualization of 'cycle continues.'",
  },
  {
    cardId: "s1_pack_040",
    sceneDelta:
      "Mid-shot. A Fossil Sentinel — a humanoid figure that has emerged from a thousand-age burial. Body composed of fossilized Antiquarian-amber substrate with embedded mineral-veins, approximately 1.9m tall, slightly hunched. Around its body, fragments of EXCAVATED EARTH still cling — patches of cool-grey earth and root-fragments at shoulders, knees, hips (it has just clawed itself out). One foot is still embedded in the dig-pit at lower-frame; the other foot has just stepped onto solid ground. The Sentinel's head is tilted slightly, REMEMBERING — a faint warm-amber grow-pulse propagates outward from its body. Eye-niches where eyes would be glow faintly warm-amber (memory returning). Behind it, the dig-pit is still half-open; behind the dig-pit, an Antiquarian excavation-camp in mid-distance.",
    moodKeywords: [
      "buried for a thousand ages",
      "each one made it stronger",
      "now it remembers why it was buried",
      "patches of earth still clinging at shoulders and knees",
    ],
    palette:
      "Fossilized Antiquarian-amber substrate + embedded mineral-veins + cool-grey earth-fragments + warm-amber eye-niches + warm grow-pulse + cool dig-pit shadow + warm distant excavation-camp light",
    composition:
      "Mid-shot front three-quarter, Sentinel at frame-centre mid-emergence, dig-pit at lower-third, excavation-camp behind",
    notes:
      "Common unit. The 'just clawed itself out' framing is rendered as the foot-still-in-pit + earth-fragments still clinging. The 'remembers why it was buried' is rendered as the head-tilt + memory-returning eye-glow — but the WHY is deliberately left ambiguous (the threat that prompted the burial may yet return). Generic non-specific face/body must NOT match any named character.",
  },
  {
    cardId: "s1_pack_041",
    sceneDelta:
      "Wider mid-shot. The Archivist Supreme — a tall solitary figure at the centre of a vast Antiquarian archive-hall now COMPLETELY EMPTY. Where once stood thousands of catalogue-shelves, the floor now extends in cool-amber emptiness. At frame-centre, a single open BOOK floats at chest-height in front of the Archivist; the book's pages are shown blank EXCEPT for ONE remaining entry — a single line of writing at the page's centre. The Archivist holds nothing in their hands; their hands are at their sides, having just COMPLETED the erasure. The Archivist's face is grave, deliberate, slightly weary — they are now alone with the page where they stand. A faint warm-amber ambient glow from the book illuminates their face from below. Behind them, the empty archive-hall extends with no other occupants.",
    moodKeywords: [
      "opened the book of this age",
      "erased every entry but one",
      "the page where it stands alone",
      "grave, deliberate, slightly weary",
    ],
    palette:
      "Antiquarian-amber Archivist-Supreme robes + warm cream open book with single remaining entry + warm book-ambient glow + cool empty archive-hall + cool deep-shadow + cool wide-emptiness",
    composition:
      "Wider mid-shot front three-quarter, Archivist at frame-centre with floating book at chest-height, empty archive-hall extending behind",
    notes:
      "Legendary unit. The 'erased every entry but one' framing is the canonical Archivist-Supreme isolation visualization — rendered as the empty hall and the one-line book. The single-remaining-entry's TEXT is intentionally illegible at any zoom (it is the page where THEY stand — naming themselves into the only remaining record). Generic-grave face must NOT match any named character (specifically NOT The Antiquarian himself).",
  },
  {
    cardId: "s1_pack_042",
    sceneDelta:
      "Mid-shot. A Memory Splice — a female-presenting figure (anonymous, generic-Antiquarian-junior-staff features), at a small intimate Antiquarian medical-chamber, mid-action of REACHING THROUGH a translucent warm-cream temporal-window into yesterday. The temporal-window is a vertical plane at frame-centre, approximately the size of a doorway, showing a YESTERDAY-VERSION of the same chamber but with a wounded patient lying on the table BEFORE the wound was inflicted. The Splicer's right arm is extended through the window plane, fingers closing around something (a moment-before-the-wound, rendered as a small luminous warm-amber memory-pulse). She is mid-extraction. On the present-side of the window, an unconscious body lies on the medical-table at lower-third (the patient receiving the splice — face turned away, anonymous). A faint warm-cream healing-pulse propagates outward from the splicer's grip. Her face is focused, careful.",
    moodKeywords: [
      "she reached into yesterday",
      "pulled out a moment before the wound",
      "the body remembered",
      "translucent temporal-window at frame-centre",
    ],
    palette:
      "Antiquarian-junior-staff cream-and-amber + warm-cream temporal-window + warm-amber memory-pulse + cool intimate medical-chamber + warm-cream healing-pulse + warm low chamber-lamp",
    composition:
      "Mid-shot front three-quarter, Splicer at frame-centre with arm through temporal-window, patient anonymous at lower-third on table",
    notes:
      "Common spell. Anonymous patient (face turned away) preserves no-character-conflation. The 'temporal-window into yesterday' is a new visual idiom — distinct from the timeline-thread/callipers used by other Antiquarian temporal-investigators. Generic-junior-staff features must NOT match any named character. Healing-pulse warm-cream consistent with other heal cards.",
  },
  {
    cardId: "s1_pack_seed_governance",
    sceneDelta:
      "Wider mid-shot. The Antiquarian's Referendum — a vast Antiquarian-amber Council chamber at the moment a vote is being CALLED. At frame-centre, a tall ceremonial Council-podium with an open vote-ledger; behind the podium, the Antiquarian Council's twelve seats are now FILLED with senior Council members (each a different generic-scholarly archetype, all in Antiquarian-amber Council robes — but each visibly distinct: different ethnicities, different ages, different gestures, the diversity of the institution made visible). All twelve are leaning slightly forward, attentive. A single Council scribe at the podium has just stamped the vote-call onto the ledger — visualized as a cool-cyan pulse propagating from the stamp outward through the chamber. From the chamber's centre, two warm slips of paper drift up (draw-2 visualized); a warm-amber heal-pulse propagates outward through the air at chest-level (heal-2 visualized).",
    moodKeywords: [
      "the vote is called",
      "the Archive opens",
      "democracy remembers what tyrants forget",
      "twelve seats now filled with attentive Council",
    ],
    palette:
      "Antiquarian-amber Council chamber + Council-robe diversity (different ethnicities/ages/styles) + warm cream vote-ledger + cool-cyan stamp-pulse + warm amber paper-drifts + warm heal-pulse + warm reading-light",
    composition:
      "Wider mid-shot, podium at frame-centre with twelve filled Council seats arrayed behind, vote-call mid-stamp",
    notes:
      "Rare spell. CRITICAL contrast with gen_antiquarian (which shows ELEVEN EMPTY chairs around the senior female Council member): this card shows the chairs FILLED — the institution functioning at full quorum. The diversity of Council members is canon-implied from the Antiquarian's role as preserver of all civilizations. NO specific named character — all twelve generic-scholarly. Twelve-pattern is the canonical Council motif extended to populated diversity.",
  },
] as const;

/**
 * Antiquarian faction's prompt registry, keyed by card id.
 *
 * Currently populated: 24 / ~39 cards
 * (gen_antiquarian, s1_char_018, s1_char_043, s1_char_058-060,
 *  s1_char_062-065, s1_char_097, s1_char_121-124, s1_char_201,
 *  s1_pack_036-042, s1_pack_seed_governance).
 */
export const ANTIQUARIAN_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(ANTIQUARIAN_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
