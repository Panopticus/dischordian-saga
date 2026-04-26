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
  {
    cardId: "s1_char_061",
    sceneDelta:
      "Wider mid-shot. Riri'Ahlia the Taskmaster — a tall non-human Hierarchy COO at frame-centre, body composed of dense charcoal-and-deep-crimson chitin-substance, six powerful articulated arms extending outward (the canonical six-arms detail), each arm holding a different Blood-Weave tactical-instrument (a chrome-and-deep-crimson commander's-baton, a brass-and-glass dimensional-tracker, a curved deep-crimson tactical-blade, a chrome-and-cool-violet communications-gauntlet, a chrome ledger-tablet, an empty grasping-hand). Her face is a long-jawed deep-charcoal demonic-aristocrat profile with three eye-points arranged vertically (deeper-crimson eye-points). She stands at a multi-dimensional command-table at lower-third (the table itself shows 17 different translucent battlefield-views simultaneously — the 17 dimensions). Faint warm fury-glow rims her shoulders. Behind her, the Hierarchy command-spire receding.",
    moodKeywords: [
      "COO of the Hierarchy",
      "commands the Blood Weave's armies across 17 dimensions simultaneously",
      "six tireless arms each holding a different tactical-instrument",
      "long-jawed deep-charcoal demonic-aristocrat profile, three vertical eye-points",
    ],
    palette:
      "Charcoal-and-deep-crimson chitin-substance + six articulated arms + chrome-and-deep-crimson commander's-baton + brass-and-glass dimensional-tracker + curved deep-crimson tactical-blade + chrome-and-cool-violet communications-gauntlet + three deeper-crimson vertical eye-points + warm fury-glow + multi-dimensional command-table + Hierarchy command-spire",
    composition:
      "Wider mid-shot front three-quarter, Taskmaster at frame-centre with six arms extended, command-table at lower-third with 17 battlefield-views",
    notes:
      "Legendary unit. Hierarchy COO is a unique character (not Demagi-faction footsoldier). Six-arms + 17-dimension command is canon-direct from flavor. Generic-Hierarchy-aristocrat features (long-jawed profile, vertical eye-points) must NOT match Xeth'Raal Demagi Archlord (s1_race_demagi_03 — different specific archetype: Archlord vs COO).",
  },
  {
    cardId: "s1_char_066",
    sceneDelta:
      "Mid-shot. Fenra the Moon Tyrant — a tall lupine-Hierarchy figure at frame-centre, female-presenting wolf-aspect with deep-charcoal-and-cool-violet pelt-substance, sharp lupine features (elongated muzzle, pointed ears, alert deep-violet eyes), wearing a fitted Hierarchy operations-coat over the pelt. She stands at a Hierarchy operations-room logistics-table at frame-centre, mid-action of REVIEWING multi-dimensional supply-routes — both lupine-clawed hands extended over a translucent dimensional-map showing 17 separate logistics-arrays. Her face shows lupine focus, slight bared-teeth visible (the canonical 'lupine precision and ferocity'). Faint cool-violet operational-glow at her gauntlets. Behind her, the Hierarchy operations-room with anonymous lupine-Hierarchy operatives (back-shots only) at consoles.",
    moodKeywords: [
      "Director of Operations",
      "coordinates Blood Weave logistics across 17 dimensions",
      "with lupine precision and ferocity",
      "deep-charcoal-and-cool-violet pelt with sharp lupine features",
    ],
    palette:
      "Deep-charcoal-and-cool-violet pelt-substance + Hierarchy operations-coat + alert deep-violet lupine eyes + translucent dimensional-map + 17 logistics-arrays + cool-violet operational-glow + Hierarchy operations-room + cool deep-shadow + warm low console-light",
    composition:
      "Mid-shot front three-quarter, Fenra at frame-centre at logistics-table, lupine-Hierarchy operatives at lower-third",
    notes:
      "Epic unit. Lupine-aspect is a NEW Hierarchy archetype (vs Demagi humanoid + Riri'Ahlia six-armed-aristocrat). The 17-dimension logistics is canon-direct from flavor — visualized via the translucent multi-array map. Generic lupine features must NOT match any other named character.",
  },
  {
    cardId: "s1_char_078",
    sceneDelta:
      "Wider mid-shot. Governor Thane — male-presenting figure in mid-fifties, generic-imposing features (composed grave eyes, set jaw, weathered self-made face), in formal New Babylon Governor's robes (deep warm-leather-and-cream-marble ceremonial fabric with chrome-and-warm-gold Governor's-staircase emblem at the chest). He stands at the centre of a vast New Babylon Senate-chamber at frame-centre, both hands gripping the edges of a tall ceremonial Governor's-podium. Behind him, the chamber extends with empty Senator-benches (the staircase he built — he occupies the top alone). Burned-paper fragments visibly drift in the air at lower-third (the canonical 'burned every other way up' — alternative-ascension records destroyed). A translucent green-tinted forcefield-shimmer wraps him; faint warm provoke-glow rims his shoulders.",
    moodKeywords: [
      "he did not rise to power",
      "he built the staircase and burned every other way up",
      "burned-paper fragments drifting at lower-third",
      "composed grave eyes, set jaw, weathered self-made face",
    ],
    palette:
      "Deep warm-leather-and-cream-marble Governor's robes + chrome-and-warm-gold staircase-emblem + tall ceremonial Governor's-podium + empty Senator-benches + burned-paper fragments + translucent green-tinted forcefield + warm provoke-rim + warm Senate-chamber sodium-light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Thane at frame-centre at podium, empty Senator-benches behind, burned-paper drifting at lower-third",
    notes:
      "Legendary unit. Generic-imposing features must NOT match any named character. The 'burned every other way up' is the canonical 'self-made tyrant' visualization — empty benches + burning paper. Forcefield + provoke dual-keyword rendering matches Architect-faction visual idioms.",
  },
  {
    cardId: "s1_char_079",
    sceneDelta:
      "Mid-shot. A Citadel Guardian — male-presenting figure in mid-thirties, generic-stalwart features (firm jaw, alert eyes, calm composure), in heavy New Babylon citadel-armor (deep slate-and-warm-gold ceremonial plating with cream-marble chest-emblem). He stands at the threshold of a New Babylon citadel gate-tower, both hands gripping a tall ceremonial pike (chrome-and-warm-gold tipped). His pose is grounded, immovable. Faint warm provoke-glow rims his leading shoulder. Behind him, the citadel's tall warm-cream-and-cool-slate walls extend in mid-distance — visibly INTACT, unbroken. The walls have never been breached.",
    moodKeywords: [
      "the walls of New Babylon have never been breached",
      "the guardians intend to keep it that way",
      "firm jaw, alert eyes, calm composure",
      "tall warm-cream-and-cool-slate citadel walls visibly intact",
    ],
    palette:
      "Deep slate-and-warm-gold citadel-armor + cream-marble chest-emblem + chrome-and-warm-gold ceremonial pike + warm provoke-rim + warm-cream-and-cool-slate citadel walls + warm sodium gate-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Guardian at frame-centre at gate-tower threshold, citadel walls extending behind",
    notes:
      "Common unit. Generic-stalwart features must NOT match any named character. The intact walls are the visual key — 'never breached' rendered as visibly unbroken architecture.",
  },
  {
    cardId: "s1_char_080",
    sceneDelta:
      "Action mid-shot. A District Enforcer — female-presenting figure in late-twenties, generic-quick features (focused dark eyes, athletic build), in light New Babylon-aligned tactical-leathers (warm-leather over slate with chrome-and-warm-gold district-badge at the chest). She is mid-stride forward across a New Babylon district-street, leading-foot landed past a fallen anonymous citizen (back-shot only) at lower-third (the swift justice already-delivered). Her right hand carries a chrome-and-warm-gold short-blade. Faint warm rush-trails at her heels (rush keyword). Her face is composed, professional, slightly-tired (justice is the job). Behind her, a busy New Babylon district-corridor with anonymous bystanders averting eyes.",
    moodKeywords: [
      "justice in New Babylon is swift",
      "appeals are slower — by design",
      "mid-stride past fallen anonymous citizen",
      "composed professional slightly-tired",
    ],
    palette:
      "Light New Babylon-aligned tactical-leathers + warm-leather over slate + chrome-and-warm-gold district-badge + chrome-and-warm-gold short-blade + warm rush-trails + warm New Babylon district-street + anonymous citizens + warm sodium-light + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Enforcer at frame-centre mid-stride, fallen citizen at lower-third, district-corridor behind",
    notes:
      "Common unit. Anonymous fallen citizen + bystanders preserve no-character-conflation. The 'swift justice / slow appeals' framing is rendered as the immediate strike + the procedural-aftermath waiting (the bystanders averting eyes communicate the systemic nature).",
  },
  {
    cardId: "s1_char_081",
    sceneDelta:
      "Mid-shot. A Tribunal Magistrate — female-presenting figure in mid-forties, generic-judicial features (deeply composed face, calm grave eyes, hair pulled back severely), in formal New Babylon tribunal-robes (deep warm-cream-and-deep-crimson ceremonial fabric with chrome-and-warm-gold scales-of-judgment pendant at the throat). She stands at the centre of a New Babylon tribunal-courtroom at frame-centre, mid-action of DELIVERING A VERDICT — her right hand is mid-motion of striking a chrome-and-warm-gold judgment-gavel against a tall warm-leather sentencing-block. Around her, a translucent green-tinted forcefield-shimmer (forcefield keyword). The chamber's anonymous accused (back-three-quarter, generic-civilian) stands at lower-third in the dock. Her face is unmoved — verdict absolute, sentence irrevocable.",
    moodKeywords: [
      "her verdicts are absolute",
      "her sentences, irrevocable",
      "mid-strike of chrome-and-warm-gold judgment-gavel",
      "deeply composed face, hair pulled back severely",
    ],
    palette:
      "Deep warm-cream-and-deep-crimson tribunal-robes + chrome-and-warm-gold scales-of-judgment pendant + chrome-and-warm-gold judgment-gavel + tall warm-leather sentencing-block + translucent green-tinted forcefield + warm tribunal-chamber light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Magistrate at frame-centre delivering verdict, anonymous accused at lower-third in dock",
    notes:
      "Uncommon unit. Anonymous accused (back-three-quarter) preserves no-character-conflation. Generic-judicial features must NOT match any named character (specifically NOT Adjudicator Locke — different specific archetype: Adjudicator vs Tribunal Magistrate).",
  },
] as const;

/**
 * New Babylon faction's prompt registry, keyed by card id.
 *
 * Currently populated: 11 / 52 cards
 * (gen_new_babylon, s1_char_001, s1_char_003, s1_char_020,
 *  s1_char_033, s1_char_061, s1_char_066, s1_char_078,
 *  s1_char_079, s1_char_080, s1_char_081).
 */
export const NEW_BABYLON_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(NEW_BABYLON_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
