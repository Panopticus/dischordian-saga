/**
 * Card art prompts — PANOPTICON faction subgroup (8 character cards).
 *
 * The Panopticon set are eight architect-faction (per definition)
 * character cards thematically grouped around the surveillance-state
 * apparatus that the Architect deploys against citizens. Distinct
 * from broader Architect-faction characters (which include
 * Quarchon-aligned, philosopher-aligned, and synthetic-engineering
 * subgroups). The visual language is COLDER and MORE BUREAUCRATIC
 * than the broader Architect-faction set:
 *
 *   - palette: Architect cool-cyan + chrome + slate-grey + warm
 *     fluorescent ceiling-strip (Panopticon institutional lighting)
 *   - environments: Central Spire, surveillance corridors,
 *     compliance-checkpoints, blacksite holding-cells, registry
 *     archive-floors
 *   - signature visual idiom: cool-cyan optical-lens motif
 *     (every Panopticon character interacts with surveillance
 *     somehow — they wear it, carry it, ARE it)
 *   - faces: deliberately UNINDIVIDUAL (the system has reduced
 *     them to function); when faces are visible, they are calm,
 *     procedural, NOT cruel — cruelty would be inefficient
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 *
 * IDs follow the convention `s1_char_<NNN>` per definition.
 */

import type { CardArtPrompt } from "./types";

