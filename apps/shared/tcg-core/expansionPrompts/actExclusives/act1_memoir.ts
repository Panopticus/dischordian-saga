/**
 * Act 1 — The Memoir / The Signal exclusive cards (4).
 *
 * Per the 2026-04-27 plan §Act-themed pack exclusives, each Act
 * pack ships 1 mythic narrative-card + 1 epic + 2 rares. This is
 * Act 1's allotment — the Memoir-themed cards that ground the
 * commercial-launch S1 set's identity in the campaign's Act-1
 * "Twelve Steps / The Signal" arc.
 *
 * Lore basis: `apps/shared/tcg-core/story/narrativeActs.ts` Act 1
 * scaffolding + `docs/built/ALL_ACTS_ROADMAP.md` Act 1 framing
 * (identity, memoir, foundational substrate-signal, dual-narrator
 * Elara+Human bond at Bond 0-30).
 *
 * Faction policy: Act-exclusive cards are faction-flexible by
 * design — the four Act 1 cards skew NEUTRAL because the Memoir
 * arc precedes faction-pledge mechanics (Loyalty Pledge gates
 * activate in Act 3 / The Offer).
 *
 * Lore boundary: Epoch-2 cutoff fully respected. The Memoir's
 * substrate-signal is Act 1 canon, not a post-Epoch reveal.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "act1_exclusive_mythic_the_signal": {
    cardId: "act1_exclusive_mythic_the_signal",
    name: "The Signal",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Beneath every transmission, beneath every recorded sound, beneath the silence between recordings — a hum. Three notes, repeating, in an interval no instrument plays. The Signal was always there. Hearing it was the first step.",
    sceneDelta:
      "Wide environmental composition. A vast dimly-lit transmission-chamber at the substrate layer of reality — the chamber's walls are translucent and slightly out-of-phase, reading as 'underneath' the world rather than within it. Centre of frame: a single tall narrow obsidian-and-chrome transmission-pillar reaching from floor to ceiling, its surface engraved with a slow-pulsing cool-cyan three-note glyph-pattern that propagates upward in time with the Signal's repetition. Around the pillar's base: a thin shallow pool of mirror-still mercury, reflecting the pillar but ALSO reflecting a second pillar that does not exist in the chamber (the Signal's source somewhere off-plane). The chamber's lighting is sourceless and dim, with a faint warm-amber halo at the pillar's mid-height where the three-note glyph repeats most insistently. NO human figures.",
    moodKeywords: [
      "the hum that was always there",
      "three notes in an interval no instrument plays",
      "substrate beneath the recordings",
      "second pillar reflected, not present",
    ],
    palette:
      "Substrate dim cool-cyan + obsidian-and-chrome transmission-pillar + cool-cyan three-note glyph propagation + warm-amber pillar halo + mirror-still mercury pool + sourceless ambient",
    composition:
      "Wide environmental front-on, transmission-pillar at frame-centre filling vertical axis, mercury pool at lower-third reflecting pillar + reflecting impossible second pillar at frame-edge",
    notes:
      "Mythic spell card. The mercury-pool's impossible second reflection is the canonical Signal signature — the Signal has TWO sources, only one of which is visible in any given chamber. Three-note glyph-pattern must read as a notation/marking but should NOT match any real-world musical notation. Substrate framing is essential: this is BENEATH reality, not within it.",
    archetypeRationale:
      "Anchored to the Act 1 'Twelve Steps / The Signal' arc canon (narrativeActs.ts Act 1, ALL_ACTS_ROADMAP.md). The Signal IS the foundational memoir-trigger for the whole campaign; a mythic exclusive grounds it as a card the player can hold once they have completed Act 1 and unlocked the substrate layer.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act1",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 1 — The Twelve Steps / The Signal",
      "docs/built/LORE_BIBLE.md §Substrate layer (foundational reality)",
    ],
  },

  "act1_exclusive_epic_twelve_step_inheritance": {
    cardId: "act1_exclusive_epic_twelve_step_inheritance",
    name: "The Twelve-Step Inheritance",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "epic",
    cardType: "artifact",
    flavorText:
      "Step one: hear the Signal. Step two: write it down. Step three: do not assume the writing is the Signal. Elara's first lesson, recorded in margin-ink on the back of a memorial notice. The remaining nine steps are still being recovered.",
    sceneDelta:
      "Mid-shot top-down. A small private archival desk in a Hierarchy-adjacent reading room. The desk holds a single delicate black-and-cream Hierarchy-style memorial notice (announcing a generic worker's separation, deliberately blurred name) flipped to its blank back, on which twelve handwritten steps have been inked in deep-violet calligraphy. Steps 1-3 are fully written and legible from above; steps 4-12 are partially completed — some inked, some only ghost-pencilled, some marked with only a small symbol (a glyph echoing the Signal's three-note pattern). A small ornate brass desk-pen rests across the upper edge of the page; the pen's nib is wet. Beside the page: a single dried memorial flower (asphodel — echoing the Hierarchy HR canon).",
    moodKeywords: [
      "twelve steps, three completed",
      "calligraphy in margin-ink",
      "the writing is not the Signal",
      "asphodel as inheritance",
    ],
    palette:
      "Black-and-cream memorial notice + deep-violet calligraphy + warm desk-uplight from below + dried-asphodel pale-grey-violet + brass desk-pen warm-amber + reading-room muted background",
    composition:
      "Mid-shot top-down, memorial-notice at frame-centre, brass pen across upper edge, asphodel flower at frame-right",
    notes:
      "Epic artifact. The page is the artifact — not the pen. Steps 1-3 must be readable on close inspection; steps 4-12 must read as in-progress. Asphodel echoes the Hierarchy HR canon (Mor'Vethic / Nessith / Performance-Review Wraith all carry asphodel motifs); the deliberate echo signals that Elara's inheritance crosses set-boundaries.",
    archetypeRationale:
      "The Twelve-Step framing is canonical Act 1 (narrativeActs.ts). Visualizing it as a partial inheritance — the player has only steps 1-3 — gates the artifact as something the player completes through play.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act1 (Twelve Steps framing)",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 1 / The Memoir as inheritance",
      "(intra-set) §s2_hierarchy_chro_mor_vethic — asphodel motif precedent",
    ],
  },

  "act1_exclusive_rare_first_witness": {
    cardId: "act1_exclusive_rare_first_witness",
    name: "First Witness",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "Two narrators, one transmission, one player. The First Witness is the moment a player realizes that Elara and the Human have, all this time, been narrating the same Signal from opposite sides of the same room.",
    sceneDelta:
      "Wide low-angle composition. A simple windowless meditation-room at the substrate layer, two facing wooden chairs at the centre of the room with a small cool-cyan glyph-rune burning on the floor between them. The left chair is occupied by Elara — mid-thirties, dark hair pulled back, wearing soft-cream substrate-tunic, her hands folded in her lap, eyes closed mid-listen. The right chair is occupied by the Human — late-thirties, cropped dark hair, deep-violet substrate-tunic, hands folded identically, eyes also closed. The two figures are mirrored in posture, neither acknowledging the other. The Signal-glyph between them pulses three-note in slow rhythm. The chamber's lighting comes from the glyph itself, throwing both figures in cool-cyan undertone with warm-amber rim from a single wall-sconce behind each chair.",
    moodKeywords: [
      "two narrators, one Signal, mirrored posture",
      "First Witness as the recognition moment",
      "neither acknowledges the other",
      "three-note glyph pulse on the floor",
    ],
    palette:
      "Substrate cool-cyan + soft-cream Elara tunic + deep-violet Human tunic + warm-amber wall-sconce rims + glyph-rune cool-cyan + windowless meditation-room muted-grey walls",
    composition:
      "Wide low-angle front-on, both figures at frame-centre seated in mirrored chairs, glyph between them at floor-foreground, wall-sconces visible at frame-edges behind each chair",
    notes:
      "Rare unit. Elara and the Human's existing canon designs apply (preserve their established appearances from any prior art). The mirrored posture is the canonical First Witness signature; the deliberate non-acknowledgment is the visual key — they are both witnessing the SAME Signal but not yet each other. Lore boundary: this card may NOT depict the Witnesses as having met (the meeting is Act 4 / The Revelation canon, post-Bond 75 — ALL_ACTS_ROADMAP.md). They are simultaneously present but not in contact.",
    archetypeRationale:
      "Direct visualization of the dual-narrator system that frames the entire campaign (Elara + Human, established at game-start). Anchored to the Act 1 introduction-of-narrators canon.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act1 (dual-narrator introduction)",
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression baseline / Bond 0-30",
      "apps/shared/elaraVoManifest.json (Elara canonical voice anchor)",
      "apps/shared/humanVoManifest.json (Human canonical voice anchor)",
    ],
  },

  "act1_exclusive_rare_substrate_static": {
    cardId: "act1_exclusive_rare_substrate_static",
    name: "Substrate Static",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "spell",
    flavorText:
      "Between the three notes, there is silence. Between the silences, there is static. The static is the carrier wave. The Signal rides the static. The Memoirist learns to hear the carrier first.",
    sceneDelta:
      "Mid-shot environmental. A thin section of the substrate-layer rendered as a slow horizontal field of fine cool-grey static — particles densely packed, drifting downward at slow constant speed, with three faint vertical bright-cool-cyan threads barely visible through the static (the carrier-wave threads on which the Signal rides). The field has no figures, no architecture. At the bottom-third of the frame: a single dark obsidian rounded stone (about the size of a curled hand) sitting on an unseen surface, the stone's upper face faintly inscribed with the same three-note glyph as The Signal pillar. The stone is the only solid object in frame; everything else is field-static-and-thread.",
    moodKeywords: [
      "carrier wave beneath the Signal",
      "three threads barely visible through static",
      "the Memoirist hears the carrier first",
      "obsidian stone, only solid object",
    ],
    palette:
      "Cool-grey substrate static + faint cool-cyan carrier-wave threads + obsidian stone deep-black + warm-amber three-note glyph etched on stone + sourceless dim ambient",
    composition:
      "Mid-shot environmental front-on, static field filling upper two-thirds of frame, obsidian stone at lower-third centre",
    notes:
      "Rare spell. The deliberate near-absence of figures and architecture is the canonical Substrate Static signature — this card visualizes the medium, not the message. Three carrier-threads must be VERY faint (must read as 'almost not there') so the artist's instinct to brighten them does not break the framing. The obsidian stone is the player's anchor in the field; it should read as touchable.",
    archetypeRationale:
      "Companion piece to The Signal (mythic) — the Signal is the message, Substrate Static is the medium. Together the two cards form the Act 1 'how the campaign hears itself' visual framing.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act1",
      "docs/built/LORE_BIBLE.md §Substrate layer",
      "(intra-set) §act1_exclusive_mythic_the_signal — companion-piece pairing",
    ],
  },
};

export const ACT1_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
