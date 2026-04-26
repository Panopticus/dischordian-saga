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
] as const;

/**
 * Thought Virus faction's prompt registry, keyed by card id.
 *
 * Currently populated: 11 / 53 cards
 * (gen_thought_virus, s1_char_032, s1_char_049, s1_char_070,
 *  s1_char_071, s1_char_072, s1_char_073, s1_char_074,
 *  s1_char_075, s1_char_076, s1_char_077).
 */
export const THOUGHT_VIRUS_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(THOUGHT_VIRUS_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
