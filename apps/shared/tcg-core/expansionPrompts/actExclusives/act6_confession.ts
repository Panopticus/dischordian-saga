/**
 * Act 6 — The Confession exclusive cards (4).
 *
 * Per the 2026-04-27 plan §Act-themed pack exclusives. Act 6 is
 * post-Year-One: narrators' confessions surface (Bond 90), truth/
 * banish mechanics activate, character backstories revealed.
 *
 * Lore basis: `apps/shared/tcg-core/story/narrativeActs.ts` Act 6 +
 * `docs/built/ALL_ACTS_ROADMAP.md` Act 6 framing (Bond 90 threshold,
 * confessional arc, banishment mechanics) +
 * `apps/shared/tcg-core/story/act6OpponentDialog.ts`.
 *
 * Lore boundary: Confessions are canonically Act 6 (per Bond 90
 * milestone) — backstories surface but Acts 7 reveals (Convergence
 * chord, finale stance choices, Watcher unmasking) STRICTLY remain
 * hidden. The confessional cards visualize the act-of-confession,
 * not the specific contents that would spoil Act 7.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "act6_exclusive_mythic_the_confession": {
    cardId: "act6_exclusive_mythic_the_confession",
    name: "The Confession",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Year One ended. Both Witnesses now know what they were each holding back. Both Witnesses now know what the OTHER was holding back. Neither has yet decided whether to speak it. The Confession is the breath before the speaking.",
    sceneDelta:
      "Wide environmental composition. The substrate-layer rendered as a small chapel-like confession-chamber at midnight — a low vaulted ceiling, two facing prayer-stalls separated by a thin lattice partition. The lattice is the canonical confessional grille — small geometric cut-outs that allow voice to pass but not faces. ELARA seated in the LEFT stall in soft-cream tunic with gold cuff-thread (continuity from Act 4); HUMAN seated in the RIGHT stall in deep-violet tunic with matching gold cuff-thread. Both face the lattice; both have eyes closed; both have hands folded at the lattice-edge. A single warm-amber sanctum-candle burns at the chapel's altar at frame-rear, throwing both figures in soft glow. NEITHER is speaking yet — this is the breath before. The chapel is otherwise empty.",
    moodKeywords: [
      "the breath before the speaking",
      "lattice that lets voice pass, not faces",
      "both eyes closed, both poised",
      "Year One ended",
    ],
    palette:
      "Substrate midnight cool-grey + chapel vaulted ceiling muted-stone + lattice partition warm-bone + soft-cream Elara tunic + deep-violet Human tunic + gold cuff-thread accent + warm-amber sanctum-candle uplight",
    composition:
      "Wide environmental front-on, lattice partition at frame-centre vertical, both figures in stalls at frame-edges, sanctum-candle altar at frame-rear",
    notes:
      "Mythic spell card. The lattice-grille is the canonical Confession signature — voice without face is the Act 6 mechanical and emotional key. Both Witnesses' eyes-closed posture means this card can show them in the same chamber WITHOUT breaking the eye-contact-is-meeting framing established in Act 4. Lore boundary: do NOT depict either narrator speaking — this card is the breath before, not the speech.",
    archetypeRationale:
      "Anchored to the Act 6 'Confession' arc canon (narrativeActs.ts Act 6, ALL_ACTS_ROADMAP.md). The Confession is the campaign's largest emotional turn-point post-Year-One; mythic-tier ensures it lands as a face-card moment.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act6",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 6 — The Confession",
      "apps/shared/tcg-core/story/act6OpponentDialog.ts",
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 90 threshold",
    ],
  },

  "act6_exclusive_epic_bond_90": {
    cardId: "act6_exclusive_epic_bond_90",
    name: "Bond 90 — The Confessional Hour",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "Bond 60 was the silence. Bond 75 was the meeting. Bond 90 is the hour in which neither narrator can return to the version of themselves the other did not know.",
    sceneDelta:
      "Mid-shot composition. The substrate meditation-room from First Witness / Bond 60 / Two Witnesses Meet — same two facing wooden chairs, same windowless room — fully time-shifted to Bond 90. The Signal-glyph between the chairs has DEEPENED from warm-gold (Act 4) into a steady DEEP-VIOLET light (matching the gold-cuff-thread inversion). Both chairs occupied: Elara left, Human right, BOTH leaning slightly TOWARD each other across the centre, hands now meeting in a single shared clasp at the midpoint between the chairs (this is the post-confessional hand-clasp; canonical for Bond 90). Eye contact direct. Faces hold expressions of post-confession recognition — neither tearful nor euphoric, but visibly altered. The room's deep-violet glyph-light is the dominant source.",
    moodKeywords: [
      "Bond 90 the hour of irreversible knowing",
      "deep-violet glyph-light",
      "shared hand-clasp at midpoint",
      "neither tearful nor euphoric — altered",
    ],
    palette:
      "Substrate deep-violet ambient + soft-cream Elara tunic with gold cuff-thread + deep-violet Human tunic with gold cuff-thread + deep-violet glyph standing-light + sourceless dim ambient",
    composition:
      "Mid-shot front-on between the two chairs, both figures at frame-edges leaning toward centre, shared hand-clasp at frame-foreground centre, glyph at lower-frame between hands",
    notes:
      "Epic unit. Direct visual sequel to Two Witnesses Meet (Act 4). The shared hand-clasp is the canonical Bond 90 signature (Act 4's hands deliberately did NOT touch; Act 6's now do). Glyph-color progression: cool-cyan (Act 1) → warm-cream (Act 2) → warm-gold (Act 4) → deep-violet (Act 6) — visualizes the bond's deepening across the campaign's cards.",
    archetypeRationale:
      "Bond 90 is canonical Act 6 (ALL_ACTS_ROADMAP.md §Bond progression). The Confessional Hour is the canonical Act 6 milestone; visualizes the post-confession irreversibility.",
    loreCitations: [
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 90 / Confessional Hour",
      "apps/shared/tcg-core/story/narrativeActs.ts:Act6",
      "(intra-set) §act4_exclusive_epic_two_witnesses_meet — visual sequel framing",
      "(intra-set) §act1_exclusive_rare_first_witness — original meditation-room canon",
    ],
  },

  "act6_exclusive_rare_narrators_truth": {
    cardId: "act6_exclusive_rare_narrators_truth",
    name: "A Narrator's Withheld Truth",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "spell",
    flavorText:
      "Each narrator carried one fact from before they were a narrator. Each fact was a small thing they had once done that the other would not have agreed to. Each fact was, on confession, smaller than they had feared.",
    sceneDelta:
      "Mid-shot top-down. A small bedside-table beside an unmade single bed in a substrate-quiet sleeping-quarters. The table holds a single small folded paper — handwritten on the visible upper-side in fine ink, the writing legible-but-deliberately-blurred (the artist must paint it as 'words on the page' but unreadable to the camera). Beside the folded paper: a small empty drinking-glass, a single dried twig (substrate flora — small grey-violet bract), and a sleeping-quarters-style desk-clock reading 03:11 AM. The bed is unmade in a way that suggests its occupant has just risen and not yet returned. NO figure is in frame. The ambient lighting is low warm-amber from a single small bedside-sconce.",
    moodKeywords: [
      "small thing once done",
      "paper folded, words deliberately unreadable",
      "03:11 AM sleeping-quarters",
      "smaller than they had feared",
    ],
    palette:
      "Substrate quiet warm-amber bedside-sconce + folded paper warm-cream + bedside-table warm-wood + drinking-glass clear + dried twig pale-grey-violet + clock dark-charcoal + unmade-bed pale-grey",
    composition:
      "Mid-shot top-down on bedside-table at frame-centre, unmade bed visible at frame-foreground edge, sconce at frame-edge throwing low warm light",
    notes:
      "Rare spell card. Lore boundary: the paper's writing must be deliberately unreadable; do NOT specify what the withheld truth IS — both narrators have one, and the canonical reveal of WHICH narrator and WHAT truth is each player's individual Act 6 experience. The 03:11 AM clock-reading is the canonical Withheld Truth signature (the small-hours-of-the-morning when confession happens).",
    archetypeRationale:
      "Withheld-truth confessions are canonical Act 6 (act6OpponentDialog.ts framing). Visualizing the moment-of-rising-to-confess as an empty room grounds the confessional act without forcing identity-disclosure.",
    loreCitations: [
      "apps/shared/tcg-core/story/act6OpponentDialog.ts",
      "apps/shared/tcg-core/story/narrativeActs.ts:Act6",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 6 / character backstories surface",
    ],
  },

  "act6_exclusive_rare_banishment_glyph": {
    cardId: "act6_exclusive_rare_banishment_glyph",
    name: "Banishment Glyph",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "spell",
    flavorText:
      "What is named cannot stay. The Memoirist learns the Banishment Glyph in Act 6, and the first thing banished is the version of themselves who was unwilling to speak.",
    sceneDelta:
      "Wide environmental composition. A dim substrate-layer practice-chamber at twilight — bare stone floor, single overhead skylight throwing a circular pool of cool-cyan moonlight into the chamber's centre. In the moonlight-pool: a single fresh BANISHMENT GLYPH inscribed in chalk on the stone — a complex three-rune cluster in tight concentric arrangement, the outermost rune SOFTLY BURNING with faint cool-violet light (the glyph is freshly cast). Around the glyph's perimeter: a thin ring of fine grey ash (the residue of the banished). NO figure visible — the caster has stepped out of frame. A single piece of charcoal rests on the floor at the glyph's edge, recently set down.",
    moodKeywords: [
      "what is named cannot stay",
      "first thing banished was unwillingness to speak",
      "ring of grey ash at glyph perimeter",
      "charcoal recently set down",
    ],
    palette:
      "Substrate twilight cool-grey + cool-cyan moonlight pool + chalk-glyph pale-cream + cool-violet outermost rune-glow + grey-ash ring + dark stone floor + sourceless dim ambient",
    composition:
      "Wide environmental top-down on chalk-glyph at frame-centre, moonlight-pool defining circular composition, charcoal at frame-edge",
    notes:
      "Rare spell card. The three-rune cluster must read as a complete inscribed pattern but should NOT match any real-world occult notation. The grey-ash ring is the canonical Banishment Glyph signature — it visualizes that something WAS banished, without specifying what. The flavor-text's 'first thing banished is the version of themselves' is the lore key: this card is psychospiritual not necromantic.",
    archetypeRationale:
      "Banishment mechanics are canonical Act 6 (narrativeActs.ts Act 6). Visualizing the freshly-cast glyph + ash-residue grounds the truth/banish gameplay system in a recognizable artifact-of-the-act.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act6 (truth/banish mechanics)",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 6 / Banishment unlock",
    ],
  },
};

export const ACT6_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
