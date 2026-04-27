/**
 * Author's Edition — set-completion master alt-art mythic.
 *
 * Per the 2026-04-27 plan §6 Collector hook §3 (set completion):
 * 100% S2_HIERARCHY collection unlocks the Author's Edition. The
 * companion Author's Edition for S1_MEMOIR completion is granted
 * separately at S1 100%; this prompt covers the S2 master version.
 *
 * Serialized like the Founder's Bundle but at a smaller scale (one
 * per master-collector rather than one per Founding Week buyer).
 * Faction: neutral. Rarity: cosmetic alt-art mythic.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "special_authors_edition_s2": {
    cardId: "special_authors_edition_s2",
    name: "The Author's Edition (S2 Master)",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Eighty-four entries collected. Eighty-four corners of the corporate hell catalogued. The Author's Edition is the Memoirist's annotated master — bound in Hierarchy plum-and-charcoal with hand-lettered marginalia in the Memoirist's own ink. The Hierarchy has not authorized this binding. The Hierarchy will, the Memoirist notes, fail to find a way to revoke it.",
    sceneDelta:
      "Mid-shot top-down. A vast Hierarchy-style oak-and-leather binding-table holding ONE single bound master-Memoir-volume — the Author's Edition. The volume is OPEN to a centre-spread that contains a complete miniature reproduction of the S2_HIERARCHY corporate org-chart: at the top, the Hierarchy crest with Mol'Garath's name; below, seven small-portrait C-Suite tiles; below those, cascading downward, the seven VP tiles, fourteen Director tiles, and so on through the Manager / Analyst / Intern tiers — in nested fan-shape descending the page (deliberately rendered too-small-to-read-individually but clearly hierarchical). In the margin: the Memoirist's HAND-LETTERED ANNOTATIONS in deep-violet ink (the same Engineer's-hand ink from across the Memoir). The annotations are illegible-but-clearly-textual. Beside the volume: a brass-and-bone quill, a small inkwell of deep-violet, and a single tiny serial-stamp (showing as much serial-readable visualization as the Founder's Bundle's lower-edge framing).",
    moodKeywords: [
      "eighty-four corners catalogued",
      "Hierarchy crest at top, Intern tiles at bottom",
      "Memoirist's marginalia in deep-violet ink",
      "Hierarchy will fail to revoke",
    ],
    palette:
      "Hierarchy plum-and-charcoal binding + cream Memoir page + cascading org-chart deep-violet + Memoirist marginalia deep-violet ink + warm-amber binding-table uplight + brass-and-bone quill + small serial-stamp brass",
    composition:
      "Mid-shot top-down on binding-table at frame-centre, open Memoir-spread filling frame-centre two-thirds, quill+inkwell+serial-stamp at frame-foreground edges",
    notes:
      "Cosmetic mythic spell. The cascading org-chart MUST be rendered too-small-to-read-individually — the structure must be visible (clearly hierarchical) but no specific tile readable. This protects the future addition of cards to S2 + ensures the artist doesn't need to perfectly identify every existing entry. Marginalia ink = same deep-violet as the Engineer's-hand annotations on the Soul Map (Acts 3 + 5) and Twelve-Step Inheritance (Act 1) — set-internal continuity.",
    archetypeRationale:
      "Plan §6 Collector hook §3. Cosmetic-tier reward for completionists; the visual hook is the player's annotated MASTERY of the entire set — every tier, every entry, with personal commentary. Pairs with Founding Author + BP-50 as the three meta-author cosmetic tiers.",
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §3 (set-completion)",
      "(intra-set) §act3_exclusive_rare_soul_map_calibration + §act5_exclusive_mythic_the_map — same deep-violet Engineer-hand ink continuity",
      "(intra-set) §act1_exclusive_epic_twelve_step_inheritance — marginalia-ink continuity",
      "S2_HIERARCHY 84-card org-chart — covered by hierarchy/csuite + vps + directors + managers + analysts + interns",
    ],
  },
};

export const AUTHORS_EDITION_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
