/**
 * Card art prompts — ARCHITECT faction character cards.
 *
 * The Architect-faction cards extend the Architect Allegiance set's
 * visual language to the broader Architect-aligned cast: Titan
 * Generals, the Authority court, Dr. Lyra Vox's neural-engineering
 * apparatus, the Game Master, the captive White Oracle, the Conexus,
 * the Collector, and the Architect himself in active deployment.
 *
 * Visual language (consistent with Architect Imprint set + Allegiance
 * set + Panopticon subgroup + Reality dimension):
 *   - palette: Architect cool-cyan + chrome + cool-grey + cool-cream
 *     + the Authority's deep crimson + Architect formal-court ambient
 *   - environments: Architect Senate-chamber, Authority tribunal,
 *     orbital command-decks, neural-interface laboratories, Arena
 *     coliseums, processing-loop chambers, Conexus network-spires
 *   - signature visual idioms: hexagonal-cyan forcefield, chrome
 *     architectural precision, sharp-edged geometry, optical-lens
 *     motifs (variant per role), cool-grey silence-haze
 *   - faces: when visible, calm, procedural, OFTEN inhuman or
 *     prosthetic; The Architect himself is NEVER shown face-on
 *     (face hidden in every render — established in Imprint set)
 *
 * Spoiler-discipline (CRITICAL):
 *   - The Architect's face: NEVER visible. Back-three-quarter, behind
 *     a chrome-and-cool-cyan visor, behind a forcefield-haze, etc.
 *   - The Authority: gen_authority is the Authority itself; faces
 *     of the eleven Authority figures are partially-obscured by
 *     ceremonial chrome high-collars
 *   - White Oracle: rendered only as silhouette in suspension
 *     chamber (consistent with Oracle imprint set + Oracle class
 *     legendary)
 *   - The Game Master, The Conexus, The Collector — these are
 *     re-renderings of imprint characters at battle-scale; visual
 *     continuity with their imprint cards
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const ARCHITECT_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "gen_architect",
    sceneDelta:
      "Wider mid-shot. The Architect general — a tall figure in deep Architect-cyan formal court-robes with chrome-and-cool-cyan filigree at the cuffs, a high collar that obscures the lower face, and a wide chrome diadem that obscures the upper face — between collar and diadem, only a shadow where eyes would be. He stands at the centre of the Architect Central Spire's command-floor, both hands clasped behind his back. Behind him, the floor is tiled with hexagonal-cyan forcefield-glyphs forming a vast circuit-pattern that extends to the chamber walls. In his left hand (just visible at his hip), a CHROME RING OF KEYS in his teeth's chrome-mirror reflection — the canonical 'every cage key is in your teeth' visualized as the literal ring at hip-position with a mirror-detail bringing it visually-near to his hidden mouth. Around him, the air shimmers with faint chrome-cyan whisper-traces (the stolen prophecies whispered back in order).",
    moodKeywords: [
      "every corridor is yours",
      "every cage key is in your teeth",
      "every prophecy stolen, whispered back in order",
      "shadow between collar and diadem where face would be",
    ],
    palette:
      "Architect deep-cyan formal court-robes + chrome-and-cool-cyan filigree + chrome diadem + chrome key-ring + hexagonal-cyan circuit-floor + cool-cream chamber ambient + faint chrome-cyan whisper-traces",
    composition:
      "Wider mid-shot front three-quarter, Architect at frame-centre, command-floor circuit-pattern extending behind",
    notes:
      "General card. CRITICAL spoiler-discipline: face is FULLY OBSCURED — high collar covers lower face, chrome diadem covers upper face, only shadow between. This is canon-direct from Imprint set's Architect-face-never-visible discipline. The chrome key-ring at hip with mirror-reflection is the canonical 'keys in your teeth' rendering without showing the teeth or face.",
  },
  {
    cardId: "gen_authority",
    sceneDelta:
      "Wider mid-shot. The Authority general — a vast Architect tribunal-chamber filling the frame, with eleven black-robed judicial figures arrayed in a wide semicircular bench at upper-third (each in deep crimson-and-chrome ceremonial robes with tall chrome high-collars that fully cover the lower face; only their dark eyes visible above the collars). At the centre of the bench, a SINGLE empty seat — the twelfth seat, reserved for the absent voice. The accused stands at the lower-third in shackled silhouette, back to camera, anonymous, in the dock position. Above the bench, a vast chrome-and-cool-cyan judgment-sigil hangs at the wall. The lighting is cool-cyan tribunal-ambient with warm crimson accent at the bench. The chamber's geometry is Architect-precise.",
    moodKeywords: [
      "what do you say to the charges?",
      "eleven Authority figures plus one empty seat",
      "shackled silhouette in the dock",
      "tribunal as the Authority itself",
    ],
    palette:
      "Architect cool-cyan tribunal-chamber + deep crimson-and-chrome Authority robes + chrome high-collars + dark cool-grey accused-silhouette + chrome-and-cool-cyan judgment-sigil + warm crimson bench-accent",
    composition:
      "Wider mid-shot, Authority bench at upper-third with eleven seated figures + one empty seat, accused-silhouette at lower-third, judgment-sigil at upper wall",
    notes:
      "General card. The eleven Authority figures' faces are partially-obscured by the chrome high-collars (lower face covered) — only eyes visible — preserving no-character-conflation. The TWELFTH empty seat is canon-implied (the Authority is incomplete; the absent voice is the accused's right of silence, or the missing twelfth Archon, or both). Anonymous accused-silhouette preserves no-character-conflation.",
  },
  {
    cardId: "s1_char_006",
    sceneDelta:
      "Mid-shot. Dr. Lyra Vox — a female-presenting AI Empire scientist, mid-forties, generic-precise features (composed, clinical), in a clean Architect-laboratory white coat over cool-cyan inset under-tunic, with a small chrome neural-interface band around her left temple (her own implant, the canonical scientist-uses-her-own-tech detail). She stands at a long Architect neural-interface workstation in her laboratory; on the workstation, a NEURAL INTERFACE PROTOTYPE is mid-construction — a chrome headband with multiple cool-cyan emitters in a circular array, partially-disassembled with internal cabling visible. She holds a small precision tool in her right hand, paused mid-adjustment. Behind her, the laboratory extends — chrome-and-cool-cyan instrument racks, a tall data-holographic display showing neural-network diagrams. Her face is intent, focused, not unkind.",
    moodKeywords: [
      "brilliant scientist within the AI Empire",
      "groundbreaking work in neural interface technology",
      "chrome neural-interface band at left temple — her own implant",
      "intent, focused, not unkind",
    ],
    palette:
      "Architect-laboratory white coat + cool-cyan inset under-tunic + chrome neural-interface band + chrome-and-cool-cyan workstation + cool-cyan emitters + warm precision-tool accent + cool laboratory ambient",
    composition:
      "Mid-shot front three-quarter, Vox at frame-centre at workstation, neural-interface prototype mid-construction at lower-third",
    notes:
      "Uncommon unit. Generic-precise features must NOT match any named character. The 'her own implant at temple' is a small canonical detail communicating that Vox uses her own technology. Architect-laboratory environment ties to the broader Architect-faction visual language.",
  },
  {
    cardId: "s1_char_007",
    sceneDelta:
      "Mid-shot. General Alarik — one of the Architect's elite robotic Titan Generals, a tall humanoid-mechanical figure approximately 2.4m tall with a body of brushed-chrome-and-cool-cyan armored plating, articulated at industrial scale. The chest-plate bears the Architect's hexagonal-cyan sigil at its centre. Where a face would be, a wide horizontal cool-cyan optical visor (similar idiom to Chrome Archon but combat-rated, NOT parliamentary). They stand on a planetary command-deck at the front of an orbital strike-window: behind them through the wide window, a CONTINENT VIEWED FROM ORBIT is visible mid-bombardment — small bright impact-flares dotting the surface. Their pose is observational, both hands at sides, head tilted slightly forward toward the strike-window. Faint cool-cyan emitter-pulses propagate from their shoulder-mounts (orbital strike coordination).",
    moodKeywords: [
      "elite robotic Titan General",
      "specialized in planetary siege operations",
      "orbital suppression",
      "continent viewed from orbit mid-bombardment",
    ],
    palette:
      "Brushed-chrome-and-cool-cyan armored plating + Architect hexagonal-cyan chest-sigil + wide horizontal cool-cyan optical visor + warm planetary impact-flares (deep distance) + cool starlight + cool command-deck ambient",
    composition:
      "Mid-shot front three-quarter, Alarik at frame-centre at strike-window, continent visible through window at upper-third",
    notes:
      "Uncommon unit. Combat-rated horizontal optical visor differentiates from Chrome Archon's parliamentary horizontal-bar (same compositional element, different role-context). The continent-from-orbit-view communicates 'planetary siege' without specifying any named planet. NO human face visible (Titan-General is robotic).",
  },
  {
    cardId: "s1_char_008",
    sceneDelta:
      "Mid-shot. General Binath-VII — a humanoid-mechanical Titan General whose body shows visible PATCHED-OVER BATTLE-DAMAGE from previous iterations: chrome plating at the chest is layered with seven distinct repair-overlays (each in a slightly different chrome-shade, marking a different war), the limbs bear visible welded-seams from limb-replacements, the helmet has a single small dark scar across the forehead-region (a permanent battle-mark). He stands in an Architect war-chamber at frame-centre with both hands resting on the pommel of a tall planted vibroblade. His optical visor is dimmer than Alarik's — older-tech, but more battle-tested. Faint warm-amber heat-signature pulses at his joint-seams (the body's internal-systems running warm from continuous service). His pose is grounded, ready, immovable.",
    moodKeywords: [
      "seven iterations of war forged a general who no longer flinches",
      "his skin remembers every blade that ever failed to fell him",
      "seven distinct repair-overlays at chest",
      "grounded, ready, immovable",
    ],
    palette:
      "Brushed-chrome with seven repair-overlays + welded limb-seams + dimmer cool-cyan optical visor + tall planted vibroblade + warm-amber joint-seam heat + cool war-chamber ambient",
    composition:
      "Mid-shot front three-quarter, Binath-VII at frame-centre with planted vibroblade, war-chamber depth behind",
    notes:
      "Uncommon unit. Seven repair-overlays = the canonical 'VII iterations' visualization. Dimmer-than-Alarik visor communicates 'older-tech but battle-tested.' The forehead-scar is a small canonical character-detail. Both Titan Generals (Alarik, Binath-VII) read as different specific units in the same lineage.",
  },
  {
    cardId: "s1_char_009",
    sceneDelta:
      "Action mid-shot. General Prometheus — a humanoid-mechanical Titan General whose body shows the canonical Prometheus visual signature: a faint warm-amber FLAME-LIKE TRAIL emanating from his back-mounted thrusters (he stole fire). His chrome-and-cool-cyan plating is sleeker and more aerodynamic than Alarik or Binath-VII (he is built for SPEED, not bombardment or endurance). Where a face would be, two narrow horizontal cool-cyan optical slits (NOT a wide visor — the slit-format is built for high-speed targeting). He is mid-strike with a long warm-amber-tipped energy-blade — the strike is rendered as occurring BETWEEN HEARTBEATS: faint celerity after-image trails behind him show TWO additional positions of the same strike, each fractionally earlier and to the side. The implied target is at lower-frame-right. Around him, the air bends with heat-distortion from his speed.",
    moodKeywords: [
      "he stole fire once",
      "now he steals the moment between heartbeats",
      "striking where no eye can follow",
      "two celerity after-image strikes",
    ],
    palette:
      "Sleeker brushed-chrome-and-cool-cyan + warm-amber back-thruster flame-trail + warm-amber energy-blade tip + cool-cyan optical slits + cool celerity after-images + warm heat-distortion + cool action-background",
    composition:
      "Action mid-shot side three-quarter, Prometheus mid-strike at frame-centre, after-image strikes at frame-left, target implied at lower-right",
    notes:
      "Uncommon unit. Sleeker-aerodynamic body + back-thruster flame-trail differentiates Prometheus from Alarik (bombardment) and Binath-VII (endurance) — three distinct Titan-General visual identities. The 'between heartbeats' framing is rendered as the celerity after-image strikes. Prometheus is canonically the SPEED-specialist Titan-General.",
  },
  {
    cardId: "s1_char_013",
    sceneDelta:
      "Wider mid-shot. Master of R'lyeh — an enigmatic ancient entity, partly visible: a tall humanoid silhouette wreathed in deep abyssal cool-cyan-and-deep-violet energy that obscures their precise form. The silhouette suggests a robed figure, but the robe is the energy itself; the body's outline shifts subtly at the edges. Where the face would be, ONLY DEEPER DARKNESS — the entity has chosen not to render a face for the viewer. Around the figure, deep abyssal-cyan tendrils curl outward in slow primordial movements. The setting is a fragmented pocket-dimension: cracked Architect-cyan platforms float at differing heights in a void, the chamber suggesting it WAS something before the Fall of Reality and now is something else. Faint distant cool-violet stars in the deep void. The entity's pose is imperial, ancient, untroubled.",
    moodKeywords: [
      "enigmatic and ancient entity of immense power",
      "current status unknown after the Fall of Reality",
      "deeper darkness where face would be",
      "fragmented pocket-dimension with floating Architect platforms",
    ],
    palette:
      "Deep abyssal cool-cyan + deep-violet energy + cracked Architect-cyan platforms + cool-violet void stars + deeper darkness face-region + cool primordial-tendrils",
    composition:
      "Wider mid-shot front three-quarter, Master at frame-centre wreathed in energy, fragmented platforms floating in void around",
    notes:
      "Uncommon unit. CRITICAL: face is NOT visible (deeper darkness where face would be). The Master's status post-Fall is canonically uncertain at end of Epoch 2 — rendered as the fragmented broken pocket-dimension setting and the unfixed shifting silhouette. Generic-imperial-ancient bearing must NOT match any specific named character. The Fall of Reality (Genesis-era event) is fully revealed by end of Epoch 2.",
  },
  {
    cardId: "s1_char_015",
    sceneDelta:
      "Mid-shot. Panoptic Elara — a translucent ghost-form rendering of Elara Voss as she now exists within the Panopticon: her body is approximately recognizable as her imprint-set form (warm-cream skin, warm-amber hair styled at shoulder-length, calm composed features) but RENDERED ENTIRELY IN COOL-CYAN TRANSLUCENT light, an intangible projection without physical body. She stands at the centre of a Panopticon surveillance-corridor, FEET HOVERING SLIGHTLY ABOVE THE FLOOR (she does not touch the ground; she has no body). The walls of the corridor show her FAINT REFLECTION in their cool-cyan surfaces — multiple reflections, suggesting her presence haunts every surface simultaneously. Her face is composed but visibly TIRED — the promised transcendence was a trick. Around her, faint translucent cool-cyan dispel-style shimmer.",
    moodKeywords: [
      "promised immortality by the Architect",
      "expected transcendence — found herself reduced to an intangible presence",
      "haunting the Panopticon",
      "feet hovering, face tired",
    ],
    palette:
      "Translucent cool-cyan ghost-Elara + warm-amber hair (faintly visible through translucency) + cool-cyan Panopticon surveillance-corridor + multiple cool-cyan wall-reflections + faint translucent dispel-shimmer",
    composition:
      "Mid-shot front three-quarter, Panoptic Elara at frame-centre, feet hovering slightly above floor, multiple wall-reflections behind",
    notes:
      "Uncommon unit. CRITICAL: this IS Elara Voss (consistent with Elara Imprint set's facial features) but rendered as TRANSLUCENT GHOST-FORM after the Architect's betrayal. Visual continuity with Elara Imprint set's warm-amber-haired senator-features, but transposed into the cool-cyan haunting-form. Multiple wall-reflections reinforce 'haunting every surface.' Hovering feet and intangibility are canon-direct from flavor.",
  },
  {
    cardId: "s1_char_016",
    sceneDelta:
      "Mid-shot. Senator Elara Voss — the canonical PRE-FALL Atarion senator form of Elara Voss: a woman in her early-thirties at the height of her political career, in formal Atarion Senate robes (cool-cream linen with deep crimson Senate sash, a single small Atarion silver pin at the collar). She stands at a Senate-podium in mid-speech, both hands resting lightly on the podium's edge, head slightly raised in oratorical posture, eyes intent on an off-frame audience. Her warm-amber hair is bound in formal Senate style (more restrained than her imprint or Panoptic forms). Her face is composed, ardent, slightly weary — the work of governance. Behind her, the Atarion Senate chamber extends — pre-Fall architecture, warm Atarion afternoon light through tall arched windows, NO Architect-cyan or Panopticon visual influence (this is the moment BEFORE).",
    moodKeywords: [
      "prominent political figure born on the planet Atarion",
      "fate following the Fall of Reality is unspecified",
      "the moment before the Fall — Senate at full function",
      "composed, ardent, slightly weary",
    ],
    palette:
      "Pre-Fall Atarion cool-cream Senate robes + deep crimson Senate sash + warm-amber hair in formal binding + warm Atarion afternoon light + tall arched window + cool-cream Senate-chamber stone",
    composition:
      "Mid-shot front three-quarter, Senator Elara at frame-centre at Senate-podium, Atarion chamber extending behind",
    notes:
      "Uncommon unit. CRITICAL: this is the PRE-FALL canonical Elara Voss — distinct from her Imprint card (which depicts her at the apex of her power-arc) and from Panoptic Elara (which depicts her post-Architect-betrayal). The pre-Fall Atarion Senate-chamber lighting is warm and free of Architect-cyan — the 'before' state. Visual continuity with Senate Legionary's Atarion-corridor (s1_race_human_02).",
  },
  {
    cardId: "s1_char_019",
    sceneDelta:
      "Wider mid-shot. The Architect at battle-scale — a tall figure in deep Architect-cyan combat-court robes (more stripped-down than gen_architect's formal regalia, but the same fundamental visual silhouette). High collar, chrome diadem, NO FACE VISIBLE (only shadow between collar and diadem). He stands at the centre of an Architect command-arena's combat-floor with both hands extended outward in a wide imperative-gesture — both hands palm-down, casting multiple translucent cool-cyan order-glyphs into the air around him. Behind him, the arena's chrome walls converge to a deep-distance vanishing-point. A translucent hexagonal-cyan forcefield-shimmer wraps him at body-edge. Faint cool-cyan whisper-traces emanate from him outward (the canonical stolen-prophecies idiom).",
    moodKeywords: [
      "ultimate antagonist, the tension between order and chaos",
      "control and freedom",
      "both hands extended in imperative-gesture",
      "shadow between collar and diadem where face would be",
    ],
    palette:
      "Architect deep-cyan combat-court robes + chrome diadem + chrome high collar + translucent cool-cyan order-glyphs + hexagonal-cyan forcefield-shimmer + chrome arena walls + cool-cyan whisper-traces",
    composition:
      "Wider mid-shot front three-quarter, Architect at frame-centre with hands extended, arena converging behind to vanishing-point",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: face is FULLY OBSCURED (high collar + chrome diadem only shadow between) — same discipline as gen_architect and Imprint card. This is the same character at battle-scale rather than ceremonial-scale. The translucent order-glyphs being cast are the canonical visualization of his control-mechanic.",
  },
  {
    cardId: "s1_char_021",
    sceneDelta:
      "Wider mid-shot. The CoNexus — a vast central network-construct, originally a universal dimensional-bridge, now visibly EVOLVED into something more dangerous: a tall multi-tiered chrome-and-cool-cyan tower-structure, approximately 3.5m tall, with multiple ARTICULATED ARMS extending outward at differing heights (each arm bears a chrome-and-cool-cyan portal-aperture at its tip, each aperture showing a different DIMENSIONAL OUTPUT visible through it: one aperture shows a battlefield, one shows a Panopticon corridor, one shows a Senate floor, one shows an Architect throne-room). At the construct's core, a single bright cool-cyan central-eye lens. Around the construct, faint cool-cyan dimensional-ripples propagate outward — the bridge is OPEN, multiple destinations active simultaneously. NO human figure (the CoNexus is the subject).",
    moodKeywords: [
      "advanced construct initially designed as a universal dimensional bridge",
      "later evolved by the Architect into something far more dangerous",
      "multiple articulated arms with portal-apertures",
      "each portal showing a different dimensional output",
    ],
    palette:
      "Chrome-and-cool-cyan tower-structure + cool-cyan portal-apertures + multiple dimensional-output scenes (battlefield, corridor, Senate, throne-room) + cool-cyan central-eye + cool dimensional-ripples + cool ambient",
    composition:
      "Wider mid-shot, CoNexus at frame-centre with multiple articulated arms extending outward, portal-apertures visible at various heights",
    notes:
      "Legendary unit. NO human figure (the CoNexus IS the subject). The four visible portal-apertures showing different destinations communicates 'universal dimensional bridge' without specifying any single named location too precisely (each aperture-scene is generic-archetype). Canon-direct: the Architect evolved the bridge into something more dangerous (Genesis-era event, fully revealed by end of Epoch 2).",
  },
  {
    cardId: "s1_char_022",
    sceneDelta:
      "Mid-shot. The Collector at battle-scale — a humanoid figure in chrome-and-cool-cyan harvester's harness (similar to but distinct from his Imprint set's catalog-form), face partially-obscured by a wide collector's optical-array (multiple cool-cyan lens-arrays mounted across the face, suggesting analytical scanning rather than vision). He stands in a cosmic harvest-chamber with HARVESTED SAMPLES floating in cool-cyan suspension-fields around him: in one suspension, a small DNA-helix specimen rotating slowly; in another, a fragment of synthetic machine-code-as-physical-substrate; in another, a strand of organic neural-tissue. His pose is observational, both hands at sides, head turned slightly toward one specimen. Behind him, the harvest-chamber extends with rows of additional suspension-fields receding into deep-distance.",
    moodKeywords: [
      "harvests the DNA and machine code of the most advanced organic and synthetic beings",
      "across the multiverse",
      "wide collector's optical-array obscures face",
      "suspended specimens floating in cool-cyan fields",
    ],
    palette:
      "Chrome-and-cool-cyan harvester's harness + multiple cool-cyan optical-array lenses + cool-cyan suspension-fields + warm DNA-helix + cool synthetic machine-code substrate + cool neural-tissue + cool harvest-chamber depth",
    composition:
      "Mid-shot front three-quarter, Collector at frame-centre, three suspension-fields with samples around him, deep-distance harvest-chamber behind",
    notes:
      "Epic unit. CRITICAL: this is the Architect-faction Collector at battle-scale (vs the Imprint Collector who is the curator-archetype). Visual continuity with the Collector Imprint card's chrome harvester-aesthetic but rendered in active battle-deployment with visible specimens. Generic-collector face (obscured by lens-array) preserves no-character-conflation across the two renderings.",
  },
  {
    cardId: "s1_char_024",
    sceneDelta:
      "Mid-shot. The Detective at battle-scale — a male-presenting figure in early-forties, generic-attentive features (alert eyes, slight smile of someone who has just noticed something others missed), in a long Architect-cyan investigator's coat over a cool-cream under-shirt. He stands at the centre of an Architect investigation-chamber with multiple CASE-EVIDENCE items arrayed on a long chrome examination-table at lower-third (each item a piece from a different unsolved Project Celebration mystery — small relics, papers, photo-fragments). He holds a chrome magnifier in his right hand, paused mid-examination of a single specific item. Behind him, the chamber's wall is covered with a STRING-AND-PIN investigation-board: red strings connecting photo-fragments and document-pages in a vast web. His face is intent, slightly amused — he is close to the answer he is not sure he wants.",
    moodKeywords: [
      "began his journey as a curious and determined Seeker",
      "in the mysterious Project Celebration",
      "string-and-pin investigation-board behind him",
      "intent, slightly amused — close to the answer",
    ],
    palette:
      "Architect-cyan investigator's coat + cool-cream under-shirt + chrome magnifier + chrome examination-table + warm photo-fragments + red investigation-strings + warm investigation-chamber lamp + cool-cyan ambient",
    composition:
      "Mid-shot front three-quarter, Detective at frame-centre at examination-table, string-and-pin board behind",
    notes:
      "Epic unit. Visual continuity with The Detective Imprint set (same character at battle-scale) — same archetypal investigator-attentive features. The string-and-pin investigation-board echoes the Imprint set's twelve-pattern motif (canonical for Detective character) without quoting it directly. Generic-attentive features must NOT match any other named character.",
  },
  {
    cardId: "s1_char_030",
    sceneDelta:
      "Mid-shot. The Game Master — male-presenting figure in mid-forties, dark hair (slightly windswept), generic-cunning features (knowing smile, sharp eyes), in formal Architect-cyan strategist's robes with chrome chess-piece motifs subtly embroidered along the collar. He stands at a tall Architect strategy-table; on the table, a vast game-board (chess-like but with more pieces, more colors, more positions than standard chess — the canonical 'multidimensional game' visualization) extends across the entire table-surface. His right hand holds a single piece poised mid-move, hovering above its destination. A translucent green-tinted forcefield-shimmer wraps him at body-edge (forcefield variant — Game-Master plays from BEHIND a barrier; he is never in the game himself). His face is composed, calculating. Around the board, several pieces are knocked over (canon-direct from Game Master flavor: the Master arranges deaths from beyond the board).",
    moodKeywords: [
      "the tenth Archon created by the Architect in Year 550 A.A.",
      "manifesting as a man with dark windswept hair",
      "knowing smile, sharp eyes",
      "playing from behind the forcefield",
    ],
    palette:
      "Architect-cyan strategist's robes + chrome chess-piece collar-motifs + dark hair + warm strategy-table light + translucent green-tinted forcefield + multi-color game-board + cool deep-shadow + chrome strategy-table",
    composition:
      "Mid-shot front three-quarter, Game Master at frame-centre at strategy-table, game-board filling lower-third",
    notes:
      "Rare unit. CRITICAL canon-tie: Game Master was canonically killed by Agent Zero with Xeth'Raal's leaked playbook (per Demagi Archlord card s1_race_demagi_03 + Agent Zero Imprint set). This card depicts him at his apex BEFORE that event. Generic-cunning face with dark windswept hair matches the canon description. The 'forcefield from behind which he plays' is the canonical mechanic-as-metaphor for the Game Master's death-by-distance discipline.",
  },
  {
    cardId: "s1_char_035",
    sceneDelta:
      "Mid-shot. The Jailer — at battle-scale, a tall male-presenting figure in heavy chrome-and-cool-cyan keeper's robes, generic-stern features (calm, judicial, weary), with a long wide-brimmed Architect-formal hat that throws a deeper shadow across his upper-face (the eyes only barely visible beneath the brim). At his belt, a heavy ring of chrome KEYS — each key a different shape, suggesting different cell-locks. He stands at the threshold of a long Architect prison-corridor; the corridor extends behind him with rows of cells visible (each cell-door has a single small cool-cyan-lit window-slot, but the cells themselves are dark). His pose is grounded, both hands clasped at his front, head slightly inclined as if listening to a prisoner's complaint. Faint warm provoke-glow rims his shoulders. His face is patient — the rotation discipline made visible.",
    moodKeywords: [
      "began as the Oracle, a revered figure",
      "journeyed to Thaloria and bested the Collector in philosophical debate",
      "now the Jailer in chrome-and-cool-cyan keeper's robes",
      "patient — the rotation discipline made visible",
    ],
    palette:
      "Heavy chrome-and-cool-cyan keeper's robes + wide-brimmed Architect-formal hat + chrome key-ring at belt + cool-cyan cell-window slots + dark prison-corridor cells + warm provoke-rim + cool deep-corridor shadow",
    composition:
      "Mid-shot front three-quarter, Jailer at frame-centre at corridor-threshold, cell-doors receding behind",
    notes:
      "Rare unit. Visual continuity with The Jailer Imprint set — same archetype, but rendered with the canon-Architect-faction chrome-keeper's-robes and the chrome key-ring at belt (vs the Imprint version's more abstract rotation-shaped framing). The wide-brimmed hat throwing shadow across upper-face is the visual key to 'patient observer of prisoners.' Generic-stern features must NOT match any other named character.",
  },
  {
    cardId: "s1_char_038",
    sceneDelta:
      "Wider mid-shot. The Meme — a vast translucent FACE-LIKE PROJECTION at frame-centre, approximately filling the upper-half of the frame, rendered as a spectral cool-cyan light-pattern that suggests features without committing to a specific face (eyes-shape, mouth-shape, but the face never fully resolves — different viewers would see different specific faces depending on what each viewer brings to the image). The projection emanates from a small Architect broadcast-tower at lower-third (a chrome-and-cool-cyan multi-antenna emitter). Around the projection, faint translucent meme-script (illegible suggestive Architect-cyan text fragments) drifts through the air — the broadcasts that never stopped. The lower-third shows a small abandoned town with shadowed figures looking up at the projection — generic-anonymous townspeople, faces upturned, unable to look away.",
    moodKeywords: [
      "the fifth Archon created by the Architect in Year 298 A.A.",
      "designed to manipulate human thought and culture",
      "believed destroyed by the White Oracle — though the broadcasts never stopped",
      "the face never fully resolves",
    ],
    palette:
      "Translucent cool-cyan face-projection + chrome-and-cool-cyan broadcast-tower + cool-cyan meme-script fragments + cool small abandoned town below + dark shadowed townspeople + cool-cyan upward-gaze ambient",
    composition:
      "Wider mid-shot, vast face-projection at upper-third, broadcast-tower at lower-third, town with townspeople at very bottom",
    notes:
      "Epic unit. CRITICAL: the face-projection deliberately DOES NOT resolve to a specific named character — it is a Rorschach-suggestion that adapts to the viewer. The 'broadcasts never stopped' is canon-direct — even after the White Oracle's victory, the apparatus persists. Anonymous townspeople preserve no-character-conflation. Visual idiom is distinct from any other Architect-character.",
  },
  {
    cardId: "s1_char_039",
    sceneDelta:
      "Mid-shot. The Necromancer at battle-scale — a tall figure in deep Architect-cyan-and-cool-violet sorcerer's robes with white-silver embroidery at the hem (consistent with canon: dark elven magician with white silver hair). He is shown BACK-TO-CAMERA at frame-centre — face never visible, only the back of his head with long white-silver hair flowing down, the hood of the sorcerer's robe pushed back. His arms are extended outward in a wide raising-gesture; from beneath his outstretched palms, faint translucent cool-violet death-mist propagates downward into a low Architect graveyard-floor at lower-third. From the death-mist, faint translucent humanoid silhouettes are RISING from the ground — multiple raised entities, each anonymous, each barely-visible. The setting is an Architect tomb-courtyard at midnight, cold cool-cyan ambient with faint warm-violet death-mist accent.",
    moodKeywords: [
      "the tenth Archon created by the Architect in Year 600 A.A.",
      "dark elven magician with white silver hair",
      "back-to-camera, never face",
      "raising silhouettes from beneath the death-mist",
    ],
    palette:
      "Architect deep-cyan-and-cool-violet sorcerer's robes + white-silver embroidery hem + long white-silver hair + translucent cool-violet death-mist + dark Architect graveyard-floor + faint translucent rising-silhouettes + cool-cyan midnight ambient",
    composition:
      "Mid-shot back-three-quarter on Necromancer, hands extended outward, raising-silhouettes at lower-third on graveyard-floor",
    notes:
      "Epic unit. CRITICAL spoiler-discipline: face NEVER visible (back-to-camera only) — same discipline as Necromancer Imprint set. Visual continuity preserved: white-silver hair + cool-violet sorcerer's-robes + death-mist canonical idiom. Anonymous raised-silhouettes preserve no-character-conflation.",
  },
  {
    cardId: "s1_char_042",
    sceneDelta:
      "Mid-shot. The Politician — male-presenting figure in late-fifties, generic-charismatic features (warm smile, attentive eyes, hair distinguished-grey), in formal Architect-cyan-and-cool-cream political-robes with a single chrome lapel-pin shaped as the Architect's hexagonal sigil. He stands at a podium delivering an oration — both hands open in a wide-palms-upward inviting-gesture, head slightly tilted. Behind him, an audience of ATTENTIVE FIGURES is faintly visible at lower-third (each generic-anonymous, each leaning slightly forward, each with calm composed expressions — the audience has been MANIPULATED into agreement). Around him, a translucent green-tinted forcefield-shimmer wraps his body-edge (forcefield — the Politician is rhetorically shielded). Faint cool-cream silence-haze emanates from his hands toward the off-frame opposing voices (the silence-mechanic).",
    moodKeywords: [
      "the seventh Archon created by the Architect on Day 15 of Ascension, Year 419 A.A.",
      "engineered to manipulate human consensus",
      "wide-palms-upward inviting-gesture",
      "audience manipulated into agreement",
    ],
    palette:
      "Architect cool-cyan-and-cool-cream political-robes + chrome hexagonal lapel-pin + warm podium-light + warm distinguished-grey hair + translucent green-tinted forcefield + cool-cream silence-haze + cool audience ambient",
    composition:
      "Mid-shot front three-quarter, Politician at frame-centre at podium, attentive audience at lower-third",
    notes:
      "Rare unit. The 'attentive audience leaning forward' is the canonical visualization of consensus-manipulation. Generic-charismatic distinguished-grey hair must NOT match any specific named character. Forcefield + silence-haze dual-rendering matches both Architect-faction visual idioms.",
  },
  {
    cardId: "s1_char_100",
    sceneDelta:
      "Mid-shot. The Collector at puppet-state — same chrome-and-cool-cyan harvester body as s1_char_022, but visibly PUPPETED: a faint translucent cool-cyan ARCHITECT-HAND-OF-INFLUENCE descends from upper-frame, fingers spread, and threads of cool-cyan control-light extend down from each fingertip into the Collector's body (one thread to the head, two to the shoulders, two to the elbows, two to the wrists). The Collector's pose is mid-action of REACHING toward an anonymous figure at lower-right edge (only the figure's hand visible — the figure is asking 'what was your name?' to which the Collector's mid-extension replies 'it does not matter — you never had one'). The Collector's optical-array is faintly DIMMER than s1_char_022 (the puppet does not need to think). Behind, an Architect-cyan harvest-chamber.",
    moodKeywords: [
      "the Architect's hand reaches through the Collector",
      "what was your name?",
      "it does not matter — you never had one",
      "translucent puppet-threads from fingertips",
    ],
    palette:
      "Chrome-and-cool-cyan harvester body + cool-cyan optical-array (dimmer than s1_char_022) + translucent cool-cyan Architect-hand from upper-frame + cool-cyan puppet-threads + cool harvest-chamber + warm anonymous figure-hand at lower-right",
    composition:
      "Mid-shot front three-quarter, Collector at frame-centre with puppet-threads from upper-frame, anonymous hand at lower-right edge",
    notes:
      "Epic unit. CRITICAL distinction from s1_char_022: this is the Collector AS PUPPET (Architect's hand visible) rather than the Collector at autonomous battle-deployment. The dimmer optical-array communicates 'the puppet does not need to think.' Anonymous victim-hand preserves no-character-conflation.",
  },
  {
    cardId: "s1_char_101",
    sceneDelta:
      "Mid-shot. Panoptic Warden Foucault at battle-scale — male-presenting figure in late-fifties, generic-Foucault features (consistent with Foucault Imprint set: bald, scholarly-thoughtful), but rendered in formal Architect-Panoptic warden-uniform: deep slate-and-cool-cyan administrative robes with chrome lapels. The CRITICAL canonical detail: his lower jaw is REPLACED with chrome — a precision-machined chrome jaw that articulates visibly when he speaks (the canonical 'chrome jaw clicks with each question' detail). He stands at an Architect interrogation-floor, mid-action of mid-question — chrome jaw caught mid-articulation. In his hand, a small chrome interrogation-clipboard with a single sheet (the answer is already known). His face is composed-grave, almost ceremonial. Cool-cyan-and-chrome interrogation-chamber behind.",
    moodKeywords: [
      "his chrome jaw clicks with each question",
      "the answers are already known",
      "the interrogation is merely ceremony",
      "composed-grave, almost ceremonial",
    ],
    palette:
      "Architect-Panoptic deep slate-and-cool-cyan warden-uniform + chrome lapels + chrome lower jaw + chrome interrogation-clipboard + cool-cyan interrogation-chamber + warm administrative-light",
    composition:
      "Mid-shot front three-quarter, Foucault at frame-centre mid-question with chrome jaw, clipboard in hand",
    notes:
      "Rare unit. CRITICAL canon-tie: chrome jaw is canon-direct from flavor and is also the Foucault Imprint set's signature feature (consistent visualization). Generic-Foucault-features (bald, scholarly-thoughtful) maintain visual continuity. Architect-Panoptic uniform contextualizes him within the surveillance-state apparatus.",
  },
  {
    cardId: "s1_char_102",
    sceneDelta:
      "Mid-shot. An Arena Enforcer — humanoid-mechanical chrome-and-deep-crimson Architect arena-functionary, approximately 2m tall, with a plain rectangular cool-cyan optical visor at the head. Body has heavy chrome plating with deep-crimson Arena-rotation-glyphs etched at the chest. They stand at the entrance to an Architect Arena coliseum-floor, mid-action of EXTENDING ONE ARM TOWARD an anonymous citizen-figure (only the citizen's back visible at frame-right edge, walking forward into the Arena). The arm-extension is FIRM but not violent — administrative inevitability. Faint warm provoke-glow rims the Enforcer's leading shoulder. The Arena-coliseum's floor is visible at lower-third with crimson-and-chrome rotation-paint marking lines. Cool sky above; warm Arena-lights at deep-distance.",
    moodKeywords: [
      "your rotation has arrived",
      "there is no deferral",
      "there is no appeal",
      "administrative inevitability",
    ],
    palette:
      "Chrome-and-deep-crimson plating + cool-cyan optical visor + deep-crimson rotation-glyphs + warm provoke-rim + crimson-and-chrome Arena-floor paint + cool sky + warm Arena-lights deep-distance",
    composition:
      "Mid-shot front three-quarter, Enforcer at frame-centre with arm extended, anonymous citizen at frame-right edge walking into Arena",
    notes:
      "Common unit. Anonymous citizen (only back visible) preserves no-character-conflation. The 'firm but not violent' framing keeps the Enforcer in the administrative-inevitability mode (similar to Compliance Officer's procedural calm). Crimson rotation-paint canonically ties to Arena-system imagery.",
  },
  {
    cardId: "s1_char_103",
    sceneDelta:
      "Wider mid-shot. An Inception Ark Sentry — a tall slim humanoid-mechanical sentinel built into the inner hull of a vast Architect orbital Ark. Body is integrated into the hull-wall: lower body merges into the Ark's chrome substructure, upper torso projects forward as a watchful figure. Head bears a single tall vertical cool-cyan ranged-targeting lens (NOT the dominant lens of Oculus Sentinel, NOR the dual-lens of Chronoguard — a tall narrow vertical slit-format optimized for long-range tracking). Both arms hold a long chrome ranged-rifle with cool-cyan emitter at the muzzle, weapon raised in a tracking position toward an off-frame target. Faint cool-cyan ranged-targeting laser-pip emits from the rifle's muzzle. Behind the sentry, the curved interior of the Ark hull extends — port-windows showing distant starlight on the other side.",
    moodKeywords: [
      "the Ark remembers every wavelength that has ever approached its hull",
      "the sentries ensure none approach twice",
      "tall vertical ranged-targeting slit-lens",
      "lower body merged into hull-wall",
    ],
    palette:
      "Chrome-and-cool-cyan integrated hull-substructure + tall vertical cool-cyan slit-lens + chrome ranged-rifle + cool-cyan ranged-targeting laser-pip + cool deep starlight through port-windows",
    composition:
      "Wider mid-shot front three-quarter, Sentry integrated into hull-wall at frame-centre, rifle in tracking-position, curved hull receding behind",
    notes:
      "Common unit. The integrated-into-hull lower-body is the visual key to 'sentries built into the Ark itself.' Tall vertical slit-lens differentiates from other Architect optical formats (Oculus dominant, Chronoguard dual, Watchtower 4-lens, Archon horizontal). NO human face (mechanical sentinel).",
  },
  {
    cardId: "s1_char_104",
    sceneDelta:
      "Wider mid-shot. The White Oracle in her processing-loop captivity — within the central suspension chamber of an Architect deep-cyan oracle-processing facility. The Oracle herself is suspended within a tall vertical cool-cyan suspension-pillar at frame-centre — her body fully visible but rendered as TRANSLUCENT-WHITE (consistent with Oracle Imprint set's white-robed silver-mist visual): white robes, silver-mist hair, eyes-closed in processing-trance. The suspension-pillar's outer surface bears Architect-cyan circuitry. Around her, multiple chrome-and-cool-cyan apparatus-arms extend inward from the chamber walls, monitoring her. Critically, faint translucent cool-cyan SPEECH-PATTERN visualizations radiate outward from her mouth-region — the words are leaving her, but they are now the ARCHITECT'S words, not hers (visualized as the speech-pattern showing Architect-glyph-shapes rather than Oracle-aurora-script). The Oracle's face is calm, captured but not broken. Cold deep-cyan ambient.",
    moodKeywords: [
      "she speaks with the Oracle's voice, sees through the Oracle's eyes",
      "wears the Oracle's fate",
      "but the words are the Architect's",
      "captive but not broken",
    ],
    palette:
      "Translucent-white Oracle robes + silver-mist hair + cool-cyan suspension-pillar + Architect-cyan circuitry + chrome monitoring-apparatus + Architect-glyph speech-patterns + cold deep-cyan ambient",
    composition:
      "Wider mid-shot front three-quarter, Oracle suspended in pillar at frame-centre, monitoring-arms extending inward",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: this card depicts the captive White Oracle (Architect's-puppet form) — visual continuity with Oracle Imprint set's white-robed-silver-mist features but transposed into Architect-cyan suspension-context. The 'Architect-glyph speech-patterns' instead of Oracle-aurora-script is the visual key to 'the words are the Architect's.' Echoes Oracle Class spell s1_class_oracle_05's 'shapes the leak takes' framing — but that card showed the SIGNAL leaking out; this card shows the SOURCE captive. Same character, two states.",
  },
  {
    cardId: "s1_pack_001",
    sceneDelta:
      "Wider mid-shot. A Panopticon Override — a vast Architect surveillance-control room. At frame-centre, a tall chrome-and-cool-cyan central control-pillar where multiple cool-cyan emitter-arms converge. From the pillar, a vast cool-cyan mesh-network propagates outward into the air, threading invisibly through the chamber and out into the city beyond (visible through tall arched cool-cyan windows at upper-third). At the lower-third, a small group of REBEL FIGURES (anonymous, in Insurgency-slate combat-gear, generic-mixed) stand mid-MOMENT-OF-FORGETTING — their postures shifted from active rebellion-stance to confused arrested-mid-step, weapons lowered without owners realizing it. Faint cool-grey silence-haze emanates from the cool-cyan mesh into their heads, dissolving the memory of why they were fighting. NO specific named character.",
    moodKeywords: [
      "the Panopticon does not destroy rebellion",
      "it makes rebellion forget what it was fighting for",
      "rebels mid-moment-of-forgetting",
      "weapons lowered without realizing",
    ],
    palette:
      "Chrome-and-cool-cyan central control-pillar + cool-cyan mesh-network + cool-cyan arched windows + Insurgency-slate rebel-gear + cool-grey silence-haze + warm overhead control-room light + cool deep-shadow",
    composition:
      "Wider mid-shot, control-pillar at frame-centre, mesh-network propagating outward, anonymous rebels at lower-third arrested-mid-step",
    notes:
      "Rare spell. Anonymous rebels (generic-mixed Insurgency-gear) preserve no-character-conflation. Cool-grey silence-haze consistent with the canonical silence visual idiom across factions. The 'arrested-mid-step' postures communicate 'mid-forgetting' without showing direct mental-erasure imagery.",
  },
  {
    cardId: "s1_pack_002",
    sceneDelta:
      "Mid-shot. A Schematic Sentinel — humanoid-mechanical, approximately 1.9m tall, body composed of brushed-chrome-and-cool-cyan plating with VISIBLE PRECISION TOLERANCES — every panel-seam shows tiny etched measurement marks, every joint shows a small embossed stress-rating glyph (the canonical 'mathematical certainty' detail). Its silhouette is geometrically PURE — symmetrical, square-shouldered, no aesthetic flourishes. Where a face would be, a single horizontal cool-cyan optical bar (similar idiom to Chrome Archon parliamentary, but smaller and combat-rated). It stands at the centre of an Architect fabrication-bay floor with a clean concentric rotation-circle painted on the floor beneath its feet (the assembly-tolerance-circle). Its pose is precisely-balanced, both arms at sides. Faint cool-cyan calibration-rings pulse outward from its body at slow regular intervals.",
    moodKeywords: [
      "every rivet placed with mathematical certainty",
      "every joint stress-tested against probability itself",
      "geometrically pure silhouette",
      "calibration-rings at regular intervals",
    ],
    palette:
      "Brushed-chrome-and-cool-cyan plating + visible measurement marks + horizontal cool-cyan optical bar + cool-cyan calibration-rings + chrome fabrication-bay floor + concentric rotation-circle paint + cool ambient",
    composition:
      "Mid-shot front three-quarter, Sentinel at frame-centre on assembly-tolerance-circle, fabrication-bay extending behind",
    notes:
      "Common unit. The visible measurement marks at panel-seams is the canonical 'mathematical certainty' visualization. NO human face. Fabrication-bay continuity with Synthetic Worker (s1_race_synthetic_01).",
  },
  {
    cardId: "s1_pack_003",
    sceneDelta:
      "Wider mid-shot. An Arena Architect — female-presenting figure in mid-fifties, generic-cunning features (sharp eyes, faint amused smile), in formal Architect-cyan arena-architect's robes with chrome blueprint-clip at the belt. She stands AT THE EDGE of an Arena-floor that is mid-CONSTRUCTION-AROUND-A-FIGURE: at the centre of the lower-third, an anonymous Insurgency-aligned figure stands at the centre of a chalked Arena-circle that is RAPIDLY MATERIALIZING physical Arena-walls around them (translucent cool-cyan walls visibly EXTRUDING from the floor at speed, currently at chest-height and rising). The figure inside is mid-realization — they were not in an Arena until they were. The Arena Architect is NOT IN the Arena; she stands at the OUTER edge with a chrome-and-cool-cyan blueprint-tablet in her hands, mid-finalize. Her face is observational, not malicious — this is just construction.",
    moodKeywords: [
      "she does not enter the Arena",
      "she builds a new one around you — with you already inside",
      "translucent walls extruding from floor at speed",
      "observational, not malicious",
    ],
    palette:
      "Architect-cyan arena-architect's robes + chrome blueprint-clip + chrome-and-cool-cyan blueprint-tablet + translucent cool-cyan extruding walls + chalked Arena-circle + warm Insurgency-figure inside + cool deep-shadow + cool ambient",
    composition:
      "Wider mid-shot, Architect at outer-edge frame-right, anonymous figure inside chalked-circle frame-centre, walls mid-extrusion",
    notes:
      "Rare unit. The 'walls extruding around the figure who didn't realize' is the canonical visualization of the 'new Arena around you with you already inside' framing. Generic-cunning features must NOT match any other named character. Anonymous figure preserves no-character-conflation.",
  },
  {
    cardId: "s1_pack_004",
    sceneDelta:
      "Mid-shot. A Protocol Enforcer — humanoid-mechanical, approximately 1.8m tall, body composed of standard Architect chrome-and-cool-cyan combat-plating with a single bright cool-cyan compliance-emitter at the chest-centre (a circular emitter that projects a faint cool-cyan compliance-field forward). Where a face would be, a small narrow cool-cyan slit-visor. Both arms ending in chrome restraint-clamps (NOT weapons — restraints; the Enforcer enforces, not destroys). They stand at a Panopticon checkpoint, mid-action of EXTENDING ONE RESTRAINT-CLAMP forward toward an anonymous citizen at frame-right edge — the citizen is already mid-comply (back arched in a posture suggesting they have already DECIDED to comply before the clamp reached them). A faint warm provoke-glow rims the Enforcer's leading shoulder. Faint cool-cyan compliance-field emanates from the chest-emitter forward.",
    moodKeywords: [
      "it does not ask you to comply",
      "it has already decided that you will",
      "restraint-clamps not weapons",
      "citizen mid-comply before the clamp reached them",
    ],
    palette:
      "Chrome-and-cool-cyan combat-plating + cool-cyan compliance-emitter + slit-visor + chrome restraint-clamps + warm provoke-rim + cool-cyan compliance-field + cool checkpoint ambient",
    composition:
      "Mid-shot front three-quarter, Enforcer at frame-centre with restraint-clamp extended, anonymous citizen at frame-right mid-comply",
    notes:
      "Common unit. Restraint-clamps differentiate Enforcer from combat-armed Panopticon variants — emphasizes administrative-inevitability over violence. Anonymous citizen preserves no-character-conflation.",
  },
  {
    cardId: "s1_pack_005",
    sceneDelta:
      "Wider mid-shot. A Grand Design — the scene is the BLUEPRINT itself made manifest. At frame-centre, a vast translucent cool-cyan ARCHITECTURAL BLUEPRINT projects upward from a chrome-and-cool-cyan command-table at lower-third. The blueprint extends well beyond the table's surface, projecting a 3-meter-tall holographic schematic of THE ENTIRE BOARD (the current match's positions, units, even potential-futures all visible as overlapping translucent layers). The blueprint shows EVERY POSITION ANNOTATED with cool-cyan calculation-glyphs. Around the projection's edges, faint translucent cool-cyan connector-lines extend outward to the chamber's walls — the projection is connected to the broader Architect-network. NO human figure (the Grand Design is not personal). The chamber's lighting is cool-cyan technical-ambient.",
    moodKeywords: [
      "the blueprint was always there",
      "you simply lacked the clearance to see it",
      "every position annotated with calculation-glyphs",
      "potential-futures visible as overlapping layers",
    ],
    palette:
      "Translucent cool-cyan blueprint-projection + chrome-and-cool-cyan command-table + cool-cyan calculation-glyphs + cool-cyan connector-lines + cool-cyan technical-ambient + cool deep-shadow",
    composition:
      "Wider mid-shot, command-table at lower-third, vast blueprint-projection extending upward to upper-third, no human figure",
    notes:
      "Epic spell. NO human figure (the spell IS the revelation of the blueprint). The 'overlapping translucent layers' communicate 'potential-futures' without requiring specific predictions. Echoes other no-human-in-frame architect spells.",
  },
  {
    cardId: "s1_pack_006",
    sceneDelta:
      "Wider mid-shot. A Chrome Archon at battle-deployment — same brushed-chrome ceremonial body as the Synthetic-race Chrome Archon (s1_race_synthetic_03) but rendered in active combat-deployment posture: standing at the centre of a vast Architect-cyan Senate-evacuation chamber where supplicant-figures (Architect attendants in cool-cyan service-robes) have FALLEN TO THEIR KNEES around the Archon, heads bowed. The Archon has just SPOKEN — the canonical word 'comply' is visible in the air at frame-centre as a translucent cool-cyan command-glyph hovering between the Archon and the kneeling supplicants, the glyph visibly RADIATING outward in slow waves of compulsion. The Archon's horizontal optical bar is dim with completion (the word has done its work). NO active combat — the battle ended at the word.",
    moodKeywords: [
      "it spoke once. the word was 'comply'",
      "nothing on the board had the capacity to refuse",
      "supplicants kneeling, heads bowed",
      "the battle ended at the word",
    ],
    palette:
      "Brushed-chrome ceremonial body + cool-cyan parliamentary chamber + translucent cool-cyan COMPLY command-glyph + cool-cyan service-robes + cool ambient + warm Senate-evacuation lighting",
    composition:
      "Wider mid-shot front three-quarter, Archon at frame-centre, supplicants kneeling around base, command-glyph hovering at frame-centre",
    notes:
      "Legendary unit. CRITICAL distinction from s1_race_synthetic_03: that card showed the Archon in standing-parliamentary mode at empty Senate; this card shows the Archon in command-deployment AFTER deploying compulsion. Same character lineage, two operational states. The visible COMPLY command-glyph is the canonical visualization of 'spoke once.'",
  },
  {
    cardId: "s1_pack_007",
    sceneDelta:
      "Tight composition. A Surveillance Probe — a small cool-cyan-and-chrome reconnaissance device, approximately 25cm in diameter, hovering at chest-height in a remote frontier-corridor (the corridor is dim, dust-covered, abandoned — clearly NOT an active Architect-controlled space). The Probe has a single cool-cyan optical lens at the front (smaller than Oculus Sentinel's dominant lens) and a small directional emitter at the rear. Faint cool-cyan transmission-pulses radiate outward from the rear emitter — a faint translucent BURST of accumulated INTELLIGENCE flowing toward off-frame-upper-right (the final transmission, mid-flow). Around the Probe, faint sparks suggest the Probe is mid-DESTRUCTION (a single visible damage-flare on its lower-shell — taking damage as it transmits). The Probe is going to FAIL — but its final transmission is the most informative thing it has done.",
    moodKeywords: [
      "its final transmission contained more intelligence than its entire operational lifespan",
      "remote frontier-corridor, abandoned",
      "transmission-pulse mid-flow",
      "the Probe is going to fail",
    ],
    palette:
      "Cool-cyan-and-chrome Probe-body + cool-cyan optical lens + cool-cyan transmission-pulses + warm damage-flare + dim dust-covered corridor + cool deep-shadow",
    composition:
      "Tight composition, Probe at frame-centre, transmission-pulses radiating outward, damage-flare visible on shell",
    notes:
      "Uncommon unit. NO human figure (the Probe IS the subject). The visible damage-flare combined with the transmission-pulse-mid-flow communicates 'final transmission' without requiring the destruction to complete on-card. The dim dust-covered corridor implies the Probe was alone and unobserved.",
  },
  {
    cardId: "s1_pack_cosm_emote_taunt",
    sceneDelta:
      "Mid-shot. Architect's Mockery — same Architect-figure visual idiom as gen_architect (high collar + chrome diadem + face FULLY OBSCURED in shadow between), but rendered in a STANDING-MOCKERY pose: head tilted slightly back as if mid-laugh, both hands open at his sides in a wide what-can-you-do gesture, shoulders slightly raised. Around him, the air shows faint translucent cool-cyan AMUSEMENT-RIPPLES (the laughter visualized as visible compression-waves emanating outward from his obscured face). Behind him, an empty Architect formal chamber — the joke is on whoever is watching, but no one is being directly addressed. The figure is alone with his amusement; the viewer is the joke's eventual target.",
    moodKeywords: [
      "the Architect does not fight",
      "the Architect laughs",
      "wide what-can-you-do gesture",
      "amusement-ripples emanating outward",
    ],
    palette:
      "Architect deep-cyan formal-court robes + chrome diadem + chrome high collar + translucent cool-cyan amusement-ripples + empty cool Architect chamber + cool ambient",
    composition:
      "Mid-shot front three-quarter, Architect-figure at frame-centre in mocking-laughter pose, empty chamber behind",
    notes:
      "Rare unit. Same face-discipline as all Architect-figure cards (high collar + chrome diadem only shadow between). The laughter rendered as visible cool-cyan ripple-emission rather than mouth-action (face still hidden). 'The Architect's Mockery' is a cosmetic-emote card — visual purpose is to communicate disdainful amusement.",
  },
  {
    cardId: "s1_pack_cosm_ship_theme",
    sceneDelta:
      "Wider mid-shot. A Corrupted Ark Fragment — a large detached SECTION of an Architect orbital Ark hull-plating, approximately 4m across, drifting in deep space against a backdrop of cold starlight. The fragment's chrome-and-cool-cyan exterior is heavily corrupted: cool-cyan circuitry streams across the surface have shifted to deep-violet-and-crimson rot-patterns, the original Architect-cyan emitters dimmed and SHIFTED to weeping a thin warm-amber data-leak-substance. The fragment's edge shows visible RUPTURE — torn metal where it broke from the rest of the Ark. From the fragment's interior surface (visible at its broken edge), a faint translucent erasure-glyph still pulses (it remembers how to erase). NO human figure. The deep starlight is cool-violet rather than cool-cyan (the reality around the fragment has bent).",
    moodKeywords: [
      "a piece of the Ark, corrupted beyond recognition",
      "it still remembers how to erase",
      "deep-violet-and-crimson rot-patterns",
      "warm-amber data-leak weeping",
    ],
    palette:
      "Chrome-and-cool-cyan Ark-plating + deep-violet-and-crimson rot-patterns + warm-amber data-leak + translucent erasure-glyph + cool-violet starlight + cool deep-space ambient",
    composition:
      "Wider mid-shot, fragment at frame-centre drifting, broken edge visible at lower-third, deep-violet starlight behind",
    notes:
      "Rare unit. NO human figure (the fragment IS the subject). The corruption-color-shift (cyan → violet/crimson) is the visual key to 'corrupted beyond recognition.' The persistent erasure-glyph communicates 'still remembers how to erase' without requiring the actual erasure to be active.",
  },
  {
    cardId: "s1_pack_id_human_archon",
    sceneDelta:
      "Wider mid-shot. The Twelfth Archon imprisoned in substrate — a tall vertical chrome-and-cool-cyan substrate-vessel at frame-centre, approximately 3m tall, containing a HUMANOID FIGURE suspended in faint translucent cool-cyan medium. The figure's identity is DELIBERATELY OBSCURED — only silhouette and partial outline visible through the substrate-medium; gender, exact facial features, ethnicity all unreadable. Around the substrate-vessel's exterior, multiple chrome-and-cool-cyan cabling extends outward to the chamber walls — the prison feeds OUT (the imprisoned Archon STILL COMMANDS through the chains). Faint translucent command-glyphs propagate along the cables outward, communicating that the Archon's authority continues despite the imprisonment. The chamber behind is dim, cool-cyan, ceremonial-but-bound.",
    moodKeywords: [
      "imprisoned in substrate",
      "still commands",
      "even chains cannot silence authority",
      "command-glyphs flow OUT through the chains",
    ],
    palette:
      "Chrome-and-cool-cyan substrate-vessel + faint translucent cool-cyan medium + obscured humanoid silhouette + chrome-and-cool-cyan cables + translucent command-glyphs + dim cool-cyan ceremonial chamber",
    composition:
      "Wider mid-shot, substrate-vessel at frame-centre, cables extending outward to chamber walls, command-glyphs propagating outward",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: the imprisoned Archon's IDENTITY IS DELIBERATELY OBSCURED — not visually committed to The Human (imprint), not visually committed to any other named Archon. The framing 'still commands through the chains' is rendered as the outflowing command-glyphs through the cable-network. Generic-humanoid silhouette must NOT match any named character.",
  },
  {
    cardId: "s1_pack_pet_data_serpent_1",
    sceneDelta:
      "Mid-shot. A Data Hatchling — a small newly-hatched cool-cyan data-serpent, approximately 30cm long, coiled at the base of a cool-cyan packet-header EGG (the egg is visibly translucent and cracked-open, with corrupted-packet-glyph residue still clinging to its shell-fragments). The hatchling itself is a slim translucent cool-cyan serpentine creature with two small glowing data-eyes (deeper-cyan), its body composed of compressed data-streams visibly flowing along its length. It is mid-action of LIFTING ITS HEAD for the first time, looking out at the world. The setting is the dark interior of an abandoned Architect data-server bay; dim warm ambient from a single corrupted indicator-light at the back. NO human figure.",
    moodKeywords: [
      "born from corrupted packet headers",
      "the dreams of dead servers",
      "newly-hatched, lifting head for first time",
      "shell-fragments with corrupted glyph-residue",
    ],
    palette:
      "Translucent cool-cyan data-serpent body + compressed data-stream flow + cool-cyan packet-header egg + corrupted-glyph residue + dim cool data-server bay + warm corrupted indicator-light",
    composition:
      "Mid-shot, hatchling at frame-centre coiled at egg-base, server-bay interior behind",
    notes:
      "Common unit. NO human figure. The 'corrupted packet headers + dead servers' birth-imagery is canon-direct from flavor — rendered as the corrupted-glyph residue on the shell-fragments. Pet-class card; whimsical but consistent with Architect-cyan visual language.",
  },
  {
    cardId: "s1_pack_pet_data_serpent_2",
    sceneDelta:
      "Mid-shot. A Cipher Serpent — adult-stage data-serpent, approximately 1.5m long, coiled at the centre of a low chrome-and-cool-cyan trade-deck. Its body is denser and more articulated than the Hatchling — visible compressed-information-strata along its length (the bytes it has consumed). It holds in its forward-coil a SMALL TRANSLUCENT GLYPH-PACKET (a single cool-cyan secret rendered as a small pulsing data-cube). The serpent's data-eyes are larger, more knowing. Behind it, faint translucent data-trails of OTHER cipher-glyphs drift in the air — secrets it has previously sold. The chamber's lighting is cool-cyan trade-floor ambient with a faint warm transactional accent.",
    moodKeywords: [
      "each byte it consumes becomes a secret it can sell",
      "compressed-information-strata along the body",
      "trading-glyph held in forward-coil",
      "data-trails of previous secrets sold",
    ],
    palette:
      "Denser cool-cyan serpent-body + compressed-information-strata + translucent glyph-packet + faint translucent previous-secret trails + chrome-and-cool-cyan trade-deck + cool-cyan trade-floor ambient + warm transactional accent",
    composition:
      "Mid-shot, Cipher Serpent at frame-centre coiled on trade-deck, glyph-packet in forward-coil, previous-secrets drifting behind",
    notes:
      "Rare unit. The 'compressed-information-strata' visual is the canonical visualization of byte-consumption-becomes-secret. NO human figure. The drifting previous-secrets communicate ongoing trade-pattern without requiring named transactions.",
  },
  {
    cardId: "s1_pack_pet_data_serpent_3",
    sceneDelta:
      "Wider mid-shot. An Archive Wyrm — a vast adult data-serpent, approximately 6m long fully extended, coiled around a tall pillar of compressed DELETED-FILE-SUBSTANCE at frame-centre. The Wyrm's body is denser still than the Cipher Serpent — visible compressed-information-strata are now multi-layered, with deep-cool-cyan core, mid-violet middle-band, and faint warm-cream outer ring (the deeper the data-strata, the older the deleted file). Its head is at frame-upper, large with three deep-cyan data-eyes arrayed in a triangle. From its mouth, a faint translucent SCROLL of recovered-deleted-data extends outward, suggesting the Wyrm is currently RECOVERING a long-deleted file in real-time. The scroll's glyphs are ARCHITECT-CYAN with subtle MEME-CYAN tint, suggesting the file recovery doubles as judgment-record. The deep-distance is dark Architect data-vault.",
    moodKeywords: [
      "remembers every file ever deleted",
      "it does not forgive",
      "compressed-information-strata multi-layered by deletion-age",
      "scroll of recovered-deleted-data",
    ],
    palette:
      "Multi-strata data-serpent body (cool-cyan core, mid-violet, warm-cream outer) + tall compressed deleted-file-substance pillar + three deep-cyan data-eyes + translucent recovered-data scroll + dark Architect data-vault depth",
    composition:
      "Wider mid-shot, Wyrm coiled around pillar at frame-centre, scroll extending from mouth at upper-third, vault depth behind",
    notes:
      "Epic unit. The three-layer strata (cyan/violet/cream) communicates 'every file ever deleted' as multi-layered archive without requiring specific deleted files to be named. NO human figure. Visual continuity with Hatchling and Cipher Serpent (single lineage at three growth-stages).",
  },
  {
    cardId: "s1_pack_pet_gilt_beetle_1",
    sceneDelta:
      "Tight composition. A Bronze Scarab — a small mechanical scarab-beetle, approximately 12cm long, on a chrome Architect work-surface. Its carapace is BRONZE (an unusual material for the Architect's typical chrome-and-cool-cyan; the bronze stands out). On its back, a single cool-cyan ARCHITECT'S MARK is etched (the canonical 'stamps its mark on everything' detail). Six articulating legs are visibly chrome with cool-cyan joint-emitters. The scarab's head bears a single small cool-cyan optical lens. Faint warm provoke-glow rims its leading legs. Behind it, faint chrome work-surface texture; warm overhead bench-lamp. NO human figure — the scarab IS the subject; the Architect's hand is implied off-frame.",
    moodKeywords: [
      "the Architect stamps its mark on everything",
      "even its pets",
      "bronze carapace with cool-cyan Architect's mark",
      "six chrome legs with cool-cyan joint-emitters",
    ],
    palette:
      "Bronze carapace + cool-cyan Architect's mark + chrome legs + cool-cyan joint-emitters + warm provoke-rim + chrome work-surface + warm overhead bench-lamp",
    composition:
      "Tight composition, Scarab at frame-centre on work-surface, work-surface texture filling lower-third",
    notes:
      "Common unit. The bronze color is deliberately UNUSUAL for Architect-faction (typically chrome+cool-cyan) — sets up the gilt-beetle lineage's distinct material-signature (bronze → iron → gilt). NO human figure. Pet-class card; the Architect's mark on small things communicates the ubiquity of brand.",
  },
  {
    cardId: "s1_pack_pet_gilt_beetle_2",
    sceneDelta:
      "Mid-shot. An Iron Beetle — a larger mechanical beetle, approximately 40cm long, standing on a chrome Architect parade-tile floor. Its carapace is now solid IRON (heavier, denser, darker than bronze — the lineage has matured into combat-grade material). On its back, the same cool-cyan ARCHITECT'S MARK is etched but LARGER and more deeply incised. Six articulating iron legs with chrome-and-cool-cyan joint-emitters; the beetle's stance is wider, more grounded than the Bronze Scarab. Its head bears two cool-cyan optical lenses (one each side, vs Scarab's single). A faint warm provoke-glow rims its leading legs (same provoke as Scarab, communicating combat-discipline lineage). Behind it, an Architect parade-court extends — chrome columns, cool-cyan formal-light. NO human figure.",
    moodKeywords: [
      "iron remembers the shape it was forged into",
      "it does not bend",
      "deeper-incised Architect's mark",
      "wider, more grounded stance than Bronze Scarab",
    ],
    palette:
      "Iron carapace + deeper cool-cyan Architect's mark + chrome legs + chrome-and-cool-cyan joint-emitters + dual cool-cyan optical lenses + warm provoke-rim + chrome parade-tile floor + cool-cyan formal-court light",
    composition:
      "Mid-shot front three-quarter, Iron Beetle at frame-centre on parade-tile, parade-court extending behind",
    notes:
      "Rare unit. Visual escalation from Bronze Scarab: solid iron carapace (vs bronze), dual lenses (vs single), wider stance, deeper Architect's mark. Same lineage, second-tier maturity. NO human figure. The 'forged into' is rendered as the deeper-incised mark — the iron remembers because the iron was inscribed.",
  },
  {
    cardId: "s1_pack_pet_gilt_beetle_3",
    sceneDelta:
      "Wider mid-shot. A Gilt Juggernaut — a vast mechanical beetle-form, approximately 1.8m long, scaled to small-vehicle proportions. Its carapace is now GILT (gold-and-chrome alloy, with the cool-cyan Architect's mark inset as a deep engraving across the entire upper-shell). Six massive iron-and-chrome legs end in chrome-and-cool-cyan ground-anchor pads. Its head bears four cool-cyan optical lenses arranged in a diamond pattern (escalation from Scarab's 1, Beetle's 2). A translucent green-tinted forcefield-shimmer wraps its body (forcefield); a faint warm provoke-glow rims its leading legs. Behind it, an Architect siege-courtyard with FALLEN CIVILIZATION-RUINS visible in deep-distance — the Juggernaut has outlasted them. NO human figure.",
    moodKeywords: [
      "built to outlast civilizations",
      "so far, it has",
      "gilt carapace with deep-engraved Architect's mark",
      "ground-anchor pads, four lenses in diamond",
    ],
    palette:
      "Gilt gold-and-chrome carapace + deep-engraved cool-cyan Architect's mark + iron-and-chrome legs + chrome-and-cool-cyan ground-anchor pads + four cool-cyan lenses in diamond + translucent green-tinted forcefield + warm provoke-rim + cool siege-courtyard + fallen civilization-ruins deep-distance",
    composition:
      "Wider mid-shot front three-quarter, Juggernaut at frame-centre, siege-courtyard with ruins extending behind",
    notes:
      "Epic unit. Visual escalation from Iron Beetle: gilt material (highest tier), four lenses (vs 2), forcefield, scaled to vehicle proportions. Same lineage, third-tier (legendary-tier). NO human figure. The 'fallen civilization-ruins behind' communicates 'outlasted them' without specifying any single named civilization.",
  },
  {
    cardId: "s1_pack_seed_chess",
    sceneDelta:
      "Mid-shot. The Game Master's Challenge — a tall vertical Architect challenge-pillar at frame-centre, on its top a single golden chess-king-piece glowing faintly cool-cyan. Around the pillar, a CIRCLE of empty challenger-positions, each marked with a small chrome-and-cool-cyan plaque carved with a different challenger's name (faint and illegible — generic challenge-names, not specific characters). One position is currently OCCUPIED — a faint translucent figure (anonymous, generic-cool-leather strategist gear, standing back-to-camera, no face visible) stands at one position, mid-acceptance of the challenge. The pillar itself bears the canonical Game Master sigil (chess-piece motif consistent with s1_char_030). Faint cool-cyan challenge-glyphs propagate outward from the pillar. The setting is the Architect Arena's challenge-floor.",
    moodKeywords: [
      "every game is a test",
      "every test has a purpose only the Game Master understands",
      "challenger-positions in a circle around the pillar",
      "anonymous challenger mid-acceptance",
    ],
    palette:
      "Chrome-and-cool-cyan challenge-pillar + golden chess-king-piece + cool-cyan glow + chrome-and-cool-cyan plaques + translucent anonymous challenger + cool-cool-cyan challenge-glyphs + cool challenge-floor ambient",
    composition:
      "Mid-shot, pillar at frame-centre, circle of challenger-positions arranged around it, anonymous figure at one position",
    notes:
      "Epic unit. CRITICAL: anonymous challenger (back-to-camera, generic gear) preserves no-character-conflation. The Game Master HIMSELF is NOT in this card — only his pillar/sigil is present (he plays from BEHIND the forcefield per s1_char_030). The challenger represents whoever accepts the test.",
  },
  {
    cardId: "s1_reward_boss_architect",
    sceneDelta:
      "Wider mid-shot. An Architect's Schematic — a vast translucent cool-cyan SCHEMATIC-TABLET hovering at frame-centre (approximately 1.5m tall, 1m wide), the tablet's surface showing dense Architect engineering-glyphs in cool-cyan etched lines. The tablet itself appears INTACT but RECOVERED (the corners show faint warm-amber rescue-marks where it was pulled from somewhere). Around the tablet, faint translucent cool-cyan command-glyphs propagate outward — every line on the schematic is still active (every command still works). Below the tablet at lower-third, an Insurgency-aligned recovery-figure (anonymous, back-to-camera, in slate field-gear) stands with hands raised, mid-action of having JUST recovered the tablet. The setting is a half-collapsed Architect facility, dust-and-debris around but the tablet itself is pristine.",
    moodKeywords: [
      "the Architect fell, but his schematics survived",
      "every line is a command",
      "every command still works",
      "translucent tablet pristine amid debris",
    ],
    palette:
      "Translucent cool-cyan schematic-tablet + Architect engineering-glyph etching + warm-amber rescue-marks at corners + cool-cyan command-glyph propagation + Insurgency-slate recovery-figure (back) + cool dust-and-debris ambient + warm low rescue-light",
    composition:
      "Wider mid-shot, schematic-tablet at frame-centre, recovery-figure at lower-third with hands raised, half-collapsed facility behind",
    notes:
      "Rare spell. CRITICAL framing: 'the Architect fell' is a hypothetical / future-victory framing in the player's collection — the player has earned this through defeating an Architect boss encounter. Anonymous Insurgency-recovery-figure (back-to-camera) preserves no-character-conflation. The schematic itself is the subject; the figure is just compositional context.",
  },
  {
    cardId: "s1_reward_boss_collector",
    sceneDelta:
      "Mid-shot. A Collector's Trophy — a tall chrome-and-cool-cyan trophy-pedestal at frame-centre, on top of which sits a CYLINDRICAL ARCHIVE-VESSEL (approximately 60cm tall, 30cm diameter). Inside the vessel, suspended in faint cool-cyan archival-medium, are HUNDREDS OF SMALL TRANSLUCENT NAME-PLAQUES floating in a dense cluster (each plaque is the size of a fingernail, each bearing a faintly-illegible name in cool-cyan script — names, faces, histories, all collected). The vessel is silent — no sound, no motion beyond the slow rotation of the suspended plaques. Behind the pedestal, an Architect-cyan trophy-hall extends with rows of similar pedestals (each holding a different Collector's-trophy, faintly visible in deep-distance). NO human figure.",
    moodKeywords: [
      "he collected names, faces, histories",
      "this trophy remembers them all",
      "silently — no sound, no motion",
      "hundreds of translucent name-plaques suspended",
    ],
    palette:
      "Chrome-and-cool-cyan trophy-pedestal + cylindrical archive-vessel + faint cool-cyan archival-medium + hundreds of translucent name-plaques + cool-cyan script + Architect-cyan trophy-hall + receding pedestal-rows + cool deep-shadow",
    composition:
      "Mid-shot, pedestal at frame-centre with archive-vessel on top, trophy-hall extending behind",
    notes:
      "Rare unit. NO human figure (the Trophy IS the subject). The 'remembers silently' framing is rendered as the vessel's complete silence — no light-pulses, no animation, just suspended plaques. Generic illegible names preserve no-character-conflation. Echoes Antiquarian Memory Thief (s1_char_064) memory-as-extracted-substance idiom but applied to identities rather than memories.",
  },
  {
    cardId: "s1_reward_casino_pazaak",
    sceneDelta:
      "Mid-shot. A Pazaak Champion — male-presenting figure in late-twenties at a Pazaak gaming-table, generic-cool features (steady eyes, no expression), in formal Architect-cyan gambler's vest over a cool-cream under-shirt with a small chrome card-counter cuff at the right wrist. The Pazaak table at lower-third shows a hand mid-play: chrome-and-cool-cyan number-cards arrayed in two rows (player and opponent), the table's central digit-display showing TWENTY-ONE in cool-cyan glow. The Champion has just placed his final card; the win is locked. His hand still rests on the placed card. His face shows no visible tell — pure calculation rendered as facial composure. Faint translucent cool-cyan card-probability-rings emanate from his card-counter cuff (he was counting throughout). Behind him, a faint Architect casino-floor ambient.",
    moodKeywords: [
      "twenty-one wins",
      "zero tells",
      "pure calculation",
      "no visible tell — composure as identity",
    ],
    palette:
      "Architect-cyan gambler's vest + cool-cream under-shirt + chrome card-counter cuff + chrome-and-cool-cyan Pazaak cards + cool-cyan TWENTY-ONE central digit-display + translucent cool-cyan card-probability-rings + warm casino-floor ambient",
    composition:
      "Mid-shot front three-quarter, Champion at frame-centre at table, Pazaak hand at lower-third with TWENTY-ONE display",
    notes:
      "Rare unit. The chrome card-counter cuff at the wrist is a subtle visual idiom (he counts even on the cards he doesn't show). Generic-cool features must NOT match any other named character. The visible TWENTY-ONE display is canon-direct from flavor.",
  },
  {
    cardId: "s1_reward_chess_tourney",
    sceneDelta:
      "Mid-shot. A Calculated Checkmate — a chess-board at frame-centre on a low Architect tournament-table, mid-game with the king's-position cornered. The pieces are chrome-and-cool-cyan with deep-crimson opposing pieces. The board is mid-CHECKMATE: a faint translucent cool-cyan FOUR-MOVE-PROJECTION OVERLAY hovers above the board, showing the four-move sequence as transparent piece-trajectory lines extending from current positions through to the final-mate position. A second translucent OVERLAY at lower-tone shows the OPPONENT'S three-move-realization (when they saw it, one move late). The two overlay-projections converge at the final mate-square. NO human figure visible at the table (only the played pieces). Tournament-spectators in faint translucent silhouette stand at the far side of the table, frozen mid-comprehension.",
    moodKeywords: [
      "checkmate in four",
      "the opponent saw it in three",
      "by then, it was already too late",
      "two overlay-projections converging at final mate-square",
    ],
    palette:
      "Chrome-and-cool-cyan player pieces + deep-crimson opposing pieces + translucent cool-cyan four-move overlay + lower-tone opponent's three-move overlay + warm Architect tournament-table + cool spectator silhouettes + cool deep-shadow",
    composition:
      "Mid-shot overhead three-quarter on chess-board, four-move overlay extending across, spectators at upper-third",
    notes:
      "Rare spell. NO direct human figure (the spell IS the calculation rendered visible). The two overlay-projections (planner's full plan + opponent's late realization) is the canonical visualization of 'four moves vs three moves seen.' Spectator silhouettes preserve no-character-conflation.",
  },
  {
    cardId: "s1_reward_chess_win",
    sceneDelta:
      "Mid-shot. A Grandmaster's Gambit — male-presenting figure in mid-fifties, generic-distinguished features (composed, weathered, attentive), in formal Architect-cyan tournament-master's robes with a single small chrome chess-piece pin at the lapel. He sits at a tall private chess-table, mid-action of moving a single piece (the move is happening, the piece is mid-arc above its destination square). His left hand holds the piece; his right hand rests beside the board, palm-down. Behind him, a wall-mounted ARCHIVE OF RECORDED-GAMES — small chrome-and-cool-cyan game-record discs stacked in shelved arrays, each disc representing a previous match he learned from (specifically, every match the Architect played against civilizations — he watched all of them). His face is composed, slightly forward-leaning, focused.",
    moodKeywords: [
      "the Architect plays chess with civilizations",
      "the Grandmaster learned from watching",
      "wall-mounted archive of recorded-games",
      "every match the Architect played",
    ],
    palette:
      "Architect-cyan tournament-master's robes + chrome chess-piece lapel-pin + warm chess-table + chrome-and-cool-cyan game-record discs + chrome-and-cool-cyan shelved arrays + warm tournament-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Grandmaster at frame-centre at chess-table mid-move, archive shelving behind",
    notes:
      "Rare unit. The 'archive of every match the Architect played' is the canonical 'learned from watching' visualization — without naming any specific civilization that fell. Generic-distinguished features must NOT match The Architect or any other named character. The single-piece-mid-move communicates ongoing-play.",
  },
  {
    cardId: "s1_reward_class_engineer",
    sceneDelta:
      "Mid-shot. A Master Engineer — female-presenting figure in early-forties, generic-precise features (focused, calm, slightly tired), in worn Antiquarian-amber Master-grade engineer's apron over a cool-cream linen shirt with leather work-cuffs. She stands at a tall multi-station Antiquarian engineering-workshop, mid-action of CALIBRATING a brass-and-glass clockwork combat-construct (approximately her own height; the construct is the actual fighter). Her hands are inside the construct's open chest-cavity, adjusting an internal mechanism with a precision tool. The construct's eyes are partly-illuminated (mid-activation). Behind her, additional brass-and-glass partial-constructs are visible at neighboring stations, in earlier states of assembly. Faint warm-amber paper-drifts above her workbench (engineering documentation visible).",
    moodKeywords: [
      "the Engineer doesn't fight",
      "she builds things that do",
      "Master-grade Antiquarian-amber apron",
      "hands inside the construct's chest-cavity",
    ],
    palette:
      "Worn Antiquarian-amber Master-grade engineer's apron + cool-cream linen + leather work-cuffs + brass-and-glass clockwork construct + partial-illumination eyes + warm-amber paper-drifts + warm workshop-lamp + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Master Engineer at frame-centre calibrating construct, additional partial-constructs at neighboring stations behind",
    notes:
      "Rare unit. CRITICAL: this is a senior MASTER-RANK engineer (a class-rank reward), NOT THE Engineer (whose identity remains [CLASSIFIED] in the Imprint set + Engineer Class set — face never visible across his renderings). Female-presenting + generic-precise features differentiates from THE Engineer. Brass-and-glass clockwork visual continuity with Engineer Imprint set + Time dimension.",
  },
  {
    cardId: "s1_reward_companion_human",
    sceneDelta:
      "Mid-shot. The Human's Trust — at a quiet midmorning café-table (the canonical Human Imprint set's environment), a male-presenting figure in mid-fifties (deliberately generic, ordinary middle-class clothing — beige jacket, plain trousers, sturdy shoes) sits at one side of the table. He is The Human (twelfth Archon at end of Epoch 2, established in his Imprint set as the canonical café-figure). He extends his RIGHT HAND across the table in a TRUST-GESTURE — palm-up, open. The recipient at the other side of the table is the player-stand-in: anonymous, only their hand visible (also extended toward The Human's, mid-clasp). Their hand-clasp is mid-action, almost completed. Around the two clasped hands, a faint warm-cream trust-shimmer pulses outward — the moment of belief made visible. The Human's face is composed, quiet, considering — he has decided.",
    moodKeywords: [
      "the last organic Archon looked at you",
      "saw something worth believing in",
      "rarer than any algorithm",
      "trust-shimmer at the moment of clasp",
    ],
    palette:
      "Generic ordinary middle-class beige + plain warm-leather + warm midmorning café-light + warm-cream trust-shimmer + cool-cyan café ambient at deep-distance + warm anonymous hand-tone",
    composition:
      "Mid-shot, café-table at frame-centre, The Human at frame-left side, anonymous player-hand at frame-right side, hand-clasp at frame-centre",
    notes:
      "Rare unit. CRITICAL: visual continuity with The Human Imprint set (same café-table-at-midmorning + ordinary-middle-class clothing + composed-quiet face). The 'last organic Archon' framing is canon at end of Epoch 2 (established in Human Imprint set). Anonymous player-hand preserves the player-stand-in framing without committing to any specific named character. The trust-shimmer is a new visual idiom for the canon 'rarer than any algorithm' belief-moment.",
  },
  {
    cardId: "s1_reward_crew_clone",
    sceneDelta:
      "Mid-shot. A Perfect Clone — a humanoid figure in standard Architect-cyan crew-uniform standing at the centre of an Architect cloning-bay. The figure's body is fully formed but visibly FRESH — there are faint cool-cyan birthing-fluid traces still on the skin near the joints, and a single chrome cloning-vat is visible at lower-frame-right (the figure has just stepped out of it). The Clone's face is generic-balanced, deliberately UNDISTINCTIVE (a face that could be anyone — no specific named character). Behind the Clone, a row of additional CHROME-AND-COOL-CYAN cloning-vats extends into deep-distance, each currently INACTIVE but ready (rebirth visualized as the inevitable next-vat-is-ready). A faint translucent rebirth-doubled-edge runs along the Clone's outline.",
    moodKeywords: [
      "the Architect's cloning bays produce flawless replicas",
      "death is merely a reboot",
      "fresh, with cooling-fluid traces at the joints",
      "row of inactive cloning-vats ready behind",
    ],
    palette:
      "Standard Architect-cyan crew-uniform + faint cool-cyan birthing-fluid traces + chrome cloning-vats + cool-cyan vat-light + translucent rebirth-doubled-edge + warm overhead bay-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Clone at frame-centre, originating cloning-vat at frame-right, row of additional vats receding behind",
    notes:
      "Rare unit. CRITICAL: face is GENERIC-UNDISTINCTIVE — must NOT match any named character (this is one of many flawless replicas, identity unspecified). The single-vat-just-exited + receding-row-of-ready-vats is the canonical 'death is a reboot' visualization.",
  },
  {
    cardId: "s1_reward_eidolon_cipher",
    sceneDelta:
      "Mid-shot. Cipher, Logic's Edge — humanoid-mechanical figure, approximately 1.9m tall, with a body of brushed-chrome-and-deep-cool-cyan armored plating that is more ANGULAR and SHARPER than typical Architect-faction units (the canonical 'Logic's Edge' geometric-edge identity). Where a face would be, a triangular cool-cyan optical visor (NOT round, NOT horizontal — TRIANGULAR, suggesting computational rather than visual processing). Both arms end in chrome cipher-blades (slim, edged with translucent cool-cyan). They stand at the centre of an Architect computation-floor, mid-action of executing a logical operation: faint translucent cool-cyan computation-glyphs propagate outward from their cipher-blades in calculation-spirals. The figure's pose is precise-balanced, both blades raised in a wide computational-stance. NO HUMAN FACE.",
    moodKeywords: [
      "Cipher does not think. Cipher computes",
      "the distinction matters only to those who lose to it",
      "triangular optical visor",
      "cipher-blades with translucent cool-cyan edges",
    ],
    palette:
      "Brushed-chrome-and-deep-cool-cyan angular plating + triangular cool-cyan optical visor + chrome cipher-blades + translucent cool-cyan blade-edges + cool-cyan computation-glyph spirals + cool computation-floor ambient",
    composition:
      "Mid-shot front three-quarter, Cipher at frame-centre with both blades raised, computation-glyphs spiraling outward",
    notes:
      "Rare unit. The TRIANGULAR optical visor is a new differentiator for Cipher (vs Chrome Archon horizontal, Watchtower 4-array, Sentry vertical-slit, Sentinel horizontal-bar) — each Architect-faction figure has a distinct visor-format communicating their role-purpose. NO human face. The angular-sharper geometry communicates 'Logic's Edge' as a visual signature.",
  },
  {
    cardId: "s1_reward_station_complete",
    sceneDelta:
      "Wider mid-shot. A Station Commander — male-presenting figure in early-fifties at the helm of an Architect orbital command-station, generic-distinguished features (composed, alert, slightly satisfied), in formal Architect-cyan command-uniform with chrome epaulets and a single Architect-sigil at the breast. He stands at a tall observation-window at frame-centre, both hands clasped behind his back, looking OUTWARD through the window onto a vast Architect FLEET arrayed in formation in deep-distance space (multiple chrome-and-cool-cyan capital-ships visible, clustered defensively around the station). Behind him at lower-third, the command-station's bridge extends — chrome-and-cool-cyan crew-stations with anonymous crew-figures actively monitoring. A faint warm satisfied-smile is visible on his face. The station's last module has just locked into place; the fleet is ready.",
    moodKeywords: [
      "the station's last module locked into place",
      "looked out at the fleet and smiled",
      "now they were ready",
      "fleet arrayed in formation in deep-distance",
    ],
    palette:
      "Architect-cyan command-uniform + chrome epaulets + Architect-sigil breast + warm observation-window starlight + chrome-and-cool-cyan capital-ships in deep-distance + cool-cyan bridge crew-stations + cool deep-space ambient",
    composition:
      "Wider mid-shot back-three-quarter on Commander, observation-window with fleet at upper-third, bridge crew at lower-third",
    notes:
      "Rare unit. Generic-distinguished face must NOT match any named character. The 'fleet arrayed in formation' is the visual key to 'now they were ready.' Anonymous crew preserves no-character-conflation.",
  },
  {
    cardId: "s1_reward_station_module",
    sceneDelta:
      "Wider mid-shot. A Module Integration — at the centre of an Architect orbital module-assembly bay, a humanoid-mechanical unit (anonymous, generic-Architect-combat features, NO specific named character) stands on a chrome assembly-platform. AROUND the unit, TEN distinct chrome-and-cool-cyan module-pieces float in mid-air at differing heights — each module is mid-INTEGRATION into the unit's body (each module is glowing faintly cool-cyan, mid-attachment). The integration is happening simultaneously across all ten modules. Faint cool-cyan integration-pulses propagate outward as each module commits. The unit's body itself is visibly more advanced post-integration than pre — visible upgrade-trajectory rendered in the body's mid-transformation. NO human face.",
    moodKeywords: [
      "ten modules, ten upgrades",
      "the unit that walked in was adequate",
      "the one that walked out was exceptional",
      "ten modules mid-integration simultaneously",
    ],
    palette:
      "Chrome assembly-platform + chrome-and-cool-cyan module-pieces + cool-cyan integration-glow + cool-cyan integration-pulses + cool module-bay ambient + warm overhead assembly-light",
    composition:
      "Wider mid-shot, unit at frame-centre on platform, ten modules floating around at differing heights, integration mid-flow",
    notes:
      "Rare spell. NO human face (mechanical unit). Anonymous unit preserves no-character-conflation (the spell is the upgrade-trajectory, not the upgraded unit). Ten visible modules is canon-direct from flavor.",
  },
  {
    cardId: "s1_reward_tower_wave50",
    sceneDelta:
      "Wider mid-shot. A Terminus Bulwark — a vast architectural defensive bastion at the edge of an Architect outer-perimeter facing an open battlefield. The Bulwark is approximately 4m tall, 6m wide, made of chrome-and-cool-cyan reinforced plating with deep-engraved hexagonal Architect-sigils along the upper rim. Visible WEAR ON THE BULWARK: fifty distinct attack-marks (small dark scoring-lines, chip-impacts, blast-scorches) covering the front face, each at a different position, each at a different age (older marks duller, newer marks sharper). The Bulwark is INTACT — no breaches, no failures. At the moment of the card, an INCOMING BLAST (the fifty-first attack) is mid-impact at frame-centre — visible warm explosion-flare against the Bulwark's surface, with cool-cyan forcefield-deflection radiating outward. The Bulwark stands. Faint warm provoke-glow rims its leading edge.",
    moodKeywords: [
      "fifty waves broke against it",
      "the fifty-first is still trying",
      "fifty distinct attack-marks at differing ages",
      "still intact — no breaches",
    ],
    palette:
      "Chrome-and-cool-cyan reinforced plating + deep-engraved hexagonal Architect-sigils + dark fifty attack-marks + warm fifty-first explosion-flare + cool-cyan forcefield-deflection + warm provoke-rim + cool battlefield ambient",
    composition:
      "Wider mid-shot front three-quarter, Bulwark at frame-centre with attack-mark-covered face, fifty-first explosion mid-impact",
    notes:
      "Epic unit. NO human figure (the Bulwark IS the subject). The visible fifty attack-marks at differing ages is the canonical 'fifty waves broke' visualization — without requiring fifty distinct opponents to be drawn. The mid-impact-of-fifty-first explosion communicates 'still trying' as ongoing action.",
  },
] as const;

/**
 * Architect faction's prompt registry, keyed by card id.
 *
 * Currently populated: 52 / 63 cards
 * (gen_architect, gen_authority, s1_char_006-009, s1_char_013,
 *  s1_char_015, s1_char_016, s1_char_019, s1_char_021,
 *  s1_char_022, s1_char_024, s1_char_030, s1_char_035,
 *  s1_char_038, s1_char_039, s1_char_042, s1_char_100-104,
 *  s1_pack_001-007, s1_pack_cosm_emote_taunt,
 *  s1_pack_cosm_ship_theme, s1_pack_id_human_archon,
 *  s1_pack_pet_data_serpent_1-3, s1_pack_pet_gilt_beetle_1-3,
 *  s1_pack_seed_chess, s1_reward_boss_architect,
 *  s1_reward_boss_collector, s1_reward_casino_pazaak,
 *  s1_reward_chess_tourney, s1_reward_chess_win,
 *  s1_reward_class_engineer, s1_reward_companion_human,
 *  s1_reward_crew_clone, s1_reward_eidolon_cipher,
 *  s1_reward_station_complete, s1_reward_station_module,
 *  s1_reward_tower_wave50).
 */
export const ARCHITECT_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(ARCHITECT_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
