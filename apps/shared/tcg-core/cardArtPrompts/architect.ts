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
] as const;

/**
 * Architect faction's prompt registry, keyed by card id.
 *
 * Currently populated: 12 / 63 cards
 * (gen_architect, gen_authority, s1_char_006-009, s1_char_013,
 *  s1_char_015, s1_char_016, s1_char_019, s1_char_021,
 *  s1_char_022).
 */
export const ARCHITECT_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(ARCHITECT_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
