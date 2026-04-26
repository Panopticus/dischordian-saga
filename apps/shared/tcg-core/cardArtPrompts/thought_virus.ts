/**
 * Card art prompts — THOUGHT VIRUS faction character cards.
 *
 * The Thought Virus-faction cards extend the Thought Virus Allegiance
 * set's visual language to the broader infected-cast: The Source himself
 * (canonical Kael-corrupted figure), The Host, Patient Zero, neural
 * parasites, plague heralds, and the Hierarchy-of-the-Damned commander
 * Terminus Sovereign.
 *
 * Visual language (consistent with Thought Virus Allegiance set):
 *   - palette: Thought Virus phosphor-green + toxic-violet + cool-grey
 *     decay + warm-crimson hot-blood + cool-cyan infected-tech +
 *     Source-specific brilliant-white core with toxic-green outer ring
 *   - environments: Ark 1047 corrupted-interior, plague-rooms,
 *     infection-spread streets, neural-rot chambers, Terminus
 *     command-spires, Source-throne sanctums
 *   - signature visual idioms: phosphor-green Hierarchy-script,
 *     toxic-green spore-cloud, cool-violet rot-substance, neural
 *     parasite-tendrils, infection-veins
 *   - faces: when visible, hollow, partly-consumed, eyes black-void;
 *     The Source's face is DELIBERATELY UNREADABLE per spoiler-discipline
 *
 * Spoiler-discipline (CRITICAL):
 *   - The Source (gen_thought_virus, s1_char_049) is the canonical
 *     Kael-corrupted figure. Per types.ts lore-boundary, his TRUE
 *     identity-connection to specific other Kael-figures (Act 5
 *     reveal) MUST NOT be visually confirmed. Render with brilliant-
 *     white-core + toxic-green outer ring (canonical Source visual
 *     signature). His face DELIBERATELY UNREADABLE — partially obscured
 *     by infection-substance, neither matching contemporary Insurgency
 *     Kael (s1_char_012) NOR historical First-of-the-Ne-Yon Kael
 *     (s1_race_neyon_03). The "Kael Reborn" connection stays a secret.
 *   - The Host (s1_char_032) is canonically a former Potential — render
 *     as ambiguous gender, dual-heritage features, but NO direct
 *     spoiler-confirmation of which specific named character was
 *     consumed.
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const THOUGHT_VIRUS_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "gen_thought_virus",
    sceneDelta:
      "Wider mid-shot. The Source as the player's general — at frame-centre, a tall humanoid figure of indeterminate gender on a Source-throne (corroded chrome-and-toxic-green throne). Body composed of BRILLIANT-WHITE-CORE substance with a TOXIC-GREEN OUTER RING (the canonical Source visual signature). The white-core radiates outward; the toxic-green ring is the virus that consumed him memory-by-memory, now containing him. Where his face would be, deliberately UNREADABLE features — partially obscured by toxic-green infection-substance pouring outward from his eye-sockets and mouth (no specific facial details fix). Around the throne, faint phosphor-green Hierarchy-script propagates outward. Behind him, the corroded interior of stolen Ark 1047 — chrome walls now coated in cool-violet rot-substance.",
    moodKeywords: [
      "he stole Ark 1047 already contaminated",
      "the virus consumed him memory-by-memory",
      "now he IS the infection",
      "brilliant-white core + toxic-green outer ring + face deliberately unreadable",
    ],
    palette:
      "Brilliant-white core substance + toxic-green outer ring + corroded chrome-and-toxic-green throne + toxic-green infection-substance from eyes/mouth + phosphor-green Hierarchy-script + cool-violet rot-substance + corroded chrome Ark 1047 walls + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Source on throne at frame-centre, corroded Ark 1047 interior behind",
    notes:
      "General card. CRITICAL spoiler-discipline: face DELIBERATELY UNREADABLE — neither matching contemporary Insurgency Kael (s1_char_012, dark-haired modern strategist) NOR historical First-of-the-Ne-Yon Kael (s1_race_neyon_03, warm-amber-haired pre-Fall figure). The 'Kael Reborn' Act 5 connection stays preserved as secret. Brilliant-white-core + toxic-green outer ring is the canonical Source visual signature.",
  },
  {
    cardId: "s1_char_032",
    sceneDelta:
      "Mid-shot. The Host — a humanoid figure of indeterminate gender at frame-centre, body showing DUAL-HERITAGE features partially-consumed by infection: skin tone that was once warm-organic + cool-cyan-machine (consistent with Nythera-archetype dual-heritage Potentials) is now visibly CORRUPTED — cool-violet rot-veins running across the body, faint translucent toxic-green spore-cloud emanating from the chest. The figure's face is partly hollow (eye-sockets dark void with faint phosphor-green pinpricks where pupils would be), mouth slightly open with a faint toxic-green tongue-tendril visible. Their body still has SHAPE of a former Potential warrior but is no longer identifying as one. Faint cool-violet decay-aura wraps them.",
    moodKeywords: [
      "once a Potential, forged from the Architect's legacy",
      "preserved DNA and machine code",
      "this being once carried the spark",
      "cool-violet rot-veins + toxic-green spore-cloud + black-void eyes with phosphor-green pinpricks",
    ],
    palette:
      "Partly-consumed warm-organic + cool-cyan-machine dual-heritage skin + cool-violet rot-veins + translucent toxic-green spore-cloud + black-void eye-sockets + phosphor-green pupil-pinpricks + faint toxic-green tongue-tendril + cool-violet decay-aura + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Host at frame-centre, faint corrupted environment behind",
    notes:
      "Uncommon unit. CRITICAL: dual-heritage features echo Nythera (s1_char_014) but rendered as CONSUMED — the same Potential-archetype after infection. Generic-Potential features must NOT specifically match Nythera (different specific consumed-individual). Indeterminate gender preserved.",
  },
  {
    cardId: "s1_char_049",
    sceneDelta:
      "Wider mid-shot. The Source at battle-scale — same canonical features as gen_thought_virus (brilliant-white core + toxic-green outer ring + face deliberately unreadable obscured by infection-substance). At battle-scale he is taller, more imposing — approximately 2.5m tall, a vast presence. His arms are extended outward in a wide INFECTION-SPREAD gesture; from his fingertips, faint translucent toxic-green plague-tendrils extend toward off-frame targets at frame-edges. Around him, the air shows visible CORRUPTION-RIPPLES (the canonical Project Vector influence made literal). Faint phosphor-green Project Vector glyphs propagate outward. Behind him, the corroded Ark 1047 with its inner chambers visible — each chamber now a Source-shrine.",
    moodKeywords: [
      "through the twisted schemes of Project Vector",
      "Kael's fate was reshaped into something monstrous and eternal",
      "infection-spread gesture with plague-tendrils from fingertips",
      "Project Vector glyphs propagating outward",
    ],
    palette:
      "Brilliant-white core substance + toxic-green outer ring + toxic-green infection-substance from face + translucent toxic-green plague-tendrils + visible corruption-ripples + phosphor-green Project Vector glyphs + corroded Ark 1047 interior + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Source at frame-centre with arms extended, plague-tendrils to off-frame targets, Source-shrines behind",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline preserved: face DELIBERATELY UNREADABLE (consistent with gen_thought_virus). The 'Kael Reborn' Act 5 connection stays secret. Project Vector reference is canon at end of Epoch 2.",
  },
  {
    cardId: "s1_char_070",
    sceneDelta:
      "Mid-shot. Patient Zero — a humanoid figure of indeterminate gender at frame-centre, body showing visible TRANSITION-MOMENT of cracking-open: their skull is mid-FRACTURE at the top (a single thin crack visible across the forehead), and from the crack, a faint translucent SIGNAL-ENTRY (cool-cyan-and-toxic-green light-thread) descends INTO the figure's body. Their eyes are wide with the original-scream — still mid-scream from the original infection-event (canon-direct: 'first mind to crack open and let the signal through'). Around the figure, faint cool-violet rot-substance has begun to spread from their feet outward. Their body is otherwise still HUMAN-FORM (the transformation has just begun). NO specific named features.",
    moodKeywords: [
      "the first mind to crack open and let the signal through",
      "every infection since has been an echo of that original scream",
      "skull mid-fracture with signal-entry descending through crack",
      "wide eyes still mid-scream from original infection-event",
    ],
    palette:
      "Generic humanoid skin-tone + skull-fracture crack + translucent cool-cyan-and-toxic-green signal-entry + wide screaming eyes + faint cool-violet rot-substance at feet + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Patient Zero at frame-centre with skull-fracture and signal-entry, rot beginning at feet",
    notes:
      "Legendary unit. The 'first to crack open' is rendered through the visible skull-fracture + signal-entry. Generic humanoid features (no specific named individual). The 'original scream' is canon-direct from flavor — rendered as the wide-eyed mid-scream expression.",
  },
  {
    cardId: "s1_char_071",
    sceneDelta:
      "Tight composition. A Neural Parasite — a small phosphor-green parasitic creature, approximately 8cm long, mid-action of BURROWING through an anonymous figure's ear-canal at frame-centre. Only the figure's profile-side-of-head is visible (back of skull, side of ear, neck — generic-anonymous, no facial features visible). The parasite is half-emerged from inside the ear, its phosphor-green segmented body trailing into the ear-canal, its head-end already inside (visible as a faint silhouette through skin-translucency near the temple — heading toward the hippocampus). Faint warm rush-trails behind the parasite (rush keyword). NO face visible.",
    moodKeywords: [
      "it burrows through the ear canal",
      "nests in the hippocampus",
      "by then, you are already someone else",
      "parasite half-emerged from anonymous ear",
    ],
    palette:
      "Phosphor-green segmented parasite-body + anonymous skin-tone + faint translucent silhouette through skin near temple + warm rush-trails + cool deep-shadow",
    composition:
      "Tight composition profile-side, parasite at frame-centre half-in-ear, faint silhouette through skin near temple",
    notes:
      "Common unit. Anonymous host (profile, no face) preserves no-character-conflation. The 'already someone else' framing is rendered through the burrow-action — the consumption is mid-flow, not yet complete on this card.",
  },
  {
    cardId: "s1_char_072",
    sceneDelta:
      "Mid-shot. A Memetic Carrier — humanoid figure of indeterminate gender at frame-centre, generic-anonymous features (no specific identifying detail), in plain civilian clothes. Their face is partially infected — the canonical phosphor-green pupil-pinpricks visible in black-void eyes, lips slightly parted as if mid-sentence. Around the figure's mouth and ears, faint translucent phosphor-green MEMETIC-IDEA-PARTICLES drift outward (the canonical 'spreads through comprehension' visualization — every word the Carrier speaks deposits a particle). At lower-third, anonymous figures (back-shots only) listen with rapt-confused attention, their own ears beginning to develop faint phosphor-green tints. NO direct horror — the spread is conversational, social.",
    moodKeywords: [
      "it does not spread through contact",
      "it spreads through comprehension",
      "phosphor-green memetic-particles drifting from mouth and ears",
      "anonymous listeners' own ears beginning to tint",
    ],
    palette:
      "Generic civilian-clothes + black-void eyes + phosphor-green pupil-pinpricks + translucent phosphor-green memetic-particles + anonymous listeners + cool deep-shadow + warm low conversation-light",
    composition:
      "Mid-shot front three-quarter, Carrier at frame-centre with memetic-particles drifting, anonymous listeners at lower-third",
    notes:
      "Common unit. Generic-anonymous features must NOT match any named character. The 'spreads through comprehension' is rendered through the conversational-spread visualization (no physical contact, only words/listening).",
  },
  {
    cardId: "s1_char_073",
    sceneDelta:
      "Mid-shot. A Cognitive Blight — anonymous figure (back-three-quarter, generic civilian clothes) at frame-centre, mid-action of REWRITING. The figure's posture shows their consciousness mid-edit: a translucent INFECTION-FILAMENT (phosphor-green) descends from upper-frame INTO the back of their skull (the rewrite-channel). From the figure's body, multiple faint translucent BELIEF-LAYERS are visibly being EDITED — older cool-cyan loyalty-glyphs at their core are being replaced one-by-one with phosphor-green replacement-glyphs (synapse by synapse, the canonical 'rewrites one synapse at a time' rendering). Faint warm pierce-glow rims the infection-filament. NO face visible.",
    moodKeywords: [
      "it rewrites your beliefs one synapse at a time",
      "until loyalty feels like a foreign language",
      "translucent infection-filament descending into back of skull",
      "cool-cyan loyalty-glyphs being replaced with phosphor-green replacements one-by-one",
    ],
    palette:
      "Generic civilian back-three-quarter + translucent phosphor-green infection-filament + cool-cyan loyalty-glyphs (being replaced) + phosphor-green replacement-glyphs + warm pierce-glow + cool deep-shadow",
    composition:
      "Mid-shot back-three-quarter, Blight-victim at frame-centre, infection-filament descending from upper-frame, belief-layers mid-edit",
    notes:
      "Uncommon unit. Anonymous victim (back-three-quarter) preserves no-character-conflation. The 'one synapse at a time' is rendered through the visible glyph-replacement mid-flow.",
  },
  {
    cardId: "s1_char_074",
    sceneDelta:
      "Wider mid-shot. A Vector Swarm — at frame-centre, a dispersed CLOUD of phosphor-green vector-particles, hundreds of small infection-vectors arrayed in mid-air at varying densities. The swarm has been partly STRUCK (visible at frame-left as a concentrated burst — the 'kill it' moment), but the strike has caused the swarm to SPLIT (multiple smaller swarms drifting outward at frame-edges). At frame-right, partial BURNING (small warm-orange flame-licks) is visible on another portion — but the burned portions DRIFT AWAY as toxic-green smoke. The swarm is unkillable; both responses fail. Faint translucent rebirth-doubled-edge runs along the swarm-cloud's outline. NO human figure.",
    moodKeywords: [
      "kill it and it splits",
      "burn it and it drifts",
      "ignore it and you are already too late",
      "unkillable cloud — both kill and burn responses fail",
    ],
    palette:
      "Phosphor-green vector-particles + concentrated burst at frame-left (struck) + smaller drifting swarms + warm-orange flame-licks (burning) + toxic-green smoke + translucent rebirth-doubled-edge + cool deep-shadow",
    composition:
      "Wider mid-shot, swarm-cloud at frame-centre, struck-burst at frame-left, burning at frame-right, drift-out at edges",
    notes:
      "Common unit. NO human figure. The 'kill it splits, burn it drifts' is the canonical visualization — both failed-response states made visible simultaneously.",
  },
  {
    cardId: "s1_char_075",
    sceneDelta:
      "Mid-shot. A Plague Herald — male-presenting figure in mid-forties, generic-charismatic features (wide eyes mid-fanaticism, slight visible drooling, mouth open in mid-sermon), in tattered phosphor-green-and-cool-violet plague-priest robes. He stands at the centre of an infected congregation at frame-centre, mid-action of DELIVERING A SERMON — both arms extended outward in a wide preaching-gesture. From his MOUTH, faint translucent toxic-green LIVE-PATHOGEN-WORDS visibly emit forward (each word a glowing green spore, mid-flight toward off-frame congregation). Faint warm overcharge-glow rims his shoulders; faint cool drain-rim wraps his body. Around the congregation, anonymous infected listeners (back-shots) are visibly being-infected by his sermon-words.",
    moodKeywords: [
      "his sermons are not metaphors",
      "every word is a live pathogen",
      "toxic-green live-pathogen-words emitting from mouth",
      "wide eyes mid-fanaticism, slight drooling",
    ],
    palette:
      "Tattered phosphor-green-and-cool-violet plague-priest robes + translucent toxic-green live-pathogen-words + faint warm overcharge-glow + cool drain-rim + anonymous infected listeners + cool deep-shadow + warm low congregation-light",
    composition:
      "Mid-shot front three-quarter, Plague Herald at frame-centre with arms extended, listeners at lower-third",
    notes:
      "Rare unit. Generic-charismatic features must NOT match any named character. The 'every word a live pathogen' is rendered as the visible spore-words emitting from his mouth.",
  },
  {
    cardId: "s1_char_076",
    sceneDelta:
      "Wider mid-shot. A Synaptic Horror — a non-human entity at frame-centre, body composed of LIVING DARKNESS-AND-SILENCE (deep cool-violet substance with internal phosphor-green void-flickers). Its silhouette suggests humanoid but DISLOCATED — limbs at unnatural angles, head twisted slightly off-axis. It exists in the GAP between thoughts (canonical 'gap between dying thought and silence'). Around it, the air shows visible THOUGHT-DECAY-RIPPLES — translucent fading thought-fragments at frame-edges visibly DYING (a thought ending, the silence beginning). Where its face would be, only DEEPER VOID. Faint warm backstab-glow rims its leading manipulator-tendril; faint phosphor-green deathwatch-script propagates outward.",
    moodKeywords: [
      "it lives in the gap between a dying thought and the silence that follows",
      "deep cool-violet substance with phosphor-green void-flickers",
      "limbs at unnatural angles, head twisted off-axis",
      "translucent dying thought-fragments at frame-edges",
    ],
    palette:
      "Deep cool-violet substance + phosphor-green void-flickers + dislocated humanoid silhouette + translucent fading thought-fragments + deeper-void face-region + warm backstab-glow + phosphor-green deathwatch-script + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Synaptic Horror at frame-centre with dislocated body, dying thought-fragments at frame-edges",
    notes:
      "Epic unit. NO recognizable face (only deeper-void). NO human-character-conflation possible (the entity is alien-monstrous). The 'gap between thought and silence' is rendered through the surrounding dying thought-fragments.",
  },
  {
    cardId: "s1_char_077",
    sceneDelta:
      "Wider mid-shot. A Mind Rot Drone — a phosphor-green-and-cool-violet aerial drone at frame-centre, approximately 1.2m wingspan, circling above a battlefield mid-distance. Body design: vulture-aspect with elongated infected-rotting features — phosphor-green-tinged feathers visibly rotting, cool-violet decay-substance dripping from the wing-tips. Where its head would be, three phosphor-green eye-points and a long curved beak. Below the drone at lower-third, anonymous battlefield-figures (back-shots, generic-mixed combatants) — but instead of feeding on bodies, the drone visibly EXTRACTS faint translucent SANITY-RIBBONS from the figures (rising from their heads upward into the drone's beak). Faint cool wind-trails behind the drone (flying); faint warm pierce-glow rims its talons.",
    moodKeywords: [
      "it circles above the battlefield like a vulture",
      "except it feeds on sanity, not carrion",
      "translucent sanity-ribbons rising from anonymous combatants into drone's beak",
      "phosphor-green-tinged rotting feathers",
    ],
    palette:
      "Phosphor-green-and-cool-violet drone-body + rotting feathers + cool-violet decay-drips + three phosphor-green eye-points + long curved beak + translucent sanity-ribbons + cool wind-trails + warm pierce-glow + cool battlefield + cool deep-shadow",
    composition:
      "Wider mid-shot, Drone at frame-centre upper-third circling, anonymous combatants at lower-third with sanity-ribbons rising",
    notes:
      "Rare unit. Anonymous combatants (back-shots) preserve no-character-conflation. The 'feeds on sanity not carrion' is the canonical visualization — sanity-ribbons rising vs blood-drops falling.",
  },
  {
    cardId: "s1_char_113",
    sceneDelta:
      "Wider mid-shot. Terminus Sovereign — a vast humanoid Hierarchy-of-the-Damned commander at frame-centre, approximately 3m tall, body composed of charcoal-and-deep-crimson chitin substance with phosphor-green infected-veins running through. Six arms (matching Riri'Ahlia COO archetype but DARKER, more crowned) — but the canonical Sovereign-detail: in front of him at lower-third, SEVEN BOWLS arrayed in a semicircle, each containing a different visible-substance. Bowl 1: faint translucent doubt-mist (cool-grey). Bowl 2: faint translucent fear-substance (cool-violet). Bowls 3-6: progressively darker substances. Bowl 7: deep-empty void (the canonical 'forgotten what it was to be whole'). The Sovereign's leading hand is mid-action of OFFERING a bowl outward to an off-frame initiate. NO face fully visible (deep cool-violet hood obscures features); deep-violet crown of horns visible.",
    moodKeywords: [
      "the first bowl is doubt",
      "the second is fear",
      "by the seventh, you have forgotten what it was to be whole",
      "seven bowls arrayed in semicircle, each containing different substance",
    ],
    palette:
      "Charcoal-and-deep-crimson chitin substance + phosphor-green infected-veins + six arms + cool-grey doubt-mist (bowl 1) + cool-violet fear-substance (bowl 2) + progressively darker substances (bowls 3-6) + deep-empty void (bowl 7) + deep cool-violet hood + deep-violet crown of horns + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Sovereign at frame-centre, seven bowls in semicircle at lower-third",
    notes:
      "Legendary unit. CRITICAL: Sovereign is a Hierarchy-of-the-Damned commander DISTINCT from Riri'Ahlia COO (same six-arms archetype but DIFFERENT specific role: ceremonial-Sovereign with bowls vs operational-COO with multi-dim command). Visual continuity preserved (charcoal-and-deep-crimson chitin) but distinct: hooded face vs visible profile, bowl-ceremony vs command-table.",
  },
  {
    cardId: "s1_char_114",
    sceneDelta:
      "Mid-shot. A Viral Vector — humanoid figure of indeterminate gender at frame-centre, body partially-translucent (the canonical 'do not look too long' visualization — looking at it makes it MORE solid). The figure stands still, arms at sides, but the body's substance is ANOMALOUS: cool-violet outline with shifting phosphor-green internal patterns. Where its face would be, it has TWO MIRRORED VOIDS (the eyes are SEEING the viewer back; the canonical 'reads your attention as an invitation'). Around the figure, the very air visibly THICKENS with infection-substance the longer they are observed (a faint translucent toxic-green attention-haze). Faint warm low warning-light from off-frame.",
    moodKeywords: [
      "do not kill it",
      "do not touch it",
      "do not look at it too long",
      "the infection reads your attention as an invitation",
    ],
    palette:
      "Partially-translucent body + cool-violet outline + shifting phosphor-green internal patterns + two mirrored void-eyes + translucent toxic-green attention-haze + warm low warning-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Vector at frame-centre, attention-haze thickening around them",
    notes:
      "Rare unit. The mirrored-void-eyes + attention-haze is the canonical 'looking is invitation' visualization. NO specific named features (the entity is alien-monstrous in a deliberately-unsettling way).",
  },
  {
    cardId: "s1_char_115",
    sceneDelta:
      "Action mid-shot. A Consumed Host — humanoid figure mid-RUN at frame-centre, generic-anonymous features but visibly HOLLOW (eye-sockets dark void with phosphor-green pinpricks, mouth slightly open with toxic-green saliva-drip, skin showing cool-violet rot-veins). The body is LITERAL HUNGER WEARING HUMAN SHAPE — the figure is sprinting forward toward off-frame prey at frame-right edge, arms extended in clawing-gesture. Their original civilian clothes are tattered, partly-shed. Faint warm rush-trails at the heels (rush keyword). Behind them, an infected city-corridor in mid-distance.",
    moodKeywords: [
      "the body runs",
      "the mind is already gone",
      "what remains is hunger wearing a human shape",
      "tattered civilian clothes, hollow eyes, clawing-gesture",
    ],
    palette:
      "Generic anonymous skin + dark void eye-sockets + phosphor-green pinpricks + toxic-green saliva-drip + cool-violet rot-veins + tattered civilian clothes + warm rush-trails + infected city-corridor + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Host mid-run at frame-centre, off-frame prey at frame-right edge",
    notes:
      "Common unit. Anonymous Host (generic features, hollow) preserves no-character-conflation. The 'hunger wearing human shape' is rendered through the visible degradation + clawing-gesture toward off-frame prey.",
  },
  {
    cardId: "s1_char_116",
    sceneDelta:
      "Mid-shot. A Neural Plague Carrier — humanoid figure at frame-centre, generic-anonymous features but with a VISIBLE WIDE SMILE (the canonical 'smiles when soldiers fall' detail). The smile is unsettling — not malicious, but mechanical, a rewiring-effect. Around the figure, anonymous fallen soldiers (back-shots only at lower-third) lie on the ground; the Carrier's smile WIDENS as each falls (joy rewired to dying-screams frequency). Their eyes are the canonical phosphor-green pinpricks in black-void. Faint phosphor-green deathwatch-script propagates outward from the figure (deathwatch keyword); faint cool-violet rot-veins on the skin. Behind them, an infected battlefield.",
    moodKeywords: [
      "it smiles when soldiers fall",
      "not from malice — the Virus has rewired joy to the frequency of dying screams",
      "wide unsettling mechanical smile",
      "anonymous fallen soldiers below, smile widening as each falls",
    ],
    palette:
      "Generic anonymous skin + wide mechanical smile + black-void eyes + phosphor-green pupil-pinpricks + cool-violet rot-veins + phosphor-green deathwatch-script + anonymous fallen soldier-silhouettes + infected battlefield + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Carrier at frame-centre with wide smile, fallen soldiers at lower-third",
    notes:
      "Uncommon unit. Anonymous Carrier + anonymous fallen preserve no-character-conflation. The 'rewired joy' is rendered through the visible mechanical-smile + deathwatch-script.",
  },
  {
    cardId: "s1_char_200",
    sceneDelta:
      "Action mid-shot. A Cortex Ravager — humanoid-aberrant figure at frame-centre, body composed of cool-violet-and-phosphor-green skull-substance with elongated bone-spurs at the elbows + shoulders. Its head is a vast SKULL with phosphor-green infection-patterns inside the cranial-cavity. It is mid-strike against an anonymous figure at frame-right (back-three-quarter, generic-Insurgency tactical), and from the strike-point, faint translucent SENTENCE-FRAGMENTS visibly EXTRACT (small chrome-and-cool-cyan word-fragments rising from the victim's head and being absorbed into the Ravager's skull-cavity). Each blow erases a sentence from the victim's memory. NO mouth visible (canonical 'does not need to speak'). Faint warm low battlefield-light.",
    moodKeywords: [
      "it does not speak",
      "it does not need to",
      "every blow is a sentence erased from your memory",
      "translucent sentence-fragments extracting from victim's head into Ravager's skull-cavity",
    ],
    palette:
      "Cool-violet-and-phosphor-green skull-substance body + elongated bone-spurs + vast skull-head + phosphor-green internal infection-patterns + translucent chrome-and-cool-cyan sentence-fragment word-fragments + anonymous Insurgency-tactical victim + warm low battlefield-light + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Ravager at frame-centre mid-strike, anonymous victim at frame-right with sentence-fragments rising",
    notes:
      "Uncommon unit. Anonymous victim (back-three-quarter) preserves no-character-conflation. The 'sentence erased per blow' is the canonical visualization — words rising from victim into Ravager's skull-cavity.",
  },
  {
    cardId: "s1_pack_022",
    sceneDelta:
      "Mid-shot. A Viral Bloom — at frame-centre, a vast translucent toxic-green BLOOM unfurling in mid-air at chest-height, approximately 2m wide. The bloom appears almost beautiful — radial-symmetry petals of phosphor-green-and-cool-violet substance, faintly luminous. From the bloom's centre, faint translucent DIMINISHMENT-RIPPLES propagate outward toward off-frame targets. At lower-third, anonymous figures (back-three-quarter, generic civilian + tactical) whose bodies are visibly LESS-THAN-WHOLE — visibly thinner, faintly translucent at the extremities (the 'less than you were' rendering — they have already been diminished without realizing). NO faces visible.",
    moodKeywords: [
      "it does not kill — it diminishes",
      "by the time you notice, you are less than you were",
      "almost beautiful translucent toxic-green bloom",
      "anonymous figures visibly less-than-whole",
    ],
    palette:
      "Translucent toxic-green bloom + radial-symmetry phosphor-green-and-cool-violet petals + translucent diminishment-ripples + anonymous figures with thinning extremities + cool deep-shadow",
    composition:
      "Mid-shot, bloom at frame-centre at chest-height, anonymous diminished figures at lower-third",
    notes:
      "Rare spell. Anonymous figures (back-three-quarter, no faces) preserve no-character-conflation. The 'less than you were' is rendered through the visible thinning-extremity detail.",
  },
  {
    cardId: "s1_pack_023",
    sceneDelta:
      "Action mid-shot. An Infected Drone — small chrome-and-phosphor-green aerial drone, approximately 30cm wingspan, at frame-centre mid-DESTRUCTION (the drone is mid-explosion, fragmenting outward). Critically, from the explosion's centre, multiple translucent toxic-green TRANSMISSION-PULSES burst outward in all directions (the canonical 'final act is not death — it is transmission'). The pulses reach off-frame targets at frame-edges. Around the destruction, faint warm rush-trails (rush keyword). NO human figure (the drone IS the subject). Background: cool battlefield ambient.",
    moodKeywords: [
      "its final act is not death",
      "it is transmission",
      "drone mid-explosion with toxic-green transmission-pulses bursting outward",
      "fragments dispersing in all directions",
    ],
    palette:
      "Chrome-and-phosphor-green drone-body + warm explosion-flares + translucent toxic-green transmission-pulses + warm rush-trails + cool battlefield ambient + cool deep-shadow",
    composition:
      "Action mid-shot, Drone mid-explosion at frame-centre, transmission-pulses bursting outward",
    notes:
      "Common unit. NO human figure. The 'final act is transmission' framing is rendered through the visible burst-pattern at destruction-moment.",
  },
  {
    cardId: "s1_pack_024",
    sceneDelta:
      "Wider mid-shot. A Plague Architect — humanoid figure of indeterminate gender at frame-centre, body composed of charcoal-and-toxic-green substance, in tattered Hierarchy-builder's robes with chrome-and-phosphor-green architect's tools at the belt. They stand at the centre of a partially-built CATHEDRAL OF ROT — the structure is mid-construction at lower-third, with visible BRICKS made from FALLEN BODIES (anonymous, layered like masonry — back-shots only, generic-mixed) and visible MORTAR made from translucent toxic-green SCREAM-SUBSTANCE (the canonical 'every fallen is a brick, every scream is mortar' rendering). The Architect's arms are mid-action of placing a new body-brick into the rising wall. Faint phosphor-green deathwatch-script propagates outward (deathwatch keyword).",
    moodKeywords: [
      "every fallen soldier is a brick",
      "every scream is mortar",
      "the cathedral rises",
      "anonymous body-bricks layered like masonry",
    ],
    palette:
      "Charcoal-and-toxic-green Architect-body + tattered Hierarchy-builder's robes + chrome-and-phosphor-green architect's tools + anonymous body-bricks (back-shots) + translucent toxic-green scream-mortar + phosphor-green deathwatch-script + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Plague Architect at frame-centre placing body-brick, cathedral rising at lower-third",
    notes:
      "Uncommon unit. Anonymous body-bricks (back-shots) preserve no-character-conflation. The 'cathedral of bodies and screams' is the canonical visualization made literal.",
  },
  {
    cardId: "s1_pack_025",
    sceneDelta:
      "Wider mid-shot. A Corruption Wave — at frame-centre, a vast wave of toxic-green-and-cool-violet corruption-substance sweeping across an open battlefield, mid-flow. The wave is approximately 4m tall and extends across the full frame-width. INSIDE the wave, anonymous figures from BOTH SIDES (Insurgency-slate AND Architect-cyan AND Hierarchy-charcoal — visible representatives of multiple factions all back-shots, generic-mixed) are mid-CONSUMPTION (the wave does not discriminate). At the wave's TRAILING edge, faint translucent virus-substance LINGERS — the Virus feeds on what remains. NO single dominant figure (the wave IS the subject).",
    moodKeywords: [
      "the wave does not discriminate",
      "it consumes friend and foe alike",
      "but the Virus always feeds on what remains",
      "multiple-faction figures all consumed simultaneously",
    ],
    palette:
      "Toxic-green-and-cool-violet corruption-wave + Insurgency-slate + Architect-cyan + Hierarchy-charcoal anonymous figures + translucent lingering virus-substance + cool deep-shadow + warm battlefield-light",
    composition:
      "Wider mid-shot, wave at frame-centre sweeping across, multi-faction anonymous figures inside the wave",
    notes:
      "Epic spell. Anonymous multi-faction figures preserve no-character-conflation. The 'does not discriminate' framing is rendered through the visible cross-faction consumption.",
  },
  {
    cardId: "s1_pack_026",
    sceneDelta:
      "Mid-shot. A Neural Hive — humanoid-amalgamation entity at frame-centre, approximately 1.8m tall, body composed of MULTIPLE FUSED NEURAL-PARASITES (visible smaller phosphor-green parasitic units bonded together in humanoid silhouette — see s1_char_071 Neural Parasite for the individual unit-form). Where its skin would be, the parasites are visible as overlapping carapace-plates. Where its head would be, ONE LARGER central parasite has assumed dominant-position. The Hive's chest shows visible PARASITE-SEEDS (small detached parasite-units, ready to deploy when the Hive is wounded — the canonical 'every wound is a seed' rendering). Faint phosphor-green glow from the seam-junctions. The Hive is mid-stride forward.",
    moodKeywords: [
      "kill it. please",
      "but understand: every wound you inflict is a seed",
      "humanoid silhouette of fused neural-parasites",
      "parasite-seeds visible at chest ready to deploy",
    ],
    palette:
      "Multiple fused phosphor-green neural-parasites + overlapping carapace-plates + larger central head-parasite + parasite-seeds at chest + phosphor-green seam-glow + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Neural Hive at frame-centre mid-stride, parasite-seeds visible at chest",
    notes:
      "Common unit. Visual continuity with Neural Parasite (s1_char_071) — same parasite unit, this card's Hive is many of them fused. The 'every wound is a seed' is rendered through the visible parasite-seeds ready to deploy.",
  },
  {
    cardId: "s1_pack_027",
    sceneDelta:
      "Wider mid-shot. A Terminus Dreadnought — vast architectural-mechanical entity at frame-centre, approximately 4m tall, body composed of dense charcoal-and-toxic-green WAR-PLATING (industrial Hierarchy-aesthetic but more massive, more permanent). It does not move; it stands still. Around it, the surrounding ENVIRONMENT visibly DECAYS in real-time — translucent decay-ripples propagate outward; nearby structures show visible mid-rot (chrome surfaces tarnishing, warm-leather darkening, organic matter wilting). At lower-third, anonymous figures (back-three-quarter, mixed factions) flee outward — but their fleeing-paths are visibly DECAYING beneath their feet (the further they move, the more rot). The Dreadnought's face is invisible behind a thick chrome-and-phosphor-green visor. NO motion from the Dreadnought.",
    moodKeywords: [
      "it does not chase",
      "it simply exists, and everything around it decays",
      "destroying it only accelerates the process",
      "translucent decay-ripples + structures mid-rot + fleeing-paths decaying",
    ],
    palette:
      "Dense charcoal-and-toxic-green war-plating + chrome-and-phosphor-green visor + translucent decay-ripples + visibly mid-rot structures + anonymous fleeing figures + decaying fleeing-paths + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Dreadnought at frame-centre still, decay-ripples + fleeing figures at lower-third",
    notes:
      "Legendary unit. Anonymous fleeing figures (back-three-quarter) preserve no-character-conflation. The 'simply exists and everything decays' is rendered through the still-figure + active environmental-decay.",
  },
  {
    cardId: "s1_pack_028",
    sceneDelta:
      "Wider mid-shot. A Spore Cloud — at frame-centre, a vast translucent toxic-green spore-cloud drifting across an open battlefield mid-flow. The cloud is amorphous, gentle-looking — approximately 6m wide, drifting like a sigh (the canonical 'drifted like a sigh' rendering). At lower-third, anonymous warriors (back-three-quarter, mixed factions, mid-stride toward the cloud) are visibly DROPPING THEIR BLADES — chrome-and-warm-gold blades falling from hands without comprehension. Their faces (back-shots only, no visible features) are mid-confusion. The spore-cloud is mid-influence; the warriors do not yet know why they have stopped fighting. NO single dominant figure.",
    moodKeywords: [
      "it drifted across the battlefield like a sigh",
      "warriors dropped their blades without knowing why",
      "translucent toxic-green spore-cloud drifting amorphously",
      "anonymous warriors mid-blade-drop without comprehension",
    ],
    palette:
      "Translucent toxic-green spore-cloud + chrome-and-warm-gold falling-blades + anonymous mixed-faction warrior-silhouettes + cool battlefield ambient + cool deep-shadow",
    composition:
      "Wider mid-shot, spore-cloud at frame-centre drifting, anonymous warriors at lower-third dropping blades",
    notes:
      "Common spell. Anonymous warriors (back-three-quarter) preserve no-character-conflation. The 'drifted like a sigh' is rendered through the gentle-amorphous form contrasted with the visible-effect (blades dropping).",
  },
  {
    cardId: "s1_pack_cosm_armor_void",
    sceneDelta:
      "Mid-shot. A Void Sentinel — humanoid figure of indeterminate gender at frame-centre, body fully ENCASED in cool-violet-and-deep-black VOID-ARMOR (the canonical 'shielded by surrender to the Void' rendering). The armor is plate-and-chain combination of deep-violet substance with internal phosphor-green void-flickers. Where its face would be, a sealed cool-violet helmet with no visible features (full surrender to the Void). Faint translucent void-aura wraps the body — protective-shield emanation. Both arms hold a chrome-and-cool-violet ceremonial halberd. Behind the figure, a vast Void-rift in the deep-distance. NO face visible.",
    moodKeywords: [
      "the Void does not destroy",
      "it shields those who surrender to it",
      "fully encased in cool-violet-and-deep-black void-armor",
      "sealed helmet with no visible features",
    ],
    palette:
      "Cool-violet-and-deep-black void-armor + phosphor-green void-flickers + sealed cool-violet helmet + chrome-and-cool-violet ceremonial halberd + translucent void-aura + Void-rift in deep-distance + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Sentinel at frame-centre, Void-rift behind",
    notes:
      "Epic unit. NO face visible (fully encased) preserves no-character-conflation. The 'surrender to Void' framing is rendered through the full-encasement.",
  },
  {
    cardId: "s1_pack_cosm_board_void",
    sceneDelta:
      "Wider mid-shot. A Void Arena Rift — at frame-centre, a vast TEAR in the New Babylon arena-floor (the canonical 'arena tears open'). The tear extends across the full lower-third of the frame; through it, deep cool-violet VOID-SUBSTANCE pours upward into the arena — a translucent waterfall-of-void rising from below, cool-violet-and-phosphor-green substance overflowing onto the arena's surface. Around the tear, anonymous arena-figures (back-three-quarter, generic-mixed combatants) flee outward at frame-edges. Faint cool-violet void-fragments drift in mid-air around the rift. NO single dominant figure (the rift IS the subject).",
    moodKeywords: [
      "the arena tears open",
      "the Void pours through",
      "translucent waterfall-of-void rising from below",
      "anonymous arena-figures fleeing at frame-edges",
    ],
    palette:
      "Vast tear in New Babylon arena-floor + cool-violet void-substance + translucent void-waterfall + phosphor-green substance overflow + anonymous fleeing arena-figures + cool-violet void-fragments + cool deep-shadow",
    composition:
      "Wider mid-shot, rift at lower-third with void-waterfall rising, anonymous fleeing figures at frame-edges",
    notes:
      "Rare spell. Anonymous arena-figures preserve no-character-conflation. The 'arena tears open' is the canonical visualization — the void emerges from below, not descends from above.",
  },
  {
    cardId: "s1_pack_cosm_tower_skin",
    sceneDelta:
      "Mid-shot. A Terminus Spire Guard — humanoid figure at frame-centre, body composed of charcoal-and-toxic-green substance (Hierarchy-aesthetic but more compact, more disciplined), in formal Spire-guard armor. They stand at the threshold of a Terminus Spire — both feet planted shoulder-width, both hands gripping a tall ceremonial chrome-and-toxic-green polearm planted vertically. Behind the Guard, the Spire's chrome-and-phosphor-green walls extend upward. Faint warm provoke-glow rims their leading shoulder. Critically: the Guard is COMPLETELY STILL — no animation, no shifting, no movement. The 'nothing passes them' framing is rendered through the absolute-stillness pose. Where their face would be, a sealed chrome-and-toxic-green visor.",
    moodKeywords: [
      "the Spire's guards do not move",
      "they do not need to",
      "nothing passes them",
      "absolute-stillness pose, sealed visor",
    ],
    palette:
      "Charcoal-and-toxic-green substance + chrome-and-toxic-green Spire-guard armor + sealed chrome-and-toxic-green visor + tall ceremonial polearm + warm provoke-rim + Terminus Spire chrome-and-phosphor-green walls + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Guard at frame-centre at Spire-threshold, Spire-walls behind",
    notes:
      "Rare unit. NO face visible (sealed visor). The 'do not move' is rendered through the absolute-stillness pose. Distinct from Citadel Guardian (s1_char_079 — different specific role: New Babylon city-walls vs Hierarchy Spire-threshold) and Crystal Archive Guard (s1_char_120 — different specific role: archive-keeper vs Spire-sealer).",
  },
  {
    cardId: "s1_pack_id_kael_patient_zero",
    sceneDelta:
      "Mid-shot. Kael at his canonical PATIENT-ZERO transformation moment — humanoid figure at frame-centre, generic pre-Fall-era features (weathered traveler's face, dark hair, lean build). CRITICAL: features are DISTINCT from contemporary Insurgency Kael (s1_char_012 — modern strategist, command-coat) — this Kael is rendered as an Ark-thief-era figure in tattered Ark-thief-leather-and-warm-cream travel-wear, NO modern command insignia. He is mid-action of HAVING JUST OPENED Ark 1047's contaminated chamber — visible chrome-and-phosphor-green Ark interior at frame-back, contamination already mid-spread. From his eyes, the canonical phosphor-green pupil-pinpricks have JUST APPEARED (the moment of infection). His expression shows mid-realization grief — every death (everyone he tried to save by stealing Ark 1047) is feeding the signal taking him over. Faint phosphor-green deathwatch-script begins to propagate outward (deathwatch keyword).",
    moodKeywords: [
      "the infection spreads through grief",
      "every death feeds the signal",
      "Kael at canonical Patient-Zero transformation moment",
      "Ark-thief-era figure DISTINCT from contemporary Insurgency Kael",
    ],
    palette:
      "Tattered Ark-thief-leather-and-warm-cream travel-wear + dark hair + lean build + chrome-and-phosphor-green Ark 1047 interior + black-void eye-sockets with phosphor-green pupil-pinpricks (just appearing) + phosphor-green deathwatch-script + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Kael at frame-centre mid-transformation, Ark 1047 contaminated chamber behind",
    notes:
      "Epic unit. CRITICAL spoiler-discipline: this Kael is the HISTORICAL Ark-thief-era Kael (the 'original' patient zero), rendered as DISTINCT from contemporary Insurgency Kael (s1_char_012). Different visual archetype: tattered traveler's wear vs modern command-coat. The Act 5 'Kael Reborn' connection (whether contemporary Kael IS this Kael returned) stays preserved as secret. Generic pre-Fall-era features must NOT match s1_char_012 face.",
  },
  {
    cardId: "s1_pack_id_kael_source",
    sceneDelta:
      "Wider mid-shot. Kael, the Source — same canonical Source visual signature as gen_thought_virus + s1_char_049 (brilliant-white core + toxic-green outer ring + face DELIBERATELY UNREADABLE obscured by infection-substance). At this card-stage, the Kael-name lingers in the title only — the figure is now SO consumed that no original-Kael features remain. His silhouette is taller, more imposing. From his outline, faint traces of the original-Kael TRAVELER'S form (Ark-thief travel-wear) are visible only as faint translucent ghost-fragments at the body-edges (the canonical 'no Kael anymore — only the signal'). Behind him, a vast cosmic Source-throne sanctum extends, the chrome-and-toxic-green corruption complete throughout. Faint phosphor-green Hierarchy-script propagates outward.",
    moodKeywords: [
      "there is no Kael anymore",
      "there is only the signal",
      "translucent ghost-fragments of original-Kael at body-edges",
      "face DELIBERATELY UNREADABLE consistent with all Source renderings",
    ],
    palette:
      "Brilliant-white core + toxic-green outer ring + toxic-green face-obscuring infection-substance + faint translucent original-Kael ghost-fragments at body-edges + chrome-and-toxic-green Source-throne sanctum + phosphor-green Hierarchy-script + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Source at frame-centre, ghost-fragments at body-edges, sanctum behind",
    notes:
      "Legendary unit. CRITICAL spoiler-discipline: face DELIBERATELY UNREADABLE (consistent with gen_thought_virus + s1_char_049 + s1_pack_id_kael_patient_zero). The 'no Kael anymore' framing is rendered through the ghost-fragments — only traces remain. The Act 5 'Kael Reborn' connection NOT confirmed; specifically the visual must NOT match contemporary Insurgency Kael's face.",
  },
  {
    cardId: "s1_pack_pet_void_crawler_1",
    sceneDelta:
      "Tight composition. A Void Grub — small phosphor-green-and-cool-violet larval creature, approximately 8cm long, at frame-centre. Body is segmented, slug-like. The Grub is mid-action of BURROWING into a faint translucent gap between two THOUGHT-BUBBLES (the canonical 'space between thoughts' rendering — two adjacent translucent thought-shapes visible in mid-air, the Grub burrowing between them). Two tiny phosphor-green eye-points. Around the Grub, the surrounding space shows faint translucent thought-residue. The Grub is settling in — waiting to die (the canonical short-life cycle).",
    moodKeywords: [
      "it burrows into the space between thoughts",
      "and waits to die",
      "two translucent thought-bubbles with Grub burrowing between",
      "faint translucent thought-residue around",
    ],
    palette:
      "Phosphor-green-and-cool-violet larval body + segmented slug-like form + two phosphor-green eye-points + translucent thought-bubbles + faint translucent thought-residue + cool deep-shadow",
    composition:
      "Tight composition, Grub at frame-centre between two thought-bubbles, thought-residue around",
    notes:
      "Common unit. NO human figure. The 'space between thoughts' is rendered through the literal between-thought-bubbles burrow-position. First stage of void-crawler lineage.",
  },
  {
    cardId: "s1_pack_pet_void_crawler_2",
    sceneDelta:
      "Action mid-shot. A Void Stalker — adult-stage void-crawler, approximately 90cm long, mid-action of BACKSTAB on an anonymous figure at frame-centre. Body has matured: now a quadrupedal dark-violet-and-phosphor-green sleek hunter-form, four void-claw legs, one long curved void-tail with phosphor-green tip. The Stalker is BEHIND the anonymous victim (back-three-quarter on victim, generic civilian + tactical), tail extended forward into the victim's back. Faint warm backstab-glow rims the tail-tip (backstab keyword). Around the Stalker, faint cool-violet void-shimmer (canonical 'feeds from behind'). NO face on victim.",
    moodKeywords: [
      "it feeds from behind",
      "you won't feel it until it's too late",
      "quadrupedal dark-violet-and-phosphor-green sleek hunter",
      "void-tail extended into victim's back",
    ],
    palette:
      "Dark-violet-and-phosphor-green sleek hunter-body + four void-claw legs + long curved void-tail + phosphor-green tail-tip + warm backstab-glow + cool-violet void-shimmer + anonymous victim back-three-quarter + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Stalker behind anonymous victim, tail extended forward",
    notes:
      "Rare unit. NO victim face visible. Second stage of void-crawler lineage (escalation: 8cm slug → 90cm quadrupedal hunter).",
  },
  {
    cardId: "s1_pack_pet_void_crawler_3",
    sceneDelta:
      "Wider mid-shot. A Void Leviathan — vast adult-stage void-crawler, approximately 4m long, body composed of dense cool-violet-and-phosphor-green void-substance, snake-like serpentine form. It is mid-action of CRAWLING OUT of a deep cool-violet VOID-RIFT in the air at frame-back-centre — head emerged, half the body still inside the rift. The Leviathan brings NOTHING with it (the canonical 'crawled out of nothing and brought nothing — nothing that erases everything it touches'). Around its leading edge, anything-it-touches visibly ERASES — faint translucent objects begin to fade where the Leviathan's body has passed. NO single dominant figure (the Leviathan IS the subject; the erased objects are anonymous fragments).",
    moodKeywords: [
      "it crawled out of nothing",
      "and brought nothing with it",
      "nothing that erases everything it touches",
      "Leviathan emerging from void-rift, erasing along its path",
    ],
    palette:
      "Dense cool-violet-and-phosphor-green void-substance + snake-like serpentine body + deep cool-violet void-rift + translucent fading objects (being erased) + cool deep-shadow",
    composition:
      "Wider mid-shot, Leviathan emerging from rift at frame-back-centre, fading objects along path",
    notes:
      "Epic unit. NO human figure. Third stage of void-crawler lineage. The 'erases everything it touches' is rendered through the visible fading-trail along the Leviathan's path.",
  },
  {
    cardId: "s1_reward_boss_source",
    sceneDelta:
      "Mid-shot. A Source Fragment — at frame-centre, a single FLOATING SHARD of brilliant-white core substance with toxic-green outer ring (the canonical Source-substance signature, but FRAGMENT scale). The shard is approximately 30cm tall, hovering at chest-height in a quiet aftermath-room. From within the shard, a faint translucent SIGNAL-PULSE propagates rhythmically (heartbeat made of static — the canonical 'hums inside like a heartbeat'). Around the shard, faint phosphor-green Hierarchy-script faintly drifts — the signal still alive. NO human figure (the shard IS the subject; the Source itself is gone). Background: aftermath-debris of a destroyed Source-throne sanctum.",
    moodKeywords: [
      "the Source was destroyed",
      "the signal was not",
      "it hums inside the Fragment like a heartbeat made of static",
      "shard with rhythmic signal-pulse + Hierarchy-script drift",
    ],
    palette:
      "Brilliant-white core substance + toxic-green outer ring (fragment-scale) + faint translucent signal-pulse + phosphor-green Hierarchy-script + aftermath-debris of destroyed sanctum + cool deep-shadow",
    composition:
      "Mid-shot, Source Fragment at frame-centre at chest-height, aftermath-debris behind",
    notes:
      "Legendary unit. NO human figure. The 'Source destroyed but signal alive' framing is rendered through the persistent shard + ongoing pulse. Visual continuity with all Source renderings (brilliant-white-core + toxic-green ring) at fragment scale.",
  },
  {
    cardId: "s1_reward_circuit_1st",
    sceneDelta:
      "Action mid-shot. A Clone Racer — humanoid figure mid-RACE at frame-centre, generic-anonymous features (alert eyes, lean racer build, no specific distinguishing details), in chrome-and-phosphor-green Circuit-racer's skin-suit. He is mid-stride forward (rush keyword). At frame-LEFT (behind him), a faint translucent ghost-figure of HIM AT THE STARTING LINE is visible (cloned-at-start). At frame-RIGHT (ahead, off-frame), a faint translucent recycling-vat visible — where he will end. The Circuit's track extends behind him. Faint warm rush-trails at his heels. NO memory of the previous forty-seven races visible — his face is FIRST-RACE blank. Cool deep-shadow surrounds the track-edges.",
    moodKeywords: [
      "they clone him at the starting line and recycle him at the finish",
      "he has won forty-seven races. he remembers none of them",
      "ghost-clone at starting line behind, recycling-vat ahead",
      "FIRST-RACE blank expression",
    ],
    palette:
      "Chrome-and-phosphor-green Circuit-racer's skin-suit + faint translucent ghost-clone at starting line + faint translucent recycling-vat + warm rush-trails + cool Circuit-track + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Racer mid-stride at frame-centre, ghost-clone at frame-left, recycling-vat off-frame at frame-right",
    notes:
      "Rare unit. Anonymous Racer (generic features) preserves no-character-conflation. The 'no memory of previous races' is rendered through the FIRST-RACE blank expression — every race is his first, in a sense.",
  },
  {
    cardId: "s1_reward_circuit_survive",
    sceneDelta:
      "Mid-shot. An Identity Fragment — a small humanoid figure at frame-centre, body composed of TRANSLUCENT FRAGMENT-OF-IDENTITY substance (faint warm-cream luminous outline barely visible). Most of the figure's body is translucent-empty (the Circuit stripped away name, face, memory) but at the figure's CHEST, a single small SOLID warm-amber SPARK is visible (something small and stubborn and alive — the canonical 'something persisted'). The figure stands upright, pose calm-defiant. Faint translucent rebirth-doubled-edge runs along the outline (rebirth keyword). NO face visible (face-region empty translucent). Background: cool aftermath of a Circuit-arena.",
    moodKeywords: [
      "the Circuit stripped away everything — name, face, memory",
      "but something persisted",
      "something small and stubborn and alive",
      "translucent body with one solid warm-amber chest-spark",
    ],
    palette:
      "Translucent fragment-of-identity body + faint warm-cream luminous outline + solid warm-amber chest-spark + translucent rebirth-doubled-edge + cool Circuit-arena aftermath + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Identity Fragment at frame-centre upright, chest-spark luminous",
    notes:
      "Rare unit. NO face visible (deliberately empty). The 'something persisted' is rendered through the visible chest-spark amid the translucent body — a single luminous point in otherwise-empty form.",
  },
  {
    cardId: "s1_reward_class_assassin",
    sceneDelta:
      "Action mid-shot. A Master Assassin — figure of indeterminate gender at frame-centre, generic-precise features (sharp focused eyes, calm mid-strike expression, hair tightly bound), in dark Insurgency-aligned Master-grade infiltration-leathers (deeper than standard Insurgency-slate, with chrome-and-signal-green Master's-pin at the chest — Master-rank). They are mid-strike — but the strike is rendered as ALREADY-COMPLETED: the blade is in the off-frame target's body (only the off-frame target's chrome-and-cool-cyan armor edge visible at frame-right), the Assassin's posture is PERFECT-COMPOSURE (no extra motion, no follow-through — the kill happened the moment they decided). Faint signal-green stealth-shimmer at body-edge. Faint warm rush-trails at heels. Their face shows zero anticipation, zero exertion.",
    moodKeywords: [
      "the kill is decided before the blade is drawn",
      "Master-rank tier with deeper-than-standard infiltration-leathers",
      "perfect-composure mid-strike — kill already-completed",
      "zero anticipation, zero exertion",
    ],
    palette:
      "Dark Insurgency-aligned Master-grade infiltration-leathers + chrome-and-signal-green Master's-pin + signal-green stealth-shimmer + warm rush-trails + anonymous off-frame target's chrome-and-cool-cyan armor edge + cool deep-shadow",
    composition:
      "Action mid-shot front three-quarter, Master Assassin at frame-centre in perfect-composure mid-strike, off-frame target at frame-right edge",
    notes:
      "Rare unit. CRITICAL: this is class-rank reward Master Assassin (echoes Master Engineer / Oracle / Spy / Soldier pattern), NOT Akai Shi (different specific archetype). Generic-precise features distinct from Akai Shi's Potentials-glyph. Anonymous off-frame target preserves no-character-conflation.",
  },
  {
    cardId: "s1_reward_companion_kael",
    sceneDelta:
      "Mid-shot. Kael's Memory — at frame-centre, a small luminous warm-amber MEMORY-FRAGMENT hovering at chest-height in a quiet remembrance-chamber. The fragment shows visible KAEL FROM BEFORE THE INFECTION — but ONLY as a translucent generic-traveler silhouette outline (no facial features, no specific identifying details — the canonical 'someone worth remembering' rendered as generalized memory rather than specific likeness). The fragment is sharp-edged (the canonical 'his memory still cuts' — visible sharp warm-amber edge-outline that looks blade-like). An anonymous figure (only their hand visible at frame-bottom-edge, generic Insurgency-slate sleeve) reaches up toward the fragment. NO Kael literally rendered — only the outline-silhouette of memory.",
    moodKeywords: [
      "before the infection, Kael was someone worth remembering",
      "his memory still cuts",
      "translucent generic-traveler silhouette outline (no facial features)",
      "sharp warm-amber edge-outline that looks blade-like",
    ],
    palette:
      "Warm-amber memory-fragment + translucent generic-traveler silhouette outline + sharp warm-amber edge-outline + anonymous reaching hand + warm low remembrance-chamber light + cool deep-shadow",
    composition:
      "Mid-shot, memory-fragment at frame-centre at chest-height, anonymous reaching hand at frame-bottom-edge",
    notes:
      "Rare unit. CRITICAL: Kael literally rendered ONLY as silhouette-outline (no specific facial features) — preserves spoiler-discipline (the historical Kael's specific face is not confirmed; the contemporary Insurgency Kael's connection NOT confirmed). Generic-traveler outline echoes Patient Zero's Ark-thief-era framing without committing to specific features.",
  },
  {
    cardId: "s1_reward_crew_sacrifice",
    sceneDelta:
      "Mid-shot. The Sacrificed — female-presenting figure at frame-centre, generic-resolute features (eyes still half-open in death, calm composed face, hair tied back), her body in a CONSECRATED-DECEASED state — laid in a small ceremonial Insurgency-aligned remembrance-bier at lower-third. Around her, faint translucent silver-mist memory-trails extend outward toward off-frame crew-mates (the canonical 'her crew remembers' rendering — multiple translucent ribbon-trails visible reaching to frame-edges). Her body shows faint warm-cream-and-cool-violet INFECTION-RESIDUE (sacrificed during the Outbreak — the infection took her, but she chose). Faint phosphor-green deathwatch-script propagates outward. Background: a quiet Outbreak-aftermath cell-room.",
    moodKeywords: [
      "sacrificed during the Outbreak",
      "her crew remembers",
      "translucent silver-mist memory-trails extending to off-frame crew",
      "warm-cream-and-cool-violet infection-residue (she chose)",
    ],
    palette:
      "Generic-resolute features + remembrance-bier + translucent silver-mist memory-trails + warm-cream-and-cool-violet infection-residue + phosphor-green deathwatch-script + Outbreak-aftermath cell-room + warm low remembrance-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Sacrificed at frame-centre on bier, memory-trails extending to off-frame crew",
    notes:
      "Epic unit. Generic-resolute features must NOT match any named character. The 'her crew remembers' is rendered through the off-frame memory-trails. The 'she chose' framing is rendered through the calm-composed face + the consecrated-deceased state.",
  },
] as const;

/**
 * Thought Virus faction's prompt registry, keyed by card id.
 *
 * Currently populated: 37 / 53 cards
 * (gen_thought_virus, s1_char_032, s1_char_049, s1_char_070,
 *  s1_char_071, s1_char_072, s1_char_073, s1_char_074,
 *  s1_char_075, s1_char_076, s1_char_077, s1_char_113-116,
 *  s1_char_200, s1_pack_022-028,
 *  s1_pack_cosm_armor_void, s1_pack_cosm_board_void,
 *  s1_pack_cosm_tower_skin, s1_pack_id_kael_patient_zero,
 *  s1_pack_id_kael_source, s1_pack_pet_void_crawler_1-3,
 *  s1_reward_boss_source, s1_reward_circuit_1st,
 *  s1_reward_circuit_survive, s1_reward_class_assassin,
 *  s1_reward_companion_kael, s1_reward_crew_sacrifice).
 */
export const THOUGHT_VIRUS_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(THOUGHT_VIRUS_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
