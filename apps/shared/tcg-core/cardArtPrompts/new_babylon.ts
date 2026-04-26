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
  {
    cardId: "s1_pack_029",
    sceneDelta:
      "Mid-shot. A Hostile Takeover — at frame-centre, Adjudicator Locke (same canonical features as gen_new_babylon: female mid-forties, eye-patch on left eye, deep warm-leather Adjudicator's coat) is mid-action of SIGNING a takeover-order with a chrome-and-warm-gold quill. Her face shows a small composed smile. The order at lower-third bears chrome-and-warm-gold script with a small chrome-and-warm-gold COMPENSATION-CLAUSE visibly highlighted. At frame-right edge, an anonymous courier (back-shot only) is mid-departure carrying the signed order. Behind Locke, faint warm low office-light. The signed order's recipient (the takeover-target) is implied off-frame and not expected to survive to collect.",
    moodKeywords: [
      "Locke smiled as he signed the order",
      "the compensation was generous",
      "the target was not expected to survive to collect it",
      "small composed smile, single-eyed gaze, chrome-and-warm-gold quill",
    ],
    palette:
      "Deep warm-leather Adjudicator's coat + chrome-and-warm-leather eye-patch + chrome-and-warm-gold quill + chrome-and-warm-gold takeover-order script + warm low office-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Locke at frame-centre signing order, anonymous courier at frame-right edge departing",
    notes:
      "Rare spell. Visual continuity with gen_new_babylon + s1_char_001 (same Locke). Anonymous courier preserves no-character-conflation. NOTE: flavor uses 'he' but Locke is canonically female-presenting (gender-neutral pronouns may be misdirection in flavor text).",
  },
  {
    cardId: "s1_pack_030",
    sceneDelta:
      "Action mid-shot. A Syndicate Enforcer — male-presenting figure in mid-thirties, generic-grim features (calm cold eyes, set jaw), in dark New Babylon syndicate-leathers (deep warm-leather over slate with chrome-and-warm-gold syndicate-mark at the chest). He stands at the centre of a back-alley scene at frame-centre, mid-action of CROUCHING beside a fallen anonymous body (back-shot only at lower-third) with one hand reaching INTO the body's pocket — extracting payment. His face shows efficient-procedural calm. Faint warm low alley-light; cool deep-shadow at the alley-edges. The setting is a quiet New Babylon back-alley.",
    moodKeywords: [
      "he does not ask for payment",
      "he takes it from the corpse's pockets",
      "the Syndicate calls it 'efficiency'",
      "calm cold eyes, set jaw, efficient-procedural",
    ],
    palette:
      "Deep warm-leather over slate syndicate-leathers + chrome-and-warm-gold syndicate-mark + warm low alley-light + anonymous fallen body + cool deep-shadow",
    composition:
      "Action mid-shot side three-quarter, Enforcer at frame-centre crouched beside fallen body, alley extending behind",
    notes:
      "Common unit. Anonymous fallen body (back-shot) preserves no-character-conflation. Generic-grim features must NOT match any named character. The 'efficiency' framing is rendered through the procedural-calm extraction-gesture.",
  },
  {
    cardId: "s1_pack_031",
    sceneDelta:
      "Mid-shot. A Crystal Senator — male-presenting figure in mid-fifties, generic-distinguished features (composed eyes, slight knowing smile, distinguished-grey hair), in formal New Babylon Senator's robes (deep warm-leather-and-cream-marble fabric with chrome-and-warm-gold Senator's pin at the breast). He stands at frame-centre at a New Babylon Senate-corridor. Around his body, a translucent CRYSTALLIZED-CURRENCY forcefield-shimmer wraps him — the shield is visibly composed of HUNDREDS OF SMALL CRYSTALLINE COIN-FRAGMENTS suspended in mid-air around his body, each a separate piece of crystallized money forming a barrier. His face is composed, untroubled — no blade can afford to breach what wealth has built. Faint warm low Senate-corridor light.",
    moodKeywords: [
      "the Senator's shield is not magic — it is money",
      "crystallized into a barrier no blade can afford to breach",
      "translucent crystallized-currency forcefield of hundreds of coin-fragments",
      "composed, untroubled, distinguished-grey hair",
    ],
    palette:
      "Deep warm-leather-and-cream-marble Senator's robes + chrome-and-warm-gold Senator's pin + translucent crystallized coin-fragments + warm-gold currency-shimmer + warm low Senate-corridor light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Crystal Senator at frame-centre with currency-shield, Senate-corridor behind",
    notes:
      "Rare unit. Generic-distinguished features must NOT match Senator Voss (s1_char_117) — different specific archetype: Crystal Senator vs Voss-family. The currency-shield is a unique visual idiom for forcefield (vs standard hexagonal-cyan / green-tinted variants).",
  },
  {
    cardId: "s1_pack_032",
    sceneDelta:
      "Wider mid-shot. A Market Crash — at frame-centre, a vast New Babylon trading-floor at the moment of CATASTROPHIC PRICE-COLLAPSE: multiple translucent warm-gold price-line-graphs visible in mid-air across the entire floor, each line CRASHING DOWNWARD simultaneously (the lines were UP a moment ago; they are now descending in unison). Around the trading-floor, anonymous traders (back-shots only, generic civilian + tactical figures) react in panic — some clutching heads, some falling to knees, some running toward exits at frame-edges. The floor itself is unbroken — the market is correcting, not the architecture. Faint warm-amber economic-shock-aura propagates outward. NO single dominant figure (the spell is the impersonal market).",
    moodKeywords: [
      "the market corrects itself",
      "it does not care who is standing when it does",
      "multiple price-line-graphs crashing simultaneously",
      "anonymous traders in panic",
    ],
    palette:
      "Translucent warm-gold price-line-graphs + descending lines + anonymous trader-silhouettes (back-shots) + warm-amber economic-shock-aura + warm New Babylon trading-floor + cool deep-shadow",
    composition:
      "Wider mid-shot, trading-floor filling frame, price-line-graphs crashing in mid-air, anonymous traders in panic at lower-third",
    notes:
      "Epic spell. Anonymous traders preserve no-character-conflation. The 'impersonal market' framing is rendered through the absence of any single dominant figure — the crash IS the subject.",
  },
  {
    cardId: "s1_pack_033",
    sceneDelta:
      "Mid-shot. A Debt Collector — male-presenting figure in mid-thirties, generic-procedural features (no expression, calm dark eyes, average build), in plain New Babylon Debt-Collection coat (deep warm-leather over slate with a small chrome ledger-clip at the lapel). He stands at the threshold of an anonymous citizen's apartment-doorway at frame-centre — the doorway is OPEN, the citizen NOT VISIBLE (already gone or already taken). The Collector holds a chrome-and-warm-gold subtraction-stamp in his right hand, mid-action of striking it against an open ledger in his left hand (the line being struck through). His face shows no procedural emotion. Behind him, a quiet New Babylon residential-corridor.",
    moodKeywords: [
      "he does not knock",
      "he does not ask",
      "he simply subtracts",
      "no expression, calm dark eyes",
    ],
    palette:
      "Deep warm-leather over slate Debt-Collection coat + chrome ledger-clip + chrome-and-warm-gold subtraction-stamp + open ledger + warm low residential-corridor light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Collector at frame-centre at open doorway, residential-corridor behind",
    notes:
      "Common unit. Anonymous absent citizen (door open, no figure) preserves no-character-conflation. Generic-procedural features must NOT match Trade Enforcer (s1_char_118) — different specific role: door-to-door extraction vs trading-floor balance.",
  },
  {
    cardId: "s1_pack_034",
    sceneDelta:
      "Wider mid-shot. Locke's Inner Circle — at frame-centre, FIVE FIGURES at a private New Babylon high-table (each in distinct New Babylon political/syndicate attire, all generic-distinguished features, all back-three-quarter or partial-profile — NO faces fully visible). At the head of the table at frame-back-centre, Adjudicator Locke is visible (back-three-quarter, eye-patch on left eye, recognizable by silhouette and patch — visual continuity with gen_new_babylon). The five figures are mid-discussion, hands gesture-active, the room is intimate-private. On the table at lower-third, a single chrome-and-warm-gold OWNERSHIP-LEDGER (the city itself written in it). Around the room, faint warm low elite-back-room light. They do not rule — they own.",
    moodKeywords: [
      "they do not rule New Babylon",
      "they own it",
      "and now they own whatever comes next",
      "five figures at private high-table, Locke at the head, all back/partial",
    ],
    palette:
      "Distinct New Babylon political/syndicate attire (varied) + Locke's chrome-and-warm-leather eye-patch + chrome-and-warm-gold ownership-ledger + warm low elite-back-room light + warm-leather high-table + cool deep-shadow",
    composition:
      "Wider mid-shot, high-table at frame-centre, five figures around with Locke at back, ownership-ledger at lower-third",
    notes:
      "Legendary unit. Anonymous Inner Circle (back/partial) preserves no-character-conflation. Locke's eye-patch establishes her presence by silhouette only (no face visible). The 'own whatever comes next' framing is rendered through the visible ownership-ledger.",
  },
  {
    cardId: "s1_pack_035",
    sceneDelta:
      "Wider mid-shot. A Trade Embargo — at frame-centre, a set of New Babylon TRADE-ROUTE GATES across a wide trade-corridor (chrome-and-warm-gold ceremonial gates, mid-CLOSING). The gates are visible as multiple parallel-aligned barriers, each in its own gate-frame, all closing in unison at the same moment. Beyond the gates at deep-distance, OBJECTS-WAITING are visible (translucent stranded-cargo, faint silhouettes of merchant-figures unable to cross — anonymous, back-shots only). Above the gates, a single chrome-and-warm-gold EMBARGO-DECREE plaque hangs visibly. NO single dominant figure (the spell is the closing-action).",
    moodKeywords: [
      "the trade routes closed overnight",
      "by morning, entire strategies had starved",
      "trade-route gates mid-closing in unison",
      "stranded-cargo and merchant-figures behind unable to cross",
    ],
    palette:
      "Chrome-and-warm-gold ceremonial trade-gates + multiple parallel-aligned barriers + chrome-and-warm-gold embargo-decree plaque + translucent stranded-cargo + anonymous merchant-figures + warm trade-corridor sodium-light + cool deep-shadow",
    composition:
      "Wider mid-shot, trade-gates at frame-centre mid-closing, stranded merchants beyond at deep-distance",
    notes:
      "Uncommon spell. Anonymous merchants (back-shots) preserve no-character-conflation. The 'overnight closing' is rendered through the unanimous mid-close — multiple gates moving as one.",
  },
  {
    cardId: "s1_pack_seed_fighter",
    sceneDelta:
      "Action mid-shot. Akai Shi, the Red Death — same canonical Akai Shi features as s1_char_003 (mid-thirties female, Potentials-glyph at left temple, dark hair tied back) but rendered in ARENA-CHAMPION posture: she stands at the centre of a New Babylon arena-floor at frame-centre, both feet planted shoulder-width, both hands gripping a single chrome-and-deep-crimson curved-blade in mid-finishing-strike (the blade is mid-arc, dripping with translucent blood-red strike-residue — faint). Around her, the arena's anonymous spectators (back-shots only, generic-mixed New Babylon citizens) cheer in mid-distance bleachers. Faint warm rush-trails at her heels (rush keyword); faint warm pierce-glow rims the blade-tip (pierce keyword). Her face shows arena-finality — no mercy.",
    moodKeywords: [
      "the arena has a champion",
      "the champion has no mercy",
      "Akai Shi at arena-floor in finishing-strike posture",
      "anonymous arena-spectators cheering in bleachers",
    ],
    palette:
      "Slate-and-deep-crimson combat-leathers + chrome-and-deep-crimson curved-blade + chrome-and-deep-crimson Potentials-glyph at left temple + translucent blood-red strike-residue + warm rush-trails + warm pierce-glow + warm New Babylon arena-floor + anonymous cheering spectators + cool deep-shadow",
    composition:
      "Action mid-shot front three-quarter, Akai Shi at frame-centre in finishing-strike, arena-spectators in bleachers behind",
    notes:
      "Legendary unit. Visual continuity with s1_char_003 (same character at arena-context vs post-cataclysm). Anonymous spectators preserve no-character-conflation. The 'Red Death' framing is rendered through the deep-crimson blade-residue.",
  },
  {
    cardId: "s1_pack_seed_trade",
    sceneDelta:
      "Mid-shot. A Shadow Route Manifest — at frame-centre, an OPEN SHADOW-MANIFEST DOCUMENT laid flat on a low warm-leather smuggling-table. The manifest's surface shows a NEW BABYLON CITY-MAP with multiple visible TRADE-ROUTES marked in chrome-and-warm-gold INK (the official routes), but ALSO multiple SHADOW-ROUTES marked in translucent warm-amber INK (the routes that don't appear on any official chart). The shadow-routes are clearly more numerous and lead to richer destinations. An anonymous smuggler's hand (only fingertips visible at frame-bottom-edge, generic warm-leather sleeve) traces one of the shadow-routes with a fingertip. NO face visible.",
    moodKeywords: [
      "the routes that don't appear on any chart",
      "are the ones that pay the most",
      "official chrome-and-warm-gold routes + translucent warm-amber shadow-routes",
      "anonymous smuggler's fingertip tracing shadow-route",
    ],
    palette:
      "Open shadow-manifest document + warm-leather smuggling-table + chrome-and-warm-gold official-route ink + translucent warm-amber shadow-route ink + anonymous fingertip + warm low smuggling-table light + cool deep-shadow",
    composition:
      "Mid-shot, manifest at frame-centre on table, anonymous fingertip at frame-bottom-edge tracing shadow-route",
    notes:
      "Rare spell. Anonymous smuggler (fingertip only) preserves no-character-conflation. The two-color route-distinction (chrome-and-warm-gold official vs translucent warm-amber shadow) is the visual key to the canonical 'don't appear on charts' framing.",
  },
  {
    cardId: "s1_reward_casino_high_roller",
    sceneDelta:
      "Mid-shot. A High Roller — male-presenting figure in mid-forties, generic-confident features (steady eyes, slight grin, distinguished but not flashy hair), in expensive but not ostentatious New Babylon casino-attire (warm-leather over warm-cream linen with multiple chrome property-deed pins clustered at the lapel — three city-block-deeds visible). He stands at the threshold of a New Babylon casino re-entering through a tall warm-gold ceremonial gateway. In one hand, a small chrome-and-warm-gold gambling-token; in the other, a sheaf of three property-deed-scrolls bound with chrome-and-warm-gold ribbon (the three city blocks). His face shows controlled appetite — he is going back in to risk it all. Behind him, the casino-interior glows warm.",
    moodKeywords: [
      "walked into the Casino with nothing",
      "walked out owning three city blocks",
      "then he went back in",
      "controlled appetite — going back to risk it all",
    ],
    palette:
      "Expensive warm-leather over warm-cream linen + chrome property-deed pins + chrome-and-warm-gold gambling-token + chrome-and-warm-gold property-deed-scrolls + warm casino-gateway light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, High Roller at frame-centre at gateway, casino-interior glowing behind",
    notes:
      "Epic unit. Generic-confident features must NOT match The Degen (different visual context — Dreamer-faction casino-host vs New Babylon casino-patron). The three property-deeds + return-to-risk framing is the canonical High Roller visualization.",
  },
  {
    cardId: "s1_reward_casino_poker",
    sceneDelta:
      "Mid-shot. A Nebula Shark — female-presenting figure in late-twenties, generic-cool features (sharp watchful eyes, slight smile, hair tied back), in dark New Babylon-aligned card-player's attire (deep slate-and-warm-gold vest over cool-cream shirt). She sits at a private New Babylon poker-table mid-hand. CRITICAL detail: her gaze is directed at the OPPONENT (off-frame at frame-right) NOT at her own cards — she is reading them, not her hand. In her hands, her playing-cards are held face-up TOWARD HER (visible only as their backs to viewer). Behind the cards, faint translucent cool-cyan PROBABILITY-RIPPLES emanate (the canonical 'reads your hand before you've looked at it' rendering). Her face is composed-knowing.",
    moodKeywords: [
      "she reads your hand before you've looked at it yourself",
      "gaze on opponent not her own cards",
      "translucent cool-cyan probability-ripples around her cards",
      "composed-knowing, sharp watchful eyes",
    ],
    palette:
      "Deep slate-and-warm-gold card-player's vest + cool-cream shirt + chrome-and-warm-gold playing-cards + translucent cool-cyan probability-ripples + warm low poker-table light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Nebula Shark at frame-centre at poker-table, cards in hand, gaze toward off-frame opponent",
    notes:
      "Rare unit. Anonymous off-frame opponent preserves no-character-conflation. The 'reads your hand first' is rendered through gaze-direction (on opponent, not own cards) + probability-ripples around her cards. Generic-cool features must NOT match Pazaak Champion (s1_reward_casino_pazaak — different specific game).",
  },
  {
    cardId: "s1_reward_casino_vip",
    sceneDelta:
      "Wider mid-shot. A Casino Mogul — female-presenting figure in mid-fifties, generic-imperial features (composed grave eyes, set jaw, distinguished silver-streaked hair styled formally), in formal New Babylon Casino-VIP attire (deep warm-leather robe over warm-gold ceremonial garment with chrome casino-emblem at the breast). She stands at the centre of a private New Babylon Casino VIP-suite at frame-centre. The room features a high VIP-table at lower-third with NO VISIBLE LIMITS PLAQUE (the canonical 'no limits' detail — where other tables would have a chrome-and-warm-gold limit-display, this table has only an empty plaque-spot, a deliberate void). Her hands rest at the table-edge. Faint warm provoke-glow rims her shoulders. Behind her, the VIP-suite extends with anonymous service-staff at deep-distance.",
    moodKeywords: [
      "the VIP table has no limits",
      "neither does she",
      "deliberate empty plaque where limit-display would be",
      "composed grave eyes, distinguished silver-streaked hair",
    ],
    palette:
      "Deep warm-leather robe over warm-gold ceremonial garment + chrome casino-emblem + warm-leather VIP-table + empty plaque-spot + warm provoke-rim + warm VIP-suite ambient + anonymous service-staff + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Mogul at frame-centre at VIP-table, suite extending behind",
    notes:
      "Legendary unit. The empty plaque-spot is the canonical 'no limits' visualization — absence rendered as visual key. Generic-imperial features must NOT match any named character. Anonymous service-staff preserves no-character-conflation.",
  },
  {
    cardId: "s1_reward_class_soldier",
    sceneDelta:
      "Mid-shot. A Master Soldier — male-presenting figure in mid-forties (NOT Iron Lion — different specific archetype: class-rank Master vs Insurgency-leader), generic-veteran features (deeply weathered face, calm grave eyes, set jaw), in New Babylon-aligned Master-grade soldier-armor (deep slate-and-warm-gold plating with chrome Master's-pin at the chest — visible Master-rank). He stands at the centre of a New Babylon parade-ground at frame-centre, both hands at sides, posture grounded. Faint warm provoke-glow rims his shoulders. Behind him, anonymous lower-rank New Babylon soldiers (back-shots only) stand at parade-rest in formation — they do not need orders; he is the order. His face shows quiet command-authority.",
    moodKeywords: [
      "New Babylon's finest don't ask for orders",
      "they are the order",
      "Master-rank chrome pin, deeply weathered face",
      "anonymous lower-rank soldiers in formation behind",
    ],
    palette:
      "Deep slate-and-warm-gold Master-grade soldier-armor + chrome Master's-pin + warm provoke-rim + warm New Babylon parade-ground + anonymous lower-rank soldier-silhouettes + warm sodium-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Master Soldier at frame-centre, parade-ground formation behind",
    notes:
      "Rare unit. CRITICAL: this is class-rank reward Master Soldier (echoes Master Engineer / Master Oracle / Master Spy pattern), NOT Iron Lion. Generic-veteran features distinct from Iron Lion's grizzled-warrior + grey-beard rendering. Anonymous formation preserves no-character-conflation.",
  },
  {
    cardId: "s1_reward_companion_locke",
    sceneDelta:
      "Mid-shot. Locke's Favor — at frame-centre, a small chrome-and-warm-gold FAVOR-TOKEN on a low warm-leather private-table. The token is approximately 5cm in diameter, faintly luminous warm-gold, embossed with Adjudicator Locke's personal SIGIL (a small etched eye-patch glyph — recognizable from her canonical eye-patch detail). An anonymous figure (only their hand visible at frame-bottom-edge, generic-cool-leather sleeve) is mid-action of receiving the token (palm extended). Faint warm-gold importance-aura emanates from the token. NO Locke present (this card is what she GIVES, not who she is). Background: warm low private-table light.",
    moodKeywords: [
      "Adjudicator Locke's favor is the rarest currency in New Babylon",
      "and the most profitable",
      "chrome-and-warm-gold favor-token with Locke's eye-patch sigil",
      "anonymous hand receiving",
    ],
    palette:
      "Chrome-and-warm-gold favor-token + warm-gold importance-aura + etched eye-patch sigil + warm-leather private-table + anonymous receiving-hand + warm low private-table light + cool deep-shadow",
    composition:
      "Mid-shot, favor-token at frame-centre on table, anonymous hand at frame-bottom-edge receiving",
    notes:
      "Rare spell. Anonymous receiver (hand only) preserves no-character-conflation. NO Locke present — only her token. The eye-patch sigil references Locke without rendering her literally.",
  },
  {
    cardId: "s1_reward_eidolon_auros",
    sceneDelta:
      "Mid-shot. Auros, the Honor — male-presenting figure in mid-forties, generic-noble features (composed deep eyes, full short beard, calm grave bearing), in formal New Babylon-aligned ceremonial honor-armor (warm-gold-and-cream-marble plating with chrome ceremonial-laurel at the brow). He stands at the centre of a New Babylon battle-line at frame-centre — but he stands ALONE FORWARD of the line: anonymous soldier-silhouettes behind him are visibly RETREATING (back-shots, mid-flight away from frame-back), while Auros remains standing forward, both hands gripping a tall chrome-and-warm-gold ceremonial honor-shield planted vertically before him. Faint warm provoke-glow rims his shoulders. His face shows quiet certainty — honor demands no less.",
    moodKeywords: [
      "he stands where others flee",
      "honor demands no less",
      "alone forward of the line, others retreating",
      "composed deep eyes, full short beard, ceremonial-laurel at brow",
    ],
    palette:
      "Warm-gold-and-cream-marble honor-armor + chrome ceremonial-laurel + chrome-and-warm-gold honor-shield + warm provoke-rim + retreating anonymous soldier-silhouettes + warm dawn-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Auros at frame-centre alone forward, retreating soldiers at deep-distance",
    notes:
      "Rare unit. Generic-noble features must NOT match any named character. Anonymous retreating soldiers preserve no-character-conflation. The 'stands where others flee' is rendered through the visible spatial separation — Auros forward, others fleeing back.",
  },
  {
    cardId: "s1_reward_guild_territory",
    sceneDelta:
      "Wider mid-shot. A Territory Commander — female-presenting figure in late-thirties, generic-resolute features (sharp eyes, set jaw, hair tied back tightly), in heavy New Babylon-aligned territory-claim armor (deep slate-and-warm-gold plating with chrome guild-emblem at the chest). She stands at the centre of a contested-ground vista at frame-centre, mid-action of having JUST PLANTED a tall New Babylon FLAG (chrome-and-warm-gold flagpole, chrome-and-warm-gold banner with New Babylon emblem) into the disputed-ground at her feet. Her right hand still grips the flagpole. Around her, the contested-ground extends — uneven terrain with visible signs of recent conflict (broken structures, scorched earth). Her face shows defiant certainty. Behind her, the dared-world extends.",
    moodKeywords: [
      "she planted New Babylon's flag in contested ground",
      "and dared the world to pull it out",
      "tall flagpole just planted, hand still gripping",
      "defiant certainty, sharp eyes",
    ],
    palette:
      "Deep slate-and-warm-gold territory-claim armor + chrome guild-emblem + chrome-and-warm-gold flagpole + chrome-and-warm-gold New Babylon banner + contested-ground terrain + broken structures + scorched earth + warm sodium-light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Commander at frame-centre with planted flagpole, contested-ground extending behind",
    notes:
      "Rare unit. Generic-resolute features must NOT match any named character (specifically NOT Agent Zero or Iron Lion — different specific archetypes). The planted-flag + dared-world framing is canon-direct from flavor.",
  },
  {
    cardId: "s1_reward_guild_victory",
    sceneDelta:
      "Wider mid-shot. A War Dividend — at frame-centre, a recently-concluded battlefield with smoke still rising at lower-third (anonymous fallen figures back-shots, broken weapons, scorched ground). Through the still-rising smoke, anonymous LOCKE'S ACCOUNTANTS (multiple figures, all in formal Locke-aligned warm-leather-and-cream-marble accountant-coats with chrome-and-warm-gold ledger-clips, all back-three-quarter, generic-procedural) MOVE FORWARD into the battlefield carrying chrome-and-warm-gold ledger-tablets. Above the scene, faint warm-gold dividend-glyphs visibly accumulate (the canonical 'before the smoke cleared' framing). NO faces visible.",
    moodKeywords: [
      "the guild war ended",
      "Locke's accountants moved in before the smoke cleared",
      "anonymous accountants advancing through still-rising smoke",
      "warm-gold dividend-glyphs accumulating above",
    ],
    palette:
      "Battlefield smoke + anonymous fallen figures + scorched ground + warm-leather-and-cream-marble accountant-coats + chrome-and-warm-gold ledger-clips + chrome-and-warm-gold ledger-tablets + warm-gold dividend-glyphs + cool deep-shadow",
    composition:
      "Wider mid-shot, battlefield at frame-centre with rising smoke, accountants advancing through, dividend-glyphs above",
    notes:
      "Epic spell. Anonymous accountants + fallen preserve no-character-conflation. The 'before the smoke cleared' framing is rendered through visible still-rising smoke + accountants already advancing.",
  },
  {
    cardId: "s1_reward_syndicate_build",
    sceneDelta:
      "Mid-shot. A Syndicate Foreman — male-presenting figure in mid-fifties, generic-builder features (calm grave eyes, weathered hands, slight smile of satisfaction), in worn New Babylon construction-foreman's coat (warm-leather-and-warm-gold dust-coated working-attire with chrome-and-warm-gold foundation-medallion at the chest). He stands at the centre of a New Babylon construction-site at frame-centre, mid-action of inspecting a freshly-poured foundation. In the foreground at lower-third, a chrome-and-warm-gold cornerstone-plaque bears HIS OWN NAME (faintly legible, generic-builder-name) — the canonical 'twenty-first was his own.' Behind him, twenty other completed towers visible at varying depths in the background skyline.",
    moodKeywords: [
      "he poured the foundations for twenty towers",
      "the twenty-first was his own",
      "cornerstone-plaque with his own name",
      "twenty completed towers visible in skyline behind",
    ],
    palette:
      "Worn warm-leather-and-warm-gold construction-foreman's coat + chrome-and-warm-gold foundation-medallion + chrome-and-warm-gold cornerstone-plaque + warm New Babylon construction-site + twenty distant towers + warm sodium-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Foreman at frame-centre at construction-site, twenty distant towers in skyline behind",
    notes:
      "Rare unit. Generic-builder features must NOT match any named character. The 'twenty-first his own' framing is rendered through the visible cornerstone-plaque at his feet + the twenty completed towers behind.",
  },
  {
    cardId: "s1_reward_syndicate_empire",
    sceneDelta:
      "Wider mid-shot. A Syndicate Overlord — male-presenting figure in mid-fifties, generic-imperial features (composed grave eyes, distinguished silver-streaked beard, set jaw), in formal New Babylon Overlord's robes (deep warm-leather-and-warm-gold ceremonial fabric with chrome-and-warm-gold imperial-emblem at the breast). He stands at the centre of a vast Overlord's command-balcony at frame-centre, both hands on a chrome-and-warm-gold balcony-railing. Below the balcony at lower-third, a vast Overlord's FLEET extends across the deep-distance — multiple chrome-and-warm-gold capital-ships in formation visible (the fleet that made the fifth world's governor sign the treaty). Beside Overlord at frame-right edge, the SIGNED TREATY-DOCUMENT lies on a low side-table. His face is composed-grave.",
    moodKeywords: [
      "the fifth world fell without a shot",
      "its governor took one look at the Overlord's fleet and signed the treaty",
      "command-balcony overlooking vast fleet",
      "signed treaty-document at side-table",
    ],
    palette:
      "Deep warm-leather-and-warm-gold Overlord's robes + chrome-and-warm-gold imperial-emblem + chrome-and-warm-gold balcony-railing + vast chrome-and-warm-gold capital-ships in formation + signed treaty-document + warm command-balcony light + cool deep-shadow",
    composition:
      "Wider mid-shot back-three-quarter, Overlord at frame-centre at balcony, fleet extending below at lower-third",
    notes:
      "Epic unit. Generic-imperial features must NOT match Senator Voss (s1_char_117) — different specific archetype: Syndicate-Overlord vs Senator. The 'without a shot' is rendered through the visible fleet + signed treaty (no battle scene needed).",
  },
  {
    cardId: "s1_reward_trade_act1",
    sceneDelta:
      "Mid-shot. A Trade Scout — male-presenting figure in mid-twenties, generic-young features (alert eyes, slight forward-lean of newcomer-energy), in light New Babylon Trade-Scout coat (warm-leather over warm-cream linen with chrome trade-scout pin at the lapel — Scout-rank insignia). He stands at the centre of an alien-frontier landscape at frame-centre, mid-action of FIRST CONTACT with an off-frame alien-merchant (only the alien-merchant's tentacle/limb visible at frame-right edge — generic alien-form, no specific named species). In his right hand, he extends a SMALL CHROME-AND-WARM-GOLD CONTRACT-SCROLL (the first contract). At his belt, a small chrome trade-coin-pouch (the first profit yet to come). His face shows excited determination.",
    moodKeywords: [
      "first contact",
      "first contract",
      "first profit",
      "extending first contract-scroll to off-frame alien-merchant tentacle",
    ],
    palette:
      "Light warm-leather Trade-Scout coat + cool-cream linen + chrome trade-scout pin + chrome-and-warm-gold contract-scroll + chrome trade-coin-pouch + warm alien-frontier landscape + generic alien-tentacle + warm sodium-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Scout at frame-centre extending contract, alien-tentacle at frame-right edge",
    notes:
      "Common unit. Generic-young features must NOT match any named character. Anonymous alien-merchant (tentacle only) preserves no-character/species-conflation. The 'first contact' framing is the visual key.",
  },
  {
    cardId: "s1_reward_trade_act2",
    sceneDelta:
      "Mid-shot. A Trade Captain — female-presenting figure in mid-thirties, generic-experienced features (sharp eyes, set jaw, weathered captain's bearing), in formal New Babylon Trade-Captain coat (deep warm-leather over slate with chrome-and-warm-gold Captain's-pin + a small chrome silenced-pistol at her hip). She stands at the deck of a New Babylon trade-ship at frame-centre, mid-action of INSPECTING A CARGO-MANIFEST in her right hand. The manifest's pages show classified-redacted entries (visible chrome-and-warm-gold REDACTION-BARS over multiple lines). Beside her at lower-third, a small CHROME KILL-COUNT-LEDGER lies open (also classified-redacted). Her face is composed-veteran.",
    moodKeywords: [
      "her cargo manifest is classified",
      "so is her kill count",
      "redacted-bars over both manifest and kill-count-ledger",
      "composed-veteran captain's bearing",
    ],
    palette:
      "Deep warm-leather over slate Trade-Captain coat + chrome-and-warm-gold Captain's-pin + chrome silenced-pistol + classified cargo-manifest with redaction-bars + chrome kill-count-ledger + warm trade-ship deck + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Captain at frame-centre on trade-ship deck, manifest in hand, kill-ledger at side",
    notes:
      "Rare unit. Generic-experienced features must NOT match any named character. The dual-redacted-document framing (manifest + kill-count) is the canonical 'both classified' visualization.",
  },
  {
    cardId: "s1_reward_trade_empire",
    sceneDelta:
      "Wider mid-shot. A Merchant's Fortune — at frame-centre, a vast OPEN VAULT in a New Babylon merchant's headquarters. Inside the vault, neatly-arrayed CHROME-AND-WARM-GOLD MANA-CRYSTAL-SHARDS (the crystallized mana-currency, hundreds visible in stacks) glow softly. Around the vault, faint translucent warm-gold currency-script reads 'MANA = MONEY' in chrome-and-warm-gold runes (the canonical Locke-quote made visible — 'mana is just money by another name'). At lower-third, an anonymous merchant's hand (only fingertips visible at frame-bottom-edge, generic warm-leather sleeve) reaches into the vault to withdraw a single shard. NO face visible.",
    moodKeywords: [
      "Adjudicar Locke once said that mana is just money by another name",
      "he was not wrong",
      "vault filled with chrome-and-warm-gold mana-crystal-shards",
      "MANA = MONEY runes around the vault",
    ],
    palette:
      "Vast open vault + chrome-and-warm-gold mana-crystal-shards + warm-gold currency-script runes + warm vault-light + anonymous reaching fingertips + cool deep-shadow",
    composition:
      "Wider mid-shot, vault at frame-centre filled with shards, anonymous fingertips at frame-bottom-edge withdrawing shard",
    notes:
      "Rare spell. NOTE: flavor uses 'he' for Locke; per gen_new_babylon canonical visualization Locke is female. The mana=money equivalence is the canonical Locke-philosophy made literal.",
  },
  {
    cardId: "s1_reward_trade_tycoon",
    sceneDelta:
      "Wider mid-shot. A Galactic Tycoon — male-presenting figure in mid-fifties, generic-imperial features (composed knowing eyes, distinguished silver-streaked beard, slight grin), in formal New Babylon-aligned Galactic-Tycoon attire (deep warm-leather over warm-cream marble fabric with chrome-and-warm-gold MULTI-WORLD pin at the lapel — visible chrome icons of multiple distinct worlds). He stands at the centre of a vast NEW BABYLON SKY-LOUNGE at frame-centre, both hands behind his back. Behind him through tall arched windows, an OUTER-SPACE VISTA visible — multiple distant planets / star-systems clustered (the galaxy as his market). On a low side-table, a small chrome-and-warm-gold CREDIT-COUNTER reads '1,000,000+' (a million credits is just the beginning). His face is composed-knowing.",
    moodKeywords: [
      "a million credits is just the beginning",
      "the galaxy is a market",
      "multi-world pin showing chrome icons of multiple worlds",
      "outer-space vista with planets/star-systems behind",
    ],
    palette:
      "Deep warm-leather over warm-cream marble Galactic-Tycoon attire + chrome-and-warm-gold MULTI-WORLD pin + chrome-and-warm-gold credit-counter + tall arched windows + outer-space vista with distant planets + warm sky-lounge ambient + cool deep-space",
    composition:
      "Wider mid-shot front three-quarter, Tycoon at frame-centre at sky-lounge, outer-space vista behind",
    notes:
      "Legendary unit. Generic-imperial features must NOT match Syndicate Overlord (s1_reward_syndicate_empire — different specific archetype: Galactic-Tycoon vs Syndicate-Overlord; both distinguished silver-streaked but distinct contexts). The 'galaxy is a market' framing is rendered through the multi-world pin + outer-space vista.",
  },
  {
    cardId: "s1_spell_116",
    sceneDelta:
      "Mid-shot. A Blood Tax — Adjudicator Locke (canonical features: female mid-forties, eye-patch on left eye, deep warm-leather Adjudicator's coat) at frame-centre, mid-action of TRANSFERRING A COST. Her right hand holds a chrome-and-warm-gold blood-token (visibly luminous deep-crimson); her left hand pushes a chrome-and-warm-gold INVOICE-LEDGER toward an off-frame recipient (only the recipient's hand visible at frame-right edge). The invoice's top-line shows 'COST: TRANSFERRED' in chrome-and-warm-gold script. Her face is composed, untroubled — she does not flinch. Behind her, faint warm low office-light.",
    moodKeywords: [
      "Locke never flinches at the cost",
      "he simply adds it to someone else's invoice",
      "transferring blood-token cost via invoice-ledger",
      "untroubled, single-eyed gaze",
    ],
    palette:
      "Deep warm-leather Adjudicator's coat + chrome-and-warm-leather eye-patch + chrome-and-warm-gold blood-token + deep-crimson token-glow + chrome-and-warm-gold invoice-ledger + warm low office-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Locke at frame-centre, blood-token in right hand, invoice pushed toward off-frame recipient at frame-right edge",
    notes:
      "Uncommon spell. Visual continuity with all Locke renderings (eye-patch). NOTE: flavor uses 'he' for Locke; canonical visualization is female-presenting per gen_new_babylon. Anonymous recipient (hand only) preserves no-character-conflation.",
  },
  {
    cardId: "s1_spell_117",
    sceneDelta:
      "Wider mid-shot. A Market Manipulation — at frame-centre, a New Babylon trading-floor at the moment of WHISPER-OBEDIENCE: anonymous Locke-aligned figure (back-three-quarter, deep warm-leather coat, hooded — only silhouette visible) in upper-third whispers something to a chrome-and-warm-gold market-controller console. From the whisper, a faint translucent silver-mist whisper-pulse propagates downward through the floor. The pulse REACHES the market AHEAD of the official market-shout (a chrome-and-warm-gold ALARM-INDICATOR at the floor's centre is just-beginning to flash but the prices have ALREADY shifted). Anonymous traders at lower-third react in slower-than-the-pulse confusion. Faint warm low trading-floor light.",
    moodKeywords: [
      "the market obeyed Locke's whisper before it heard the shout",
      "by the time the correction came, fortunes had already changed hands",
      "translucent silver-mist whisper-pulse arriving ahead of alarm-indicator",
      "anonymous traders in slower-than-pulse confusion",
    ],
    palette:
      "Deep warm-leather hooded Locke-aligned figure + chrome-and-warm-gold market-controller console + translucent silver-mist whisper-pulse + chrome-and-warm-gold alarm-indicator + anonymous trader-silhouettes + warm low trading-floor light + cool deep-shadow",
    composition:
      "Wider mid-shot, hooded figure at upper-third whispering, whisper-pulse descending, traders at lower-third reacting",
    notes:
      "Common spell. Anonymous Locke-aligned figure (hooded back-three-quarter) preserves Locke's identity-via-context (the whisper is hers). Anonymous traders preserve no-character-conflation.",
  },
  {
    cardId: "s1_spell_118",
    sceneDelta:
      "Mid-shot. A Syndicate Contract — at frame-centre, a chrome-and-warm-gold CONTRACT-DOCUMENT laid open on a low warm-leather private-table. The contract's surface shows chrome-and-warm-gold ceremonial script with a SIGNATURE-LINE at the bottom AND a small blood-letting INSTRUMENT (a small chrome-and-warm-gold pin-needle) beside it (the canonical 'sign here, in blood'). An anonymous figure (only their hand visible at frame-bottom-edge, generic civilian sleeve) is mid-action of having JUST PRICKED their fingertip — a single drop of warm-crimson blood is mid-fall toward the signature-line. Their face is not visible. Faint warm low private-table light.",
    moodKeywords: [
      "sign here, in blood",
      "the power is yours — for exactly as long as it takes to spend it",
      "blood-letting pin-needle beside signature-line",
      "single drop of warm-crimson blood mid-fall toward signature",
    ],
    palette:
      "Chrome-and-warm-gold contract-document + chrome-and-warm-gold ceremonial script + chrome-and-warm-gold pin-needle + warm-crimson blood-drop + warm-leather private-table + anonymous fingertip + warm low private-table light + cool deep-shadow",
    composition:
      "Mid-shot, contract at frame-centre on table, anonymous fingertip at frame-bottom-edge with blood-drop mid-fall",
    notes:
      "Uncommon spell. Anonymous signer (fingertip only) preserves no-character-conflation. The 'sign in blood' is rendered through the visible blood-letting instrument + mid-fall drop.",
  },
  {
    cardId: "s1_spell_119",
    sceneDelta:
      "Wider mid-shot. A Hostile Acquisition — at frame-centre, the moment of LOCKE'S BLOODLESS CONQUEST: a vast New Babylon Senate-chamber filled with leveraged-asset documents stacked on every Senate-bench (chrome-and-warm-gold contract-folders, signed-soul-receipts, leveraged-asset-deeds — the city itself in paper form). At the centre of the chamber, Adjudicator Locke (canonical features, eye-patch, deep warm-leather coat) stands at the central rostrum, both hands at sides, calm-victorious. On the rostrum before her, a single chrome-and-warm-gold CITY-DEED-DOCUMENT is freshly-signed. NO weapons visible (canonical 'didn't conquer with armies'). NO opposition figures visible — they have already been bought-out. Her face shows quiet satisfaction.",
    moodKeywords: [
      "Locke didn't conquer New Babylon with armies",
      "he bought it — one signature, one soul, one leveraged asset at a time",
      "Senate-chamber filled with leveraged-asset documents",
      "no weapons visible, no opposition visible",
    ],
    palette:
      "Deep warm-leather Adjudicator's coat + chrome-and-warm-leather eye-patch + chrome-and-warm-gold contract-folders + signed-soul-receipts + leveraged-asset-deeds + chrome-and-warm-gold city-deed-document + warm Senate-chamber sodium-light + cool deep-shadow",
    composition:
      "Wider mid-shot front three-quarter, Locke at frame-centre at rostrum, Senate-benches piled with documents around",
    notes:
      "Rare spell. Visual continuity with all Locke renderings. The 'bought not conquered' framing is rendered through the absence of weapons + presence of paper documents. NOTE: flavor uses 'he' for Locke; canonical visualization is female-presenting.",
  },
  {
    cardId: "s1_spell_224",
    sceneDelta:
      "Mid-shot. A Tax Collector — male-presenting figure in late-thirties, generic-procedural features (no expression, calm dark eyes), in standard New Babylon Tax-Collector coat (warm-leather over slate with chrome-and-warm-gold tax-pin at the lapel). He stands at the threshold of an anonymous citizen's doorway at frame-centre, mid-action of EXTENDING A PALM toward the doorway interior — palm-up, demanding payment. The doorway is OPEN; the citizen NOT VISIBLE (only the doorway's interior is seen, dim warm low light within). In his other hand, a small chrome-and-warm-gold tax-tablet showing a flexible-currency conversion-table (multiple currency-types listed in chrome-and-warm-gold, all ending at a single deadline-date). His face is unmoved.",
    moodKeywords: [
      "payment is due",
      "the currency is flexible",
      "the deadline is not",
      "palm-up demanding-gesture at anonymous doorway",
    ],
    palette:
      "Warm-leather over slate Tax-Collector coat + chrome-and-warm-gold tax-pin + chrome-and-warm-gold tax-tablet + flexible-currency conversion-table + warm low doorway-light + cool deep-shadow",
    composition:
      "Mid-shot front three-quarter, Tax Collector at frame-centre at open doorway, palm extended into interior",
    notes:
      "Common spell. Generic-procedural features must NOT match Debt Collector (s1_pack_033) — both are extraction-figures but different specific roles: Tax-Collector demands at door vs Debt-Collector subtracts in absentia.",
  },
  {
    cardId: "s1_spell_225",
    sceneDelta:
      "Mid-shot. A Bounty Notice — at frame-centre, a chrome-and-warm-gold BOUNTY-NOTICE plaque mounted on a warm-leather notice-board at a New Babylon district-square. The notice shows: a chrome-and-warm-gold redacted target-portrait at the upper, a chrome-and-warm-gold price-amount in the centre, and a chrome-and-warm-gold timestamp at the bottom (the dawn-time canonical 'goes up at dawn'). At lower-third, an anonymous bounty-hunter (back-three-quarter, generic-cool-leather) walks past the notice with a small smile — they have already begun the work. Faint warm noon-light from above (mid-day already; the work is being done quickly).",
    moodKeywords: [
      "the notice goes up at dawn",
      "by noon, the work is done",
      "chrome-and-warm-gold bounty-notice with redacted target-portrait",
      "anonymous hunter walking past with small smile",
    ],
    palette:
      "Chrome-and-warm-gold bounty-notice plaque + warm-leather notice-board + chrome-and-warm-gold redacted target-portrait + chrome-and-warm-gold price-amount + chrome-and-warm-gold timestamp + warm noon-light + cool deep-shadow",
    composition:
      "Mid-shot, bounty-notice at frame-centre on notice-board, anonymous hunter at lower-third walking past",
    notes:
      "Uncommon spell. Anonymous target-portrait (redacted) and hunter (back-three-quarter) preserve no-character-conflation. The dawn-to-noon rapid-execution is rendered through the warm noon-light setting.",
  },
  {
    cardId: "s1_spell_226",
    sceneDelta:
      "Wider mid-shot. A Crystal Vault — at frame-centre, a vast CRYSTAL-WALLED VAULT chamber. INSIDE the vault (visible behind translucent crystal-walls), valuable items are arrayed on chrome-and-warm-gold shelves: art, chrome-and-warm-gold ingots, brass-and-glass mana-crystals, all visibly faintly LUMINOUS (appreciating value). OUTSIDE the vault at frame-edges, the surrounding chamber shows visible decay: dust, cobwebs, broken furniture (depreciating value). The vault's crystal-walls are sharp-edged; the IN-vs-OUT contrast is the visual key. NO human figure (the vault IS the subject). Faint warm low vault-interior glow.",
    moodKeywords: [
      "behind crystal walls, value appreciates",
      "outside, everything depreciates",
      "translucent crystal-walls separating appreciating-interior from depreciating-exterior",
      "no human figure",
    ],
    palette:
      "Translucent crystal-walls + chrome-and-warm-gold interior shelves + valuable art + chrome-and-warm-gold ingots + brass-and-glass mana-crystals + decayed exterior + dust and cobwebs + warm low vault-interior glow + cool deep-shadow",
    composition:
      "Wider mid-shot, vault at frame-centre, IN-interior appreciating, OUT-exterior decayed",
    notes:
      "Common spell. NO human figure (the vault IS the subject). The IN-vs-OUT visual contrast is the canonical visualization. Echoes Antiquarian Preservation Field (s1_spell_234) but applied to commercial value-preservation rather than temporal-preservation.",
  },
  {
    cardId: "s1_spell_227",
    sceneDelta:
      "Mid-shot. A Leveraged Buyout — at frame-centre, an anonymous Locke-aligned syndicate-figure (back-three-quarter, deep warm-leather over slate vest, generic-procedural) stands at the threshold of an anonymous CITIZEN-OWNED ASSET (a small business-front, warm-leather signage above the door, dim warm interior visible). The syndicate-figure is mid-action of POSTING A 'NEW MANAGEMENT' notice on the door — a chrome-and-warm-gold plaque being affixed. The original-owner (also anonymous, only their feet visible at frame-bottom-edge being escorted away) is mid-departure. Faint warm low business-front light. The asset is being restructured. NO faces visible.",
    moodKeywords: [
      "your asset is underperforming",
      "allow us to restructure it under new management",
      "syndicate-figure posting NEW MANAGEMENT plaque",
      "original-owner being escorted away (feet only visible)",
    ],
    palette:
      "Deep warm-leather over slate syndicate-vest + chrome-and-warm-gold NEW MANAGEMENT plaque + warm-leather business-front signage + dim warm interior + anonymous original-owner feet + cool deep-shadow + warm low light",
    composition:
      "Mid-shot back-three-quarter on syndicate-figure at door, original-owner's feet at frame-bottom-edge departing",
    notes:
      "Rare spell. Anonymous syndicate-figure + anonymous original-owner preserve no-character-conflation. The 'restructuring under new management' euphemism is rendered through the polite plaque + the involuntary departure.",
  },
  {
    cardId: "s1_spell_228",
    sceneDelta:
      "Wider mid-shot. Economic Sanctions — at frame-centre, a vast New Babylon CURRENCY-CONTROL CENTER chamber. Multiple chrome-and-warm-gold CURRENCY-FLOW VALVES are visible at upper-third, mid-action of CLOSING in unison (each valve has a small chrome-and-warm-gold off-position lever). From each closed valve, a faint translucent warm-gold currency-stream visibly STOPS at the valve's exit-point — currency that was flowing OUT to recipient-systems is now blocked. At lower-third, multiple anonymous starving-recipient silhouettes (back-three-quarter, generic-civilian + tactical figures, varying scales — even GOD-SIZED silhouettes among them per canonical 'even gods go hungry') stand visibly affected, hands clutched to empty-stomachs. NO faces visible.",
    moodKeywords: [
      "when New Babylon cuts the purse strings",
      "even gods go hungry",
      "chrome-and-warm-gold currency-flow valves mid-closing in unison",
      "starving recipient silhouettes including god-sized variants",
    ],
    palette:
      "Chrome-and-warm-gold currency-control center + chrome-and-warm-gold currency-flow valves + chrome-and-warm-gold off-position levers + faint translucent warm-gold currency-streams stopped + anonymous starving recipient silhouettes (varying scales) + warm low control-center light + cool deep-shadow",
    composition:
      "Wider mid-shot, valves at upper-third closing, anonymous starving recipients at lower-third",
    notes:
      "Uncommon spell. Anonymous recipients (back-three-quarter, varying scales including god-sized) preserve no-character-conflation. The 'even gods go hungry' is rendered through the scale-variation in the recipient silhouettes.",
  },
  {
    cardId: "s1_spell_229",
    sceneDelta:
      "Wider mid-shot. A Liquidation Sale — at frame-centre, a New Babylon outdoor sale-yard at frame-centre, with multiple LOTS arranged in rows: chrome-and-warm-gold LOT-SIGNS labeling each row (chrome equipment lots, warm-leather property lots, warm-cream marble-statue lots — a full inventory of holdings). Critically, the LAST ROW at lower-third shows ANONYMOUS SOLDIERS (back-three-quarter, generic-mixed New Babylon-aligned tactical figures, all standing at parade-rest under a chrome-and-warm-gold 'SOLDIERS' lot-sign) — the canonical 'including the soldiers' framing made literal. Anonymous BUYERS (also back-three-quarter, generic civilian + foreign-aligned figures) walk past inspecting lots. NO faces visible.",
    moodKeywords: [
      "everything must go",
      "including the soldiers",
      "chrome-and-warm-gold SOLDIERS lot-sign over anonymous soldier-row",
      "anonymous buyers walking past inspecting",
    ],
    palette:
      "New Babylon outdoor sale-yard + chrome-and-warm-gold lot-signs + chrome equipment lots + warm-leather property lots + warm-cream marble-statue lots + chrome-and-warm-gold SOLDIERS lot-sign + anonymous soldier-row + anonymous buyer-silhouettes + warm sodium-light + cool deep-shadow",
    composition:
      "Wider mid-shot, sale-yard rows extending across frame, SOLDIERS row at lower-third, anonymous buyers walking through",
    notes:
      "Common spell. Anonymous soldiers + buyers preserve no-character-conflation. The 'including the soldiers' is rendered through the literal SOLDIERS lot-sign — making the ultimate-commodification visible.",
  },
] as const;