const PANOPTICON_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "s1_char_050",
    sceneDelta:
      "Wider mid-shot. Warden Prime — the supreme overseer of the Panopticon surveillance state — stands at the apex chamber of the Central Spire. He is a tall figure in late-fifties with a shaved head, generic-bureaucrat features (NOT cruel — procedural), wearing a heavy ceremonial Panopticon uniform: deep slate-grey with chrome epaulets, a chrome-and-cool-cyan high-collar tunic, a single small Architect-cyan sigil at the breast. He stands at the centre of the apex chamber, both hands clasped behind his back, facing OUTWARD toward a wall-of-displays — hundreds of small live surveillance feeds tiled across the entire wall, each feed showing a different Panopticon citizen at a different moment of their day. His eyes are open, reading multiple feeds simultaneously. A faint warm provoke-glow rims his shoulders (provoke); a faint cool cream rebirth-style buff-pulse propagates outward from his body across the chamber-floor (the +1 health to all friendlies visualized as a slow pulse).",
    moodKeywords: [
      "the Warden does not sleep",
      "the Warden is sleep denied to others",
      "every whisper heard, every shadow measured",
      "wall-of-displays at the apex chamber",
    ],
    palette:
      "Panopticon slate-grey + chrome epaulets + cool-cyan high-collar + Architect-cyan sigil + wall-of-display cool-cyan ambient + warm provoke-rim + cool cream buff-pulse",
    composition:
      "Wider mid-shot back-three-quarter on Warden, wall-of-displays filling upper-half of frame, Warden's silhouette at lower-third centre",
    notes:
      "Legendary unit. Warden's face is partially turned away (back-three-quarter only — we see him reading the wall, not us). The 'sleep denied to others' is rendered as the wall-of-feeds — every citizen visible. Generic-bureaucrat features must NOT match any named Architect-aligned character.",
  },
  {
    cardId: "s1_char_051",
    sceneDelta:
      "Mid-shot. An Oculus Sentinel — a small surveillance-drone hovering at chest-height in a Panopticon corridor, approximately 30cm in diameter, sleek chrome body with a SINGLE LARGE cool-cyan optical lens at the front (the lens is the dominant feature, occupying 60% of the drone's visible body). Two small articulating sensor-arms with smaller secondary lenses at the tips. The drone's main lens is RECORDING — a faint cool-cyan recording-light is on, and a faint cool-cyan ranged-attack laser-pip emits from the lens's centre toward an off-frame target at lower-frame-right (ranged + on-deploy random damage visualized). Behind the drone, the corridor extends in cool-cyan-and-fluorescent depth. NO human figure.",
    moodKeywords: [
      "its glass eye never blinks",
      "its memory never falters",
      "built to watch and to remember",
      "single dominant optical lens",
    ],
    palette:
      "Chrome drone-body + dominant cool-cyan optical lens + cool-cyan recording-light + Panopticon corridor cool-cyan + warm fluorescent ceiling-strip + cool-cyan ranged-laser-pip",
    composition:
      "Mid-shot front three-quarter on drone, drone at frame-centre at chest-height, corridor extending behind",
    notes:
      "Common unit. The dominant cool-cyan optical lens is the canonical Panopticon-set signature — every Panopticon character carries the lens-motif somewhere. NO human in frame (the drone IS the subject). Echoes Synthetic-race visual language but explicitly Panopticon-bureaucratic rather than Architect-fabrication-bay.",
  },
  {
    cardId: "s1_char_052",
    sceneDelta:
      "Mid-shot. A Compliance Officer — male-presenting, mid-forties, generic-procedural features (calm, not cruel), in standard Panopticon enforcement uniform: dark slate body-armor over a cool-cyan high-collar shirt, chrome shoulder-pads, a single cool-cyan optical-monocle worn over the right eye (the lens-motif). He stands at a Panopticon compliance-checkpoint in mid-action of waving a citizen through (the citizen is implied but at frame-edge — only their hand and a small ID-card visible at lower-right edge). His face is matter-of-fact, professional. His left hand rests on a holstered baton; his right hand is mid-wave-through-gesture. A faint warm provoke-glow rims his shoulders (provoke); a translucent cool-cream personal forcefield-shimmer forms around his torso (the +0/+2 buff visualized as personal protective bubble). Behind him, the checkpoint architecture: a chrome bollard line, a low cool-cyan registration-desk, a wall-mounted oculus-sentinel lens.",
    moodKeywords: [
      "obedience is not requested — it is extracted",
      "calm, procedural, not cruel",
      "optical-monocle over the right eye",
      "matter-of-fact mid-wave-through-gesture",
    ],
    palette:
      "Panopticon slate body-armor + cool-cyan high-collar shirt + chrome shoulder-pads + cool-cyan optical-monocle + warm provoke-rim + translucent cool-cream personal forcefield + cool-cyan checkpoint-architecture",
    composition:
      "Mid-shot front three-quarter, Officer at frame-centre at compliance-checkpoint, citizen's hand and ID at lower-right edge",
    notes:
      "Common unit. Generic-procedural face must NOT match any named character. The optical-monocle is the canonical Panopticon-set lens-motif worn at human-scale. Anonymous citizen at edge (only hand + ID visible) preserves no-character-conflation.",
  },
  {
    cardId: "s1_char_053",
    sceneDelta:
      "Mid-shot. A Data Harvester — an upright bipedal architectural-mechanical figure, approximately human-sized but visibly NOT human: a torso of chrome-and-slate plating with internal cool-cyan visible interrogation-tubes, two articulating arms ending in delicate fine-instrument extractors (NOT weapons — instruments), a head-unit with three cool-cyan optical lenses arranged in a triangle. The Harvester stands at the centre of a Panopticon interrogation-cell, its arms extended toward an anonymous slumped detainee at lower-frame-right (only the detainee's bound hands and the bottom of their slumped torso visible — face deliberately not visible). Faint cool-cyan threads of extracted DATA flow from the detainee toward the Harvester's chest, where the threads are absorbed and converted to a faint warm-amber drain-glow that pulses INWARD toward the Harvester's core (drain visualized as data + healing-flow). The Harvester does NOT communicate — it parses.",
    moodKeywords: [
      "does not ask questions",
      "parses screams for keywords",
      "extracts vital information AND vital energy",
      "instruments not weapons",
    ],
    palette:
      "Chrome-and-slate Harvester body + cool-cyan internal interrogation-tubes + three cool-cyan triangle-arrayed lenses + cool-cyan extracted-data threads + warm-amber drain-pulse + dark Panopticon cell + warm low cell-light",
    composition:
      "Mid-shot front three-quarter on Harvester, Harvester at frame-centre, anonymous detainee's bound-hands at lower-right edge only",
    notes:
      "Uncommon unit. CRITICAL: detainee is rendered as bound-hands-only — no face visible (preserves no-character-conflation and avoids gratuitous cruelty-rendering). The Harvester's three triangle-arrayed lenses differentiate from common Sentinel's single dominant lens. 'Instruments not weapons' is canon-direct framing — the procedural cruelty is SO procedural it doesn't need ostensibly-violent tooling.",
  },
] as const;

/**
 * Panopticon subgroup's prompt registry, keyed by card id.
 *
 * Currently populated: 4 / 8 cards
 * (s1_char_050, s1_char_051, s1_char_052, s1_char_053).
 * TODO: s1_char_054 through s1_char_057.
 */
export const PANOPTICON_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(PANOPTICON_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
