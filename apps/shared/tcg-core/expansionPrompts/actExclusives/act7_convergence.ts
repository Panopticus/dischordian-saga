/**
 * Act 7 — The Convergence exclusive cards (4).
 *
 * Per the 2026-04-27 plan §Act-themed pack exclusives. Act 7 is
 * the campaign capstone: all factions + narrators + Hierarchy
 * converge. The Convergence chord sounds; finale stance choices
 * resolve. Year-Two through Year-N are framed by what happens here.
 *
 * Lore basis: `apps/shared/tcg-core/story/narrativeActs.ts` Act 7 +
 * `docs/built/ALL_ACTS_ROADMAP.md` Act 7 framing +
 * `apps/shared/tcg-core/story/act7OpponentDialog.ts`.
 *
 * Lore boundary: Act 7 contains the campaign's final reveals
 * (Convergence chord identity, Watcher unmasked, finale stance
 * meanings). The plan locks our prompts to Epoch-2-cutoff — meaning
 * these cards must visualize the SHAPE of Act 7's beats while
 * SPECIFICALLY EXCLUDING the canonical reveals. The Convergence
 * sounds; we do not say what the chord IS. The Watcher converges;
 * we do not unmask them. The stance is taken; we do not name it.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "act7_exclusive_mythic_the_convergence": {
    cardId: "act7_exclusive_mythic_the_convergence",
    name: "The Convergence",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Three doors at the start. One chamber at the end. Every Memoirist arrives here. Every Memoirist arrives differently. The Convergence is not the end of the Memoir; it is the Memoir noticing itself for the first time.",
    sceneDelta:
      "Wide environmental composition. The substrate-layer rendered as a vast circular cathedral-chamber at dawn — the chamber's circumference encircled by the THREE DOORS from The Offer (Act 3): signal-green Insurgency LEFT, cool-cyan Empire CENTRE, deep-crimson-and-rust Hierarchy RIGHT — but in Act 7, ALL THREE doors stand OPEN and three different streams of converging color-light pour into the chamber from each door. The three streams meet at the chamber's exact CENTRE, where they BLEND into a tall column of pure WARM-GOLD light reaching from floor to skylight. At the column's base: a single low pedestal with a CLOSED sealed Hierarchy Memoir-volume resting on it (the Memoir is finished). Around the chamber's perimeter: faint silhouettes of figures from every faction — Insurgency operatives, Empire authority, Hierarchy executives — visible only as backlit shapes, none individually identifiable.",
    moodKeywords: [
      "all three doors now open",
      "three streams blend into pure warm-gold",
      "the Memoir is finished and closed",
      "every faction in silhouette, none identifiable",
    ],
    palette:
      "Substrate dawn cool-cream cathedral + signal-green Insurgency stream + cool-cyan Empire stream + deep-crimson-and-rust Hierarchy stream + warm-gold central blend column + Hierarchy Memoir-volume deep-violet + faction-silhouettes backlit deep-charcoal",
    composition:
      "Wide environmental front-on, three doors at frame-edges (left/centre/right), three light-streams converging on frame-centre column, pedestal+Memoir at column-base lower-third, faction silhouettes scattered around chamber perimeter",
    notes:
      "Mythic spell card. CRITICAL lore boundary: the silhouettes around the perimeter MUST be deliberately non-identifiable — do NOT design any silhouette to read as a specific named character (no Watcher, no Source, no Engineer). The three light-streams must be EQUAL in width — Act 7's Convergence does not weight one path over another at the visual level (the player's chosen path is the WHITE-GOLD column, regardless of which door fed it most). The Memoir is CLOSED — finished — as a deliberate frame.",
    archetypeRationale:
      "Anchored to the Act 7 'Convergence' arc canon (narrativeActs.ts Act 7, ALL_ACTS_ROADMAP.md). Direct visual completion of the Three Doors framing introduced in The Offer (Act 3); the campaign's longest visual arc closes in this card.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act7",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 7 — The Convergence",
      "apps/shared/tcg-core/story/act7OpponentDialog.ts",
      "(intra-set) §act3_exclusive_mythic_the_offer — three-door framing closure",
    ],
  },

  "act7_exclusive_epic_all_faction_convergence_field": {
    cardId: "act7_exclusive_epic_all_faction_convergence_field",
    name: "All-Faction Convergence Field",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "epic",
    cardType: "structure",
    flavorText:
      "Insurgency, Empire, Hierarchy, Antiquarian, Dreamer, Architect, Thought Virus — and one Memoirist. Eight presences in a field of unconditional witness. No alliance survives this field. No grudge does, either. Both are, by Act 7, the same problem.",
    sceneDelta:
      "Wide environmental composition. A vast flat substrate plain at twilight, ringed at its edge by the SEVEN canonical faction-banner-poles (each pole tall, flying a single faction-color banner — signal-green Insurgency, deep-crimson Hierarchy / new_babylon, cool-cyan Empire-tower, amber-and-parchment Antiquarian, deep-violet Dreamer, Architect chrome-and-cyan, Thought-Virus toxic-magenta). The seven banners are arranged in a perfect heptagon around the plain's perimeter. At the plain's exact CENTRE: a single small flat stone with a Hierarchy-style sealed Memoir-volume resting on it — the SAME closed Memoir-volume from The Convergence card. The plain itself is empty of figures; the banners are the only marks.",
    moodKeywords: [
      "seven banners in a heptagon",
      "no alliance survives the field, no grudge does either",
      "Memoir on the centre stone",
      "field of unconditional witness",
    ],
    palette:
      "Substrate twilight cool-grey plain + signal-green Insurgency banner + deep-crimson Hierarchy banner + cool-cyan Empire banner + amber-and-parchment Antiquarian banner + deep-violet Dreamer banner + chrome-and-cyan Architect banner + toxic-magenta Thought-Virus banner + Memoir-volume centre deep-violet",
    composition:
      "Wide environmental from low-angle slightly above horizon, seven banner-poles in heptagonal arrangement at frame-perimeter, central stone+Memoir at frame-centre lower-third, twilight sky filling upper two-thirds",
    notes:
      "Epic structure. The seven-banner heptagon is the canonical All-Faction Convergence Field signature. Faction-banner colors must match canonical faction palettes; Architect's chrome-and-cyan is distinct from Empire's pure-cyan to allow both on-frame without conflation. Lore boundary: the centre Memoir must be SEALED/CLOSED — the campaign's central artifact is finished by Act 7.",
    archetypeRationale:
      "Convergence-of-all-factions is canonical Act 7 (ALL_ACTS_ROADMAP.md). Visualizing the seven faction-banners on a field grounds the convergence-mechanic as a structure-card.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act7",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 7 / Convergence",
      "(intra-set) §act7_exclusive_mythic_the_convergence — closed-Memoir continuity",
    ],
  },

  "act7_exclusive_rare_final_witness_pair": {
    cardId: "act7_exclusive_rare_final_witness_pair",
    name: "Final Witness — Bond 100",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "unit",
    flavorText:
      "Bond 100. Both narrators have nothing left to confess. Both narrators have, by mutual recognition, become a single voice with two mouths. The Memoirist, the Memoirist now realizes, has always been listening to one Witness — at least at the end.",
    sceneDelta:
      "Wide composition. The substrate meditation-room from First Witness / Bond 60 / Two Witnesses Meet / Bond 90 — same two facing wooden chairs, same windowless room — fully time-shifted to Bond 100 (final). The Signal-glyph between the chairs has now ASCENDED: it lifts off the floor and hovers at chest-height between Elara and the Human, glowing in a steady white-gold (the final color in the Glyph's progression). Both chairs occupied: Elara left, Human right, both in their canonical tunics with gold cuff-thread. They are NOT looking at each other; instead, BOTH are looking outward, slightly past frame-edge, in the SAME DIRECTION (the canonical Bond 100 framing — the Witnesses now witness the SAME thing, not each other). Hands rest at their own knees, no longer needing the clasp. Faces hold expressions of shared steady recognition. The room's white-gold glyph-light is the dominant source.",
    moodKeywords: [
      "Bond 100 single voice with two mouths",
      "glyph hovers at chest-height white-gold",
      "both look outward in the same direction",
      "no longer need the clasp",
    ],
    palette:
      "Substrate ascended-white ambient + soft-cream Elara tunic with gold cuff-thread + deep-violet Human tunic with gold cuff-thread + white-gold glyph hovering + sourceless dim ambient",
    composition:
      "Wide front-on between the two chairs, both figures at frame-edges seated, glyph hovering at frame-centre at chest-height, both figures' eye-lines parallel and directed past frame-edge",
    notes:
      "Rare unit. Direct visual completion of the dual-narrator card-arc (First Witness → Silent Listening → Two Witnesses Meet → Confessional Hour → Final Witness). The both-look-same-direction framing is the canonical Bond 100 signature — the Witnesses no longer NEED to face each other because they now witness the same thing. The hovering glyph at chest-height visualizes the final unification. Glyph-color progression complete: cyan (Act 1) → cream (Act 2) → gold (Act 4) → deep-violet (Act 6) → white-gold (Act 7).",
    archetypeRationale:
      "Bond 100 is canonical Act 7 (ALL_ACTS_ROADMAP.md §Bond progression / final). Visualizes the campaign's longest visual arc reaching closure as a card the player can hold at end-game.",
    loreCitations: [
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 100 / final",
      "apps/shared/tcg-core/story/narrativeActs.ts:Act7",
      "(intra-set) §act1_exclusive_rare_first_witness — five-card visual arc closure",
      "(intra-set) §act6_exclusive_epic_bond_90 — direct visual sequel",
    ],
  },

  "act7_exclusive_rare_convergence_chord": {
    cardId: "act7_exclusive_rare_convergence_chord",
    name: "The Convergence Chord (Heard, Not Named)",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "spell",
    flavorText:
      "Three notes were the Signal. Twelve sectors were the Map. One chord, at the end, holds them all. The chord cannot be written down. The chord can only be heard. The Memoirist hears it once, and is changed.",
    sceneDelta:
      "Wide environmental composition. The substrate-layer rendered as a horizonless ambient field — no floor, no ceiling, no walls; only soft white-cream luminance in every direction. At the field's exact centre: an ABSENCE of any object whatsoever (deliberate empty centre). Around the empty centre, a faint propagating CONCENTRIC RING-PATTERN of soft-violet-and-warm-gold pulses outward in slow ripples — the chord's auditory signature rendered as visual ripple. Three of the rings are tagged at their leading edge with small floating notation-glyphs (the same three-note glyph from The Signal in Act 1 — visual continuity); the other rings carry NEW glyph-types we have not previously seen (these are the chord's additional notes — left deliberately uncategorized).",
    moodKeywords: [
      "the chord cannot be written down",
      "horizonless ambient field",
      "deliberate empty centre",
      "Signal's three-note glyph + new uncategorized glyphs",
    ],
    palette:
      "Substrate white-cream horizonless ambient + soft-violet ripple-rings + warm-gold ripple-rings + Signal three-note glyph cool-cyan + new uncategorized glyphs warm-amber + sourceless ambient throughout",
    composition:
      "Wide environmental front-on, empty centre at frame-centre, concentric ripple-rings expanding outward to frame-edges, glyph-tags scattered along ring leading-edges",
    notes:
      "Rare spell card. CRITICAL lore boundary: the chord MUST be visualized as 'heard but not named'. The empty centre is the canonical Convergence Chord signature — the chord is the absence-around-which-everything-resonates. The three-note Signal glyph from Act 1 is intentional cross-reference (the chord includes the Signal). The 'new uncategorized glyphs' must be designed as plausibly-musical notation but NOT match any real-world musical or canonical-symbolic tradition; deliberate ambiguity ensures the chord stays unnamed.",
    archetypeRationale:
      "The Convergence chord is canonical Act 7 (narrativeActs.ts). Visualizing the chord as visual-ripple while preserving the canon framing of 'cannot be written down' grounds the final Act 7 mystery as a card the player can hold without spoiling the chord's content.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act7",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 7 / Convergence chord",
      "(intra-set) §act1_exclusive_mythic_the_signal — three-note continuity",
      "(intra-set) §act5_exclusive_mythic_the_map — twelve-sector parallel",
    ],
  },
};

export const ACT7_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
