/**
 * Founder's Bundle — Founding Author 1-of-N alt-art mythic.
 *
 * Week-1-only Founding Week reward. Per the 2026-04-27 plan the
 * Founder's Bundle (4000 DT / $119.99) ships a serialized alt-art
 * mythic + permanent profile badge + animated 'Founding Author'
 * title + +20% pity buff (30 days). This card is the alt-art.
 *
 * Each card carries a unique 1-of-N serial number (assigned at
 * grant time, post-Sprint-2). The art canvas is the same for
 * every serial; the serialization shows in the framing border, not
 * in the central composition.
 *
 * Rarity policy: alt-art "mythic" — paralleling existing mythic-
 * tier rarity but flagged as cosmetic. Faction: neutral (the
 * Founder concept is meta-narrative, predates faction-pledge).
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "special_founding_author": {
    cardId: "special_founding_author",
    name: "The Founding Author",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Some Memoirists arrive after the story has begun. Some Memoirists arrive before the story has been written. The Founding Author is — in the formal Hierarchy record — both. The serial number on the lower-edge of this card is, by Hierarchy decree, irreproducible.",
    sceneDelta:
      "Wide environmental composition. A grand silent ARCHIVE-ROOM at substrate-dawn — vaulted ceiling, marble floor inscribed with the seven-faction heptagon (matching All-Faction Convergence Field from Act 7), walls lined floor-to-ceiling with bound Memoir-volumes in deep-violet-and-cream. At frame-centre: a single Founder's Pedestal — taller and more ornate than any other in the campaign, an obsidian-and-brass-edged stand bearing a single open BLANK Memoir-volume (the page is uninked, awaiting the Founding Author's first stroke). Resting across the open page: a single antique writing-quill of carved-bone and brass. A faint warm-gold spotlight illuminates the pedestal from above; the rest of the chamber is in soft cool-cream ambient. NO figure visible. The Founding Author IS the player; the Memoir IS unwritten.",
    moodKeywords: [
      "Founding Author both before and after the story",
      "blank page on the Founder's Pedestal",
      "antique bone-and-brass quill",
      "irreproducible serial",
    ],
    palette:
      "Substrate dawn cool-cream ambient + warm-gold pedestal spotlight + obsidian-and-brass pedestal + blank Memoir-volume cream + bone-and-brass quill warm-amber + Memoir-shelf walls deep-violet-and-cream + marble floor pale-stone-grey",
    composition:
      "Wide environmental front-on, pedestal at frame-centre lower-third, Memoir-shelf walls encircling background, vaulted ceiling visible at upper-frame, faint heptagon floor-inscription readable in foreground stone",
    notes:
      "Cosmetic mythic spell. The blank page is the canonical Founding Author signature — the Founder writes their OWN Memoir; the pedestal awaits. Serial number rendering: at print time, render serial in small fine type at the lower-frame edge inside a narrow cream-and-gold border (NOT centered in composition). Lore boundary: NO figure ever permitted on this card; every Founding Author's serial is unique but the central scene is identical.",
    archetypeRationale:
      "Plan §6 Collector hook §1 (Founder's Bundle). Cosmetic-tier reward for week-1 commercial commitment; the meta-narrative framing ('Founding Author') is canonically the player's role at the Hierarchy's record-level. Pairs with the Author's Edition (set-completion) and BP-50 Author cards as the three meta-author cosmetic tiers.",
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §1 (Founder's Bundle)",
      "(intra-set) §act7_exclusive_epic_all_faction_convergence_field — heptagon-floor cross-reference",
      "(intra-set) §act7_exclusive_mythic_the_convergence — closed-Memoir contrast (Founding's is OPEN/blank)",
    ],
  },
};

export const FOUNDING_AUTHOR_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
