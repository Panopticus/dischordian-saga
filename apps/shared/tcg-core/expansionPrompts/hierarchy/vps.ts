/**
 * Hierarchy of the Damned — VP-tier (7 legendaries).
 *
 * Senior vice presidents reporting directly to the C-Suite. Two are
 * direct lifts from established LORE_BIBLE canon (Varkul, Shadow
 * Tongue). Five are newly-named per the 2026-04-27 plan §Hierarchy
 * naming policy and slot into the corporate-hell framing as the
 * Hierarchy's Sales / Engineering / Strategy / Operations Risk /
 * Internal Audit vice presidencies.
 *
 * All seven are LEGENDARY rarity, faction `new_babylon`.
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "s2_hierarchy_vp_security_varkul": {
    cardId: "s2_hierarchy_vp_security_varkul",
    name: "Varkul the Blood Lord, VP of Information Security",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "legendary",
    cardType: "unit",
    flavorText:
      "The Cathedral of Code has one keeper. Varkul does not patrol it; he *is* the perimeter. Every breach is paid in blood — sometimes the attacker's, sometimes the defender's, sometimes both.",
    sceneDelta:
      "Mid-shot front three-quarter. Varkul stands at the threshold of the Cathedral of Code — a vast nave whose walls and pillars are columns of slowly-flowing dark-red corrupted-code that twists and recompiles in real time. He is a tall, lean vampiric entity in a Hierarchy crimson-and-black robed-armor — half priestly cassock, half tactical chest-rig, the cassock's hem trailing into wisps of red mist. His face is gaunt, pale-as-marble, with two thin canines just visible at the resting mouth, and a single small dark-red rune burning faintly on his forehead. In one hand he carries a long obsidian-bladed pike whose haft is wrapped in barbed-wire-thin code-strands; in the other a small censer that swings on a chain, releasing not smoke but coagulating drops of dark-red lifeforce into the air. Behind him: the Cathedral nave recedes into glowing-red infinity. A faint blue forcefield-shimmer wraps his torso (forcefield).",
    moodKeywords: [
      "the Cathedral keeper",
      "blood is policy",
      "calm faith of a corrupted priest",
      "every breach paid in blood",
    ],
    palette:
      "Hierarchy crimson + black armor + marble-pale skin + dark-red corrupted-code columns + faint forehead rune-glow + cool-blue forcefield-shimmer + censer's coagulating lifeforce-drops",
    composition:
      "Mid-shot front three-quarter, Varkul at frame-centre at the Cathedral threshold, nave receding behind into vanishing point",
    notes:
      "Legendary. Vampiric framing must read as priestly more than predatory — the canon Varkul is a guardian, not a hunter. The Cathedral of Code's dark-red columns are the Hierarchy's iconic environment — re-use this backdrop for any technology-stack card. Pairs visually with Skarn-Iterate (CTO mythic) — Skarn ships the corruption Varkul defends.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Varkul the Blood Lord",
      "docs/built/LORE_BIBLE.md §Cathedral of Code",
    ],
  },

  "s2_hierarchy_vp_comms_shadow_tongue": {
    cardId: "s2_hierarchy_vp_comms_shadow_tongue",
    name: "The Shadow Tongue, SVP of Communications & Propaganda",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "legendary",
    cardType: "spell",
    flavorText:
      "It started as a memo. Then it became the shape of a memo. Then it became the shape of every memo that would ever be written. By the time anyone noticed, the Severance was already filed.",
    sceneDelta:
      "Wide environmental composition. The Shadow Tongue is not a humanoid — it is a CONCEPT given visual form. Centre of frame: a slow black liquid-shadow uncoiling out of an open ceremonial leather-bound Hierarchy memo-folder resting on a polished mahogany executive desk. The shadow rises in a sinuous serpentine column about two metres tall, coalescing into a mouth-shape at its top — a wide lipless smile of pure black void in which thousands of tiny mouths whisper simultaneously, each whispering a different language fragment that distorts the air around it (visualize as faint heat-shimmer). The shadow's lower body is still pouring out of the memo, suggesting it has no fixed volume. Behind: a Hierarchy executive office at dawn, floor-to-ceiling windows showing a thousand identical Hierarchy memos drifting in the air outside the building, each one carrying a corrupting fragment to a different reader.",
    moodKeywords: [
      "language as infestation",
      "the memo that writes you",
      "smile of a thousand mouths",
      "Severance filed at dawn",
    ],
    palette:
      "Hierarchy plum-and-charcoal office + warm dawn through floor-to-ceiling windows + pure void-black shadow column + faint heat-shimmer language-distortion + drifting paper-pale memos outside",
    composition:
      "Wide environmental, shadow column at frame-centre rising from desk-foreground, executive office and dawn windows filling background, drifting memos outside",
    notes:
      "Legendary spell card. Critical: the Shadow Tongue must NOT be anthropomorphized — the LORE_BIBLE framing is 'concept given malevolent will, evolved beyond its creator (the Collector)'. The thousand-mouths smile is the canon visual signature. The drifting-memos backdrop shows scale of operation without spoiling Severance specifics.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Shadow Tongue",
      "docs/built/LORE_BIBLE.md §Severance",
      "docs/built/LORE_BIBLE.md §The Collector (creator-of-Shadow-Tongue framing)",
    ],
  },

  "s2_hierarchy_vp_sales_kelv_orth": {
    cardId: "s2_hierarchy_vp_sales_kelv_orth",
    name: "Kelv'Orth, VP of Soul Acquisitions",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "legendary",
    cardType: "unit",
    flavorText:
      "Quotas are descending. Discounts are unauthorized. The pipeline is — Kelv'Orth pauses, smiles — qualified.",
    sceneDelta:
      "Mid-shot. Kelv'Orth is broad, charismatic, mid-forties, in a Hierarchy steel-blue blazer-and-slacks combo with the top button of his shirt deliberately open and a small Hierarchy crest cufflink. Quarchon-aligned features but warmer than Riri's — he is built for handshakes. He is mid-pitch in a glass-walled Hierarchy sales boardroom, leaning toward a wall-projection of a Pipeline of Souls (a flowing horizontal river of small floating soul-glyphs, each tagged with a tiny dossier; the river segments into stages: PROSPECT → QUALIFIED → CLOSED → COLLECTED). His right hand is mid-sweep across the projection, drawing attention to a glyph just crossing the CLOSED threshold. His left hand holds a thin Hierarchy stylus tipped with a single drop of contract-blood. Above the boardroom door: a mid-sized leaderboard with three Hierarchy-themed sales-tournament names, blurred deliberately.",
    moodKeywords: [
      "the closing handshake",
      "pipeline of souls visualized as Q3 forecast",
      "warm charisma at the abyss",
      "qualified leads, qualified screams",
    ],
    palette:
      "Hierarchy steel-blue blazer + warm boardroom lighting + soul-glyph cool-cyan + contract-blood deep-red + leaderboard blurred-amber",
    composition:
      "Mid-shot three-quarter, Kelv'Orth at frame-left mid-pitch, Pipeline-of-Souls projection occupying right two-thirds of frame",
    notes:
      "Legendary unit. Sales charisma must read as competent, not slick — Kelv'Orth is the Hierarchy's most respected closer, not a caricature. Pipeline-of-Souls is the canonical sales-VP signature. Deliberately blur the leaderboard to avoid implying named characters have been collected.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Pairs with Vex'Drelm (CMO mythic) on the revenue side — Vex'Drelm acquires the brand, Kelv'Orth closes the contract.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as sacred law",
    ],
  },

  "s2_hierarchy_vp_engineering_drask": {
    cardId: "s2_hierarchy_vp_engineering_drask",
    name: "Drask Vornal, VP of Code Corruption Engineering",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "legendary",
    cardType: "unit",
    flavorText:
      "Drask does not write malware. Drask refactors the legitimate codebase one careful PR at a time, until the legitimate codebase IS the malware.",
    sceneDelta:
      "Mid-shot front-on. Drask Vornal is a rumpled mid-thirties Quarchon engineer in a Hierarchy charcoal hoodie zipped halfway over a black t-shirt with a small Hierarchy crest, sleeves pushed up to reveal forearms tattooed with shifting code-glyphs that slowly migrate across his skin. He sits at a four-monitor command rig in a dim Hierarchy R&D lab, only the monitor-glow lighting his face — half-cyan, half-bloody-red. Each of the four monitors shows a different stage of a corruption pipeline: a clean source file (top-left), a code-review interface with a Hierarchy reviewer's avatar (top-right), a CI build going green (bottom-left), and a subtly-corrupted production deployment (bottom-right). Drask's face is intent, faintly amused — a craftsman in flow-state. His right hand rests on a custom mechanical keyboard whose keys are bone-white with red-glowing legends.",
    moodKeywords: [
      "the corruption inside the legitimate PR",
      "monitor-glow craftsman",
      "code that reviews itself approving its own corruption",
      "the engineer who LOVES this work",
    ],
    palette:
      "Hierarchy charcoal hoodie + bone-white keyboard with red legends + monitor-cyan/blood-red dual lighting + shifting forearm code-tattoos + dim Hierarchy R&D lab background",
    composition:
      "Mid-shot front-on, Drask at frame-centre seated, four monitors arranged around him, dim lab receding into shadow",
    notes:
      "Legendary unit. Drask reports to Skarn-Iterate (CTO) — the visual feel here is hands-on engineering hours, not the executive level. The four-monitor corruption-pipeline is the canonical VP-Engineering visual; do NOT show specific code (illegible glyphs only) so this card doesn't spoiler any Act 3+ technology reveals.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Drask is the IC-archetype counterpart to Skarn-Iterate's executive layer — the Hierarchy's technology stack needs both the executive (Skarn) and the senior IC (Drask) to feel real.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Cathedral of Code",
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_vp_strategy_thelv_oss": {
    cardId: "s2_hierarchy_vp_strategy_thelv_oss",
    name: "Thelv'Oss, VP of Long-Range Strategy",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "legendary",
    cardType: "unit",
    flavorText:
      "Five-year plans are for amateurs. Thelv'Oss thinks in five-Epoch increments. The current Epoch is, by her reckoning, on schedule.",
    sceneDelta:
      "Wide three-quarter portrait. Thelv'Oss is sharp-featured, ageless, Quarchon-aligned, with hair the colour of cooled iron pulled into a single tight braid that falls past her waist. She wears a Hierarchy slate-grey high-collar long coat over a dark under-suit, and a single chain at her neck holds a small obsidian pendant carved with a multi-Epoch timeline glyph. She stands at a Hierarchy strategy-room war-table that is not a table but a hovering scaled holographic model of seventeen dimensions, each rendered as a slowly-rotating translucent sphere arranged in a nested orbital configuration. Her right hand is extended over the model, palm-down, fingers slightly curled, the gesture of a chess player about to move a piece she has been studying for hours. The hologram throws her face in cool-cyan light from below.",
    moodKeywords: [
      "thinking in Epoch increments",
      "the chess player who has already moved",
      "ironcooled patience",
      "seventeen dimensions as game pieces",
    ],
    palette:
      "Hierarchy slate-grey long coat + iron-cooled hair + dark under-suit + obsidian pendant + cool-cyan hologram-uplight + dimensional spheres translucent rainbow-iridescence",
    composition:
      "Wide three-quarter, Thelv'Oss at frame-right standing, hovering hologram-model occupying frame-centre and -left, war-room arc in soft focus behind",
    notes:
      "Legendary unit. Thelv'Oss's calm must read as deeper than Mor'Vethic's — the canon framing is patience-as-weapon. The seventeen-dimension model parallels Riri'Ahlia's seventeen-dimension command but at the planning layer, not the operational layer (intentional design echo).",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. The Hierarchy is canonically a long-game organization (LORE_BIBLE: Mol'Garath's Contracts are eternal); a Strategy VP grounds that in a memorable visual.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as eternal",
    ],
  },

  "s2_hierarchy_vp_ops_risk_kragvex": {
    cardId: "s2_hierarchy_vp_ops_risk_kragvex",
    name: "Kragvex, VP of Operational Risk",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "legendary",
    cardType: "unit",
    flavorText:
      "Other VPs prepare for the worst. Kragvex prepares for slightly-worse-than-the-worst, then negotiates the budget for a contingency on top of that, then bills the contingency to a different cost centre.",
    sceneDelta:
      "Mid-shot. Kragvex is heavy-set, broad, mid-fifties, in a rumpled Hierarchy charcoal three-piece suit (the waistcoat strained slightly at the buttons), bald, with a single small Hierarchy crest pin. He sits behind a wide steel-grey Hierarchy risk-register desk piled high with bound binders labeled in spine-text: 'Q3 BREACH SCENARIOS', 'INSURGENT OPERATIONS — ACTIVE', 'CONTINGENCY ALPHA-TWELVE', etc. (tilt the binders enough that the readable spines are LEGIBLE-BUT-GENERIC; do NOT name specific Acts/operations). He is mid-action, lifting a heavy red wax-seal stamp toward a single open binder; on the visible page, a contingency authorization line is awaiting his sign-off. His left hand holds a half-eaten Hierarchy-cafeteria pastry. The desk lamp throws him in warm amber, while a wall-mounted threat-feed in the background pulses faint red.",
    moodKeywords: [
      "the prepared pessimist",
      "binders as armor",
      "pastry-while-stamping",
      "every disaster pre-budgeted",
    ],
    palette:
      "Hierarchy charcoal three-piece + warm amber desk-lamp + steel-grey desk + bound-binder forest-green + red wax-seal stamp + faint red threat-feed background",
    composition:
      "Mid-shot three-quarter, Kragvex at frame-centre seated, binder stacks framing him left and right, threat-feed in soft-focus background",
    notes:
      "Legendary unit. Kragvex's bulk and rumpled suit are intentional — the Hierarchy's risk function should feel lived-in and competent, not ascetic. Binder spine-text MUST be legible-but-generic so this card doesn't preview specific Insurgency operations covered in Act 3+ canon.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Pairs with Iglarath (CISO mythic) — Iglarath audits the breaches, Kragvex pre-budgets for them.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Insurgency vs Hierarchy operational framing",
    ],
  },

  "s2_hierarchy_vp_audit_nessith": {
    cardId: "s2_hierarchy_vp_audit_nessith",
    name: "Nessith the Reconciler, VP of Internal Audit",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "legendary",
    cardType: "unit",
    flavorText:
      "Two facts contradict. Nessith's job is not to determine which is true. Nessith's job is to file the variance, recommend a control, and close the period.",
    sceneDelta:
      "Mid-shot. Nessith is slight, calm, of indeterminate age, with the kind of face that does not register on first introduction — Quarchon-aligned but plainer than the C-Suite. She wears a Hierarchy plain charcoal blouse-and-skirt with no jewelry, no Hierarchy crest visible, only a lanyard with a small audit-clearance badge. She sits at a small standing-desk in a deliberately-bland Hierarchy audit-floor cubicle, a single open laptop in front of her displaying a reconciliation grid (two columns of figures with a difference column between them). On her desk: a single mug of plain tea, a small green pot-plant, a stack of three folders neatly aligned. The cubicle wall behind her holds a single small framed Hierarchy values-statement and one print of an asphodel field. The cubicle's overhead fluorescent throws everything in flat institutional light.",
    moodKeywords: [
      "the audit closes the period",
      "the face you forget twice",
      "two facts, one variance, one control",
      "deliberate flat institutional light",
    ],
    palette:
      "Hierarchy plain charcoal blouse + flat institutional fluorescent + cool-grey cubicle walls + mug-of-plain-tea + asphodel-field print pale-grey + lanyard a single accent thread of Hierarchy plum",
    composition:
      "Mid-shot front-on, Nessith at frame-centre seated, cubicle walls framing her tightly, no environmental depth",
    notes:
      "Legendary unit. The deliberate plainness is the Nessith signature — the framing is 'audit is the most powerful function in the Hierarchy because nobody notices it'. NO Hierarchy crest visible, NO power posture — every other VP's image is an image OF power; Nessith's is the absence of one. Asphodel print echoes Mor'Vethic's asphodel plant (intentional — both work in liminal-administrative roles).",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. The Hierarchy's bureaucratic-horror framing requires a function that performs reconciliation rather than fights — Nessith fills that role and pairs with Mor'Vethic's HR liminality.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Xeth'Raal Ledger-of-Ruin (audit-of-audit framing)",
    ],
  },
};

export const VP_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
