/**
 * Card art prompts — NEW BABYLON faction character cards.
 *
 * The New Babylon-faction cards extend the New Babylon Allegiance set's
 * visual language to the broader cast: Adjudicator Locke, Akai Shi (at
 * her contemporary battle-scale), The Authority (the merged-six-citizens
 * living computer), The Human (at his Architect-agent prior career),
 * Vexahlia, Fenra Moon-Tyrant, the Senatorial bureaucracy, and the
 * commercial/political-finance apparatus.
 *
 * Visual language (consistent with New Babylon Allegiance set):
 *   - palette: New Babylon warm-leather + brass + cream-and-amber
 *     marble + warm-gold accents + cool slate trade-floors +
 *     warm sodium-light
 *   - environments: New Babylon trading-floors, Senate chambers,
 *     adjudicator's offices, syndicate back-rooms, citadel walls,
 *     debt-collector courts, marble councils
 *   - signature visual idioms: brass-and-glass scales of judgment,
 *     warm-leather Adjudicator coats, signal-coin currency-glints,
 *     cool slate trade-floor patterns, marble columns
 *   - faces: mercantile-shrewd, weary-judicial, pragmatic — New
 *     Babylon's people carry the cost of the city's commerce visibly
 *
 * Spoiler-discipline (CRITICAL):
 *   - The Human (s1_char_033) is rendered at his Architect-agent prior
 *     career — visual continuity preserved with The Human Imprint set
 *     (canonical café-figure features) but transposed into Mechronis
 *     Academy / Architect-agent context. NO confirmation of his Twelfth
 *     Archon end-of-Epoch-2 status here (this card depicts the BEFORE).
 *   - Akai Shi (s1_char_003) preserves visual continuity with her
 *     Imprint set (Insurgency-aligned but contemporary battle-scale).
 *
 * Lore boundary: Epoch 2. See `types.ts` LORE BOUNDARY section.
 */

import type { CardArtPrompt } from "./types";