/**
 * New Babylon faction's prompt registry, keyed by card id.
 *
 * Currently populated: 52 / 52 cards — COMPLETE
 * (gen_new_babylon, s1_char_001, s1_char_003, s1_char_020,
 *  s1_char_033, s1_char_061, s1_char_066, s1_char_078,
 *  s1_char_079, s1_char_080, s1_char_081, s1_char_082-085,
 *  s1_char_117-120, s1_pack_029-035, s1_pack_seed_fighter,
 *  s1_pack_seed_trade, s1_reward_casino_high_roller,
 *  s1_reward_casino_poker, s1_reward_casino_vip,
 *  s1_reward_class_soldier, s1_reward_companion_locke,
 *  s1_reward_eidolon_auros, s1_reward_guild_territory,
 *  s1_reward_guild_victory, s1_reward_syndicate_build,
 *  s1_reward_syndicate_empire, s1_reward_trade_act1,
 *  s1_reward_trade_act2, s1_reward_trade_empire,
 *  s1_reward_trade_tycoon, s1_spell_116-119,
 *  s1_spell_224-229).
 */
export const NEW_BABYLON_CARD_ART_PROMPTS: Readonly<Record<string, CardArtPrompt>> =
  Object.freeze(
    Object.fromEntries(NEW_BABYLON_PROMPTS_LIST.map((p) => [p.cardId, p])),
  );
