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
  {
    cardId: "s1_char_082",
    sceneDelta:
      "Action mid-shot. A Spire Assassin — female-presenting figure in mid-twenties, generic-precise features (sharp eyes, slight grim expression, hair tightly bound), in dark New Babylon-aligned silent-descent leathers (deep slate-and-warm-gold tactical garments) with a small chrome-and-warm-gold Spire-emblem at the chest. She is mid-DESCENT from upper-frame on a translucent silver-mist descender-line (the canonical 'descends from the Spire'), legs tucked, body angled forward. In her right hand, a chrome-and-warm-gold short-blade is forward-extended toward an off-frame target (only the target's chrome-and-cool-cyan armored shoulder visible at lower-frame edge). Faint warm backstab-glow rims the blade-tip; faint warm pierce-glow rims her leading hand. Her face is composed-final.",
    moodKeywords: [
      "she descends from the Spire like a verdict from on high",
      "silent, precise, and final",
      "mid-descent on translucent silver-mist descender-line",
      "composed-final expression",
    ],
    palette:
      "Deep slate-and-warm-gold tactical garments + chrome-and-warm-gold Spire-emblem + translucent silver-mist descender-line + chrome-and-warm-gold short-blade + warm backstab-glow + warm pierce-glow + cool deep-shadow + warm Spire-light from above",
    composition:
      "Action mid-shot front three-quarter, Assassin mid-descent at frame-centre, off-frame target's shoulder at lower-frame edge",
    notes:
      "Rare unit. Anonymous off-frame target preserves no-character-conflation. Generic-precise features must NOT match Akai Shi (different specific archetype: Spire-aligned political assassin vs Insurgency-Architect-trained warrior) or Agent Zero (different distinct facial features). The descender-line from above is the canonical Spire-descent visualization.",
  },
  {
    cardId: "s1_char_083",
    sceneDelta:
      "Mid-shot. A Propaganda Herald — male-presenting figure in late-thirties, generic-charismatic features (warm smile, knowing eyes, slightly-styled hair), in formal New Babylon Herald's robes (warm-leather-and-cream-and-warm-gold ceremonial fabric with a chrome speaker's amplifier-pendant at the throat). He stands at the centre of a New Babylon district-square at frame-centre on a low ceremonial herald's-platform, mid-action of declaiming — head slightly raised, mouth open, right hand gestured outward in oratorical motion. From the amplifier-pendant, faint translucent warm-cream RHYME-RIPPLES propagate outward (the truth made rhymed, made memorable). Around him, anonymous district-citizens (back-shots only at lower-third) listen with rapt attention.",
    moodKeywords: [
      "the truth is whatever the Spire says it is",
      "he just makes it rhyme",
      "mid-declamation with amplifier-pendant rhyme-ripples",
      "anonymous district-citizens listening rapt",
    ],
    palette:
      "Warm-leather-and-cream-and-warm-gold Herald's robes + chrome speaker's amplifier-pendant + translucent warm-cream rhyme-ripples + warm New Babylon district-square sodium-light + anonymous district-citizens + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Herald at frame-centre on platform, anonymous citizens listening at lower-third",
    notes:
      "Common unit. Anonymous citizens (back-shots) preserve no-character-conflation. Generic-charismatic features must NOT match The Politician (s1_char_042) — different visual signature (Architect-cyan vs warm-leather-Herald). The rhyme-ripples are a new visual idiom for propaganda-as-meter.",
  },
  {
    cardId: "s1_char_084",
    sceneDelta:
      "Wider mid-shot. An Iron Decree — a vast humanoid-mechanical IRON-CAST entity at frame-centre, approximately 3m tall, body composed entirely of dense dark-iron (NOT chrome — heavy unfinished iron-cast, the canonical 'cast in iron' visualization). The figure has a wide blocky humanoid silhouette with a small chrome-and-warm-gold Spire-emblem cast directly into the chest (the law-emblem is part of the body). Where its face would be, a single horizontal warm-gold judgment-slit. Both arms end in chrome-and-warm-gold judgment-binders (NOT weapons — restraints). It strides forward across a New Babylon courtyard. Faint warm provoke-glow rims its leading shoulder; translucent green-tinted forcefield-shimmer wraps it. Behind it, anonymous fleeing citizens (back-shots) at lower-third — the guilty.",
    moodKeywords: [
      "it does not enforce the law",
      "it is the law — cast in iron and set loose upon the guilty",
      "wide blocky iron-cast humanoid with horizontal warm-gold judgment-slit",
      "anonymous fleeing citizens behind",
    ],
    palette:
      "Dense dark-iron cast body + chrome-and-warm-gold Spire-emblem chest + horizontal warm-gold judgment-slit + chrome-and-warm-gold judgment-binders + warm provoke-rim + translucent green-tinted forcefield + warm New Babylon courtyard + anonymous fleeing citizens + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Iron Decree at frame-centre mid-stride, fleeing citizens at lower-third",
    notes:
      "Epic unit. Anonymous fleeing citizens (back-shots) preserve no-character-conflation. The 'is the law cast in iron' is rendered through the literal iron-cast body + emblem-as-anatomy. Differentiates from Architect's Chrome Archon (chrome aesthetic) — Iron Decree is heavier, unfinished, more brute.",
  },
  {
    cardId: "s1_char_085",
    sceneDelta:
      "Wider mid-shot. A Sector Warden — male-presenting figure in mid-thirties, generic-vigilant features (sharp eyes, alert posture), in heavy New Babylon-aligned watchtower-armor (deep slate-and-warm-gold plating with chrome shoulder-comm), positioned at the top of a tall New Babylon watchtower. Both hands grip a long chrome-and-warm-gold ranged-rifle, mid-action of TRACKING a street below — the rifle's cool-cyan targeting-laser-pip emits forward toward off-frame street-position at lower-distance. Around the watchtower, multiple visible firing-LANE GLYPHS overlay the city's streets below (translucent warm-gold lane-markings showing every street as a tracked corridor). A translucent green-tinted forcefield-shimmer wraps him (forcefield keyword). NO direct citizen visible — only the lane-glyphs marking where the citizens would be.",
    moodKeywords: [
      "from the watchtower, every street is a firing lane",
      "every citizen, a potential target",
      "translucent warm-gold lane-glyphs over streets",
      "rifle tracking off-frame street-position",
    ],
    palette:
      "Deep slate-and-warm-gold watchtower-armor + chrome shoulder-comm + chrome-and-warm-gold ranged-rifle + cool-cyan targeting-laser-pip + translucent warm-gold firing-lane glyphs + translucent green-tinted forcefield + cool New Babylon city-streets below + warm sodium street-light",
    composition:
      "Wider mid-shot front three-quarter, Warden at frame-centre on watchtower, lane-glyphs overlaying streets at lower-third",
    notes:
      "Rare unit. NO citizen-figures (only lane-glyphs) — preserves no-character-conflation while making the surveillance-state visualization explicit. Generic-vigilant features must NOT match any named character. Watchtower differentiates from Inception Ark Sentry (architecture: tower vs hull-integrated).",
  },
  {
    cardId: "s1_char_117",
    sceneDelta:
      "Mid-shot. Senator Voss — male-presenting figure in late-fifties, generic-distinguished features (composed-grave eyes, well-groomed silver-streaked hair, set jaw — distinct from Senator Elara Voss's thirties-warm-amber-haired rendering), in formal New Babylon Senator's robes (deep warm-leather-and-cream-marble fabric with chrome-and-warm-gold Voss-family-crest at the breast). He stands at a New Babylon Senate-podium at frame-centre, mid-action of casting a VOTE — his right hand presses a chrome-and-warm-gold vote-token into a podium-receptacle. Around him, multiple anonymous Senator-silhouettes (back-shots only) cast IDENTICAL VOTES simultaneously (the canonical 'unanimous when dissenters have been recycled' rendering). Faint warm low Senate-light. His face is composed, untroubled.",
    moodKeywords: [
      "the vote was unanimous",
      "it always is, when the dissenters have already been recycled",
      "anonymous Senator-silhouettes casting identical votes simultaneously",
      "composed, untroubled — distinct from Elara Voss's thirties-Atarion features",
    ],
    palette:
      "Deep warm-leather-and-cream-marble Senator's robes + chrome-and-warm-gold Voss-family-crest + chrome-and-warm-gold vote-token + anonymous Senator-silhouettes + warm low Senate-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Senator Voss at frame-centre at podium, anonymous Senator-silhouettes voting in parallel",
    notes:
      "Epic unit. CRITICAL: distinct from Senator Elara Voss (s1_char_016 — early-thirties, warm-amber hair, Atarion Senate). This Senator Voss is a different family-member: late-fifties male in New Babylon Senate. Same family-crest establishes lineage; distinct features prevent character-conflation. The 'unanimous through recycled dissenters' is rendered through the parallel-voting silhouettes.",
  },
  {
    cardId: "s1_char_118",
    sceneDelta:
      "Mid-shot. A Trade Enforcer — male-presenting figure in mid-forties, generic-professional features (calm eyes, set jaw, weathered competence), in formal New Babylon Trade-Enforcement coat (deep warm-leather over slate with chrome-and-warm-gold ledger-pin at the lapel). He stands at the centre of a New Babylon trading-floor at frame-centre, mid-action of REVIEWING a chrome-and-warm-gold ledger in his right hand while his left hand rests casually on the pommel of a sheathed sidearm. The ledger shows visible LINE-ITEMS in cool-cyan script — one line just-checked (a small chrome checkmark beside it). Behind him, an anonymous figure (back-shot only) is being calmly escorted from the trading-floor by another anonymous Enforcer (the line-item being balanced). His face is composed-procedural.",
    moodKeywords: [
      "in New Babylon, murder is not a crime — it is a line item",
      "the Enforcer simply ensures the ledger balances",
      "ledger with line-items, one just-checked with chrome checkmark",
      "anonymous figure being escorted away",
    ],
    palette:
      "Deep warm-leather over slate Trade-Enforcement coat + chrome-and-warm-gold ledger-pin + chrome-and-warm-gold ledger + cool-cyan ledger-script + sheathed sidearm + warm New Babylon trading-floor + anonymous escorted figure + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Trade Enforcer at frame-centre with ledger, anonymous escort scene at lower-third behind",
    notes:
      "Rare unit. Generic-professional features must NOT match any named character. Anonymous escorted-figure preserves no-character-conflation. The 'murder as line-item' is rendered through the procedural ledger-checkmark + the calm escort.",
  },
  {
    cardId: "s1_char_119",
    sceneDelta:
      "Mid-shot. A Syndicate Broker — male-presenting figure in mid-forties, generic-mercantile features (warm but calculating smile, attentive eyes, well-tailored beard), in casual but expensive New Babylon syndicate-merchant attire (warm-leather vest over warm-cream linen with multiple chrome syndicate-coin pins at the chest). He sits at a low private brokering-table in a quiet syndicate back-room at frame-centre, mid-action of EXTENDING A SMALL SCROLL toward an anonymous client (only the client's hand visible at frame-right edge, generic civilian sleeve). The scroll bears the client's PRICE in chrome-and-warm-gold script (deliberately illegible to the viewer — but unmistakably the client's price-quote). The Broker's face shows calm confidence — knowing exactly what the client is worth. Faint warm low back-room light.",
    moodKeywords: [
      "everything has a price in New Babylon",
      "the Broker's gift is knowing exactly what yours is",
      "extending price-quote scroll to anonymous client",
      "warm but calculating smile",
    ],
    palette:
      "Warm-leather vest over warm-cream linen + chrome syndicate-coin pins + low private brokering-table + chrome-and-warm-gold price-quote scroll + warm low back-room light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Broker at frame-centre at brokering-table, anonymous client's hand at frame-right edge",
    notes:
      "Common unit. Anonymous client (hand only) preserves no-character-conflation. Generic-mercantile features must NOT match any named character (specifically NOT The Degen — different visual context: New Babylon syndicate-merchant vs Dreamer-faction casino-host).",
  },
  {
    cardId: "s1_char_120",
    sceneDelta:
      "Mid-shot. A Crystal Archive Guard — male-presenting figure in late-twenties, generic-stalwart features (firm jaw, alert eyes, calm composed posture), in light New Babylon-aligned guard-armor (warm-leather over slate with chrome-and-warm-gold archive-emblem at the chest). He stands at the threshold of a New Babylon Crystal Archive (a tall chamber filled with translucent silver-mist crystal-records visible at varying heights behind him, faintly luminous). His right hand rests on a chrome-and-warm-gold guard-staff. A translucent green-tinted forcefield-shimmer wraps the archive-chamber behind him (the crystals' own forcefield, not his). His face is composed; he is essentially a witness — the crystal does the work.",
    moodKeywords: [
      "the crystal remembers every blow it absorbs",
      "the guard does not need to",
      "translucent silver-mist crystal-records at varying heights behind",
      "guard's hand on staff, archive forcefield active",
    ],
    palette:
      "Light New Babylon-aligned guard-armor + warm-leather over slate + chrome-and-warm-gold archive-emblem + chrome-and-warm-gold guard-staff + translucent silver-mist crystal-records + translucent green-tinted forcefield (on archive, not guard) + warm low archive-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Guard at frame-centre at archive-threshold, crystal-records visible behind in mid-distance",
    notes:
      "Common unit. CRITICAL: forcefield is on the ARCHIVE (not the Guard) — canonical 'crystal absorbs, guard doesn't need to.' Generic-stalwart features must NOT match Citadel Guardian (s1_char_079 — different specific role: city-walls vs archive). Crystal-record visualization echoes Antiquarian relic-keeper aesthetics.",
  },
] as const;

/**
 * New Babylon faction's prompt registry, keyed by card id.
 *
 * Currently populated: 19 / 52 cards
 * (gen_new_babylon, s1_char_001, s1_char_003, s1_char_020,
 *  s1_char_033, s1_char_061, s1_char_066, s1_char_078,
 *  s1_char_079, s1_char_080, s1_char_081, s1_char_082-085,
 *  s1_char_117-120).
 */
export const NEW_BABYLON_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(NEW_BABYLON_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
