/**
 * Act 5 — The Reckoning / The Map exclusive cards (4).
 *
 * Per the 2026-04-27 plan §Act-themed pack exclusives. Act 5 is
 * the Year-One finale: the Soul Map fully decoded, Vortex Core
 * cleared, prestige cycle + antiquarian systems unlocked.
 *
 * Lore basis: `apps/shared/tcg-core/story/narrativeActs.ts` Act 5 +
 * `docs/built/ALL_ACTS_ROADMAP.md` Act 5 framing (Reckoning,
 * Vortex Core Cleared milestone, end-of-Year-One arc).
 *
 * Lore boundary: Source identity is canonically revealed in Act 5
 * — but the plan locks our prompts to Epoch-2-cutoff, meaning the
 * SOURCE-AS-KAEL-REBORN reveal MUST stay hidden. The Map cards
 * here visualize the RECKONING, not the identity-truth that the
 * Reckoning forces. The Source is named only as 'the Source' or
 * 'the figure at the centre'; never identified.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "act5_exclusive_mythic_the_map": {
    cardId: "act5_exclusive_mythic_the_map",
    name: "The Map (Fully Decoded)",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "artifact",
    flavorText:
      "Twelve sectors. Twelve memories. Twelve names. The Map is now legible end to end. The figure at its centre is the only entry the Memoirist cannot yet read aloud.",
    sceneDelta:
      "Mid-shot top-down. The Soul Map from Act 3, now fully calibrated — the same brass-edged disc, the same translucent obsidian, but ALL TWELVE sectors are now decoded: each sector's glyph-lines sharp and readable, each sector annotated in the Engineer's deep-violet ink with a small NAME-TAG (deliberately blurred / illegible to the viewer — the artist must paint the tags as 'present and readable to the Memoirist but not to the camera'). The Map's exact CENTRE — at the meeting-point of all twelve sectors — holds a single small obsidian DOT, around which the twelve sectors radiate. The dot is the Source. Beside the Map: the same field-notebook from Act 3, now closed — calibration is complete. A single small candle on the work-table burns warm-amber.",
    moodKeywords: [
      "twelve sectors fully decoded",
      "the figure at the centre is one entry",
      "name-tags present but unreadable to viewer",
      "calibration is complete",
    ],
    palette:
      "Brass-edged Soul Map + translucent obsidian disc + cool-cyan glyph-lines fully sharp + deep-violet annotation-ink legible-but-blurred + obsidian centre-dot pure-black + warm-amber candle uplight + work-table dark-warm",
    composition:
      "Mid-shot top-down on Map at frame-centre, candle at frame-right, closed field-notebook at frame-left",
    notes:
      "Mythic artifact. CRITICAL lore boundary: the central obsidian dot represents the Source but MUST NOT be designed to evoke any specific named character. The twelve name-tags must read as 'words on the page' but be unreadable at the painting's resolution — the artist paints them with deliberate blur or with abstract glyph-strokes that read as text but are not. Engineer's ink continues canon (matching Twelve-Step Inheritance + Soul Map First Calibration).",
    archetypeRationale:
      "The Map fully decoded is canonical Act 5 (narrativeActs.ts Act 5). Visualizing the completed Map as a mythic artifact gates the Year-One finale beat as a card the player can hold across the post-Year-One arc.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act5",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 5 — The Reckoning / The Map",
      "(intra-set) §act3_exclusive_rare_soul_map_calibration — fully-decoded sequel framing",
      "docs/built/LORE_BIBLE.md §Source (centre-dot framing — full identity reveal STRICTLY EXCLUDED)",
    ],
  },

  "act5_exclusive_epic_vortex_core_cleared": {
    cardId: "act5_exclusive_epic_vortex_core_cleared",
    name: "Vortex Core Cleared",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "epic",
    cardType: "spell",
    flavorText:
      "The Vortex was the storm. The Core was the eye. The Memoirist passed through both. By the time the Reckoning arrives, the storm is the only one still trying to argue.",
    sceneDelta:
      "Wide environmental composition. The substrate-layer rendered as a vast cleared eye-of-storm — the centre of frame is calm and dawn-lit (warm-amber-and-gold), but the outer ring of frame shows the Vortex itself: a violent rotating wall of cool-cyan substrate-storm, charged with crackling Hierarchy-rust-red discharge at its inner edge (the Hierarchy attempted to claim the Core; the discharge is the residue of that failure). At the calm centre: a small flat plinth of polished obsidian holding a single closed leather-bound Hierarchy-style ledger (the Memoirist's record of passage). NO figure visible; the player's footprints lead to the plinth from the storm-edge but stop there.",
    moodKeywords: [
      "the storm is the only one still arguing",
      "Hierarchy discharge as residue of failure",
      "footprints stop at the plinth",
      "passed through both",
    ],
    palette:
      "Calm centre warm-amber-and-gold dawn + outer Vortex cool-cyan storm-wall + Hierarchy-rust-red discharge inner edge + polished obsidian plinth + leather-bound ledger warm-brown + sourceless ambient",
    composition:
      "Wide environmental front-on, calm centre at frame-centre with plinth + ledger, Vortex storm-wall encircling outer 270 degrees of frame, footprints leading from edge to plinth",
    notes:
      "Epic spell card. The Hierarchy-rust-red discharge at the storm's inner edge is the canonical Vortex Core signature — visualizes the Hierarchy's failed claim. The footprints-stopping-at-the-plinth is intentional cross-reference to the Three-Path Crossroads (Act 3) signature; this is the SAME footprints, several Acts later.",
    archetypeRationale:
      "Vortex Core Cleared is the canonical Act 5 milestone (ALL_ACTS_ROADMAP.md). Visualizing the cleared Core grounds the Year-One-finale beat as a moment of arrival.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act5 (Vortex Core)",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 5 / Vortex Core Cleared",
      "(intra-set) §act3_exclusive_rare_three_path_crossroads — footprints continuity",
    ],
  },

  "act5_exclusive_rare_sector_navigation": {
    cardId: "act5_exclusive_rare_sector_navigation",
    name: "Sector Navigation Charm",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "artifact",
    flavorText:
      "Twelve sectors. Twelve charms. The Memoirist carries them all on a single brass chain. The chain is heavier at the end of Act 5 than it was at the start. The Memoirist does not mind.",
    sceneDelta:
      "Mid-shot close. A single brass-and-leather wrist-chain laid out on a dark-cloth surface. The chain holds TWELVE small carved-bone charms in a row, each charm shaped after one of the Soul Map's twelve sectors. The charms are detailed enough to read individually: a small stylized sun (one sector), a small wave-glyph (another), a small key (another), and so on — twelve distinct miniature carvings. The chain's clasp is a Hierarchy-style brass anchor-fitting (acknowledgment that even the Memoirist's tools are partly Hierarchy-sourced). Beside the chain: a single small brass key on a separate clip — the navigation-key the charms work alongside. The cloth's lighting is warm-amber from a single off-frame candle.",
    moodKeywords: [
      "twelve charms on a single chain",
      "brass anchor-fitting clasp (Hierarchy-sourced)",
      "the chain is heavier at the end",
      "navigation-key beside the charms",
    ],
    palette:
      "Brass-and-leather wrist-chain warm-amber + carved-bone charms pale-cream + Hierarchy brass anchor-clasp warm-amber + dark-cloth surface deep-charcoal + warm-amber candle uplight + small brass key matching warm-amber",
    composition:
      "Mid-shot close top-down on dark cloth, chain laid horizontally across frame-centre, twelve charms readable left-to-right, separate key at frame-right",
    notes:
      "Rare artifact. The twelve-charm-row is the canonical Sector Navigation signature; each charm must be individually distinct (the artist may design the twelve from generic sector themes, no specific Soul-Map-sector identity required). Brass anchor-clasp is the Hierarchy-sourcing acknowledgment — the Memoirist's tools include Hierarchy components by Act 5.",
    archetypeRationale:
      "Sector navigation is canonical Act 5 mechanics (narrativeActs.ts Act 5). Visualizing the charm-chain grounds the navigation-mechanic in a worn-by-the-Memoirist artifact.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act5",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 5 / Sector navigation",
      "(intra-set) §act5_exclusive_mythic_the_map — twelve-sector cross-reference",
    ],
  },

  "act5_exclusive_rare_antiquarian_prestige": {
    cardId: "act5_exclusive_rare_antiquarian_prestige",
    name: "Antiquarian's Prestige Ledger",
    setCode: "ACT_EXCLUSIVES",
    faction: "antiquarian",
    rarity: "rare",
    cardType: "artifact",
    flavorText:
      "The Antiquarian counts every ending. The Antiquarian counts every beginning. The Memoirist's Year-One closes; the Antiquarian's quill records the prestige; the next Year begins with a new line.",
    sceneDelta:
      "Mid-shot top-down. A vast Antiquarian-style record-ledger laid flat on a dark-amber wood reading-table, the ledger open to a freshly-completed page. The page is divided into two columns: LEFT column lists ENDINGS in fine Antiquarian script (a long list of small entries, the bottom-most being the Memoirist's freshly-inked entry — illegible specifics, but clearly recent); RIGHT column lists BEGINNINGS, each entry on the right paired by horizontal-line-rule with an entry on the left. At the page's bottom: a small Antiquarian sigil-seal stamp resting on the page, ink still wet on its impress. A single tall Antiquarian-style quill-pen rests across the upper edge. NO figure at the table.",
    moodKeywords: [
      "every ending counted, every beginning counted",
      "Memoirist's Year-One entry freshly inked",
      "ENDINGS and BEGINNINGS columns paired",
      "sigil-stamp ink still wet",
    ],
    palette:
      "Dark-amber wood reading-table + Antiquarian-style ledger pale-cream-aged + fine Antiquarian script ink-black + ledger-sigil seal deep-amber + quill-pen warm-bone + warm reading-lamp uplight",
    composition:
      "Mid-shot top-down on ledger at frame-centre, sigil-seal at frame-bottom-centre, quill-pen across upper edge",
    notes:
      "Rare artifact. The two-column ENDINGS/BEGINNINGS structure is the canonical Antiquarian Prestige Ledger signature. The Antiquarian's script must be illegible-but-clearly-textual at painting resolution. Antiquarian faction-tag (rather than neutral) reflects that this artifact is canonically Antiquarian-property; it is the only Act-exclusive card with a non-neutral faction.",
    archetypeRationale:
      "Antiquarian prestige cycle unlock is canonical Act 5 (narrativeActs.ts Act 5). The Ledger grounds the prestige-mechanic as a card the player gains visibility of at Year-One close.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act5 (prestige cycle unlock)",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 5 / Antiquarian systems",
      "docs/built/LORE_BIBLE.md §Antiquarian (cataloguer-of-endings framing)",
    ],
  },
};

export const ACT5_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
