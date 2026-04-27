/**
 * Act 3 — The Offer / Eyes in the Dark exclusive cards (4).
 *
 * Per the 2026-04-27 plan §Act-themed pack exclusives. Act 3 is the
 * pivotal turn-point: the Hierarchy formally enters the campaign
 * via Ith'Rael scouts, the Soul Map activates, Rylloh reconnaissance
 * begins, and the player is presented with the Loyalty Pledge —
 * the canonical three-path choice (Insurgency / Empire / Hierarchy).
 *
 * Lore basis: `apps/shared/tcg-core/story/narrativeActs.ts` Act 3 +
 * `docs/built/ALL_ACTS_ROADMAP.md` Act 3 framing +
 * `docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` (Ith'Rael
 * scouts, Soul Map activation, Rylloh recon).
 *
 * Faction policy: Act 3 introduces the three-path choice — the
 * Offer (mythic) and Three-Path Crossroads (rare) are NEUTRAL
 * (player has not pledged yet); Ith'Rael Scouting Party reads
 * Hierarchy-aligned via Hierarchy faction (new_babylon); Soul Map
 * Calibration is neutral (the artifact predates pledge).
 *
 * Lore boundary: Epoch-2 cutoff respected. Hierarchy entry is
 * canon as of Act 3; specific Acts 4-7 reveals (Witnesses meet,
 * Source identity, etc) MUST stay hidden.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "act3_exclusive_mythic_the_offer": {
    cardId: "act3_exclusive_mythic_the_offer",
    name: "The Offer",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "mythic",
    cardType: "spell",
    flavorText:
      "Three doors. Three signatures already drafted. Three lives the Memoirist might still live. The Hierarchy did not bring the offer — the Hierarchy noticed the offer had always been there and brought the contract.",
    sceneDelta:
      "Wide environmental composition. A vast ceremonial threshold-chamber at the substrate layer — a circular stone floor inscribed with three concentric rings, three tall stone doorframes spaced equidistantly around the chamber's circumference. The LEFT doorframe glows soft signal-green (Insurgency); the CENTRE doorframe glows pure-cool-cyan (Empire / New Babylon authority); the RIGHT doorframe glows deep-crimson with rust-red veins (Hierarchy). At the chamber's centre: a low obsidian altar holding a single open Hierarchy contract-folio with three distinct signature-lines visible (each line marked with the same Memoirist's name — already drafted on all three). A Hierarchy-style ceremonial pen rests across the folio. NO figures present in the chamber — the choice is the player's, and the chamber renders as deliberately empty.",
    moodKeywords: [
      "three doors, three drafted signatures",
      "the contract was always there",
      "Hierarchy noticed first",
      "empty chamber awaiting choice",
    ],
    palette:
      "Substrate stone-grey chamber + signal-green Insurgency doorframe + cool-cyan Empire doorframe + deep-crimson-and-rust Hierarchy doorframe + obsidian altar + warm-amber pen catching faint light",
    composition:
      "Wide environmental front-on, three doorframes arranged 120-degrees apart on chamber circumference, central altar at frame-foreground with open folio + pen, three concentric ring-floor visible",
    notes:
      "Mythic spell card. The three-doorframe color-coding is the canonical Three-Path signature — colors must match the established faction palettes (Insurgency green, Empire/New Babylon cyan, Hierarchy crimson-and-rust). The drafted-signatures-already on all three lines is the Offer's lore-key: the player IS being chosen, not just choosing. The deliberate emptiness is essential: this is the moment of decision, not the consequence.",
    archetypeRationale:
      "Direct visualization of the Act 3 Loyalty Pledge canonical three-path choice (plan §5 Faction commitment, narrativeActs.ts Act 3, ALL_ACTS_ROADMAP.md). The Offer is the most-significant single beat of Act 3; mythic-tier ensures it lands as a face-card moment.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act3",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 3 — Eyes in the Dark / The Offer",
      "docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md §Loyalty Pledge / three-path choice",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §5 Faction commitment",
    ],
  },

  "act3_exclusive_epic_ithrael_scouts": {
    cardId: "act3_exclusive_epic_ithrael_scouts",
    name: "Ith'Rael Scouting Party",
    setCode: "ACT_EXCLUSIVES",
    faction: "new_babylon",
    rarity: "epic",
    cardType: "unit",
    flavorText:
      "Three Ith'Rael at the threshold. They do not breach. They do not even approach. They observe — at exactly the distance from which observation cannot be mistaken for intent. The Hierarchy has been here for hours.",
    sceneDelta:
      "Mid-shot composition. The substrate-edge of the campaign-world rendered as a misted twilight ridge-line. At mid-distance on the ridge: three Hierarchy Ith'Rael scouts in matching dark-charcoal-and-rust scout-armor — slim helmeted figures, faces concealed by visor-masks tinted with faint Hierarchy crimson, each carrying a slim Hierarchy field-instrument (one a recording-rod, one a small folded mapping-board, one a long-form spotting-scope). The three are spaced at irregular intervals along the ridge — deliberate non-formation, each holding STILL in mid-observation pose. Faint Hierarchy crimson ambient glow on their visor-edges. The mist between viewer and ridge reads as substrate-fog (not weather).",
    moodKeywords: [
      "three Ith'Rael at exactly observing-distance",
      "non-formation deliberately spaced",
      "the Hierarchy has been here for hours",
      "visors tinted faint crimson",
    ],
    palette:
      "Substrate twilight cool-grey + dark-charcoal-and-rust scout-armor + faint Hierarchy crimson visor-tint + misted-ridge muted-grey + Hierarchy field-instrument matte-black + sourceless dim ambient",
    composition:
      "Mid-shot composition, three figures at frame-mid-distance arrayed along ridge-line at irregular intervals, mist-foreground in lower-third, ridge-and-sky background",
    notes:
      "Epic unit. The non-formation spacing is the canonical Ith'Rael Scouts signature — deliberate, observed, professional. Visor-mask tinting must read as Hierarchy crimson but FAINT (these are scouts, not officers; the colour signals affiliation without announcing presence). Field-instruments must read as observation-tools, never weapons (lore boundary: Ith'Rael scouts in Act 3 are reconnaissance only).",
    archetypeRationale:
      "Anchored to canon: Ith'Rael scouts are the Hierarchy's formal entry-point in Act 3 (DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md). Visualizing them at observing-distance is the Act 3 turn-point made tangible — the Hierarchy has been watching since before the player noticed.",
    loreCitations: [
      "docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md §Ith'Rael scouts (Act 3 entry)",
      "apps/shared/tcg-core/story/narrativeActs.ts:Act3",
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation (Hierarchy intelligence framing)",
    ],
  },

  "act3_exclusive_rare_three_path_crossroads": {
    cardId: "act3_exclusive_rare_three_path_crossroads",
    name: "Three-Path Crossroads",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "spell",
    flavorText:
      "Insurgency. Empire. Hierarchy. Each path is a different price; each path is a different kind of victory; each path is, in its own way, a kind of refusal.",
    sceneDelta:
      "Wide environmental composition. A wide stone crossroads at substrate-twilight with three diverging paths radiating outward from the centre point. The LEFT path leads into a forest of dim signal-green (Insurgency wilderness); the CENTRE path leads up a slope toward a pure-cool-cyan tower-spire on the horizon (Empire / New Babylon citadel); the RIGHT path leads down into a deep-crimson valley lit by Hierarchy rust-red sconces. Centre of frame: a single tall WAYMARKER stone with three engraved arrows, each arrow's etching glowing faintly in its respective path's color. NO figure is at the crossroads; a single set of footprints stops at the waymarker — the player's footprints, recorded but not yet committed. The sky is even-twilight across all three directions; no path is yet brighter than the others.",
    moodKeywords: [
      "three paths, three prices, three refusals",
      "footprints stop at the waymarker",
      "no path yet brighter than the others",
      "even-twilight sky, choice not yet made",
    ],
    palette:
      "Substrate twilight stone-grey + signal-green Insurgency forest + cool-cyan Empire tower-spire + deep-crimson Hierarchy valley + waymarker arrows three-color etched + sourceless ambient",
    composition:
      "Wide environmental from low-angle behind the waymarker, three paths radiating outward into background, footprints at waymarker base",
    notes:
      "Rare spell card. Companion to The Offer (mythic) at the rare tier — The Offer is the chamber of decision; Three-Path Crossroads is the moment of approach. The footprints-stopping-at-the-waymarker is the canonical Crossroads signature; visualizes the player's pause before commitment. Color matching with The Offer's three doorframes is intentional (set-internal cross-reference).",
    archetypeRationale:
      "Companion-piece to The Offer (mythic). The Offer is the formal contract; the Crossroads is the moment of arrival at the choice. Two cards visualizing the same Act 3 beat from two different framings — formal vs personal.",
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act3",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 3 / three-path Loyalty Pledge",
      "(intra-set) §act3_exclusive_mythic_the_offer — companion-piece pairing",
    ],
  },

  "act3_exclusive_rare_soul_map_calibration": {
    cardId: "act3_exclusive_rare_soul_map_calibration",
    name: "Soul Map — First Calibration",
    setCode: "ACT_EXCLUSIVES",
    faction: "neutral",
    rarity: "rare",
    cardType: "artifact",
    flavorText:
      "Twelve sectors observable. Three sectors decoded. Nine still scrambled. The Soul Map activates by listening, not by looking. The first calibration is the longest. The remaining ones are, the Engineer's notes assure, easier.",
    sceneDelta:
      "Mid-shot top-down. A small alchemist's-style work-table at the substrate layer holding a single circular Soul Map — a brass-edged disc about the size of a dinner plate, its surface a translucent obsidian sheet on which TWELVE sector-divisions are etched in fine cool-cyan glyph-lines. Three of the twelve sectors are visibly DECODED (their glyphs sharp, readable, with small annotated tags drawn beside in deep-violet ink — pencilled in the Engineer's hand). The other nine sectors are scrambled-cyan static, the glyph-lines blurred and shifting. Beside the Map: a thin field-notebook open to a calibration-procedure page. A small obsidian tuning-rod rests across the Map's top, the rod's tip pointing at the boundary between decoded and scrambled sectors. NO figure visible at the table.",
    moodKeywords: [
      "twelve sectors, three decoded",
      "calibration by listening, not looking",
      "Engineer's hand on the annotations",
      "tuning-rod at the boundary",
    ],
    palette:
      "Brass-edged Soul Map + translucent obsidian disc + cool-cyan glyph-lines + scrambled-cyan static (nine sectors) + deep-violet annotation-ink (Engineer's hand) + warm field-notebook cream + warm work-table uplight",
    composition:
      "Mid-shot top-down on work-table, Soul Map at frame-centre, field-notebook at frame-left, tuning-rod across Map top-edge",
    notes:
      "Rare artifact. The twelve-sector / three-decoded ratio is the canonical Soul Map First Calibration signature — Act 3 is when the Map becomes USEFUL but still remains mostly-encrypted. Engineer's annotation-ink is in deep-violet (matching The Twelve-Step Inheritance from Act 1) — same hand, signal of continuity. Lore boundary: do NOT decode any of the nine scrambled sectors visually — those are Acts 4-7 unlock content.",
    archetypeRationale:
      "Anchored to canon: the Soul Map activation is Act 3 (DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md). Visualizing the partial calibration is the Act 3 turn-point made into an artifact-card the player can hold across the act-arc.",
    loreCitations: [
      "docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md §Soul Map (Act 3 activation)",
      "apps/shared/tcg-core/story/narrativeActs.ts:Act3",
      "(intra-set) §act1_exclusive_epic_twelve_step_inheritance — same Engineer's-hand ink continuity",
    ],
  },
};

export const ACT3_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
