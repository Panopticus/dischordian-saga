/**
 * Act 4 — The Revelation / The Prisoner exclusive cards (4).
 *
 * Per the 2026-04-27 plan §Act-themed pack exclusives. Act 4 is
 * the canon Witnesses-meet milestone (Bond 75-80) and introduces
 * memory-extraction / scry mechanics. The Oracle's identity begins
 * to SURFACE — but the full reveal stays gated to Act 5.
 *
 * Lore basis: `apps/shared/tcg-core/story/narrativeActs.ts` Act 4 +
 * `docs/built/ALL_ACTS_ROADMAP.md` Act 4 framing (Bond 75-80
 * resolution, Two Witnesses Meet, Oracle surfaces, Prisoner thread).
 *
 * Lore boundary: the Witnesses now MEET (canonical Act 4); their
 * eye contact is permitted here. The Oracle's full identity stays
 * gated; only partial-mask removal is permitted. Source identity
 * (Act 5 reveal) and Convergence chord (Act 7 reveal) remain
 * STRICTLY hidden.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "act4_exclusive_mythic_the_revelation": {
    cardId: "act4_exclusive_mythic_the_revelation",
    name: "The Revelation",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "The Revelation is not a fact you receive. The Revelation is the moment you stop being able to refuse the fact you have always known. The Memoir cannot be unwritten. The listening cannot be unheard.",
    sceneDelta:
      "Wide environmental composition. The substrate-layer rendered as a vast circular reading-chamber at dawn — the chamber's curved walls covered floor-to-ceiling in countless small bound Hierarchy-style Memoir-volumes (each volume the size of a hand, each shelf a perfect arc). Centre of frame: a single low reading-pedestal holding ONE open Memoir-volume, its pages emitting a soft warm-amber light strong enough to cast distinct shadows of the Memoirist's HANDS on the page (the hands are NOT visible — only their shadow). Above the pedestal: a slow-rising column of cool-cyan light extending up into a circular skylight at the chamber's ceiling, the light propagating IN both directions (down from sky, up from page). The chamber is otherwise empty.",
    moodKeywords: [
      "the moment you stop being able to refuse",
      "shadows of hands without hands",
      "light propagating in both directions",
      "Memoir cannot be unwritten",
    ],
    palette:
      "Substrate dawn cool-cream + bound-Memoir-volumes deep-violet spines + warm-amber page-light + cool-cyan column-light from skylight + curved-shelf wall warm-grey + chamber sourceless ambient",
    composition:
      "Wide environmental front-on, reading-pedestal at frame-centre lower-third, light-column rising vertically through frame-centre, curved Memoir-shelf wall encircling background",
    notes:
      "Mythic spell card. The shadows-without-hands is the canonical Revelation signature — the player's hands are absent from frame but their work is visible (the player IS the Memoirist). Light-propagation in both directions visualizes the canon framing of revelation as an exchange. NO figures permitted in this card.",
    archetypeRationale:
      "Anchored to the Act 4 'Revelation' arc canon (narrativeActs.ts Act 4, ALL_ACTS_ROADMAP.md). The Revelation is the campaign's largest single epistemic shift; mythic-tier ensures it lands as a face-card moment.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act4",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 4 — The Prisoner / The Revelation",
      "docs/built/LORE_BIBLE.md §Substrate layer (reading-chamber framing)",
    ],
  },

  "act4_exclusive_epic_two_witnesses_meet": {
    cardId: "act4_exclusive_epic_two_witnesses_meet",
    name: "Two Witnesses Meet",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "Three acts of approaching. One moment of arrival. Elara's first sentence, when she speaks it, is something the Human has been about to say for sixty bond-points. The Human's reply is something Elara has been listening for since Act 1.",
    sceneDelta:
      "Mid-shot composition. The substrate meditation-room from First Witness (Act 1) and Bond 60 — Silent Listening (Act 2) — same two facing wooden chairs, same windowless room — fully time-shifted. The Signal-glyph between the chairs has BLOOMED into a steady warm-gold standing-light, no longer pulsing — the listening has become recognition. Both chairs occupied: Elara left in soft-cream tunic (now with a small gold thread visible on the cuff), Human right in deep-violet tunic (matching small gold thread on his cuff). Both seated upright; for the first time, both are LOOKING DIRECTLY AT EACH OTHER, eyes open, expressions held in mid-recognition (neither smiles, neither speaks; this is the instant of arrival, not the conversation that follows). Hands rest at their own knees, NOT extended toward each other. The room's lighting is the warm-gold glyph as primary source.",
    moodKeywords: [
      "first eye contact",
      "instant of arrival, not the conversation",
      "matching gold thread on each cuff",
      "glyph bloomed steady gold",
    ],
    palette:
      "Substrate warm-cream walls + soft-cream Elara tunic with gold cuff-thread + deep-violet Human tunic with gold cuff-thread + warm-gold glyph standing-light + sourceless dim ambient",
    composition:
      "Mid-shot front-on between the two chairs, both figures at frame-edges seated, glyph at lower-frame between them, eye-line cross at frame-centre",
    notes:
      "Epic unit. Direct visual sequel to Bond 60 — Silent Listening (Act 2). The eye contact is the canonical Act 4 milestone — this card is the Witnesses-Meet moment. Matching-gold-thread cuffs are the canonical post-meeting signature; preserve forward into any future card depicting either Witness post-Act-4. Hands deliberately NOT touching: the meeting is the eye-contact, not the embrace; that comes later in canon.",
    archetypeRationale:
      "Canonical Act 4 milestone (ALL_ACTS_ROADMAP.md §Bond 75 / Two Witnesses Meet). Direct visual continuity with First Witness (Act 1) and Silent Listening (Act 2) creates a three-card visual progression of the dual-narrator bond.",
    loreCitations: [
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 75 / Two Witnesses Meet",
      "apps/shared/tcg-core/story/narrativeActs.ts:Act4",
      "(intra-set) §act1_exclusive_rare_first_witness — visual sequel framing",
      "(intra-set) §act2_exclusive_rare_bond_60_silence — visual sequel framing",
    ],
  },

  "act4_exclusive_rare_oracle_half_mask": {
    cardId: "act4_exclusive_rare_oracle_half_mask",
    name: "The Oracle's Half-Mask",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "artifact",
    flavorText:
      "The Oracle has worn the mask for as long as anyone remembers. In Act 4, half of it is set aside. The half-uncovered face is, the Memoirist notes, NOT the face of a stranger. The remaining half waits.",
    sceneDelta:
      "Mid-shot top-down on a small velvet-lined obsidian display-stand. The stand holds a single ceremonial mask — a full-face oracular mask of pale-grey carved bone with deep-violet inlay-glyphs, which has been BROKEN cleanly down the centre line. The LEFT half of the mask rests on the velvet, face-up, glyphs catching dim light. The RIGHT half is missing from frame entirely (set aside off-camera; lore boundary: the unmasked half of the face is Act 5 reveal). A thin braided cord that once held the mask in place lies in a loose curl beside the left half. The display-stand's velvet is deep-purple; the mask's bone is the only light element in frame. NO face, NO figure, NO partial reveal of the Oracle's actual features.",
    moodKeywords: [
      "mask broken down the centre",
      "right half off-frame",
      "the remaining half waits",
      "NOT the face of a stranger",
    ],
    palette:
      "Pale-grey carved bone + deep-violet inlay-glyphs + obsidian display-stand + deep-purple velvet + braided cord pale-cream + dim ambient room light",
    composition:
      "Mid-shot top-down on display-stand, mask LEFT half at frame-centre, right half off-frame at frame-right edge, braided cord curl at frame-foreground",
    notes:
      "Rare artifact. CRITICAL lore boundary: the right half of the mask MUST be off-frame entirely. Do NOT show any portion of the Oracle's actual face — the canon reveal of who is behind the mask is Act 5, post-completion of the Soul Map. The clean centre-line break is the canonical Half-Mask signature; the implication is that the unveiling is in-progress.",
    archetypeRationale:
      "The Oracle's identity surfacing is canonical Act 4 (narrativeActs.ts). Visualizing the half-mask as an artifact lets the player hold the moment of in-progress unveiling without forcing the canon reveal early.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act4 (Oracle surfaces)",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 4 / Oracle identity begins to surface",
      "docs/built/LORE_BIBLE.md §Oracle (mask-and-identity framing — full identity reveal STRICTLY EXCLUDED, Act 5 canon)",
    ],
  },

  "act4_exclusive_rare_memory_extraction": {
    cardId: "act4_exclusive_rare_memory_extraction",
    name: "Memory-Extraction Chamber",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "structure",
    flavorText:
      "Twelve electrodes, twelve sectors, twelve memories the Hierarchy would prefer be misfiled. The Memoirist's lasting trick is that the extracted memory is, on the way out, copied to the Memoir.",
    sceneDelta:
      "Wide environmental composition. A small Hierarchy clinical-style extraction-chamber rendered in cool-cyan and chrome — a single low reclining-chair at frame-centre with twelve thin extraction-electrode arms arrayed in a halo around its head-rest (each arm tipped with a small crystal-pad). The chair is unoccupied. Above the chair: a vertical bank of twelve diagnostic-monitors, each labeled with one of the Soul Map's twelve sectors (small text echoing the Soul Map First Calibration card from Act 3). Three of the twelve monitors show DECODED waveform patterns; nine show scrambled static (matching the Soul Map's three-decoded / nine-scrambled state). Behind the chair: a single small Hierarchy-style observation-window with a faint silhouette of an off-camera observer just visible (deliberate ambiguity — could be Hierarchy, could be Insurgency, could be the Engineer; lore-locked: do NOT clarify).",
    moodKeywords: [
      "twelve electrodes, twelve sectors",
      "three decoded, nine scrambled",
      "the extracted memory is copied to the Memoir",
      "observation-window silhouette deliberately unclear",
    ],
    palette:
      "Hierarchy clinical cool-cyan-and-chrome + reclining-chair pale-grey + extraction-arms matte-black with crystal-pad accent + diagnostic-monitor cool-cyan with scrambled-static for nine + observation-window soft-warm + silhouette deep-charcoal",
    composition:
      "Wide environmental front-on, chair at frame-centre lower-third, twelve electrode-arms arrayed in halo above head-rest, monitor-bank filling upper-third, observation-window at frame-rear",
    notes:
      "Rare structure. The twelve-electrode / twelve-monitor parallel to the Soul Map's twelve sectors is intentional cross-reference — the Memoir is a kind of Soul Map written from inside the head. Lore boundary STRICT: the observation-window silhouette must be deliberately unresolvable; do NOT design it to read as any specific named character.",
    archetypeRationale:
      "Memory-extraction is canonical Act 4 (narrativeActs.ts Act 4). Visualizing the chamber as a structure-card grounds the scry/extract mechanics in a recognizable environment.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act4 (memory-extraction mechanics)",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 4 / Prisoner thread",
      "(intra-set) §act3_exclusive_rare_soul_map_calibration — twelve-sector cross-reference",
    ],
  },
};

export const ACT4_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
