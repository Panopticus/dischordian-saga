/**
 * Battle Pass tier-50 alt-art mythic — "The Author".
 *
 * Per the 2026-04-27 plan §6 Collector hook §6 (Battle Pass
 * exclusive). Tier 50 is the season's cap; the alt-art "Author"
 * card is the season's signature reward.
 *
 * Faction: neutral. Rarity: cosmetic alt-art mythic. Companion to
 * Founding Author (week-1 commitment) and Author's Edition (set-
 * completion mastery) — completes the three-card meta-author
 * cosmetic-tier triptych.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "special_battle_pass_t50_author": {
    cardId: "special_battle_pass_t50_author",
    name: "The Author (Battle Pass S1 Tier 50)",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Fifty tiers. Fifty completed weeks. Fifty small additions to the Memoir. The Author is what the Memoirist becomes once they have written every chapter the season offered — and noticed which chapter the season did not.",
    sceneDelta:
      "Mid-shot composition. A modest Memoirist's writing-room at substrate-twilight — a small oak desk, a single warm-amber desk-lamp, a window behind looking out onto a cool-cyan substrate-evening. The desk holds: a HALF-FILLED Memoir-volume, open and inked — the LEFT page complete, the RIGHT page mid-paragraph (the season's writing in progress). A small bound stack of FIFTY weekly-issue parchments rests at the desk's left edge, bound by a single brass-and-leather strap (the season's tier-progression made physical). Beside the open volume: an antique brass-and-bone quill resting at the page-margin (paused mid-stroke, the Memoirist has stepped away). NO figure visible. A single Hierarchy-style chair sits empty behind the desk.",
    moodKeywords: [
      "fifty tiers, fifty weeks, fifty small additions",
      "left page complete, right page mid-paragraph",
      "stack of fifty weekly-issue parchments",
      "Memoirist has stepped away",
    ],
    palette:
      "Substrate twilight cool-cyan window-light + warm-amber desk-lamp + oak desk warm-brown + cream Memoir page + brass-and-leather binding-strap + bone-and-brass quill + Hierarchy chair charcoal-and-cream + cool-cream room-walls",
    composition:
      "Mid-shot front-on, desk at frame-centre, open Memoir at desk-foreground, fifty-parchment stack at frame-left, empty chair partially visible at frame-rear behind desk, window at frame-rear filling upper-third",
    notes:
      "Cosmetic mythic spell. The fifty-parchment stack with brass-and-leather strap is the canonical BP-50 Author signature — visualizes the season's tier-progression as a physical artifact. Empty chair + paused quill is intentional — the Memoirist (the player) IS the Author and is currently away from the desk, having earned tier 50 through their actual play across the season.",
    archetypeRationale:
      "Plan §6 Collector hook §6 (Battle Pass S1 Tier 50). Cosmetic-tier reward for sustained season-engagement; completes the three-card meta-author cosmetic triptych alongside Founding Author + Author's Edition. The half-filled Memoir reflects the Battle Pass's ongoing-throughout-season nature.",
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §6 (Battle Pass tie-in)",
      "apps/shared/battlePassConfig.ts (Battle Pass tier scaffolding)",
      "(intra-set) §special_founding_author + §special_authors_edition_s2 — meta-author cosmetic-tier triptych",
    ],
  },
};

export const BATTLE_PASS_T50_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
