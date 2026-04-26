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
] as const;

/**
 * Thought Virus faction's prompt registry, keyed by card id.
 *
 * Currently populated: 5 / 53 cards
 * (gen_thought_virus, s1_char_032, s1_char_049, s1_char_070,
 *  s1_char_071).
 */
export const THOUGHT_VIRUS_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(THOUGHT_VIRUS_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
