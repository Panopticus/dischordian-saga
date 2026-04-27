/**
 * Hierarchy of the Damned — C-Suite (7 mythics).
 *
 * The supreme officers of the infernal corporation that runs the
 * S2_HIERARCHY set. Three are direct lifts from established LORE_BIBLE
 * canon (Mol'Garath, Xeth'Raal, Riri'Ahlia reprint). Four are newly-
 * named per the 2026-04-27 plan and slot into the corporate-hell
 * framing as the Hierarchy's Marketing / Technology / Human-Resources
 * / Information-Security executives.
 *
 * All seven are MYTHIC rarity, faction `new_babylon` (the Hierarchy is
 * the demonic mirror of New Babylon's Authority — already the canon
 * affiliation of Riri'Ahlia at s1_char_061).
 */
import type { ExpansionCardRegistry } from "../types";

const ENTRIES: ExpansionCardRegistry = {
  "s2_hierarchy_ceo_mol_garath": {
    cardId: "s2_hierarchy_ceo_mol_garath",
    name: "Mol'Garath the Unmaker, CEO of the Hierarchy",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "mythic",
    cardType: "unit",
    flavorText:
      "Where lesser executives hold quarterly reviews, Mol'Garath holds quarterly Unmakings. The Labyrinth was his first audit. The 72-hour deadline was his only joke.",
    sceneDelta:
      "Wide low-angle hero shot from the Hierarchy's apex boardroom — a vast obsidian-and-bone roundtable suspended over a churning red-black abyss. Mol'Garath stands at the head of the table, an enormous twelve-foot horned silhouette in a tailored matte-black executive suit, the cloth shot through with veins of dim red phosphor that pulse in time with his breathing. His face is a sculpted onyx mask with no mouth and four small inset eyes arranged in a square pattern. In one gauntleted hand he holds a Contract — a parchment scroll folded into the shape of a guillotine blade, its edge weeping a single drop of blood that hangs frozen mid-fall. Behind him: the wall is one vast translucent window onto the Labyrinth of Unmaking — geometry that turns when you look away. Faint bureaucratic-green provoke-glow rims his shoulders.",
    moodKeywords: [
      "contracts are sacred law",
      "the Unmaking is policy, not malice",
      "boredom of immortal authority",
      "sculpted-mask presidency",
    ],
    palette:
      "Hierarchy obsidian-black + corporate matte suit + red-black abyss + dim red phosphor veins + bureaucratic-green provoke-rim + frozen blood-drop accent",
    composition:
      "Wide low-angle hero shot, Mol'Garath at frame-centre at the boardroom-table head, Labyrinth window filling upper-third of frame",
    notes:
      "Mythic. Mol'Garath's mask must NOT show emotion — the canon framing is procedural, not cruel. The contract-as-guillotine motif is the Hierarchy signature; every C-Suite card carries some variant of it. The Labyrinth window must be visible but indistinct — readers should sense the Game Master defeated it but not see how.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Mol'Garath",
      "docs/built/LORE_BIBLE.md §Game Master (Labyrinth-of-Unmaking 72hr resolution)",
      "apps/client/src/pages/DemonPackPage.tsx:Mol'Garath's Vault SKU",
    ],
  },

  "s2_hierarchy_cfo_xeth_raal": {
    cardId: "s2_hierarchy_cfo_xeth_raal",
    name: "Xeth'Raal, Debt Collector & CFO",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "mythic",
    cardType: "unit",
    flavorText:
      "Every soul has an interest rate. Xeth'Raal sets them quarterly. The Ledger of Ruin is updated automatically; he simply audits it.",
    sceneDelta:
      "Mid-shot three-quarter portrait. Xeth'Raal is a tall lean figure in an immaculately tailored Hierarchy charcoal-grey suit with a rust-red tie, seated behind a vast black-glass desk that floats over an ankle-deep sea of ledger pages. His head is goat-skulled — bare bone with curling iron-bound horns — but his hands are fastidious, manicured, tipped in clear lacquer. In his left hand: an obsidian fountain pen poised over the open Ledger of Ruin (a book whose pages are translucent membranes scrolling with the names of debtor-souls in living red ink). His right hand rests palm-down on a small brass abacus whose beads are tiny screaming faces frozen mid-cry. The desk lamp throws him in warm amber from below. Behind him: an impossible filing cabinet stretching upward into vanishing point.",
    moodKeywords: [
      "soul-accountancy as ritual",
      "manicured hands, skull face — the calm professional",
      "ink that knows your name",
      "actuarial dread",
    ],
    palette:
      "Charcoal-grey corporate suit + rust-red accent tie + black-glass desk + warm amber under-lamp + living red ledger-ink + brass abacus with screaming-face beads",
    composition:
      "Mid-shot three-quarter, Xeth'Raal at frame-centre seated, infinite filing cabinet receding behind, ledger-page sea filling lower-fifth of frame",
    notes:
      "Mythic. The framing is bureaucratic horror — Xeth'Raal is calm and detail-oriented; the menace is in the ledger, not his posture. The abacus-beads motif is the Hierarchy CFO signature. The Ledger of Ruin must be readable but the surnames must be NEW (don't echo any canon character) so this card doesn't accidentally confirm a debt-status reveal.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Xeth'Raal the Debt Collector",
      "docs/built/LORE_BIBLE.md §Ledger of Ruin",
    ],
  },

  "s2_hierarchy_coo_ririahlia_reprint": {
    cardId: "s2_hierarchy_coo_ririahlia_reprint",
    name: "Riri'Ahlia the Taskmaster, COO (Hierarchy Edition)",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "mythic",
    cardType: "unit",
    flavorText:
      "Six arms. Seventeen dimensions. One performance review per quarter, attended in all of them simultaneously.",
    sceneDelta:
      "Wider mid-shot. Riri'Ahlia in her COO regalia — a six-armed Quarchon-aligned demoness in segmented Hierarchy-charcoal armor over a deep-violet under-robe, standing at the centre of a Hierarchy operations command-floor. Each of her six hands holds a different operational instrument: a Blood Weave glyph-stylus (scribing an order in midair), a thin signet-stamp (mid-impress on a contract), a brass-and-bone field telegraph (relaying), a curved short-blade (sheathed at her hip but hand-on-hilt), a tablet of glowing red-bound assignments, and a small porcelain teacup (held with absolute steadiness — she is multitasking, not stressed). Her face is mid-thirties Quarchon, calm, eyes a steady amber, hair a coiled black knot. Around her: floor-to-ceiling translucent screens showing seventeen different dimension-feeds, demonspawn legions in formation, supply chains, performance metrics ticking up.",
    moodKeywords: [
      "operational competence as terror",
      "calm tea while empires march",
      "the COO who never blinks",
      "Riri reprint reading the seventeen-dimension feed",
    ],
    palette:
      "Hierarchy charcoal armor + deep-violet under-robe + warm amber eye-glow + Blood Weave deep-red glyph-light + porcelain teacup white-and-blue + screens cool-cyan-and-blood-red",
    composition:
      "Wider mid-shot front three-quarter, Riri at frame-centre, six arms fanned outward in symmetrical mid-action pose, dimension-screens filling upper-half of frame",
    notes:
      "Mythic — alt-art reprint of s1_char_061 Riri'Ahlia. Must echo without duplicating: the s1 base art is the 'Six-Armed Assault' battle pose; this Hierarchy edition is the COO posture — domestic, controlled, indoors. Existing s1_char_061 flavor: 'Commands Blood Weave's armies across 17 dimensions simultaneously with six tireless arms' — this reprint visualizes the management side of that same fact. Six arms must read as functional, not exotic.",
    loreCitations: [
      "apps/shared/tcg-core/cards/definitions/new_babylon/s1_char_061_vexahlia_the_taskmaster.ts",
      "docs/built/LORE_BIBLE.md §Riri'Ahlia / Six-Armed Assault",
      "apps/client/src/pages/DemonPackPage.tsx:Hierarchy COO mention",
    ],
  },

  "s2_hierarchy_cmo_vex_drelm": {
    cardId: "s2_hierarchy_cmo_vex_drelm",
    name: "Vex'Drelm, CMO & Brand Acquirer",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "mythic",
    cardType: "unit",
    flavorText:
      "She does not advertise the Hierarchy. She advertises *to* the Hierarchy — and the Hierarchy is everywhere there is language.",
    sceneDelta:
      "Mid-shot. Vex'Drelm stands at the centre of a Hierarchy boardroom-stage flanked by translucent floating banner-glyphs (the brand assets of a thousand corrupted languages, each banner a different captured tongue). She is six-foot-four, lean, with a face that reads as glamour-magazine-perfect at first glance and deeply wrong on second — too symmetrical, eyes one dilation-step too wide. Wears a Hierarchy ivory-and-rose suit cut to a sharp asymmetric silhouette, a single rose-gold pin at the lapel shaped like the Hierarchy crest. In her right hand: a slender obsidian conductor's baton; she's mid-gesture, drawing one of the floating glyph-banners toward her audience like a curtain-pull. In her left: a small velvet-bound contract-of-acquisition. Behind her: a wall-projection of dialect-fragments shimmering as they're absorbed into the Hierarchy brand-mark.",
    moodKeywords: [
      "brand acquisition as soft-power empire",
      "too-perfect glamour reads as wrong",
      "language is inventory",
      "the smile that closes the deal",
    ],
    palette:
      "Hierarchy ivory + rose-gold accent + velvet-rose contract red + warm boardroom uplight + cool-violet absorbed-language banner-glow",
    composition:
      "Mid-shot three-quarter, Vex'Drelm at frame-centre mid-gesture, floating glyph-banners forming a fan around her",
    notes:
      "Mythic. Vex'Drelm is the Hierarchy's softest weapon — the face that signs the contract before the Unmaking begins. Glamour-wrongness must be subtle: this is sales, not horror. The captured-language banners must read as alien but legible-shaped; do NOT use real-world scripts.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. The Shadow Tongue (LORE_BIBLE) corrupts languages from below — Vex'Drelm corrupts them from above, by acquiring them as brand assets. Soft-power complement to the existing language-corruption canon.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Shadow Tongue (language-corruption framing)",
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_cto_skarn_iterate": {
    cardId: "s2_hierarchy_cto_skarn_iterate",
    name: "Skarn-Iterate, CTO & Architect of Forced Updates",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "mythic",
    cardType: "unit",
    flavorText:
      "Every soul ships with bugs. Skarn-Iterate ships the patches — without consent, without changelogs, without a rollback path.",
    sceneDelta:
      "Mid-shot front-on. Skarn-Iterate is a tall thin figure whose body is half flesh, half corrupted-code — the right side a normal Quarchon engineer's frame in a Hierarchy steel-grey jumpsuit, the left side resolved into cascading red-and-black hex characters that drip downward like wet paint and re-form mid-fall. The face is split clean down the centre: right side is a calm goggled engineer's face, left side is a softly-glowing terminal display showing an active progress bar at 73%. Both hands are gloved in iridescent dataflow — the right gripping a pneumatic patch-driver tool, the left held flat with a small holographic update-prompt floating above it that reads (in legible Hierarchy script) 'INSTALL NOW — CANNOT POSTPONE'. Behind: rack on rack of black-iron server cabinets stretching into a tunnel of warning-amber LEDs.",
    moodKeywords: [
      "the patch you did not consent to",
      "half-engineer half-cascade",
      "73% — and it never finishes",
      "the cathedral of forced updates",
    ],
    palette:
      "Hierarchy steel-grey jumpsuit + cascading red-and-black hex + warning-amber server LEDs + cool-cyan terminal-face glow + iridescent dataflow gloves",
    composition:
      "Mid-shot front-on, Skarn at frame-centre with the body-split running vertically through the composition, server-tunnel receding behind",
    notes:
      "Mythic. Echoes the Cathedral-of-Code framing from the Varkul VP entry but inverts it — Varkul GUARDS the Cathedral; Skarn IS the deployment pipeline that fills it with new corruption. The progress-bar must read 73% (not 100% — the joke is it never completes).",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. Pairs with Varkul (VP, Cathedral of Code guardian) to give the technology stack a clear two-tier hierarchy: Skarn ships the corruption, Varkul defends what Skarn has shipped.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Varkul / Cathedral of Code (technology-stack framing)",
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
    ],
  },

  "s2_hierarchy_chro_mor_vethic": {
    cardId: "s2_hierarchy_chro_mor_vethic",
    name: "Mor'Vethic, CHRO & Headcount Reaper",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "mythic",
    cardType: "unit",
    flavorText:
      "Performance is a managed asset. Tenure is a depreciation curve. Mor'Vethic is the line item where 'voluntary separation' becomes a Hierarchy euphemism.",
    sceneDelta:
      "Mid-shot three-quarter. Mor'Vethic is broad-shouldered, mid-fifties, with the patient bearing of a senior HR partner who has held a thousand exit interviews. She wears a Hierarchy plum-and-charcoal pantsuit, a small silver Hierarchy crest-pin at the lapel, half-moon reading glasses pushed up onto greying hair pulled into a low bun. Her face is professional, faintly sympathetic — the dangerous kind of sympathy. She is seated across a small interview-table from an empty chair (we read the absence — someone has just been separated). Both hands rest folded over a manila personnel-folder marked CONFIDENTIAL. The folder is open just enough to show the single word 'TERMINATED' stamped in bureaucratic-red ink across an ID photo we deliberately cannot quite resolve. Behind her: a low credenza with a small potted asphodel plant, a framed Hierarchy values-statement, a coffee cup half-empty.",
    moodKeywords: [
      "the dangerous sympathy of HR",
      "voluntary separation as Hierarchy euphemism",
      "bureaucratic red, no shouting",
      "the chair that just emptied",
    ],
    palette:
      "Hierarchy plum + charcoal pantsuit + silver crest-pin + warm domestic-office uplight + bureaucratic-red TERMINATED stamp + asphodel plant pale-grey-violet",
    composition:
      "Mid-shot three-quarter, Mor'Vethic at frame-centre seated, empty chair partially visible in extreme foreground (out-of-focus), credenza and asphodel behind",
    notes:
      "Mythic. The empty chair foreground is the canon Mor'Vethic motif — she is always seen *after* a separation, never during. The unresolvable ID photo must be deliberately blurred so it doesn't accidentally read as any named character. Asphodel = funerary plant, classical underworld reference; subtle, not explicit.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. The Hierarchy framing is corporate-bureaucratic; an HR officer who turns severance into ritual fits the LORE_BIBLE 'infernal corporation from the Abyss' pattern more naturally than a horned reaper would.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Xeth'Raal Ledger-of-Ruin (parallel: Mor'Vethic manages the personnel ledger as Xeth'Raal manages the soul ledger)",
    ],
  },

  "s2_hierarchy_ciso_iglarath": {
    cardId: "s2_hierarchy_ciso_iglarath",
    name: "Iglarath, CISO & Inevitability-Breach Auditor",
    setCode: "S2_HIERARCHY",
    faction: "new_babylon",
    rarity: "mythic",
    cardType: "unit",
    flavorText:
      "The Hierarchy is unbreachable in principle. Iglarath audits the breaches that occur in practice. The two facts are reconciled quarterly.",
    sceneDelta:
      "Mid-shot. Iglarath is a tall Quarchon figure in a Hierarchy night-blue uniform with high collar and silver piping, standing in a circular vault-room at the centre of a holographic threat-map sphere — the sphere is roughly two metres across, hovering at chest height, displaying the Hierarchy's seventeen-dimension perimeter as a glowing wireframe. Several small red-pulse breach-points are flagged across the sphere, each annotated with a tiny floating dossier. Iglarath is mid-action: right hand pinch-zooming on one breach (Insurgency-aligned, by the dossier's signal-green sigil), left hand resting on the hilt of a ceremonial Hierarchy short-sword still sheathed. Her face has six small horizontally-arranged eyes across a smooth obsidian forehead — all six are tracking different data feeds simultaneously. Behind her: a wall of dim cyan monitor-light + rack-mounted cipher-engines.",
    moodKeywords: [
      "perimeter security as cosmology",
      "six eyes, six feeds, one audit",
      "the breach that already happened",
      "calm of a threat-modeler",
    ],
    palette:
      "Hierarchy night-blue uniform + silver piping + obsidian face + holographic threat-sphere cool-cyan + breach-point pulse-red + Insurgency-flag signal-green accent",
    composition:
      "Mid-shot three-quarter, Iglarath at frame-centre, holographic threat-sphere occupying centre-of-frame at chest height, vault-room arc receding",
    notes:
      "Mythic. The six-eye motif is the Iglarath signature; do NOT use it on any other Hierarchy card. The Insurgency green-sigil breach-flag is canon — the Insurgency does in fact penetrate the Hierarchy perimeter (LORE_BIBLE Acts 3-7 framing) — but the dossier text must be illegible so this card doesn't confirm specific operations. Six-eye coverage of multiple feeds parallels Riri's six-arm coverage of seventeen dimensions; intentional design echo.",
    archetypeRationale:
      "Newly-named per plan §Hierarchy naming policy. The CISO role canonically guards the Hierarchy's information-perimeter; pairing with Iglarath's six-eye motif gives the role a memorable visual signature parallel to Riri's six-arm motif.",
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "docs/built/LORE_BIBLE.md §Insurgency vs Hierarchy operational framing",
    ],
  },
};

export const CSUITE_PROMPTS: ExpansionCardRegistry = Object.freeze(ENTRIES);
