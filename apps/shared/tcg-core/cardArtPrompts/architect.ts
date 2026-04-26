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
] as const;

/**
 * Architect faction's prompt registry, keyed by card id.
 *
 * Currently populated: 6 / 63 cards
 * (gen_architect, gen_authority, s1_char_006-009).
 */
export const ARCHITECT_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(ARCHITECT_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