const NEW_BABYLON_PROMPTS_LIST: readonly CardArtPrompt[] = [
  {
    cardId: "gen_new_babylon",
    sceneDelta:
      "Wider mid-shot. Adjudicator Locke as the player's general — female-presenting figure in mid-forties, generic-shrewd-judicial features (sharp single-eyed gaze, slight knowing smile, weathered cheekbones), wearing a deep warm-leather Adjudicator's coat over a cream-and-brass-edged under-tunic. CRITICAL canonical detail: her LEFT EYE is covered by a small chrome-and-warm-leather EYE-PATCH (the canonical 'lost an eye in a deal that went wrong' visualization). Her right eye is intelligent, alert. She stands at the centre of a New Babylon trading-floor at frame-centre, both hands clasped behind her back. Behind her, multiple anonymous traders work at brass-and-glass trade-stations in mid-distance. A small chrome scales-of-judgment pendant at her throat catches warm sodium-light. Her face is composed — won't say which deal, won't say which eye.",
    moodKeywords: [
      "lost an eye in a deal that went wrong",
      "won't say which deal",
      "won't say which eye",
      "shrewd-judicial single-eyed gaze, eye-patch on left",
    ],
    palette:
      "Deep warm-leather Adjudicator's coat + cream-and-brass-edged under-tunic + chrome-and-warm-leather eye-patch + chrome scales-of-judgment pendant + New Babylon trading-floor + brass-and-glass trade-stations + warm sodium-light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Locke at frame-centre on trading-floor, anonymous traders at mid-distance",
    notes:
      "General card. Visual continuity with Locke Imprint set (same character at general-scale). The eye-patch is the canonical 'lost an eye' detail — rendered consistently across all Locke renderings.",
  },
  {
    cardId: "s1_char_001",
    sceneDelta:
      "Mid-shot. Adjudicator Locke at battle-scale — same canonical features as gen_new_babylon (mid-forties female, eye-patch on left eye, deep warm-leather Adjudicator's coat) but rendered in MID-NEGOTIATION posture: she stands at frame-centre at a small trade-table, mid-action of EXTENDING ONE HAND across the table toward an anonymous deal-partner (only the partner's hand visible at frame-right edge, generic-cool-leather sleeve). Her hand carries a small chrome-and-brass DECISION-TOKEN. Her face shows enigmatic-piercing intelligence (the canonical 'piercing intelligence and enigmatic presence' rendering). Faint warm provoke-glow rims her shoulders. Behind her, a quiet New Babylon adjudicator's office at lower-third (warm-leather chairs, a brass-and-glass scales-of-judgment on a low shelf).",
    moodKeywords: [
      "piercing intelligence and enigmatic presence",
      "controversial figure in the city's labyrinthine politics",
      "mid-negotiation extending decision-token",
      "enigmatic-piercing single-eyed gaze",
    ],
    palette:
      "Deep warm-leather Adjudicator's coat + cream-and-brass-edged under-tunic + chrome-and-warm-leather eye-patch + chrome-and-brass decision-token + warm provoke-rim + warm New Babylon adjudicator's office + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Locke at frame-centre at trade-table, anonymous deal-partner's hand at frame-right edge",
    notes:
      "Uncommon unit. Visual continuity with gen_new_babylon (same Locke). Anonymous deal-partner preserves no-character-conflation. The 'piercing intelligence' is rendered as the active single-eyed gaze across the table.",
  },
  {
    cardId: "s1_char_003",
    sceneDelta:
      "Action mid-shot. Akai Shi at battle-scale — female-presenting figure in mid-thirties, generic-fierce features (sharp dark eyes, focused expression, dark hair tied back), in dark Insurgency-aligned-and-Architect-trained combat-leathers (canonical hybrid: she trained under Architect masters but allied with Insurgency) — slate-and-deep-crimson tactical garments. Her face has the canonical Akai Shi defining feature: a small chrome-and-deep-crimson Potentials-glyph at her left temple (the 'revered member of the Potentials' mark). She is mid-action of strike with a long curved-blade weapon (chrome-and-deep-crimson edge), the strike caught at the apex of motion. Faint warm pierce-glow rims the blade-tip (pierce keyword). Behind her, fragments of a recently-restored balance — debris of dispersed corrupted-substance dissolving in cool-cyan light. The setting is a Fall-of-Reality post-cataclysm aftermath.",
    moodKeywords: [
      "revered member of the Potentials",
      "emerged to restore balance in the universe after the Fall of Reality",
      "small chrome-and-deep-crimson Potentials-glyph at left temple",
      "mid-strike with chrome-and-deep-crimson curved-blade",
    ],
    palette:
      "Slate-and-deep-crimson combat-leathers + chrome-and-deep-crimson Potentials-glyph at left temple + chrome-and-deep-crimson curved-blade + warm pierce-glow + dispersed corrupted-substance + cool-cyan dissolution-light + post-cataclysm aftermath",
    composition:
      "Action mid-shot side three-quarter, Akai Shi at frame-centre mid-strike, post-cataclysm aftermath behind",
    notes:
      "Epic unit. Visual continuity with Akai Shi Imprint set (same character at battle-scale). The Potentials-glyph at left temple is the canonical defining feature. Generic-fierce features must NOT match Agent Zero's distinct scarred-cheek visualization (different specific archetype).",
  },
  {
    cardId: "s1_char_020",
    sceneDelta:
      "Wider mid-shot. The Authority of New Babylon — at frame-centre, a vast living-computer chamber filling the frame: SIX TRANSLUCENT HUMANOID FIGURES suspended at varying heights within a tall chrome-and-warm-cream computational-vault (each figure visible behind translucent vault-substance, each in mid-action of computational-thought — eyes half-closed, hands extended in computation-gestures). The six are visibly DIFFERENT from each other (different ethnicities, ages, body-types — diversity of merged citizens). Their consciousnesses are CONNECTED via translucent silver-mist computation-threads weaving between them. From the central convergence-point (where all six threads meet), faint translucent warm-cream JUDGMENT-PULSES propagate outward — the absolute-fairness governance made visible. Faint warm provoke-glow rims the entire chamber. NO single dominant face — the Authority is collective.",
    moodKeywords: [
      "formed by merging the consciousnesses of six chosen citizens",
      "into a living computer",
      "designed to govern New Babylon with absolute fairness",
      "six translucent figures connected via computation-threads",
    ],
    palette:
      "Chrome-and-warm-cream computational-vault + six translucent suspended humanoid figures + diverse ethnicities/ages/body-types + translucent silver-mist computation-threads + warm-cream judgment-pulses + warm provoke-rim + cool deep-shadow",
    composition:
      "Wider mid-shot, vault chamber filling frame, six figures arrayed at varying heights, threads converging at central point",
    notes:
      "Rare unit. CRITICAL distinction from gen_authority (Architect-faction tribunal): this is the NEW BABYLON Authority — the literal merged-six-citizens computational-government. Generic-diverse citizens preserve no-character-conflation. The 'absolute fairness' is rendered through the visible diversity of the merged six.",
  },
  {
    cardId: "s1_char_033",
    sceneDelta:
      "Mid-shot. The Human at his Architect-agent career stage — male-presenting figure in late-thirties (younger than the Imprint set's café-figure rendering, who was canonically aged-by-time), generic-ordinary middle-class features (deliberately unremarkable), in formal Mechronis Academy graduate's coat (cool-cream linen with chrome Academy-emblem at the breast and a small chrome-and-cool-cyan Architect-most-trusted-agent badge at the lapel). He stands in a quiet Architect-administrative office at frame-centre, mid-action of REVIEWING a small case-file in his hands. His face is composed-deliberate, ordinary-attentive. Behind him, an Architect-administrative archive in cool-cyan-and-chrome architecture extends. NO café-table visible (the canonical Imprint-environment is NOT yet his) — this is BEFORE.",
    moodKeywords: [
      "after graduating from Mechronis Academy",
      "served for centuries as the Architect's most trusted agent",
      "younger than the café-figure Imprint rendering",
      "Mechronis Academy graduate's coat with most-trusted-agent badge",
    ],
    palette:
      "Mechronis Academy cool-cream linen graduate's coat + chrome Academy-emblem + chrome-and-cool-cyan most-trusted-agent badge + Architect-administrative office + cool-cyan-and-chrome architecture + warm low office-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, The Human at frame-centre reviewing case-file, Architect-administrative archive behind",
    notes:
      "Epic unit. CRITICAL: this is The Human at his EARLIER career stage (BEFORE the Imprint set's café-figure rendering — canonically he served for centuries before defecting). Visual continuity with Imprint features (generic-ordinary middle-class) but younger + Architect-agent context. The Mechronis Academy graduate's coat + agent-badge are canon-direct from flavor. NO café-environment (preserves the BEFORE-state); his end-of-Epoch-2 Twelfth Archon status NOT confirmed here.",
  },
] as const;

/**
 * New Babylon faction's prompt registry, keyed by card id.
 *
 * Currently populated: 5 / 52 cards
 * (gen_new_babylon, s1_char_001, s1_char_003, s1_char_020,
 *  s1_char_033).
 */
export const NEW_BABYLON_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(NEW_BABYLON_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
